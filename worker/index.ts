import {
  MODELS,
  calculateTokenCost,
  contextUsage,
  countImageTokens,
  countTextTokens,
  getModel,
  resolveModelRates,
  type ModelConfig,
} from '../packages/tokencalculator-core/src/index';

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  PUBLIC_API_RATE_LIMITER?: { limit(input: { key: string }): Promise<{ success: boolean }> };
}

type JsonRecord = Record<string, unknown>;
type IncludeField = 'usage' | 'breakdown' | 'cost' | 'context' | 'method' | 'pricing';
interface MessageInput { role?: string; name?: string; content?: string }
interface FileInput { name?: string; content?: string; media_type?: string }
interface ImageInput { width?: number; height?: number; detail?: 'low' | 'high' }
interface MeasurementRequest {
  model?: string;
  input?: { text?: string; messages?: MessageInput[]; files?: FileInput[]; images?: ImageInput[] };
  output_tokens?: number;
  cached_input_tokens?: number;
  options?: { include?: IncludeField[] };
  metadata?: JsonRecord;
}

const API_VERSION = '2026-08-28';
const DEFAULT_INCLUDE: IncludeField[] = ['usage', 'breakdown', 'cost', 'context', 'method', 'pricing'];
const MAX_BODY_BYTES = 256 * 1024;
const MAX_BATCH = 25;
const MAX_TEXT_BYTES = 200 * 1024;
const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Request-Id',
  'Access-Control-Max-Age': '86400',
};

const json = (value: unknown, status = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(value), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': status === 200 ? 'no-store' : 'no-store', ...cors, ...extra },
});

const problem = (status: number, title: string, detail: string, requestId: string, errors?: unknown[]) => new Response(JSON.stringify({
  type: `https://tokencalculator.dev/docs/api/#errors`, title, status, detail, instance: `urn:tokencalculator:request:${requestId}`, ...(errors ? { errors } : {}),
}), { status, headers: { 'Content-Type': 'application/problem+json; charset=utf-8', 'Cache-Control': 'no-store', ...cors } });

const finiteNonNegative = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;
const byteLength = (value: string) => new TextEncoder().encode(value).length;

async function readJson(request: Request, requestId: string): Promise<JsonRecord | Response> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) return problem(415, 'Unsupported media type', 'Send a JSON request with Content-Type: application/json.', requestId);
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return problem(413, 'Payload too large', `Request bodies are limited to ${MAX_BODY_BYTES} bytes.`, requestId);
  const raw = await request.text();
  if (byteLength(raw) > MAX_BODY_BYTES) return problem(413, 'Payload too large', `Request bodies are limited to ${MAX_BODY_BYTES} bytes.`, requestId);
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return problem(400, 'Invalid request', 'The JSON body must be an object.', requestId);
    return parsed as JsonRecord;
  } catch {
    return problem(400, 'Invalid JSON', 'The request body could not be parsed as JSON.', requestId);
  }
}

function assertMeasurement(value: unknown): MeasurementRequest {
  if (!value || typeof value !== 'object' || Array.isArray(value)) throw new TypeError('Each measurement must be a JSON object.');
  const request = value as MeasurementRequest;
  if (!request.model || typeof request.model !== 'string') throw new TypeError('model is required and must be a string.');
  getModel(request.model);
  if (!request.input || typeof request.input !== 'object') throw new TypeError('input is required and must be an object.');
  if (request.output_tokens !== undefined && (typeof request.output_tokens !== 'number' || request.output_tokens < 0)) throw new TypeError('output_tokens must be a non-negative number.');
  if (request.cached_input_tokens !== undefined && (typeof request.cached_input_tokens !== 'number' || request.cached_input_tokens < 0)) throw new TypeError('cached_input_tokens must be a non-negative number.');
  return request;
}

