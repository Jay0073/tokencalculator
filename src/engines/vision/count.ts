import type { ModelConfig } from '../../domain/models';

export interface ImageInput { width: number; height: number; detail?: 'low' | 'high' }

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

export function countImage(input: ImageInput, model: ModelConfig): { tokens: number; method: string } {
  if (!model.vision) throw new Error(`${model.name} does not publish supported image-token rules.`);
  const width = Math.max(1, input.width);
  const height = Math.max(1, input.height);

  if (model.vision === 'openai-tiles') {
    if (input.detail === 'low') return { tokens: 85, method: 'OpenAI low-detail fixed image cost' };
    const fitScale = Math.min(1, 2048 / width, 2048 / height);
    let w = width * fitScale;
    let h = height * fitScale;
    const shortScale = 768 / Math.min(w, h);
    w *= shortScale;
    h *= shortScale;
    const tiles = Math.ceil(w / 512) * Math.ceil(h / 512);
    return { tokens: 85 + 170 * tiles, method: `OpenAI high-detail formula · ${tiles} tile${tiles === 1 ? '' : 's'}` };
  }

  if (model.vision === 'claude-patches') {
    const highResolution = model.id.includes('opus-4.8') || model.id.includes('sonnet-5');
    const cap = highResolution ? 4784 : 1568;
    const edge = highResolution ? 2576 : 1568;
    return { tokens: claudeImageTokens(width, height, edge, cap), method: `Claude 28×28 patch formula · ${cap.toLocaleString()} token tier` };
  }

  if (width <= 384 && height <= 384) return { tokens: 258, method: 'Gemini small-image fixed allocation' };
  const crop = Math.max(1, Math.floor(Math.min(width, height) / 1.5));
  const tiles = Math.ceil(width / crop) * Math.ceil(height / crop);
  return { tokens: tiles * 258, method: `Gemini 768px tile estimate · ${tiles} tile${tiles === 1 ? '' : 's'}` };
}
