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
  'Access-Control-Allow-Methods': 'GET, HEAD, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept, X-Request-Id',
  'Access-Control-Max-Age': '86400',
};

const json = (value: unknown, status = 200, extra: Record<string, string> = {}) => new Response(JSON.stringify(value), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...cors, ...extra },
});

/**
 * Stable, per-class error identifiers. RFC 9457 makes `type` the field a client
 * branches on, so each failure mode needs its own URI rather than one shared anchor.
 */
const PROBLEM_TYPES = {
  invalid_json: 'invalid-json',
  invalid_request: 'invalid-request',
  unknown_model: 'unknown-model',
  validation_failed: 'validation-failed',
  unsupported_media_type: 'unsupported-media-type',
  payload_too_large: 'payload-too-large',
  method_not_allowed: 'method-not-allowed',
  not_found: 'endpoint-not-found',
  rate_limited: 'rate-limited',
} as const;
type ProblemKind = keyof typeof PROBLEM_TYPES;

const problem = (
  status: number,
  kind: ProblemKind,
  title: string,
  detail: string,
  requestId: string,
  extra: { errors?: unknown[]; headers?: Record<string, string> } = {},
) => new Response(JSON.stringify({
  type: `https://tokencalculator.dev/docs/api/#error-${PROBLEM_TYPES[kind]}`,
  title,
  status,
  detail,
  instance: `urn:tokencalculator:request:${requestId}`,
  ...(extra.errors?.length ? { errors: extra.errors } : {}),
}), {
  status,
  headers: {
    'Content-Type': 'application/problem+json; charset=utf-8',
    'Cache-Control': 'no-store',
    // Errors carry the same correlation headers as successes, so logging middleware
    // that harvests X-Request-Id keeps working on exactly the responses that need it.
    'X-Request-Id': requestId,
    'X-API-Version': API_VERSION,
    ...cors,
    ...(extra.headers ?? {}),
  },
});

const finiteNonNegative = (value: unknown, fallback = 0) => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? Math.round(value) : fallback;
const byteLength = (value: string) => new TextEncoder().encode(value).length;

async function readJson(request: Request, requestId: string): Promise<JsonRecord | Response> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().includes('application/json')) return problem(415, 'unsupported_media_type', 'Unsupported media type', 'Send a JSON request with Content-Type: application/json.', requestId);
  const declared = Number(request.headers.get('content-length') ?? 0);
  if (declared > MAX_BODY_BYTES) return problem(413, 'payload_too_large', 'Payload too large', `Request bodies are limited to ${MAX_BODY_BYTES} bytes.`, requestId);
  const raw = await request.text();
  if (byteLength(raw) > MAX_BODY_BYTES) return problem(413, 'payload_too_large', 'Payload too large', `Request bodies are limited to ${MAX_BODY_BYTES} bytes.`, requestId);
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return problem(400, 'invalid_request', 'Invalid request', 'The JSON body must be an object.', requestId);
    return parsed as JsonRecord;
  } catch {
    return problem(400, 'invalid_json', 'Invalid JSON', 'The request body could not be parsed as JSON.', requestId);
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

/** Methods each route answers. Drives both routing and the Allow header on a 405. */
const ROUTES: Record<string, readonly string[]> = {
  '/api/v1/health': ['GET', 'HEAD'],
  '/api/v1/models': ['GET', 'HEAD'],
  '/api/v1/count': ['POST'],
  '/api/v1/batch': ['POST'],
  '/api/v1/compare': ['POST'],
};

const RATE_LIMIT = 60;
const RATE_WINDOW_SECONDS = 60;
/** Catalogue and health are derived from a static build, so they are safely cacheable. */
const CATALOG_CACHE = `public, max-age=${RATE_WINDOW_SECONDS * 5}, stale-while-revalidate=600`;

/** Weak entity tag over a JSON body, so agents can revalidate instead of re-downloading. */
async function etagOf(body: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(body));
  const hex = [...new Uint8Array(digest).slice(0, 16)].map(b => b.toString(16).padStart(2, '0')).join('');
  return `"${hex}"`;
}

/** A cacheable GET/HEAD response with ETag and conditional-request support. */
async function cacheableJson(value: unknown, request: Request, extra: Record<string, string>): Promise<Response> {
  const body = JSON.stringify(value);
  const etag = await etagOf(body);
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': CATALOG_CACHE,
    ETag: etag,
    ...cors,
    ...extra,
  };
  if (request.headers.get('if-none-match') === etag) return new Response(null, { status: 304, headers });
  // HEAD must return the same headers as GET but no body (RFC 9110).
  return new Response(request.method === 'HEAD' ? null : body, { status: 200, headers });
}

