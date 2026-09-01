export interface ModelConfig {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google' | 'deepseek';
  contextWindow: number;
  inputPerMillion: number;
  cachedInputPerMillion?: number;
  outputPerMillion: number;
  bytesPerToken: number;
  vision?: 'openai' | 'claude' | 'gemini';
}

export const MODELS: readonly ModelConfig[] = [
  { id: 'gpt-5.6-sol', name: 'GPT-5.6 Sol', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 5, cachedInputPerMillion: 0.5, outputPerMillion: 30, bytesPerToken: 4, vision: 'openai' },
  { id: 'gpt-5.6-terra', name: 'GPT-5.6 Terra', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 2, cachedInputPerMillion: 0.2, outputPerMillion: 12, bytesPerToken: 4, vision: 'openai' },
  { id: 'gpt-5.6-luna', name: 'GPT-5.6 Luna', provider: 'openai', contextWindow: 1_050_000, inputPerMillion: 0.2, cachedInputPerMillion: 0.02, outputPerMillion: 1.2, bytesPerToken: 4, vision: 'openai' },
  { id: 'claude-opus-4.8', name: 'Claude Opus 4.8', provider: 'anthropic', contextWindow: 1_000_000, inputPerMillion: 5, cachedInputPerMillion: 0.5, outputPerMillion: 25, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'claude-sonnet-5', name: 'Claude Sonnet 5', provider: 'anthropic', contextWindow: 1_000_000, inputPerMillion: 2, cachedInputPerMillion: 0.2, outputPerMillion: 10, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'claude-haiku-4.5', name: 'Claude Haiku 4.5', provider: 'anthropic', contextWindow: 200_000, inputPerMillion: 1, cachedInputPerMillion: 0.1, outputPerMillion: 5, bytesPerToken: 3.75, vision: 'claude' },
  { id: 'gemini-3.1-flash-lite', name: 'Gemini 3.1 Flash-Lite', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 0.25, cachedInputPerMillion: 0.025, outputPerMillion: 1.5, bytesPerToken: 4, vision: 'gemini' },
  { id: 'gemini-2.5-pro', name: 'Gemini 2.5 Pro', provider: 'google', contextWindow: 1_048_576, inputPerMillion: 1.25, cachedInputPerMillion: 0.125, outputPerMillion: 10, bytesPerToken: 4, vision: 'gemini' },
  { id: 'deepseek-v4-flash', name: 'DeepSeek V4 Flash', provider: 'deepseek', contextWindow: 1_000_000, inputPerMillion: 0.44, cachedInputPerMillion: 0.014, outputPerMillion: 1.32, bytesPerToken: 3.85 },
  { id: 'deepseek-v4-pro', name: 'DeepSeek V4 Pro', provider: 'deepseek', contextWindow: 1_000_000, inputPerMillion: 1.32, cachedInputPerMillion: 0.044, outputPerMillion: 3.96, bytesPerToken: 3.85 },
];

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
