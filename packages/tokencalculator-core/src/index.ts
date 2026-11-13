export interface TokenRates { inputPerMillion: number; outputPerMillion: number; cachedInputPerMillion?: number; cacheWritePerMillion?: number }
export interface TokenUsage { inputTokens: number; outputTokens?: number; cachedInputTokens?: number }
export interface TokenCostBreakdown { input: number; cachedInput: number; output: number; total: number }
export type ProviderId =
  | 'openai' | 'anthropic' | 'google' | 'deepseek'
  | 'alibaba' | 'moonshotai' | 'xai' | 'zai' | 'meta';
export type TokenizerStrategy =
  | 'o200k_base' | 'claude-estimate' | 'claude-47-estimate' | 'gemini-estimate' | 'deepseek-estimate'
  | 'qwen-estimate' | 'kimi-estimate' | 'grok-estimate' | 'glm-estimate' | 'llama-estimate';
export type InputModality = 'text' | 'image' | 'audio' | 'video' | 'pdf';
export type MediaKind = 'audio' | 'video' | 'pdf';
export interface MediaInput {
  kind: MediaKind;
  /** Duration in seconds. Audio and video only. */
  seconds?: number;
  /** Page count. PDFs only. */
  pages?: number;
  /** Gemini media_resolution. Left unset, each media type uses Google's own default. */
  detail?: 'low' | 'high';
  /** Whether a video carries sound, which is billed on top of the frames. */
  sound?: boolean;
}
export type MediaCount =
  | { supported: true; tokens: number; method: string; accuracy: 'provider-formula' }
  | { supported: false; reason: string };
export type VisionStrategy = 'openai-tiles' | 'openai-patches' | 'claude-patches' | 'gemini-tiles' | 'gemini-budget';
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
  /** Official model page used when its documented output limit differs from the feed. */
  maxOutputSource?: string;
  pricingTiers?: PricingTier[];
  vision?: VisionStrategy;
  /** Input types the model accepts, from the upstream catalogue. */
  inputModalities?: readonly InputModality[];
  pricingUrl: string;
  /** Official pricing page the rates were corrected from, when models.dev disagreed. */
  rateSource?: string;
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
  /** Audio clips, video clips or PDFs, counted where the provider publishes a rate. */
  media?: readonly MediaInput[];
  outputTokens?: number;
  cachedInputTokens?: number;
}

