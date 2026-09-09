export interface TokenRates { inputPerMillion: number; outputPerMillion: number; cachedInputPerMillion?: number }
export interface TokenUsage { inputTokens: number; outputTokens?: number; cachedInputTokens?: number }
export interface TokenCostBreakdown { input: number; cachedInput: number; output: number; total: number }
export type ProviderId =
  | 'openai' | 'anthropic' | 'google' | 'deepseek'
  | 'alibaba' | 'moonshotai' | 'xai' | 'zai' | 'meta';
export type TokenizerStrategy =
  | 'o200k_base' | 'claude-estimate' | 'gemini-estimate' | 'deepseek-estimate'
  | 'qwen-estimate' | 'kimi-estimate' | 'grok-estimate' | 'glm-estimate' | 'llama-estimate';
export type VisionStrategy = 'openai-tiles' | 'claude-patches' | 'gemini-tiles';
export interface PricingTier extends TokenRates { aboveInputTokens: number; label: string }
export interface ModelConfig extends TokenRates {
  id: string;
  name: string;
  provider: ProviderId;
  description: string;
  tokenizer: TokenizerStrategy;
  accuracy: 'exact' | 'estimated';
  contextWindow: number;
  maxOutput: number;
  pricingTiers?: PricingTier[];
  vision?: VisionStrategy;
  pricingUrl: string;
  /** Upstream launch date, used to sort and to surface how current a model is. */
  releaseDate?: string;
  verifiedAt: string;
  isDefault?: boolean;
}
export interface ModelMeasurement {
  modelId: string;
  model: string;
  provider: ProviderId;
  inputTokens: number;
  outputTokens: number;
  accuracy: ModelConfig['accuracy'] | 'provider-formula';
  method: string;
  cost: TokenCostBreakdown;
  context: ReturnType<typeof contextUsage>;
  rates: TokenRates & { label: string };
}
export interface ImageInput { width: number; height: number; detail?: 'low' | 'high' }
export interface ModelInputFile { text?: string; image?: ImageInput }
export interface ModelInput {
  text?: string;
  image?: ImageInput;
  images?: readonly ImageInput[];
  files?: readonly ModelInputFile[];
  outputTokens?: number;
  cachedInputTokens?: number;
}