async function measure(request: MeasurementRequest) {
  const model = getModel(request.model!);
  const input = request.input!;
  const breakdown: Array<{ type: string; name?: string; role?: string; tokens: number; accuracy: string; method: string }> = [];

  if (typeof input.text === 'string' && input.text.length) {
    const result = await countTextTokens(input.text, model);
    breakdown.push({ type: 'text', tokens: result.tokens, accuracy: result.accuracy, method: result.method });
  }
  for (const [index, message] of (Array.isArray(input.messages) ? input.messages : []).entries()) {
    if (!message || typeof message.content !== 'string') throw new TypeError(`input.messages[${index}].content must be a string.`);
    const result = await countTextTokens(message.content, model);
    breakdown.push({ type: 'message', role: message.role ?? 'user', name: message.name, tokens: result.tokens, accuracy: result.accuracy, method: result.method });
  }
  for (const [index, file] of (Array.isArray(input.files) ? input.files : []).entries()) {
    if (!file || typeof file.content !== 'string') throw new TypeError(`input.files[${index}].content must be extracted text or source code.`);
    const result = await countTextTokens(file.content, model);
    breakdown.push({ type: 'file', name: file.name ?? `file-${index + 1}`, tokens: result.tokens, accuracy: result.accuracy, method: result.method });
  }
  for (const [index, image] of (Array.isArray(input.images) ? input.images : []).entries()) {
    if (!image || typeof image.width !== 'number' || typeof image.height !== 'number') throw new TypeError(`input.images[${index}] requires numeric width and height.`);
    const result = countImageTokens(image.width, image.height, model, image.detail ?? 'high');
    breakdown.push({ type: 'image', name: `image-${index + 1}`, tokens: result.tokens, accuracy: result.accuracy, method: result.method });
  }

  const measuredBytes = [input.text ?? '', ...(input.messages ?? []).map(item => item.content ?? ''), ...(input.files ?? []).map(item => item.content ?? '')].reduce((sum, item) => sum + byteLength(item), 0);
  if (measuredBytes > MAX_TEXT_BYTES) throw new RangeError(`Combined text and extracted file content is limited to ${MAX_TEXT_BYTES} UTF-8 bytes.`);
  if (!breakdown.length) throw new TypeError('Provide input.text, input.messages, input.files, or input.images.');

  const inputTokens = breakdown.reduce((sum, item) => sum + item.tokens, 0);
  const outputTokens = finiteNonNegative(request.output_tokens);
  const cachedInputTokens = finiteNonNegative(request.cached_input_tokens);
  if (cachedInputTokens > inputTokens) throw new RangeError('cached_input_tokens cannot exceed measured input tokens.');
  const rates = resolveModelRates(model, inputTokens);
  const cost = calculateTokenCost({ inputTokens, outputTokens, cachedInputTokens }, rates);
  const context = contextUsage(inputTokens + outputTokens, model.contextWindow);
  const include = new Set(request.options?.include?.length ? request.options.include : DEFAULT_INCLUDE);
  const warnings = ['Chat role/name framing, tools, provider-added system tokens, reasoning tokens, retries, and taxes are not inferred from raw content.'];
  if (model.accuracy === 'estimated') warnings.push(`${model.name} uses a provider-calibrated UTF-8 projection because its production tokenizer is not published for exact local execution.`);
  if (input.files?.length) warnings.push('File content must be extracted before calling the public API. Use the browser app for private local PDF and DOCX extraction.');

  return {
    object: 'token_measurement',
    model: { id: model.id, name: model.name, provider: model.provider, tokenizer: model.tokenizer },
    ...(include.has('usage') ? { usage: { input_tokens: inputTokens, text_tokens: breakdown.filter(item => item.type !== 'image').reduce((sum, item) => sum + item.tokens, 0), image_tokens: breakdown.filter(item => item.type === 'image').reduce((sum, item) => sum + item.tokens, 0), cached_input_tokens: cachedInputTokens, output_tokens: outputTokens, total_tokens: inputTokens + outputTokens } } : {}),
    ...(include.has('breakdown') ? { breakdown } : {}),
    ...(include.has('cost') ? { cost: { currency: 'USD', input: cost.input, cached_input: cost.cachedInput, output: cost.output, total: cost.total } } : {}),
    ...(include.has('context') ? { context: { window: model.contextWindow, max_output: model.maxOutput, used: inputTokens + outputTokens, remaining: context.remaining, utilization: context.ratio, over_context: context.overContext } } : {}),
    ...(include.has('method') ? { method: { accuracy: breakdown.some(item => item.accuracy === 'estimated') ? 'estimated' : 'exact-or-provider-formula', algorithms: [...new Set(breakdown.map(item => item.method))], limitations: warnings } } : {}),
    ...(include.has('pricing') ? { pricing: { tier: rates.label, input_per_million: rates.inputPerMillion, cached_input_per_million: rates.cachedInputPerMillion ?? rates.inputPerMillion, output_per_million: rates.outputPerMillion, verified_at: model.verifiedAt, source: model.pricingUrl } } : {}),
    ...(request.metadata ? { metadata: request.metadata } : {}),
  };
}