// <generated-models>
// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/sync-models.mjs from https://models.dev/api.json.
// Every rate below comes from that feed. To change which models appear,
// edit scripts/model-policy.json and re-run: npm run sync:models
export const MODELS: readonly ModelConfig[] = [
  { id:'gpt-6.1-terra', name:'GPT-6.1 Terra', provider:'openai', description:'Fast, efficient multimodal model', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:1, cachedInputPerMillion:0.05, cacheWritePerMillion:1.25, outputPerMillion:5, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:2,cachedInputPerMillion:0.1,cacheWritePerMillion:2.5,outputPerMillion:7.5,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-10-26', verifiedAt:'2026-11-13' },
  { id:'gpt-6.1-sol', name:'GPT-6.1 Sol', provider:'openai', description:'Latest frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.1, cacheWritePerMillion:2.5, outputPerMillion:10, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.2,cacheWritePerMillion:5,outputPerMillion:15,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-29', verifiedAt:'2026-11-13' },
  { id:'gpt-6-luna', name:'GPT-6 Luna', provider:'openai', description:'High-volume workloads', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:0.1, cachedInputPerMillion:0.01, cacheWritePerMillion:0.125, outputPerMillion:0.5, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:0.2,cachedInputPerMillion:0.02,cacheWritePerMillion:0.25,outputPerMillion:0.75,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-22', verifiedAt:'2026-11-13' },
  { id:'gpt-6-sol', name:'GPT-6 Sol', provider:'openai', description:'Frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2.5, outputPerMillion:10, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.4,cacheWritePerMillion:5,outputPerMillion:15,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-22', verifiedAt:'2026-11-13' },
  { id:'gpt-6-astra', name:'GPT-6 Astra', provider:'openai', description:'Latest frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:1, cacheWritePerMillion:12.5, outputPerMillion:50, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:20,cachedInputPerMillion:2,cacheWritePerMillion:25,outputPerMillion:75,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-04', verifiedAt:'2026-11-13' },
  { id:'gpt-5.6-luna', name:'GPT-5.6 Luna', provider:'openai', description:'High-volume workloads', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:0.2, cachedInputPerMillion:0.02, cacheWritePerMillion:0.25, outputPerMillion:1.2, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:0.4,cachedInputPerMillion:0.04,cacheWritePerMillion:0.5,outputPerMillion:1.8,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-11-13' },
  { id:'gpt-5.6-sol', name:'GPT-5.6 Sol', provider:'openai', description:'Previous frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:4, cachedInputPerMillion:0.4, cacheWritePerMillion:5, outputPerMillion:20, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:8,cachedInputPerMillion:0.8,cacheWritePerMillion:10,outputPerMillion:30,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-11-13' },
  { id:'gpt-5.6-terra', name:'GPT-5.6 Terra', provider:'openai', description:'Balanced production model', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2.5, outputPerMillion:12, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.4,cacheWritePerMillion:5,outputPerMillion:18,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-11-13' },
  { id:'claude-fable-5-2', name:'Claude Fable 5.2', provider:'anthropic', description:'Latest frontier Claude', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:8, cachedInputPerMillion:0.2, cacheWritePerMillion:10, outputPerMillion:40, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-11-09', verifiedAt:'2026-11-13' },
  { id:'claude-haiku-5-5', name:'Claude Haiku 5.5', provider:'anthropic', description:'High-volume, low-latency Claude', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:0.1, cachedInputPerMillion:0.01, cacheWritePerMillion:0.125, outputPerMillion:0.5, pricingTiers:[{aboveInputTokens:100000,inputPerMillion:0.5,cachedInputPerMillion:0.05,cacheWritePerMillion:0.625,outputPerMillion:2.5,label:'Long-context rate above 100K input tokens'}], vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-10-07', verifiedAt:'2026-11-13' },
  { id:'claude-sonnet-5-5', name:'Claude Sonnet 5.5', provider:'anthropic', description:'Latest balanced Claude', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.1, cacheWritePerMillion:2.5, outputPerMillion:10, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-28', verifiedAt:'2026-11-13' },
  { id:'claude-opus-5-5', name:'Claude Opus 5.5', provider:'anthropic', description:'Latest Opus generation', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:4, cachedInputPerMillion:0.2, cacheWritePerMillion:5, outputPerMillion:20, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-22', verifiedAt:'2026-11-13' },
  { id:'claude-fable-5-1', name:'Claude Fable 5.1', provider:'anthropic', description:'Previous frontier Claude', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:0.25, cacheWritePerMillion:12.5, outputPerMillion:50, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-01', verifiedAt:'2026-11-13' },
  { id:'claude-opus-5', name:'Claude Opus 5', provider:'anthropic', description:'Complex professional work', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:5, cachedInputPerMillion:0.5, cacheWritePerMillion:6.25, outputPerMillion:25, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-07-24', verifiedAt:'2026-11-13' },
  { id:'claude-sonnet-5', name:'Claude Sonnet 5', provider:'anthropic', description:'Balanced intelligence', tokenizer:'claude-47-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2.5, outputPerMillion:10, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-06-29', verifiedAt:'2026-11-13' },
  { id:'gemini-4-hydrogen', name:'Gemini 4 Hydrogen', provider:'google', description:'Fast Gemini 4 for everyday coding', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:1.5, cachedInputPerMillion:0.075, outputPerMillion:7.5, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-11-12', verifiedAt:'2026-11-13' },
  { id:'gemini-4-carbon', name:'Gemini 4 Carbon', provider:'google', description:'Most capable Gemini 4 reasoning', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, maxOutputSource:'https://ai.google.dev/gemini-api/docs/models/gemini-4-carbon', inputPerMillion:2, cachedInputPerMillion:0.1, outputPerMillion:10, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-11-10', verifiedAt:'2026-11-13' },
  { id:'gemini-4-argon', name:'Gemini 4 Argon', provider:'google', description:'Efficient Gemini 4 reasoning', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, maxOutputSource:'https://ai.google.dev/gemini-api/docs/models/gemini-4-argon', inputPerMillion:2, cachedInputPerMillion:0.1, outputPerMillion:10, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-10-13', verifiedAt:'2026-11-13' },
  { id:'gemini-3.8-flash', name:'Gemini 3.8 Flash', provider:'google', description:'Latest multimodal Flash', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-09-02', verifiedAt:'2026-11-13' },
  { id:'gemini-3.5-flash-lite', name:'Gemini 3.5 Flash Lite', provider:'google', description:'Low-cost multimodal', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.3, cachedInputPerMillion:0.03, outputPerMillion:2.5, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-07-21', verifiedAt:'2026-11-13' },
  { id:'gemini-3.1-flash-lite', name:'Gemini 3.1 Flash Lite', provider:'google', description:'High-volume multimodal', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.25, cachedInputPerMillion:0.025, outputPerMillion:1.5, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-05-07', verifiedAt:'2026-11-13' },
  { id:'gemini-2.5-pro', name:'Gemini 2.5 Pro', provider:'google', description:'Long-context reasoning', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:1.25, cachedInputPerMillion:0.125, outputPerMillion:10, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:2.5,cachedInputPerMillion:0.25,outputPerMillion:15,label:'Long-context rate above 200K input tokens'}], vision:'gemini-tiles', inputModalities:['text','image','audio','video','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2025-06-17', verifiedAt:'2026-11-13' },
  { id:'deepseek-flash', name:'DeepSeek V4.1 Flash 1017', provider:'deepseek', description:'Fast, low-cost model', tokenizer:'deepseek-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:393_216, inputPerMillion:0.15, cachedInputPerMillion:0.003, outputPerMillion:0.6, inputModalities:['text','image'], pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', releaseDate:'2026-10-17', verifiedAt:'2026-11-13' },
  { id:'deepseek-v4-pro', name:'DeepSeek V4 Pro', provider:'deepseek', description:'Higher capability', tokenizer:'deepseek-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:393_216, inputPerMillion:0.66, cachedInputPerMillion:0.022, outputPerMillion:1.98, inputModalities:['text'], pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', releaseDate:'2026-08-13', verifiedAt:'2026-11-13' },
  { id:'qwen3.8-flash', name:'Qwen3.8 Flash', provider:'alibaba', description:'High-volume Qwen', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.15, cachedInputPerMillion:0.016, cacheWritePerMillion:0.2, outputPerMillion:0.47, inputModalities:['text','image','video'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-08-26', verifiedAt:'2026-11-13' },
  { id:'qwen3.8-max', name:'Qwen3.8 Max', provider:'alibaba', description:'Alibaba flagship', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:2, cachedInputPerMillion:0.25, cacheWritePerMillion:2.5, outputPerMillion:6, inputModalities:['text','image','video','pdf'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-08-03', verifiedAt:'2026-11-13' },
  { id:'qwen3.7-flash', name:'Qwen3.7 Flash', provider:'alibaba', description:'Reasoning model', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.03, cachedInputPerMillion:0.006, cacheWritePerMillion:0.0375, outputPerMillion:0.13, pricingTiers:[{aboveInputTokens:32000,inputPerMillion:0.1,cachedInputPerMillion:0.02,cacheWritePerMillion:0.125,outputPerMillion:0.4,label:'Long-context rate above 32K input tokens'},{aboveInputTokens:256000,inputPerMillion:0.2,cachedInputPerMillion:0.04,cacheWritePerMillion:0.25,outputPerMillion:0.8,label:'Long-context rate above 256K input tokens'}], inputModalities:['text','image','video'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-07-15', verifiedAt:'2026-11-13' },
  { id:'qwen3.7-plus', name:'Qwen3.7 Plus', provider:'alibaba', description:'Balanced Qwen', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.4, cachedInputPerMillion:0.08, cacheWritePerMillion:0.5, outputPerMillion:1.6, pricingTiers:[{aboveInputTokens:256000,inputPerMillion:1.2,cachedInputPerMillion:0.24,cacheWritePerMillion:1.5,outputPerMillion:4.8,label:'Long-context rate above 256K input tokens'}], inputModalities:['text','image','video'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-06-02', verifiedAt:'2026-11-13' },
  { id:'qwen3.7-max', name:'Qwen3.7 Max', provider:'alibaba', description:'Previous Qwen flagship', tokenizer:'qwen-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:2.5, cachedInputPerMillion:0.5, cacheWritePerMillion:3.125, outputPerMillion:7.5, inputModalities:['text'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-05-21', verifiedAt:'2026-11-13' },
  { id:'kimi-k3.1-pro', name:'Kimi K3.1 Pro', provider:'moonshotai', description:'Latest Moonshot flagship', tokenizer:'kimi-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:1_048_576, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2, outputPerMillion:10, inputModalities:['text','image','video'], pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-10-23', verifiedAt:'2026-11-13' },
  { id:'kimi-k3', name:'Kimi K3', provider:'moonshotai', description:'Moonshot flagship', tokenizer:'kimi-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:1_048_576, inputPerMillion:3, cachedInputPerMillion:0.3, cacheWritePerMillion:3, outputPerMillion:15, inputModalities:['text','image','video'], pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-07-16', verifiedAt:'2026-11-13' },
  { id:'grok-4.7', name:'Grok 4.7', provider:'xai', description:'xAI flagship', tokenizer:'grok-estimate', accuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.5, outputPerMillion:6, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:4,cachedInputPerMillion:1,outputPerMillion:12,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','pdf'], pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-09-21', verifiedAt:'2026-11-13' },
  { id:'grok-4.6', name:'Grok 4.6', provider:'xai', description:'xAI flagship', tokenizer:'grok-estimate', accuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.5, outputPerMillion:6, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:4,cachedInputPerMillion:1,outputPerMillion:12,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','pdf'], pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-08-12', verifiedAt:'2026-11-13' },
  { id:'grok-4.5', name:'Grok 4.5', provider:'xai', description:'Previous Grok generation', tokenizer:'grok-estimate', accuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.3, outputPerMillion:6, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:4,cachedInputPerMillion:0.6,outputPerMillion:12,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','pdf'], pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-07-08', verifiedAt:'2026-11-13' },
  { id:'glm-5.3-flashx', name:'GLM-5.3-FlashX', provider:'zai', description:'Faster GLM-5.3-Flash', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.37, cachedInputPerMillion:0.075, cacheWritePerMillion:0, outputPerMillion:1.25, inputModalities:['text','image','video','pdf'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-09-18', verifiedAt:'2026-11-13' },
  { id:'glm-5.3-flash', name:'GLM-5.3-Flash', provider:'zai', description:'Low-cost GLM', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.15, cachedInputPerMillion:0.03, cacheWritePerMillion:0, outputPerMillion:0.5, inputModalities:['text','image','video','pdf'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-08-26', verifiedAt:'2026-11-13' },
  { id:'glm-5.3', name:'GLM-5.3', provider:'zai', description:'Z.ai flagship', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, cacheWritePerMillion:0, outputPerMillion:4.4, inputModalities:['text'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-08-14', verifiedAt:'2026-11-13' },
  { id:'glm-5.2', name:'GLM-5.2', provider:'zai', description:'Reasoning model', tokenizer:'glm-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, cacheWritePerMillion:0, outputPerMillion:4.4, inputModalities:['text'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-06-13', verifiedAt:'2026-11-13' },
  { id:'muse-ember-1.0', name:'Muse Ember', provider:'meta', description:'High-volume agent execution', tokenizer:'llama-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:524_288, inputPerMillion:0.1, cachedInputPerMillion:0.004, outputPerMillion:0.5, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:0.3,cachedInputPerMillion:0.012,outputPerMillion:1.5,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','video','pdf','audio'], pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-11-09', verifiedAt:'2026-11-13' },
  { id:'muse-wonder-1.0', name:'Muse Wonder', provider:'meta', description:'Meta frontier agent model', tokenizer:'llama-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:4, cachedInputPerMillion:0.2, outputPerMillion:20, inputModalities:['text','image','video','pdf','audio'], pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-10-12', verifiedAt:'2026-11-13' },
  { id:'muse-spark-1.3', name:'Muse Spark 1.3', provider:'meta', description:'Fast Meta agent model', tokenizer:'llama-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:1.25, cachedInputPerMillion:0.15, outputPerMillion:4.25, inputModalities:['text','image','video','pdf','audio'], pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-09-02', verifiedAt:'2026-11-13' },
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
  'claude-3-5-haiku': 'claude-haiku-5-5',
  'claude-3-7-sonnet': 'claude-sonnet-5',
  'claude-sonnet-4': 'claude-sonnet-5',
  'claude-sonnet-4-5': 'claude-sonnet-5',
  'claude-opus-4': 'claude-opus-5',
  'claude-opus-4-1': 'claude-opus-5',
  'claude-haiku-4-5': 'claude-haiku-5-5',
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
  'deepseek-chat': 'deepseek-flash',
  'deepseek-reasoner': 'deepseek-v4-pro',
  'deepseek-r1': 'deepseek-v4-pro',
  'deepseek-v3': 'deepseek-flash',
  // DeepSeek retired V4 Flash on 2026-09-10 and routes the old name to V4.1 Flash.
  'deepseek-v4-flash': 'deepseek-flash',
  'deepseek-v4.1-flash': 'deepseek-flash',
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
  // Anthropic documents that Claude 4.7 and later produce ~30% more tokens for the same
  // text, so the same bytes divide into more tokens: 3.75 / 1.30.
  'claude-47-estimate': 2.88,
  'gemini-estimate': 4,
  'deepseek-estimate': 3.85,
  // CJK-heavy vocabularies pack fewer UTF-8 bytes into a token on Latin text.
  'qwen-estimate': 3.7,
  'kimi-estimate': 3.7,
  'glm-estimate': 3.7,
  'grok-estimate': 4,
  'llama-estimate': 4,
};

/**
 * OpenAI lists a patch budget and multiplier for these models only. GPT-6 Sol, GPT-6.1 Sol
 * and GPT-6 Luna accept images but are absent from that table, so they reuse the same rule
 * and are reported as an estimate.
 */
const OPENAI_PUBLISHED_PATCH_SPEC = new Set(['gpt-6-astra','gpt-5.6-sol','gpt-5.6-terra','gpt-5.6-luna']);

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
  if(model.vision==='openai-patches') {
    // 32x32 patches, capped at 2,500, then multiplied by 1.2.
    // developers.openai.com/api/docs/guides/images-vision
    const raw=Math.ceil(w/32)*Math.ceil(h/32); let patches=raw;
    if(raw>2500) {
      // Over budget: shrink to the budget, then snap the width to whole patches.
      const shrink=Math.sqrt((2500*1024)/(w*h)); const sw=w*shrink; const snap=Math.floor(sw/32)/(sw/32);
      patches=Math.min(2500,Math.ceil((sw*snap)/32)*Math.ceil((h*shrink*snap)/32));
    }
    // OpenAI publishes a budget for these models only; the rest reuse the rule as an estimate.
    const published=OPENAI_PUBLISHED_PATCH_SPEC.has(model.id);
    return {tokens:Math.ceil(patches*1.2),accuracy:(published?'provider-formula':'estimated') as 'provider-formula'|'estimated',method:`OpenAI 32×32 patch formula · ${patches.toLocaleString()} patches × 1.2${published?'':" · budget not published for this model, GPT-6 Astra's applied"}`};
  }
  if(model.vision==='openai-tiles') {
    if(detail==='low') return {tokens:85,accuracy:'provider-formula' as const,method:'OpenAI low-detail fixed image cost'};
    const fit=Math.min(1,2048/w,2048/h); let rw=w*fit,rh=h*fit; const short=768/Math.min(rw,rh); rw*=short;rh*=short; const tiles=Math.ceil(rw/512)*Math.ceil(rh/512);
    return {tokens:85+170*tiles,accuracy:'provider-formula' as const,method:`OpenAI high-detail formula · ${tiles} tiles`};
  }
  if(model.vision==='claude-patches') {
    // Claude 4.7 and later carry the larger image budget, the same boundary as the newer
    // tokenizer, so the tokenizer family selects the tier.
    // platform.claude.com/docs/en/build-with-claude/vision
    const highTier=model.tokenizer==='claude-47-estimate'; const cap=highTier?4784:1568; const edge=highTier?2576:1568;
    const patches=(pw:number,ph:number)=>Math.ceil(pw/28)*Math.ceil(ph/28);
    const fits=(pw:number,ph:number)=>Math.ceil(pw/28)*28<=edge&&Math.ceil(ph/28)*28<=edge&&patches(pw,ph)<=cap;
    let tokens=patches(w,h);
    if(!fits(w,h)) {
      // Largest proportional resize that fits both limits.
      const longest=Math.max(w,h); let low=1,high=longest;
      while(low+1<high) {
        const mid=Math.floor((low+high)/2); const scale=mid/longest;
        if(fits(Math.max(1,Math.round(w*scale)),Math.max(1,Math.round(h*scale)))) low=mid; else high=mid;
      }
      const scale=low/longest; tokens=patches(Math.max(1,Math.round(w*scale)),Math.max(1,Math.round(h*scale)));
    }
    return {tokens:Math.min(cap,tokens),accuracy:'provider-formula' as const,method:`Claude 28×28 patch formula · ${cap.toLocaleString()} token tier`};
  }
  if(model.vision==='gemini-budget') {
    // Gemini 3 and 4 spend a fixed budget per image: 280 low, 560 medium, 1,120 high and
    // default, 2,240 ultra-high. ai.google.dev/gemini-api/docs/media-resolution
    const tokens=detail==='low'?280:1120;
    return {tokens,accuracy:'provider-formula' as const,method:`${model.id.startsWith('gemini-4')?'Gemini 4':'Gemini 3'} media_resolution ${detail==='low'?'low':'high'} · ${tokens.toLocaleString()} tokens per image`};
  }
  // Gemini 2.x: one fixed allocation for a small image, 768px tiles above that, with
  // oversized images scaled into 3072x3072 first.
  if(w<=384&&h<=384) return {tokens:258,accuracy:'provider-formula' as const,method:'Gemini small-image fixed allocation'};
  const fit=Math.min(1,3072/w,3072/h); const tiles=Math.ceil((w*fit)/768)*Math.ceil((h*fit)/768);
  return {tokens:tiles*258,accuracy:'provider-formula' as const,method:`Gemini 768px tiles · ${tiles} tiles`};
}

/**
 * Gemini 3 and 4 budgets: 25 tokens a second of audio, 70 or 280 a video frame at 1 FPS, and
 * 560 a PDF page by default. ai.google.dev/gemini-api/docs/media-resolution
 * Gemini 2.x keeps the older 258-based allocations.
 */
const MEDIA_RATES = {
  'gemini-budget': { label: 'Gemini 3', audioPerSecond: 25, videoFrame: { low: 70, high: 280 }, pdfPerPage: { default: 560, low: 280, high: 1120 } },
  'gemini-tiles': { label: 'Gemini 2.x', audioPerSecond: 32, videoFrame: { low: 66, high: 258 }, pdfPerPage: { default: 258, low: 258, high: 258 } },
} as const;
const MEDIA_LABELS: Record<MediaKind, string> = { audio: 'audio', video: 'video', pdf: 'PDF' };

/**
 * Tokens for one audio clip, video clip or PDF. Only Google publishes rates for these
 * inputs today, so every other model returns the reason instead of an unsourced number.
 */
export function countMediaTokens(input: MediaInput, modelOrId: ModelConfig | string): MediaCount {
  const model = typeof modelOrId === 'string' ? getModel(modelOrId) : modelOrId;
  const kind = input.kind;
  if (model.inputModalities && !model.inputModalities.includes(kind)) {
    return { supported: false, reason: `${model.name} does not accept ${MEDIA_LABELS[kind]} input.` };
  }
  const rates = model.vision === 'gemini-budget' || model.vision === 'gemini-tiles' ? MEDIA_RATES[model.vision] : undefined;
  if (!rates) {
    return {
      supported: false,
      reason: kind === 'pdf'
        ? `Page text is counted. ${model.name} is also sent each page as an image, and no per-page token cost is published for it.`
        : `${model.name} accepts ${MEDIA_LABELS[kind]} input, but no token rate is published for it.`,
    };
  }
  const label = model.id.startsWith('gemini-4') ? 'Gemini 4' : rates.label;
  // Seconds are billed whole, and video frames are sampled once per second.
  const seconds = Math.max(0, Math.ceil(input.seconds ?? 0));
  if (kind === 'audio') {
    return { supported: true, tokens: seconds * rates.audioPerSecond, accuracy: 'provider-formula', method: `${label} audio · ${rates.audioPerSecond} tokens per second × ${seconds.toLocaleString()}s` };
  }
  if (kind === 'video') {
    // Google's default for video is the low frame budget, unlike images, where the
    // default matches the high budget.
    const perFrame = input.detail === 'high' ? rates.videoFrame.high : rates.videoFrame.low;
    const sound = input.sound === false ? 0 : seconds * rates.audioPerSecond;
    return { supported: true, tokens: seconds * perFrame + sound, accuracy: 'provider-formula', method: `${label} video · ${perFrame} tokens per frame at 1 FPS × ${seconds.toLocaleString()}s${sound ? ` + ${rates.audioPerSecond} tokens per second of sound` : ''}` };
  }
  const pages = Math.max(0, Math.round(input.pages ?? 0));
  const perPage = input.detail ? rates.pdfPerPage[input.detail] : rates.pdfPerPage.default;
  return { supported: true, tokens: pages * perPage, accuracy: 'provider-formula', method: `${label} PDF pages · ${perPage} tokens per page × ${pages.toLocaleString()} page${pages === 1 ? '' : 's'}, page text counted separately` };
}

export async function measureModel(input: ModelInput, modelOrId: ModelConfig | string): Promise<ModelMeasurement> {
  const model=typeof modelOrId==='string'?getModel(modelOrId):modelOrId;
  const fileText=(input.files??[]).map((file)=>file.text).filter((text): text is string=>typeof text==='string'&&text.length>0);
  const combinedText=[input.text,...fileText].filter((text): text is string=>typeof text==='string'&&text.length>0).join('\n\n');
  const text=await countTextTokens(combinedText,model);
  const images=[...(input.image?[input.image]:[]),...(input.images??[]),...(input.files??[]).flatMap((file)=>file.image?[file.image]:[])];
  const imageMeasurements=images.map((image)=>countImageTokens(image.width,image.height,model,image.detail));
  // Audio, video and PDF pages, where the provider publishes a rate for them.
  const mediaMeasurements=(input.media??[]).map((item)=>countMediaTokens(item,model)).filter((result):result is Extract<MediaCount,{supported:true}>=>result.supported);
  const inputTokens=text.tokens+imageMeasurements.reduce((total,image)=>total+image.tokens,0)+mediaMeasurements.reduce((total,item)=>total+item.tokens,0); const outputTokens=Math.max(0,Math.round(input.outputTokens??0)); const rates=resolveModelRates(model,inputTokens);
  return {modelId:model.id,model:model.name,provider:model.provider,inputTokens,outputTokens,accuracy:imageMeasurements[0]?.accuracy??text.accuracy,method:[text.method,...imageMeasurements.map((image)=>image.method),...mediaMeasurements.map((item)=>item.method)].filter(Boolean).join(' + '),cost:calculateTokenCost({inputTokens,outputTokens,cachedInputTokens:input.cachedInputTokens},rates),context:contextUsage(inputTokens,model.contextWindow),rates};
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