// <generated-models>
// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/sync-models.mjs from https://models.dev/api.json.
// Every rate below comes from that feed. To change which models appear,
// edit scripts/model-policy.json and re-run: npm run sync:models
export const MODELS: readonly ModelConfig[] = [
  { id:'gpt-6-astra', name:'GPT-6 Astra', provider:'openai', description:'Latest frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:1, outputPerMillion:50, vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-04', verifiedAt:'2026-09-09' },
  { id:'gpt-5.6-luna', name:'GPT-5.6 Luna', provider:'openai', description:'High-volume workloads', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:0.2, cachedInputPerMillion:0.02, outputPerMillion:1.2, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:0.4,cachedInputPerMillion:0.04,outputPerMillion:1.8,label:'Long-context rate above 272K input tokens'}], vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-09-09' },
  { id:'gpt-5.6-sol', name:'GPT-5.6 Sol', provider:'openai', description:'Frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:4, cachedInputPerMillion:0.4, outputPerMillion:20, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:8,cachedInputPerMillion:0.8,outputPerMillion:30,label:'Long-context rate above 272K input tokens'}], vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-09-09' },
  { id:'gpt-5.6-terra', name:'GPT-5.6 Terra', provider:'openai', description:'Balanced production model', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, outputPerMillion:12, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.4,outputPerMillion:18,label:'Long-context rate above 272K input tokens'}], vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-09-09' },
  { id:'claude-fable-5-1', name:'Claude Fable 5.1', provider:'anthropic', description:'Latest frontier Claude', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:0.25, outputPerMillion:50, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-01', verifiedAt:'2026-09-09' },
  { id:'claude-opus-5', name:'Claude Opus 5', provider:'anthropic', description:'Complex professional work', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:5, cachedInputPerMillion:0.5, outputPerMillion:25, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-07-24', verifiedAt:'2026-09-09' },
  { id:'claude-sonnet-5', name:'Claude Sonnet 5', provider:'anthropic', description:'Balanced intelligence', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, outputPerMillion:10, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-06-29', verifiedAt:'2026-09-09' },
  { id:'claude-opus-4-8', name:'Claude Opus 4.8', provider:'anthropic', description:'Previous Opus generation', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:5, cachedInputPerMillion:0.5, outputPerMillion:25, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-05-28', verifiedAt:'2026-09-09' },
  { id:'claude-haiku-4-5', name:'Claude Haiku 4.5', provider:'anthropic', description:'Fast, efficient Claude', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:200_000, maxOutput:64_000, inputPerMillion:1, cachedInputPerMillion:0.1, outputPerMillion:5, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2025-10-15', verifiedAt:'2026-09-09' },
  { id:'gemini-3.8-flash', name:'Gemini 3.8 Flash', provider:'google', description:'Latest multimodal Flash', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-09-02', verifiedAt:'2026-09-09' },
  { id:'gemini-3.7-flash', name:'Gemini 3.7 Flash', provider:'google', description:'Multimodal Flash', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-08-13', verifiedAt:'2026-09-09' },
  { id:'gemini-3.5-flash-lite', name:'Gemini 3.5 Flash Lite', provider:'google', description:'Low-cost multimodal', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.3, cachedInputPerMillion:0.03, outputPerMillion:2.5, vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-07-21', verifiedAt:'2026-09-09' },
  { id:'gemini-3.1-flash-lite', name:'Gemini 3.1 Flash Lite', provider:'google', description:'High-volume multimodal', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.25, cachedInputPerMillion:0.025, outputPerMillion:1.5, vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-05-07', verifiedAt:'2026-09-09' },
  { id:'gemini-2.5-pro', name:'Gemini 2.5 Pro', provider:'google', description:'Long-context reasoning', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:1.25, cachedInputPerMillion:0.125, outputPerMillion:10, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:2.5,cachedInputPerMillion:0.25,outputPerMillion:15,label:'Long-context rate above 200K input tokens'}], vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2025-06-17', verifiedAt:'2026-09-09' },
  { id:'deepseek-v4-pro', name:'DeepSeek V4 Pro', provider:'deepseek', description:'Higher capability', tokenizer:'deepseek-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:384_000, inputPerMillion:0.435, cachedInputPerMillion:0.003625, outputPerMillion:0.87, pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', releaseDate:'2026-08-12', verifiedAt:'2026-09-09' },
  { id:'deepseek-v4-flash', name:'DeepSeek V4 Flash', provider:'deepseek', description:'Fast, low-cost model', tokenizer:'deepseek-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:384_000, inputPerMillion:0.14, cachedInputPerMillion:0.0028, outputPerMillion:0.28, pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', releaseDate:'2026-07-31', verifiedAt:'2026-09-09' },
  { id:'qwen3.8-flash', name:'Qwen3.8 Flash', provider:'alibaba', description:'High-volume Qwen', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.15, cachedInputPerMillion:0.016, outputPerMillion:0.47, pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-08-26', verifiedAt:'2026-09-09' },
  { id:'qwen3.8-max', name:'Qwen3.8 Max', provider:'alibaba', description:'Alibaba flagship', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:2, cachedInputPerMillion:0.25, outputPerMillion:6, pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-08-03', verifiedAt:'2026-09-09' },
  { id:'qwen3.7-plus', name:'Qwen3.7 Plus', provider:'alibaba', description:'Balanced Qwen', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:65_536, inputPerMillion:0.5, cachedInputPerMillion:0.05, outputPerMillion:3, pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-06-02', verifiedAt:'2026-09-09' },
  { id:'qwen3.7-max', name:'Qwen3.7 Max', provider:'alibaba', description:'Previous Qwen flagship', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:65_536, inputPerMillion:2.5, cachedInputPerMillion:0.5, outputPerMillion:7.5, pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-05-21', verifiedAt:'2026-09-09' },
  { id:'qwen3.6-flash', name:'Qwen3.6 Flash', provider:'alibaba', description:'Reasoning model', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:65_536, inputPerMillion:0.1875, outputPerMillion:1.125, pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-04-27', verifiedAt:'2026-09-09' },
  { id:'kimi-k3', name:'Kimi K3', provider:'moonshotai', description:'Moonshot flagship', tokenizer:'kimi-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:3, cachedInputPerMillion:0.3, outputPerMillion:15, pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-07-16', verifiedAt:'2026-09-09' },
  { id:'kimi-k2.7-code', name:'Kimi K2.7 Code', provider:'moonshotai', description:'Code-focused Kimi', tokenizer:'kimi-estimate', accuracy:'estimated', contextWindow:262_144, maxOutput:262_144, inputPerMillion:0.95, cachedInputPerMillion:0.19, outputPerMillion:4, pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-06-12', verifiedAt:'2026-09-09' },
  { id:'kimi-k2.6', name:'Kimi K2.6', provider:'moonshotai', description:'Previous Kimi generation', tokenizer:'kimi-estimate', accuracy:'estimated', contextWindow:262_144, maxOutput:262_144, inputPerMillion:0.95, cachedInputPerMillion:0.16, outputPerMillion:4, pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-04-21', verifiedAt:'2026-09-09' },
  { id:'grok-4.6', name:'Grok 4.6', provider:'xai', description:'xAI flagship', tokenizer:'grok-estimate', accuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.5, outputPerMillion:6, pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-08-12', verifiedAt:'2026-09-09' },
  { id:'grok-4.5', name:'Grok 4.5', provider:'xai', description:'Previous Grok generation', tokenizer:'grok-estimate', accuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.3, outputPerMillion:6, pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-07-08', verifiedAt:'2026-09-09' },
  { id:'grok-4.3', name:'Grok 4.3', provider:'xai', description:'Reasoning model', tokenizer:'grok-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:30_000, inputPerMillion:1.25, cachedInputPerMillion:0.2, outputPerMillion:2.5, pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-04-17', verifiedAt:'2026-09-09' },
  { id:'glm-5.3-flash', name:'GLM-5.3-Flash', provider:'zai', description:'Low-cost GLM', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.075, cachedInputPerMillion:0.015, outputPerMillion:0.25, pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-08-26', verifiedAt:'2026-09-09' },
  { id:'glm-5.3', name:'GLM-5.3', provider:'zai', description:'Z.ai flagship', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, outputPerMillion:4.4, pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-08-14', verifiedAt:'2026-09-09' },
  { id:'glm-5.2', name:'GLM-5.2', provider:'zai', description:'Reasoning model', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, outputPerMillion:4.4, pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-06-13', verifiedAt:'2026-09-09' },
  { id:'glm-5.1', name:'GLM-5.1', provider:'zai', description:'Reasoning model', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:200_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, outputPerMillion:4.4, pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-04-07', verifiedAt:'2026-09-09' },
  { id:'glm-5-turbo', name:'GLM-5-Turbo', provider:'zai', description:'Reasoning model', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:200_000, maxOutput:131_072, inputPerMillion:1.2, cachedInputPerMillion:0.24, outputPerMillion:4, pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-03-16', verifiedAt:'2026-09-09' },
  { id:'muse-spark-1.3', name:'Muse Spark 1.3', provider:'meta', description:'Meta flagship', tokenizer:'llama-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:1.25, cachedInputPerMillion:0.15, outputPerMillion:4.25, pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-09-02', verifiedAt:'2026-09-09' },
  { id:'muse-spark-1.2', name:'Muse Spark 1.2', provider:'meta', description:'Previous Muse Spark', tokenizer:'llama-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:1.25, cachedInputPerMillion:0.15, outputPerMillion:4.25, pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-08-05', verifiedAt:'2026-09-09' },
  { id:'muse-spark-1.1', name:'Muse Spark 1.1', provider:'meta', description:'Reasoning model', tokenizer:'llama-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:1.25, cachedInputPerMillion:0.15, outputPerMillion:4.25, pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-04-08', verifiedAt:'2026-09-09' },
];
// </generated-models>

/**
 * Vendor names callers actually type, mapped to the closest supported model.
 * An automated client almost always tries a well-known id such as `gpt-4o` first;
 * without this it gets an error and gives up rather than retrying with a real id.
 */
export const MODEL_ALIASES: Readonly<Record<string, string>> = {
  // OpenAI
  'gpt-4': 'gpt-5.6-terra',
  'gpt-4o': 'gpt-5.6-terra',
  'gpt-4o-mini': 'gpt-5.6-luna',
  'gpt-4.1': 'gpt-5.6-terra',
  'gpt-4-turbo': 'gpt-5.6-terra',
  'gpt-5': 'gpt-5.6-terra',
  'gpt-5-mini': 'gpt-5.6-luna',
  'gpt-5.6': 'gpt-5.6-sol',
  'gpt-6': 'gpt-6-astra',
  'o1': 'gpt-5.6-sol',
  'o3': 'gpt-5.6-sol',
  'chatgpt': 'gpt-5.6-terra',
  // Anthropic
  'claude': 'claude-sonnet-5',
  'claude-3-opus': 'claude-opus-5',
  'claude-3-5-sonnet': 'claude-sonnet-5',
  'claude-3-5-haiku': 'claude-haiku-4-5',
  'claude-3-7-sonnet': 'claude-sonnet-5',
  'claude-sonnet-4': 'claude-sonnet-5',
  'claude-sonnet-4-5': 'claude-sonnet-5',
  'claude-opus-4': 'claude-opus-5',
  'claude-opus-4-1': 'claude-opus-5',
  'claude-haiku-4-5': 'claude-haiku-4-5',
  'claude-opus-4-8': 'claude-opus-5',
  'claude-fable-5': 'claude-fable-5-1',
  'claude-fable-5-1': 'claude-fable-5-1',
  // Google
  'gemini': 'gemini-3.8-flash',
  'gemini-pro': 'gemini-2.5-pro',
  'gemini-1.5-pro': 'gemini-2.5-pro',
  'gemini-1.5-flash': 'gemini-3.1-flash-lite',
  'gemini-2.0-flash': 'gemini-3.1-flash-lite',
  'gemini-2.5-flash': 'gemini-3.8-flash',
  'gemini-3-flash': 'gemini-3.8-flash',
  'gemini-flash': 'gemini-3.8-flash',
  'gemini-flash-lite': 'gemini-3.5-flash-lite',
  // DeepSeek
  'deepseek': 'deepseek-v4-pro',
  'deepseek-chat': 'deepseek-v4-flash',
  'deepseek-reasoner': 'deepseek-v4-pro',
  'deepseek-r1': 'deepseek-v4-pro',
  'deepseek-v3': 'deepseek-v4-flash',
};

/** Resolve a caller-supplied id to a catalogue id, or undefined when unknown. */
export const resolveModelId = (id: string): string | undefined => {
  const trimmed = id.trim();
  if (MODELS.some((candidate) => candidate.id === trimmed)) return trimmed;
  const lower = trimmed.toLowerCase();
  if (MODELS.some((candidate) => candidate.id === lower)) return lower;
  const alias = MODEL_ALIASES[lower];
  if (alias) return alias;
  // models.dev and several SDKs write versions with dashes ('claude-opus-4-8').
  const dotted = lower.replace(/-(\d+)-(\d+)$/, '-$1.$2');
  if (MODELS.some((candidate) => candidate.id === dotted)) return dotted;
  return undefined;
};

export const getModel = (id: string): ModelConfig => {
  const resolved = resolveModelId(id);
  const model = resolved ? MODELS.find((candidate) => candidate.id === resolved) : undefined;
  if (!model) throw new RangeError(`Unknown model: ${id}`);
  return model;
};

const assertNonNegative = (name: string, value: number) => {
  if (!Number.isFinite(value) || value < 0) throw new RangeError(`${name} must be a finite, non-negative number`);
};

export function calculateTokenCost(usage: TokenUsage, rates: TokenRates): TokenCostBreakdown {
  const outputTokens = usage.outputTokens ?? 0;
  const cachedInputTokens = usage.cachedInputTokens ?? 0;
  const values: Record<string, number> = { inputTokens: usage.inputTokens, outputTokens, cachedInputTokens, inputPerMillion: rates.inputPerMillion, outputPerMillion: rates.outputPerMillion };
  if (rates.cachedInputPerMillion !== undefined) values.cachedInputPerMillion = rates.cachedInputPerMillion;
  for (const [name, value] of Object.entries(values)) assertNonNegative(name, value);
  if (cachedInputTokens > usage.inputTokens) throw new RangeError('cachedInputTokens cannot exceed inputTokens');
  const input = (usage.inputTokens - cachedInputTokens) / 1_000_000 * rates.inputPerMillion;
  const cachedInput = cachedInputTokens / 1_000_000 * (rates.cachedInputPerMillion ?? rates.inputPerMillion);
  const output = outputTokens / 1_000_000 * rates.outputPerMillion;
  return { input, cachedInput, output, total: input + cachedInput + output };
}

export function resolveModelRates(model: ModelConfig, inputTokens: number): TokenRates & { label: string } {
  assertNonNegative('inputTokens', inputTokens);
  const tier = [...(model.pricingTiers ?? [])].sort((a,b) => b.aboveInputTokens-a.aboveInputTokens).find((candidate) => inputTokens > candidate.aboveInputTokens);
  return tier ?? { inputPerMillion:model.inputPerMillion, cachedInputPerMillion:model.cachedInputPerMillion, outputPerMillion:model.outputPerMillion, label:'Standard rate' };
}

let openAiEncodingPromise: Promise<{ encode(text:string): number[] }> | undefined;
async function openAiEncoding() {
  openAiEncodingPromise ??= Promise.all([import('js-tiktoken/lite'), import('js-tiktoken/ranks/o200k_base')]).then(([library, rank]) => new library.Tiktoken(rank.default));
  return openAiEncodingPromise;
}

/**
 * UTF-8 bytes per token, by tokenizer family. Only OpenAI ships an exact local
 * tokenizer; every other family is a deterministic byte-length projection, which is
 * why those models are labelled 'estimated' rather than 'exact'.
 */
export const BYTES_PER_TOKEN: Readonly<Record<TokenizerStrategy, number>> = {
  o200k_base: 4,
  'claude-estimate': 3.75,
  'gemini-estimate': 4,
  'deepseek-estimate': 3.85,
  // CJK-heavy vocabularies pack fewer UTF-8 bytes into a token on Latin text.
  'qwen-estimate': 3.7,
  'kimi-estimate': 3.7,
  'glm-estimate': 3.7,
  'grok-estimate': 4,
  'llama-estimate': 4,
};

export async function countTextTokens(text: string, modelOrId: ModelConfig | string) {
  const model = typeof modelOrId === 'string' ? getModel(modelOrId) : modelOrId;
  if (!text) return { tokens:0, accuracy:model.accuracy, method:'No text input' };
  if (model.tokenizer === 'o200k_base') {
    const encoding = await openAiEncoding();
    return { tokens:encoding.encode(text).length, accuracy:model.accuracy, method:'Exact local o200k_base BPE tokenization' };
  }
  const bytes = new TextEncoder().encode(text).length;
  const factor = BYTES_PER_TOKEN[model.tokenizer] ?? 4;
  return { tokens:Math.max(1,Math.ceil(bytes/factor)), accuracy:model.accuracy, method:`Provider-Calibrated UTF-8 Projection · ${factor.toFixed(2)} bytes/token` };
}

export function countImageTokens(width: number, height: number, modelOrId: ModelConfig | string, detail: 'low' | 'high' = 'high') {
  const model = typeof modelOrId === 'string' ? getModel(modelOrId) : modelOrId;
  if (!model.vision) throw new Error(`${model.name} does not publish supported image-token rules.`);
  const w=Math.max(1,width), h=Math.max(1,height);
  if(model.vision==='openai-tiles') {
    if(detail==='low') return {tokens:85,accuracy:'provider-formula' as const,method:'OpenAI low-detail fixed image cost'};
    const fit=Math.min(1,2048/w,2048/h); let rw=w*fit,rh=h*fit; const short=768/Math.min(rw,rh); rw*=short;rh*=short; const tiles=Math.ceil(rw/512)*Math.ceil(rh/512);
    return {tokens:85+170*tiles,accuracy:'provider-formula' as const,method:`OpenAI high-detail formula · ${tiles} tiles`};
  }
  if(model.vision==='claude-patches') {
    // Long-context Claude models carry the larger image budget. Keying this off the
    // context window rather than hardcoded ids means a new release inherits the right
    // tier automatically instead of silently falling back to the small cap.
    const cap=model.contextWindow>=1_000_000?4784:1568; const edge=cap===4784?2576:1568;
    const scale=Math.min(1,edge/w,edge/h,Math.sqrt((cap*28*28)/(w*h))); const tokens=Math.ceil(w*scale/28)*Math.ceil(h*scale/28);
    return {tokens:Math.min(cap,tokens),accuracy:'provider-formula' as const,method:`Claude 28×28 patch formula · ${cap} token tier`};
  }
  if(w<=384&&h<=384) return {tokens:258,accuracy:'provider-formula' as const,method:'Gemini small-image fixed allocation'};
  const crop=Math.max(1,Math.floor(Math.min(w,h)/1.5)); const tiles=Math.ceil(w/crop)*Math.ceil(h/crop);
  return {tokens:tiles*258,accuracy:'provider-formula' as const,method:`Gemini media allocation · ${tiles} tiles`};
}

export async function measureModel(input: ModelInput, modelOrId: ModelConfig | string): Promise<ModelMeasurement> {
  const model=typeof modelOrId==='string'?getModel(modelOrId):modelOrId;
  const fileText=(input.files??[]).map((file)=>file.text).filter((text): text is string=>typeof text==='string'&&text.length>0);
  const combinedText=[input.text,...fileText].filter((text): text is string=>typeof text==='string'&&text.length>0).join('\n\n');
  const text=await countTextTokens(combinedText,model);
  const images=[...(input.image?[input.image]:[]),...(input.images??[]),...(input.files??[]).flatMap((file)=>file.image?[file.image]:[])];
  const imageMeasurements=images.map((image)=>countImageTokens(image.width,image.height,model,image.detail));
  const inputTokens=text.tokens+imageMeasurements.reduce((total,image)=>total+image.tokens,0); const outputTokens=Math.max(0,Math.round(input.outputTokens??0)); const rates=resolveModelRates(model,inputTokens);
  return {modelId:model.id,model:model.name,provider:model.provider,inputTokens,outputTokens,accuracy:imageMeasurements[0]?.accuracy??text.accuracy,method:[text.method,...imageMeasurements.map((image)=>image.method)].filter(Boolean).join(' + '),cost:calculateTokenCost({inputTokens,outputTokens,cachedInputTokens:input.cachedInputTokens},rates),context:contextUsage(inputTokens,model.contextWindow),rates};
}

export async function compareModels(input: Parameters<typeof measureModel>[0], modelIds: readonly string[] = MODELS.map((model)=>model.id)) {
  return Promise.all(modelIds.map((id)=>measureModel(input,id)));
}

export function projectWorkload(perCall: number, requestsPerDay: number, daysPerMonth = 30) {
  assertNonNegative('perCall', perCall);
  assertNonNegative('requestsPerDay', requestsPerDay);
  assertNonNegative('daysPerMonth', daysPerMonth);
  const daily = perCall * requestsPerDay;
  return { perCall, daily, monthly: daily * daysPerMonth };
}

export function contextUsage(tokens: number, contextWindow: number) {
  assertNonNegative('tokens', tokens);
  if (!Number.isFinite(contextWindow) || contextWindow <= 0) throw new RangeError('contextWindow must be a finite, positive number');
  return { ratio: tokens / contextWindow, remaining: Math.max(0, contextWindow - tokens), overContext: tokens > contextWindow };
}