async function api(request: Request, env: Env): Promise<Response> {
  const url = new URL(request.url);
  const requestId = request.headers.get('x-request-id')?.slice(0, 96) || request.headers.get('cf-ray') || crypto.randomUUID();
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors });

  const allowed = ROUTES[url.pathname];
  // Resolve the path before the method, so an unknown path is a 404 for every verb
  // instead of a misleading "wrong method" answer.
  if (!allowed) {
    return problem(404, 'not_found', 'Endpoint not found', `No API route matches ${url.pathname}. See https://tokencalculator.dev/docs/api/ for available endpoints.`, requestId);
  }
  if (!allowed.includes(request.method)) {
    return problem(405, 'method_not_allowed', 'Method not allowed', `${url.pathname} accepts ${allowed.join(', ')}.`, requestId, {
      headers: { Allow: allowed.join(', ') },
    });
  }

  const clientKey = request.headers.get('cf-connecting-ip') ?? 'local';
  if (env.PUBLIC_API_RATE_LIMITER) {
    const rate = await env.PUBLIC_API_RATE_LIMITER.limit({ key: `${clientKey}:${url.pathname}` });
    if (!rate.success) {
      return problem(429, 'rate_limited', 'Rate limit exceeded', `The free API permits ${RATE_LIMIT} requests per minute, per client, per route. Retry after ${RATE_WINDOW_SECONDS} seconds.`, requestId, {
        headers: {
          // Machine-readable wait signal. Standard retry middleware reads these; the
          // English sentence in `detail` alone is not actionable.
          'Retry-After': String(RATE_WINDOW_SECONDS),
          'RateLimit-Limit': String(RATE_LIMIT),
          'RateLimit-Remaining': '0',
          'RateLimit-Reset': String(RATE_WINDOW_SECONDS),
          'RateLimit-Policy': `${RATE_LIMIT};w=${RATE_WINDOW_SECONDS}`,
        },
      });
    }
  }

  const headers = { 'X-Request-Id': requestId, 'X-API-Version': API_VERSION, 'RateLimit-Limit': String(RATE_LIMIT), 'RateLimit-Policy': `${RATE_LIMIT};w=${RATE_WINDOW_SECONDS}` };
  if (url.pathname === '/api/v1/health') return cacheableJson({ object: 'health', status: 'ok', version: API_VERSION }, request, headers);
  if (url.pathname === '/api/v1/models') return cacheableJson({ object: 'list', data: MODELS.map(modelJson) }, request, headers);

  const body = await readJson(request, requestId);
  if (body instanceof Response) return body;
  try {
    if (url.pathname === '/api/v1/count') return json({ ...(await measure(assertMeasurement(body))), request_id: requestId }, 200, headers);
    if (url.pathname === '/api/v1/batch') {
      const requests = body.requests;
      if (!Array.isArray(requests) || !requests.length) throw new TypeError('requests must be a non-empty array.');
      if (requests.length > MAX_BATCH) throw new RangeError(`A batch is limited to ${MAX_BATCH} measurements.`);
      const data = await Promise.all(requests.map(async (item, index) => {
        try {
          return { index, ...(await measure(assertMeasurement(item))) };
        } catch (error) {
          // Attribute the failure to its position so the caller can fix one entry
          // instead of guessing which of 25 requests was wrong.
          throw new BatchItemError(index, error);
        }
      }));
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
    return problem(404, 'not_found', 'Endpoint not found', 'See https://tokencalculator.dev/docs/api/ for available endpoints.', requestId);
  } catch (error) {
    const cause = error instanceof BatchItemError ? error.cause : error;
    const detail = cause instanceof Error ? cause.message : 'The request is invalid.';
    const errors = error instanceof BatchItemError ? [{ index: error.index, detail }] : undefined;
    // An unknown model id is a caller mistake, not a recoverable range condition.
    const unknownModel = cause instanceof RangeError && /^Unknown model:/.test(detail);
    if (unknownModel) {
      return problem(400, 'unknown_model', 'Unknown model', `${detail} Call GET /api/v1/models for the supported list.`, requestId, { errors });
    }
    return problem(cause instanceof RangeError ? 422 : 400, 'validation_failed', 'Validation failed', detail, requestId, { errors });
  }
}

/** Wraps a batch item failure with its index so the error can name the offending entry. */
class BatchItemError extends Error {
  constructor(readonly index: number, readonly cause: unknown) {
    super('Batch item failed');
  }
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    // Match the bare /api too. Agents routinely trim the trailing slash, and letting
    // that fall through to the static handler returns an HTML page where JSON is expected.
    if (url.pathname === '/api' || url.pathname.startsWith('/api/')) return api(request, env);
    return env.ASSETS.fetch(request);
  },
};
