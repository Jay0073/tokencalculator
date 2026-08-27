export interface TokenRates { inputPerMillion: number; outputPerMillion: number; cachedInputPerMillion?: number }
export interface TokenUsage { inputTokens: number; outputTokens?: number; cachedInputTokens?: number }
export interface TokenCostBreakdown { input: number; cachedInput: number; output: number; total: number }
export type ProviderId = 'openai' | 'anthropic' | 'google' | 'deepseek';
export type TokenizerStrategy = 'o200k_base' | 'claude-estimate' | 'gemini-estimate' | 'deepseek-estimate';
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
  verifiedAt: string;
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

export const MODELS: readonly ModelConfig[] = [
  { id:'gpt-5.6-sol', name:'GPT-5.6 Sol', provider:'openai', description:'Frontier reasoning', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:5, cachedInputPerMillion:.5, outputPerMillion:30, pricingTiers:[{aboveInputTokens:272_000,inputPerMillion:10,cachedInputPerMillion:1,outputPerMillion:45,label:'Long-context rate above 272K input tokens'}], vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/compare', verifiedAt:'2026-08-22' },
  { id:'gpt-5.6-terra', name:'GPT-5.6 Terra', provider:'openai', description:'Balanced production model', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:.2, outputPerMillion:12, pricingTiers:[{aboveInputTokens:272_000,inputPerMillion:4,cachedInputPerMillion:.4,outputPerMillion:18,label:'Long-context rate above 272K input tokens'}], vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/gpt-5.6-terra', verifiedAt:'2026-08-22' },
  { id:'gpt-5.6-luna', name:'GPT-5.6 Luna', provider:'openai', description:'High-volume workloads', tokenizer:'o200k_base', accuracy:'exact', contextWindow:1_050_000, maxOutput:128_000, inputPerMillion:.2, cachedInputPerMillion:.02, outputPerMillion:1.2, pricingTiers:[{aboveInputTokens:272_000,inputPerMillion:.4,cachedInputPerMillion:.04,outputPerMillion:1.8,label:'Long-context rate above 272K input tokens'}], vision:'openai-tiles', pricingUrl:'https://developers.openai.com/api/docs/models/compare', verifiedAt:'2026-08-22' },
  { id:'claude-opus-4.8', name:'Claude Opus 4.8', provider:'anthropic', description:'Complex professional work', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:5, cachedInputPerMillion:.5, outputPerMillion:25, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', verifiedAt:'2026-08-22' },
  { id:'claude-sonnet-5', name:'Claude Sonnet 5', provider:'anthropic', description:'Balanced intelligence', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:128_000, inputPerMillion:2, cachedInputPerMillion:.2, outputPerMillion:10, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', verifiedAt:'2026-08-22' },
  { id:'claude-haiku-4.5', name:'Claude Haiku 4.5', provider:'anthropic', description:'Fast, efficient Claude', tokenizer:'claude-estimate', accuracy:'estimated', contextWindow:200_000, maxOutput:64_000, inputPerMillion:1, cachedInputPerMillion:.1, outputPerMillion:5, vision:'claude-patches', pricingUrl:'https://platform.claude.com/docs/en/about-claude/pricing', verifiedAt:'2026-08-22' },
  { id:'gemini-3.1-flash-lite', name:'Gemini 3.1 Flash-Lite', provider:'google', description:'High-volume multimodal', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:.25, cachedInputPerMillion:.025, outputPerMillion:1.5, vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', verifiedAt:'2026-08-22' },
  { id:'gemini-2.5-pro', name:'Gemini 2.5 Pro', provider:'google', description:'Long-context reasoning', tokenizer:'gemini-estimate', accuracy:'estimated', contextWindow:1_048_576, maxOutput:65_536, inputPerMillion:1.25, cachedInputPerMillion:.125, outputPerMillion:10, pricingTiers:[{aboveInputTokens:200_000,inputPerMillion:2.5,cachedInputPerMillion:.25,outputPerMillion:15,label:'Long-context rate above 200K input tokens'}], vision:'gemini-tiles', pricingUrl:'https://ai.google.dev/gemini-api/docs/pricing', verifiedAt:'2026-08-22' },
  { id:'deepseek-v4-flash', name:'DeepSeek V4 Flash', provider:'deepseek', description:'Fast model', tokenizer:'deepseek-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:384_000, inputPerMillion:.44, cachedInputPerMillion:.014, outputPerMillion:1.32, pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', verifiedAt:'2026-08-23' },
  { id:'deepseek-v4-pro', name:'DeepSeek V4 Pro', provider:'deepseek', description:'Higher capability', tokenizer:'deepseek-estimate', accuracy:'estimated', contextWindow:1_000_000, maxOutput:384_000, inputPerMillion:1.32, cachedInputPerMillion:.044, outputPerMillion:3.96, pricingUrl:'https://api-docs.deepseek.com/quick_start/pricing/', verifiedAt:'2026-08-23' },
];

export const getModel = (id: string): ModelConfig => {
  const model = MODELS.find((candidate) => candidate.id === id);
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

export async function countTextTokens(text: string, modelOrId: ModelConfig | string) {
  const model = typeof modelOrId === 'string' ? getModel(modelOrId) : modelOrId;
  if (!text) return { tokens:0, accuracy:model.accuracy, method:'No text input' };
  if (model.tokenizer === 'o200k_base') {
    const encoding = await openAiEncoding();
    return { tokens:encoding.encode(text).length, accuracy:model.accuracy, method:'Exact local o200k_base BPE tokenization' };
  }
  const bytes = new TextEncoder().encode(text).length;
  const factor = model.tokenizer === 'claude-estimate' ? 3.75 : model.tokenizer === 'deepseek-estimate' ? 3.85 : 4;
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
    const cap=model.id.includes('opus-4.8')||model.id.includes('sonnet-5')?4784:1568; const edge=cap===4784?2576:1568;
    const scale=Math.min(1,edge/w,edge/h,Math.sqrt((cap*28*28)/(w*h))); const tokens=Math.ceil(w*scale/28)*Math.ceil(h*scale/28);
    return {tokens:Math.min(cap,tokens),accuracy:'provider-formula' as const,method:`Claude 28×28 patch formula · ${cap} token tier`};
  }
  if(w<=384&&h<=384) return {tokens:258,accuracy:'provider-formula' as const,method:'Gemini small-image fixed allocation'};
  const crop=Math.max(1,Math.floor(Math.min(w,h)/1.5)); const tiles=Math.ceil(w/crop)*Math.ceil(h/crop);
  return {tokens:tiles*258,accuracy:'provider-formula' as const,method:`Gemini media allocation · ${tiles} tiles`};
}

export async function measureModel(input: { text?:string; image?:{width:number;height:number;detail?:'low'|'high'}; outputTokens?:number; cachedInputTokens?:number }, modelOrId: ModelConfig | string): Promise<ModelMeasurement> {
  const model=typeof modelOrId==='string'?getModel(modelOrId):modelOrId;
  const text=await countTextTokens(input.text??'',model); const image=input.image?countImageTokens(input.image.width,input.image.height,model,input.image.detail):undefined;
  const inputTokens=text.tokens+(image?.tokens??0); const outputTokens=Math.max(0,Math.round(input.outputTokens??0)); const rates=resolveModelRates(model,inputTokens);
  return {modelId:model.id,model:model.name,provider:model.provider,inputTokens,outputTokens,accuracy:image?.accuracy??text.accuracy,method:[text.method,image?.method].filter(Boolean).join(' + '),cost:calculateTokenCost({inputTokens,outputTokens,cachedInputTokens:input.cachedInputTokens},rates),context:contextUsage(inputTokens,model.contextWindow),rates};
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
