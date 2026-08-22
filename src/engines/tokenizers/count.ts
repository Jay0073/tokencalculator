import { Tiktoken } from 'js-tiktoken/lite';
import o200kBase from 'js-tiktoken/ranks/o200k_base';
import type { ModelConfig, TokenInspectionPiece, TokenizerStrategy } from '../../domain/models';

const byteLength = (text: string) => new TextEncoder().encode(text).length;
const encodings = new Map<TokenizerStrategy, Tiktoken>();

function getTokenizer(strategy: TokenizerStrategy) {
  if (strategy !== 'o200k_base') throw new Error('This exact BPE tokenizer is not loaded by the current model catalog.');
  let encoding = encodings.get(strategy);
  if (!encoding) {
    encoding = new Tiktoken(o200kBase);
    encodings.set(strategy, encoding);
  }
  return encoding;
}

export function countText(text: string, model: ModelConfig): { tokens: number; method: string } {
  if (!text) return { tokens: 0, method: 'No input' };
  if (model.tokenizer === 'o200k_base' || model.tokenizer === 'cl100k_base') {
    const encoding = getTokenizer(model.tokenizer);
    return { tokens: encoding.encode(text).length, method: `${model.tokenizer} BPE tokenizer` };
  }

  const bytes = byteLength(text);
  const factor = model.tokenizer === 'claude-estimate' ? 3.75 : model.tokenizer === 'deepseek-estimate' ? 3.85 : 4;
  return { tokens: Math.max(1, Math.ceil(bytes / factor)), method: `Calibrated ${factor.toFixed(2)} UTF-8 bytes/token estimate` };
}

export function inspectText(text: string, model: ModelConfig): TokenInspectionPiece[] {
  if (model.tokenizer !== 'o200k_base' && model.tokenizer !== 'cl100k_base') {
    throw new Error('Token boundaries are available only for exact BPE tokenizers.');
  }
  const encoding = getTokenizer(model.tokenizer);
  const tokens = encoding.encode(text);
  const pieces: TokenInspectionPiece[] = [];
  let pending: number[] = [];
  for (const token of tokens) {
    pending.push(token);
    const decoded = encoding.decode(pending);
    if (!decoded.includes('\uFFFD')) {
      pieces.push({ text: decoded, tokenIds: [...pending] });
      pending = [];
    }
  }
  if (pending.length) pieces.push({ text: encoding.decode(pending), tokenIds: [...pending] });
  return pieces;
}
