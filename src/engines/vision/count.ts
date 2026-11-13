import type { ModelConfig } from '../../domain/models';

export interface ImageInput { width: number; height: number; detail?: 'low' | 'high' }
export interface ImageCount {
  tokens: number;
  method: string;
  /** 'estimated' when the provider documents no rule for this exact model. */
  accuracy: 'provider-formula' | 'estimated';
}

/**
 * OpenAI's patch model: the image is cut into 32x32 patches, the patch count is
 * capped, and the capped count is multiplied by a per-model factor.
 * developers.openai.com/api/docs/guides/images-vision
 */
const OPENAI_PATCH = { size: 32, budget: 2_500, multiplier: 1.2 } as const;

/**
 * OpenAI publishes a patch budget and a multiplier for these models only. GPT-6 Sol,
 * GPT-6.1 Sol and GPT-6 Luna accept images but are absent from that table, so they are
 * counted with the same rule and reported as an estimate instead of a provider formula.
 */
const OPENAI_PUBLISHED_PATCH_SPEC = new Set(['gpt-6-astra', 'gpt-5.6-sol', 'gpt-5.6-terra', 'gpt-5.6-luna']);

/**
 * Gemini 3 and 4 spend a fixed token budget per image, whatever its size. The default is the
 * same allocation as media_resolution high.
 * ai.google.dev/gemini-api/docs/media-resolution
 */
const GEMINI_IMAGE_BUDGET = { low: 280, medium: 560, high: 1_120, ultra: 2_240 } as const;

/** Patches, and the tokens they bill, for one image on an OpenAI patch model. */
function openaiPatchTokens(width: number, height: number): { tokens: number; patches: number } {
  const { size, budget, multiplier } = OPENAI_PATCH;
  const raw = Math.ceil(width / size) * Math.ceil(height / size);
  if (raw <= budget) return { tokens: Math.ceil(raw * multiplier), patches: raw };
  // Over budget: shrink to the budget, then snap the width down to a whole number of
  // patches. This is the resize OpenAI documents, and it reproduces their worked example.
  const shrink = Math.sqrt((budget * size * size) / (width * height));
  const scaledWidth = width * shrink;
  const snap = Math.floor(scaledWidth / size) / (scaledWidth / size);
  const patches = Math.min(
    budget,
    Math.ceil((scaledWidth * snap) / size) * Math.ceil((height * shrink * snap) / size),
  );
  return { tokens: Math.ceil(patches * multiplier), patches };
}

/**
 * Largest version of the image that fits both Anthropic limits, counted in 28x28 patches.
 * The search is over the long edge, because Anthropic resizes proportionally.
 */
function claudeImageTokens(width: number, height: number, maxEdge: number, maxTokens: number): number {
  const tokens = (w: number, h: number) => Math.ceil(w / 28) * Math.ceil(h / 28);
  const fits = (w: number, h: number) =>
    Math.ceil(w / 28) * 28 <= maxEdge && Math.ceil(h / 28) * 28 <= maxEdge && tokens(w, h) <= maxTokens;

  if (fits(width, height)) return tokens(width, height);
  let low = 1;
  let high = Math.max(width, height);
  while (low + 1 < high) {
    const middle = Math.floor((low + high) / 2);
    const scale = middle / Math.max(width, height);
    const resizedWidth = Math.max(1, Math.round(width * scale));
    const resizedHeight = Math.max(1, Math.round(height * scale));
    if (fits(resizedWidth, resizedHeight)) low = middle;
    else high = middle;
  }
  const scale = low / Math.max(width, height);
  return tokens(Math.max(1, Math.round(width * scale)), Math.max(1, Math.round(height * scale)));
}

export function countImage(input: ImageInput, model: ModelConfig): ImageCount {
  if (!model.vision) throw new Error(`${model.name} does not publish supported image-token rules.`);
  const width = Math.max(1, input.width);
  const height = Math.max(1, input.height);

  if (model.vision === 'openai-patches') {
    const { tokens, patches } = openaiPatchTokens(width, height);
    const published = OPENAI_PUBLISHED_PATCH_SPEC.has(model.id);
    return {
      tokens,
      accuracy: published ? 'provider-formula' : 'estimated',
      method: published
        ? `OpenAI 32×32 patch formula · ${patches.toLocaleString()} patches × ${OPENAI_PATCH.multiplier}`
        : `OpenAI 32×32 patch formula · ${patches.toLocaleString()} patches × ${OPENAI_PATCH.multiplier} · budget not published for this model, GPT-6 Astra's applied`,
    };
  }

  // Legacy OpenAI tile model, still documented for the GPT-4o and GPT-5 families.
  if (model.vision === 'openai-tiles') {
    if (input.detail === 'low') return { tokens: 85, accuracy: 'provider-formula', method: 'OpenAI low-detail fixed image cost' };
    const fitScale = Math.min(1, 2048 / width, 2048 / height);
    let w = width * fitScale;
    let h = height * fitScale;
    const shortScale = 768 / Math.min(w, h);
    w *= shortScale;
    h *= shortScale;
    const tiles = Math.ceil(w / 512) * Math.ceil(h / 512);
    return { tokens: 85 + 170 * tiles, accuracy: 'provider-formula', method: `OpenAI high-detail formula · ${tiles} tile${tiles === 1 ? '' : 's'}` };
  }

  if (model.vision === 'claude-patches') {
    // Claude 4.7 and later carry the larger image budget, the same boundary as the newer
    // tokenizer, so the tokenizer family selects the tier.
    // platform.claude.com/docs/en/build-with-claude/vision
    const highTier = model.tokenizer === 'claude-47-estimate';
    const cap = highTier ? 4_784 : 1_568;
    const edge = highTier ? 2_576 : 1_568;
    return {
      tokens: claudeImageTokens(width, height, edge, cap),
      accuracy: 'provider-formula',
      method: `Claude 28×28 patch formula · ${cap.toLocaleString()} token tier`,
    };
  }

  if (model.vision === 'gemini-budget') {
    const level = input.detail === 'low' ? 'low' : 'high';
    const tokens = GEMINI_IMAGE_BUDGET[level];
    const generation = model.id.startsWith('gemini-4') ? 'Gemini 4' : 'Gemini 3';
    return {
      tokens,
      accuracy: 'provider-formula',
      method: `${generation} media_resolution ${level} · ${tokens.toLocaleString()} tokens per image`,
    };
  }

  // Gemini 2.x: a small image is one fixed allocation, anything larger is tiled at 768px.
  // Oversized images are scaled to fit 3072x3072 first.
  // ai.google.dev/gemini-api/docs/image-understanding
  if (width <= 384 && height <= 384) return { tokens: 258, accuracy: 'provider-formula', method: 'Gemini small-image fixed allocation' };
  const fit = Math.min(1, 3_072 / width, 3_072 / height);
  const tiles = Math.ceil((width * fit) / 768) * Math.ceil((height * fit) / 768);
  return { tokens: tiles * 258, accuracy: 'provider-formula', method: `Gemini 768px tiles · ${tiles} tile${tiles === 1 ? '' : 's'}` };
}
