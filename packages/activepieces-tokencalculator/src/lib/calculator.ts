export interface ModelConfig {
  id: string;
  name: string;
  provider:
    | 'openai' | 'anthropic' | 'google' | 'deepseek'
    | 'alibaba' | 'moonshotai' | 'xai' | 'zai' | 'meta';
  contextWindow: number;
  inputPerMillion: number;
  cachedInputPerMillion?: number;
  outputPerMillion: number;
  bytesPerToken: number;
  vision?: 'openai' | 'claude' | 'gemini';
}

// <generated-models>
// GENERATED FILE - DO NOT EDIT BY HAND.
// Produced by scripts/sync-models.mjs from https://models.dev/api.json.
// Every rate below comes from that feed. To change which models appear,
// edit scripts/model-policy.json and re-run: npm run sync:models
export const MODELS: readonly ModelConfig[] = [
  { id: 'gpt-6-astra', name: 'GPT-6 Astra', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 10, cachedInputPerMillion: 1, outputPerMillion: 50, bytesPerToken: 4, vision: 'openai' },
  { id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 0.2, cachedInputPerMillion: 0.02, outputPerMillion: 1.2, bytesPerToken: 4, vision: 'openai' },
  { id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 4, cachedInputPerMillion: 0.4, outputPerMillion: 20, bytesPerToken: 4, vision: 'openai' },
  { id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 2, cachedInputPerMillion: 0.2, outputPerMillion: 12, bytesPerToken: 4, vision: 'openai' },
  { id: 'claude-fable-5-1', name: 'Claude Fable 5.1', provider: 'anthropic', contextWindow: 1_000_000, inputPerMillion: 10, cachedInputPerMillion: 0.25, outputPerMillion: 50, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'claude-opus-5', name: 'Claude Opus 5', provider: 'anthropic', contextWindow: 1_000_000, inputPerMillion: 5, cachedInputPerMillion: 0.5, outputPerMillion: 25, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'anthropic', contextWindow: 1_000_000, inputPerMillion: 2, cachedInputPerMillion: 0.2, outputPerMillion: 10, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'claude-opus-4-8', name: 'Claude Opus 4.8', provider: 'anthropic', contextWindow: 1_000_000, inputPerMillion: 5, cachedInputPerMillion: 0.5, outputPerMillion: 25, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'claude-haiku-4-5', name: 'Claude Haiku 4.5', provider: 'anthropic', contextWindow: 200_000, inputPerMillion: 1, cachedInputPerMillion: 0.1, outputPerMillion: 5, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 0.75, cachedInputPerMillion: 0.075, outputPerMillion: 3.75, bytesPerToken: 4, vision: 'gemini' },
  { id: 'gemini-3.7-flash', name: 'Gemini 3.7 Flash', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 0.75, cachedInputPerMillion: 0.075, outputPerMillion: 3.75, bytesPerToken: 4, vision: 'gemini' },
  { id: 'gemini-3.5-flash-lite', name: 'Gemini 3.5 Flash Lite', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 0.3, cachedInputPerMillion: 0.03, outputPerMillion: 2.5, bytesPerToken: 4, vision: 'gemini' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash Lite', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 0.25, cachedInputPerMillion: 0.025, outputPerMillion: 1.5, bytesPerToken: 4, vision: 'gemini' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 1.25, cachedInputPerMillion: 0.125, outputPerMillion: 10, bytesPerToken: 4, vision: 'gemini' },
  { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'deepseek', contextWindow: 1_000_000, inputPerMillion: 0.435, cachedInputPerMillion: 0.003625, outputPerMillion: 0.87, bytesPerToken: 3.85 },
  { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'deepseek', contextWindow: 1_000_000, inputPerMillion: 0.14, cachedInputPerMillion: 0.0028, outputPerMillion: 0.28, bytesPerToken: 3.85 },
  { id: 'qwen3.8-flash', name: 'Qwen3.8 Flash', provider: 'alibaba', contextWindow: 1_000_000, inputPerMillion: 0.15, cachedInputPerMillion: 0.016, outputPerMillion: 0.47, bytesPerToken: 3.7 },
  { id: 'qwen3.8-max', name: 'Qwen3.8 Max', provider: 'alibaba', contextWindow: 1_000_000, inputPerMillion: 2, cachedInputPerMillion: 0.25, outputPerMillion: 6, bytesPerToken: 3.7 },
  { id: 'qwen3.7-plus', name: 'Qwen3.7 Plus', provider: 'alibaba', contextWindow: 1_000_000, inputPerMillion: 0.5, cachedInputPerMillion: 0.05, outputPerMillion: 3, bytesPerToken: 3.7 },
  { id: 'qwen3.7-max', name: 'Qwen3.7 Max', provider: 'alibaba', contextWindow: 1_000_000, inputPerMillion: 2.5, cachedInputPerMillion: 0.5, outputPerMillion: 7.5, bytesPerToken: 3.7 },
  { id: 'qwen3.6-flash', name: 'Qwen3.6 Flash', provider: 'alibaba', contextWindow: 1_000_000, inputPerMillion: 0.1875, outputPerMillion: 1.125, bytesPerToken: 3.7 },
  { id: 'kimi-k3', name: 'Kimi K3', provider: 'moonshotai', contextWindow: 1_048_576, inputPerMillion: 3, cachedInputPerMillion: 0.3, outputPerMillion: 15, bytesPerToken: 3.7 },
  { id: 'kimi-k2.7-code', name: 'Kimi K2.7 Code', provider: 'moonshotai', contextWindow: 262_144, inputPerMillion: 0.95, cachedInputPerMillion: 0.19, outputPerMillion: 4, bytesPerToken: 3.7 },
  { id: 'kimi-k2.6', name: 'Kimi K2.6', provider: 'moonshotai', contextWindow: 262_144, inputPerMillion: 0.95, cachedInputPerMillion: 0.16, outputPerMillion: 4, bytesPerToken: 3.7 },
  { id: 'grok-4.6', name: 'Grok 4.6', provider: 'xai', contextWindow: 500_000, inputPerMillion: 2, cachedInputPerMillion: 0.5, outputPerMillion: 6, bytesPerToken: 4 },
  { id: 'grok-4.5', name: 'Grok 4.5', provider: 'xai', contextWindow: 500_000, inputPerMillion: 2, cachedInputPerMillion: 0.3, outputPerMillion: 6, bytesPerToken: 4 },
  { id: 'grok-4.3', name: 'Grok 4.3', provider: 'xai', contextWindow: 1_000_000, inputPerMillion: 1.25, cachedInputPerMillion: 0.2, outputPerMillion: 2.5, bytesPerToken: 4 },
  { id: 'glm-5.3-flash', name: 'GLM-5.3-Flash', provider: 'zai', contextWindow: 1_000_000, inputPerMillion: 0.075, cachedInputPerMillion: 0.015, outputPerMillion: 0.25, bytesPerToken: 3.7 },
  { id: 'glm-5.3', name: 'GLM-5.3', provider: 'zai', contextWindow: 1_000_000, inputPerMillion: 1.4, cachedInputPerMillion: 0.26, outputPerMillion: 4.4, bytesPerToken: 3.7 },
  { id: 'glm-5.2', name: 'GLM-5.2', provider: 'zai', contextWindow: 1_000_000, inputPerMillion: 1.4, cachedInputPerMillion: 0.26, outputPerMillion: 4.4, bytesPerToken: 3.7 },
  { id: 'glm-5.1', name: 'GLM-5.1', provider: 'zai', contextWindow: 200_000, inputPerMillion: 1.4, cachedInputPerMillion: 0.26, outputPerMillion: 4.4, bytesPerToken: 3.7 },
  { id: 'glm-5-turbo', name: 'GLM-5-Turbo', provider: 'zai', contextWindow: 200_000, inputPerMillion: 1.2, cachedInputPerMillion: 0.24, outputPerMillion: 4, bytesPerToken: 3.7 },
  { id: 'muse-spark-1.3', name: 'Muse Spark 1.3', provider: 'meta', contextWindow: 1_048_576, inputPerMillion: 1.25, cachedInputPerMillion: 0.15, outputPerMillion: 4.25, bytesPerToken: 4 },
  { id: 'muse-spark-1.2', name: 'Muse Spark 1.2', provider: 'meta', contextWindow: 1_048_576, inputPerMillion: 1.25, cachedInputPerMillion: 0.15, outputPerMillion: 4.25, bytesPerToken: 4 },
  { id: 'muse-spark-1.1', name: 'Muse Spark 1.1', provider: 'meta', contextWindow: 1_048_576, inputPerMillion: 1.25, cachedInputPerMillion: 0.15, outputPerMillion: 4.25, bytesPerToken: 4 },
];
// </generated-models>

function getModel(id: string) {
  const model = MODELS.find((candidate) => candidate.id === id);
  if (!model) throw new RangeError(`Unknown model: ${id}`);
  return model;
}

function imageTokens(width: number, height: number, model: ModelConfig, detail: 'low' | 'high') {
  const normalizedWidth = Math.max(1, width);
  const normalizedHeight = Math.max(1, height);
  if (!model.vision) throw new Error(`${model.name} does not support image-token estimates`);
  if (model.vision === 'openai') {
    if (detail === 'low') return { tokens: 85, method: 'OpenAI low-detail fixed image cost' };
    const fit = Math.min(1, 2048 / normalizedWidth, 2048 / normalizedHeight);
    let resizedWidth = normalizedWidth * fit;
    let resizedHeight = normalizedHeight * fit;
    const scale = 768 / Math.min(resizedWidth, resizedHeight);
    resizedWidth *= scale;
    resizedHeight *= scale;
    const tiles = Math.ceil(resizedWidth / 512) * Math.ceil(resizedHeight / 512);
    return { tokens: 85 + 170 * tiles, method: `OpenAI high-detail formula - ${tiles} tiles` };
  }
  if (model.vision === 'claude') {
    const cap = model.id.includes('haiku') ? 1568 : 4784;
    const edge = cap === 4784 ? 2576 : 1568;
    const scale = Math.min(1, edge / normalizedWidth, edge / normalizedHeight, Math.sqrt((cap * 28 * 28) / (normalizedWidth * normalizedHeight)));
    return { tokens: Math.min(cap, Math.ceil(normalizedWidth * scale / 28) * Math.ceil(normalizedHeight * scale / 28)), method: `Claude 28x28 patch formula - ${cap} token tier` };
  }
  if (normalizedWidth <= 384 && normalizedHeight <= 384) return { tokens: 258, method: 'Gemini small-image fixed allocation' };
  const crop = Math.max(1, Math.floor(Math.min(normalizedWidth, normalizedHeight) / 1.5));
  const tiles = Math.ceil(normalizedWidth / crop) * Math.ceil(normalizedHeight / crop);
  return { tokens: tiles * 258, method: `Gemini media allocation - ${tiles} tiles` };
}

export async function measureModel(input: MeasurementInput, modelId: string) {
  const model = getModel(modelId);
  const text = input.text ?? '';
  const textTokens = text ? Math.max(1, Math.ceil(new TextEncoder().encode(text).length / model.bytesPerToken)) : 0;
  const images = [...(input.images ?? []), ...(input.image ? [input.image] : [])];
  const imageMeasurements = images.map((image) => imageTokens(image.width, image.height, model, image.detail ?? 'high'));
  const inputTokens = textTokens + imageMeasurements.reduce((total, image) => total + image.tokens, 0);
  const outputTokens = Math.max(0, Math.round(input.outputTokens ?? 0));
  const cachedInputTokens = Math.max(0, Math.round(input.cachedInputTokens ?? 0));
  if (cachedInputTokens > inputTokens) throw new RangeError('Cached input tokens cannot exceed input tokens');
  const inputCost = (inputTokens - cachedInputTokens) / 1_000_000 * model.inputPerMillion;
  const cachedInputCost = cachedInputTokens / 1_000_000 * (model.cachedInputPerMillion ?? model.inputPerMillion);
  const outputCost = outputTokens / 1_000_000 * model.outputPerMillion;
  return {
    modelId: model.id,
    model: model.name,
    provider: model.provider,
    inputTokens,
    outputTokens,
    accuracy: imageMeasurements.length ? 'provider-formula' : 'estimated',
    method: [text ? 'Provider-calibrated UTF-8 projection' : 'No text input', ...imageMeasurements.map((image) => image.method)].filter(Boolean).join(' + '),
    cost: { input: inputCost, cachedInput: cachedInputCost, output: outputCost, total: inputCost + cachedInputCost + outputCost },
    context: { ratio: inputTokens / model.contextWindow, remaining: Math.max(0, model.contextWindow - inputTokens), overContext: inputTokens > model.contextWindow },
    rates: { inputPerMillion: model.inputPerMillion, cachedInputPerMillion: model.cachedInputPerMillion, outputPerMillion: model.outputPerMillion, label: 'Standard rate' },
  };
}

export async function compareModels(input: MeasurementInput, modelIds: readonly string[]) {
  return Promise.all(modelIds.map((id) => measureModel(input, id)));
}

export interface MeasurementInput {
  text?: string;
  image?: { width: number; height: number; detail?: 'low' | 'high' };
  images?: readonly { width: number; height: number; detail?: 'low' | 'high' }[];
  outputTokens?: number;
  cachedInputTokens?: number;
}
