// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/sync-models.mjs from https://models.dev/api.json.
// Every rate below comes from that feed. To change which models appear,
// edit scripts/model-policy.json and re-run: npm run sync:models
import type { ModelConfig, ProviderId, ServiceTier } from '../domain/models';

export const MODELS: ModelConfig[] = [
  { id:'gpt-6.1-terra', name:'GPT-6.1 Terra', provider:'openai', description:'Fast, efficient multimodal model', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:1, cachedInputPerMillion:0.05, cacheWritePerMillion:1.25, outputPerMillion:5, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:2,cachedInputPerMillion:0.1,cacheWritePerMillion:2.5,outputPerMillion:7.5,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-10-26', verifiedAt:'2026-10-29', isDefault:true },
  { id:'gpt-6.1-sol', name:'GPT-6.1 Sol', provider:'openai', description:'Latest frontier reasoning', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.1, cacheWritePerMillion:2.5, outputPerMillion:10, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.2,cacheWritePerMillion:5,outputPerMillion:15,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-29', verifiedAt:'2026-10-29' },
  { id:'gpt-6-luna', name:'GPT-6 Luna', provider:'openai', description:'High-volume workloads', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:0.1, cachedInputPerMillion:0.01, cacheWritePerMillion:0.125, outputPerMillion:0.5, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:0.2,cachedInputPerMillion:0.02,cacheWritePerMillion:0.25,outputPerMillion:0.75,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-22', verifiedAt:'2026-10-29' },
  { id:'gpt-6-sol', name:'GPT-6 Sol', provider:'openai', description:'Frontier reasoning', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2.5, outputPerMillion:10, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.4,cacheWritePerMillion:5,outputPerMillion:15,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-22', verifiedAt:'2026-10-29' },
  { id:'gpt-6-astra', name:'GPT-6 Astra', provider:'openai', description:'Latest frontier reasoning', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:1, cacheWritePerMillion:12.5, outputPerMillion:50, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:20,cachedInputPerMillion:2,cacheWritePerMillion:25,outputPerMillion:75,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-09-04', verifiedAt:'2026-10-29' },
  { id:'gpt-5.6-luna', name:'GPT-5.6 Luna', provider:'openai', description:'High-volume workloads', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:0.2, cachedInputPerMillion:0.02, cacheWritePerMillion:0.25, outputPerMillion:1.2, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:0.4,cachedInputPerMillion:0.04,cacheWritePerMillion:0.5,outputPerMillion:1.8,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-10-29' },
  { id:'gpt-5.6-sol', name:'GPT-5.6 Sol', provider:'openai', description:'Previous frontier reasoning', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:4, cachedInputPerMillion:0.4, cacheWritePerMillion:5, outputPerMillion:20, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:8,cachedInputPerMillion:0.8,cacheWritePerMillion:10,outputPerMillion:30,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-10-29' },
  { id:'gpt-5.6-terra', name:'GPT-5.6 Terra', provider:'openai', description:'Balanced production model', tokenizer:'o200k_base', textAccuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2.5, outputPerMillion:12, pricingTiers:[{aboveInputTokens:272000,inputPerMillion:4,cachedInputPerMillion:0.4,cacheWritePerMillion:5,outputPerMillion:18,label:'Long-context rate above 272K input tokens'}], vision:'openai-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://developers.openai.com/api/docs/models/compare', releaseDate:'2026-07-09', verifiedAt:'2026-10-29' },
  { id:'claude-haiku-5-5', name:'Claude Haiku 5.5', provider:'anthropic', description:'High-volume, low-latency Claude', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:0.1, cachedInputPerMillion:0.01, cacheWritePerMillion:0.125, outputPerMillion:0.5, pricingTiers:[{aboveInputTokens:100000,inputPerMillion:0.5,cachedInputPerMillion:0.05,cacheWritePerMillion:0.625,outputPerMillion:2.5,label:'Long-context rate above 100K input tokens'}], vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-10-07', verifiedAt:'2026-10-29' },
  { id:'claude-sonnet-5-5', name:'Claude Sonnet 5.5', provider:'anthropic', description:'Latest balanced Claude', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.1, cacheWritePerMillion:2.5, outputPerMillion:10, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-28', verifiedAt:'2026-10-29' },
  { id:'claude-opus-5-5', name:'Claude Opus 5.5', provider:'anthropic', description:'Latest Opus generation', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:4, cachedInputPerMillion:0.2, cacheWritePerMillion:5, outputPerMillion:20, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-22', verifiedAt:'2026-10-29' },
  { id:'claude-fable-5-1', name:'Claude Fable 5.1', provider:'anthropic', description:'Latest frontier Claude', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:0.25, cacheWritePerMillion:12.5, outputPerMillion:50, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-09-01', verifiedAt:'2026-10-29' },
  { id:'claude-opus-5', name:'Claude Opus 5', provider:'anthropic', description:'Complex professional work', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:5, cachedInputPerMillion:0.5, cacheWritePerMillion:6.25, outputPerMillion:25, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-07-24', verifiedAt:'2026-10-29' },
  { id:'claude-sonnet-5', name:'Claude Sonnet 5', provider:'anthropic', description:'Balanced intelligence', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2.5, outputPerMillion:10, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-06-29', verifiedAt:'2026-10-29' },
  { id:'claude-fable-5', name:'Claude Fable 5', provider:'anthropic', description:'Previous frontier Claude', tokenizer:'claude-47-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:10, cachedInputPerMillion:1, cacheWritePerMillion:12.5, outputPerMillion:50, vision:'claude-patches', inputModalities:['text','image','pdf'], pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', releaseDate:'2026-06-07', verifiedAt:'2026-10-29' },
  { id:'gemini-4-argon', name:'Gemini 4 Argon', provider:'google', description:'Flagship long-horizon reasoning', tokenizer:'gemini-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, maxOutputSource:'https://ai.google.dev/gemini-api/docs/models/gemini-4-argon', inputPerMillion:2, cachedInputPerMillion:0.1, outputPerMillion:10, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-10-13', verifiedAt:'2026-10-29' },
  { id:'gemini-3.8-flash', name:'Gemini 3.8 Flash', provider:'google', description:'Latest multimodal Flash', tokenizer:'gemini-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-09-02', verifiedAt:'2026-10-29' },
  { id:'gemini-3.5-flash-lite', name:'Gemini 3.5 Flash Lite', provider:'google', description:'Low-cost multimodal', tokenizer:'gemini-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.3, cachedInputPerMillion:0.03, outputPerMillion:2.5, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-07-21', verifiedAt:'2026-10-29' },
  { id:'gemini-3.6-flash', name:'Gemini 3.6 Flash', provider:'google', description:'Multimodal Flash', tokenizer:'gemini-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.75, cachedInputPerMillion:0.075, outputPerMillion:3.75, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-07-21', verifiedAt:'2026-10-29' },
  { id:'gemini-3.1-flash-lite', name:'Gemini 3.1 Flash Lite', provider:'google', description:'High-volume multimodal', tokenizer:'gemini-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:0.25, cachedInputPerMillion:0.025, outputPerMillion:1.5, vision:'gemini-budget', inputModalities:['text','image','video','audio','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2026-05-07', verifiedAt:'2026-10-29' },
  { id:'gemini-2.5-pro', name:'Gemini 2.5 Pro', provider:'google', description:'Long-context reasoning', tokenizer:'gemini-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:1.25, cachedInputPerMillion:0.125, outputPerMillion:10, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:2.5,cachedInputPerMillion:0.25,outputPerMillion:15,label:'Long-context rate above 200K input tokens'}], vision:'gemini-tiles', inputModalities:['text','image','audio','video','pdf'], pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', releaseDate:'2025-06-17', verifiedAt:'2026-10-29' },
  { id:'deepseek-flash', name:'DeepSeek V4.1 Flash 1017', provider:'deepseek', description:'Fast, low-cost model', tokenizer:'deepseek-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:393_216, inputPerMillion:0.15, cachedInputPerMillion:0.003, outputPerMillion:0.6, inputModalities:['text','image'], pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', releaseDate:'2026-10-17', verifiedAt:'2026-10-29' },
  { id:'deepseek-v4-pro', name:'DeepSeek V4 Pro', provider:'deepseek', description:'Higher capability', tokenizer:'deepseek-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:393_216, inputPerMillion:0.66, cachedInputPerMillion:0.022, outputPerMillion:1.98, inputModalities:['text'], pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', releaseDate:'2026-08-13', verifiedAt:'2026-10-29' },
  { id:'qwen3.8-flash', name:'Qwen3.8 Flash', provider:'alibaba', description:'High-volume Qwen', tokenizer:'qwen-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.15, cachedInputPerMillion:0.016, cacheWritePerMillion:0.2, outputPerMillion:0.47, inputModalities:['text','image','video'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-08-26', verifiedAt:'2026-10-29' },
  { id:'qwen3.8-max', name:'Qwen3.8 Max', provider:'alibaba', description:'Alibaba flagship', tokenizer:'qwen-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:2, cachedInputPerMillion:0.25, cacheWritePerMillion:2.5, outputPerMillion:6, inputModalities:['text','image','video','pdf'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-08-03', verifiedAt:'2026-10-29' },
  { id:'qwen3.7-flash', name:'Qwen3.7 Flash', provider:'alibaba', description:'Reasoning model', tokenizer:'qwen-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.03, cachedInputPerMillion:0.006, cacheWritePerMillion:0.0375, outputPerMillion:0.13, pricingTiers:[{aboveInputTokens:32000,inputPerMillion:0.1,cachedInputPerMillion:0.02,cacheWritePerMillion:0.125,outputPerMillion:0.4,label:'Long-context rate above 32K input tokens'},{aboveInputTokens:256000,inputPerMillion:0.2,cachedInputPerMillion:0.04,cacheWritePerMillion:0.25,outputPerMillion:0.8,label:'Long-context rate above 256K input tokens'}], inputModalities:['text','image','video'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-07-15', verifiedAt:'2026-10-29' },
  { id:'qwen3.7-plus', name:'Qwen3.7 Plus', provider:'alibaba', description:'Balanced Qwen', tokenizer:'qwen-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.4, cachedInputPerMillion:0.08, cacheWritePerMillion:0.5, outputPerMillion:1.6, pricingTiers:[{aboveInputTokens:256000,inputPerMillion:1.2,cachedInputPerMillion:0.24,cacheWritePerMillion:1.5,outputPerMillion:4.8,label:'Long-context rate above 256K input tokens'}], inputModalities:['text','image','video'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-06-02', verifiedAt:'2026-10-29' },
  { id:'qwen3.7-max', name:'Qwen3.7 Max', provider:'alibaba', description:'Previous Qwen flagship', tokenizer:'qwen-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:2.5, cachedInputPerMillion:0.5, cacheWritePerMillion:3.125, outputPerMillion:7.5, inputModalities:['text'], pricingUrl:'https://www.alibabacloud.com/help/en/model-studio/models', releaseDate:'2026-05-21', verifiedAt:'2026-10-29' },
  { id:'kimi-k3.1-pro', name:'Kimi K3.1 Pro', provider:'moonshotai', description:'Latest Moonshot flagship', tokenizer:'kimi-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:1_048_576, inputPerMillion:2, cachedInputPerMillion:0.2, cacheWritePerMillion:2, outputPerMillion:10, inputModalities:['text','image','video'], pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-10-23', verifiedAt:'2026-10-29' },
  { id:'kimi-k3', name:'Kimi K3', provider:'moonshotai', description:'Moonshot flagship', tokenizer:'kimi-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:1_048_576, inputPerMillion:3, cachedInputPerMillion:0.3, cacheWritePerMillion:3, outputPerMillion:15, inputModalities:['text','image','video'], pricingUrl:'https://platform.moonshot.ai/docs/pricing', releaseDate:'2026-07-16', verifiedAt:'2026-10-29' },
  { id:'grok-4.7', name:'Grok 4.7', provider:'xai', description:'xAI flagship', tokenizer:'grok-estimate', textAccuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.5, outputPerMillion:6, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:4,cachedInputPerMillion:1,outputPerMillion:12,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','pdf'], pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-09-21', verifiedAt:'2026-10-29' },
  { id:'grok-4.6', name:'Grok 4.6', provider:'xai', description:'xAI flagship', tokenizer:'grok-estimate', textAccuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.5, outputPerMillion:6, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:4,cachedInputPerMillion:1,outputPerMillion:12,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','pdf'], pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-08-12', verifiedAt:'2026-10-29' },
  { id:'grok-4.5', name:'Grok 4.5', provider:'xai', description:'Previous Grok generation', tokenizer:'grok-estimate', textAccuracy:'estimated', contextWindow:500_000, maxOutput:500_000, inputPerMillion:2, cachedInputPerMillion:0.3, outputPerMillion:6, pricingTiers:[{aboveInputTokens:200000,inputPerMillion:4,cachedInputPerMillion:0.6,outputPerMillion:12,label:'Long-context rate above 200K input tokens'}], inputModalities:['text','image','pdf'], pricingUrl:'https://docs.x.ai/docs/models', releaseDate:'2026-07-08', verifiedAt:'2026-10-29' },
  { id:'glm-5.3-flashx', name:'GLM-5.3-FlashX', provider:'zai', description:'Faster GLM-5.3-Flash', tokenizer:'glm-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.37, cachedInputPerMillion:0.075, cacheWritePerMillion:0, outputPerMillion:1.25, inputModalities:['text','image','video','pdf'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-09-18', verifiedAt:'2026-10-29' },
  { id:'glm-5.3-flash', name:'GLM-5.3-Flash', provider:'zai', description:'Low-cost GLM', tokenizer:'glm-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:0.15, cachedInputPerMillion:0.03, cacheWritePerMillion:0, outputPerMillion:0.5, inputModalities:['text','image','video','pdf'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-08-26', verifiedAt:'2026-10-29' },
  { id:'glm-5.3', name:'GLM-5.3', provider:'zai', description:'Z.ai flagship', tokenizer:'glm-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, cacheWritePerMillion:0, outputPerMillion:4.4, inputModalities:['text'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-08-14', verifiedAt:'2026-10-29' },
  { id:'glm-5.2', name:'GLM-5.2', provider:'zai', description:'Reasoning model', tokenizer:'glm-estimate', textAccuracy:'estimated', contextWindow:1_000_000, maxOutput:131_072, inputPerMillion:1.4, cachedInputPerMillion:0.26, cacheWritePerMillion:0, outputPerMillion:4.4, inputModalities:['text'], pricingUrl:'https://docs.z.ai/guides/overview/pricing', releaseDate:'2026-06-13', verifiedAt:'2026-10-29' },
  { id:'muse-wonder-1.0', name:'Muse Wonder', provider:'meta', description:'Meta frontier agent model', tokenizer:'llama-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:4, cachedInputPerMillion:0.2, outputPerMillion:20, inputModalities:['text','image','video','pdf','audio'], pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-10-12', verifiedAt:'2026-10-29' },
  { id:'muse-spark-1.3', name:'Muse Spark 1.3', provider:'meta', description:'Fast Meta agent model', tokenizer:'llama-estimate', textAccuracy:'estimated', contextWindow:1_048_576, maxOutput:131_072, inputPerMillion:1.25, cachedInputPerMillion:0.15, outputPerMillion:4.25, inputModalities:['text','image','video','pdf','audio'], pricingUrl:'https://llama.developer.meta.com/docs/models', releaseDate:'2026-09-02', verifiedAt:'2026-10-29' },
];

export const PRICING_NOTES: Partial<Record<ProviderId, string>> = {
  "deepseek": "Rates shown are DeepSeek's off-peak prices. From 01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday (except Chinese public holidays), DeepSeek charges double."
};

export const SERVICE_TIERS: Partial<Record<ProviderId, ServiceTier[]>> = {
  "openai": [
    {
      "id": "batch",
      "label": "Batch",
      "multiplier": 0.5,
      "note": "Asynchronous processing. Half the standard price on every model."
    },
    {
      "id": "flex",
      "label": "Flex",
      "multiplier": 0.5,
      "note": "Slower responses, billed at batch rates."
    },
    {
      "id": "fast",
      "label": "Fast",
      "multiplier": 2,
      "note": "Priority capacity at twice the standard price."
    },
    {
      "id": "ultrafast",
      "label": "Ultrafast",
      "multiplier": 6,
      "appliesTo": [
        "gpt-6-astra"
      ],
      "note": "GPT-6 Astra only, and only below the long-context threshold."
    }
  ],
  "anthropic": [
    {
      "id": "batch",
      "label": "Batch",
      "multiplier": 0.5,
      "note": "Asynchronous processing. Stacks with the cache multipliers."
    },
    {
      "id": "fast",
      "label": "Fast mode",
      "multiplier": 2,
      "appliesTo": [
        "claude-opus-5-5",
        "claude-opus-5"
      ],
      "note": "Research preview, Opus models only, on the first-party API."
    },
    {
      "id": "us",
      "label": "US data residency",
      "multiplier": 1.1,
      "note": "inference_geo set to us, on Claude 4.6 and later. Applies to every token category."
    }
  ],
  "google": [
    {
      "id": "batch",
      "label": "Batch",
      "multiplier": 0.5,
      "note": "Asynchronous processing."
    },
    {
      "id": "flex",
      "label": "Flex",
      "multiplier": 0.5,
      "appliesTo": [
        "gemini-4-argon"
      ],
      "note": "Lower-priority capacity for Gemini 4 Argon, billed at the same rates as Batch."
    },
    {
      "id": "priority",
      "label": "Priority",
      "multiplier": 1.8,
      "appliesTo": [
        "gemini-4-argon",
        "gemini-3.8-flash"
      ],
      "note": "Confirmed for Gemini 4 Argon and Gemini 3.8 Flash on the pricing page."
    }
  ],
  "deepseek": [
    {
      "id": "peak",
      "label": "Peak hours",
      "multiplier": 2,
      "note": "01:00 to 04:00 and 06:00 to 10:00 UTC, Monday to Friday. Catalogue rates are the off-peak ones."
    }
  ]
};

export const DEFAULT_MODEL = MODELS.find((model) => model.isDefault) ?? MODELS[0];
export const getModel = (id: string) => MODELS.find((model) => model.id === id) ?? DEFAULT_MODEL;
