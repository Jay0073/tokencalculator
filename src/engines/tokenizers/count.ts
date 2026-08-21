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