const modelJson = (model: ModelConfig) => ({ id: model.id, name: model.name, provider: model.provider, description: model.description, tokenizer: model.tokenizer, accuracy: model.accuracy, context_window: model.contextWindow, max_output: model.maxOutput, vision: model.vision ?? null, pricing: { input_per_million: model.inputPerMillion, cached_input_per_million: model.cachedInputPerMillion ?? null, output_per_million: model.outputPerMillion, tiers: model.pricingTiers ?? [], currency: 'USD', verified_at: model.verifiedAt, source: model.pricingUrl } });

async function api(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const requestId = request.headers.get('x-request-id')?.slice(0, 96) || request.headers.get('cf-ray') || crypto.randomUUID();
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });
  const clientKey = request.headers.get('cf-connecting-ip') ?? 'local';
  if (env.PUBLIC_API_RATE_LIMITER) {
    const rate = await env.PUBLIC_API_RATE_LIMITER.limit({ key: `${clientKey}:${url.pathname}` });
    if (!rate.success) return problem(429, 'Rate limit exceeded', 'The free API permits 60 requests per minute per route and edge location. Retry after 60 seconds.', requestId);
  }
  const headers = { 'X-Request-Id': requestId, 'X-API-Version': API_VERSION };
  if (request.method === 'GET' && url.pathname === '/api/v1/health') return json({ object: 'health', status: 'ok', version: API_VERSION }, 200, headers);
  if (request.method === 'GET' && url.pathname === '/api/v1/models') return json({ object: 'list', data: MODELS.map(modelJson) }, 200, headers);
  if (request.method !== 'POST') return problem(405, 'Method not allowed', 'Use GET for model discovery or POST for measurements.', requestId);
  const body = await readJson(request, requestId);
  if (body instanceof Response) return body;
  try {
    if (url.pathname === '/api/v1/count') return json({ ...(await measure(assertMeasurement(body))), request_id: requestId }, 200, headers);
    if (url.pathname === '/api/v1/batch') {
      const requests = body.requests;
      if (!Array.isArray(requests) || !requests.length) throw new TypeError('requests must be a non-empty array.');
      if (requests.length > MAX_BATCH) throw new RangeError(`A batch is limited to ${MAX_BATCH} measurements.`);
      const data = await Promise.all(requests.map(async (item, index) => ({ index, ...(await measure(assertMeasurement(item))) })));
      return json({ object: 'list', request_id: requestId, data }, 200, headers);
    }
    if (url.pathname === '/api/v1/compare') {
      const modelIds = body.models;
      if (!Array.isArray(modelIds) || !modelIds.length || modelIds.length > 10) throw new TypeError('models must contain between 1 and 10 model IDs.');
      const base = body.request;
      if (!base || typeof base !== 'object') throw new TypeError('request must be a measurement object.');
      const data = await Promise.all(modelIds.map(model => measure(assertMeasurement({ ...(base as object), model }))));
      return json({ object: 'comparison', request_id: requestId, data }, 200, headers);
    }
    return problem(404, 'Endpoint not found', 'See /docs/api/ for available API endpoints.', requestId);
  } catch (error) {
    const detail = error instanceof Error ? error.message : 'The request is invalid.';
    return problem(error instanceof RangeError ? 422 : 400, 'Validation failed', detail, requestId);
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname.startsWith('/api/')) return api(request, env);
    return env.ASSETS.fetch(request);
  },
};
