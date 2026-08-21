import { getEncoding } from 'js-tiktoken';
import type { ModelConfig } from '../../domain/models';

const byteLength = (text: string) => new TextEncoder().encode(text).length;

export function countText(text: string, model: ModelConfig): { tokens: number; method: string } {
  if (!text) return { tokens: 0, method: 'No input' };
  if (model.tokenizer === 'o200k_base' || model.tokenizer === 'cl100k_base') {
    const encoding = getEncoding(model.tokenizer);
    return { tokens: encoding.encode(text).length, method: `${model.tokenizer} BPE tokenizer` };
  }

  const bytes = byteLength(text);
  const factor = model.tokenizer === 'claude-estimate' ? 3.75 : model.tokenizer === 'deepseek-estimate' ? 3.85 : 4;
  return { tokens: Math.max(1, Math.ceil(bytes / factor)), method: `Calibrated ${factor.toFixed(2)} UTF-8 bytes/token estimate` };
}

export function inspectText(text: string, model: ModelConfig): string[] {
  if (model.tokenizer !== 'o200k_base' && model.tokenizer !== 'cl100k_base') {
    throw new Error('Token boundaries are available only for exact BPE tokenizers.');
  }
  const encoding = getEncoding(model.tokenizer);
  const tokens = encoding.encode(text);
  const pieces: string[] = [];
  let pending: number[] = [];
  for (const token of tokens) {
    pending.push(token);
    const decoded = encoding.decode(pending);
    if (!decoded.includes('\uFFFD')) {
      pieces.push(decoded);
      pending = [];
    }
  }
  if (pending.length) pieces.push(encoding.decode(pending));
  return pieces;
}
