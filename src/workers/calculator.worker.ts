import { getModel } from '../data/models';
import { calculateResult } from '../engines/pricing/calculate';
import { countText, inspectText } from '../engines/tokenizers/count';
import { countImage } from '../engines/vision/count';

let cachedText = '';
const cachedTextCounts = new Map<string, { tokens:number; method:string }>();

self.onmessage = (event: MessageEvent<{ id: number; modelId: string; text?: string; image?: { width: number; height: number; detail?: 'low' | 'high' }; inspect?: boolean }>) => {
  const { id, modelId, text, image, inspect } = event.data;
  try {
    const model = getModel(modelId);
    if (inspect) {
      self.postMessage({ id, ok: true, pieces: inspectText(text ?? '', model) });
      return;
    }
    if (image) {
      const counted = countImage(image, model);
      self.postMessage({ id, ok: true, result: calculateResult(counted.tokens, model, 'provider-formula', counted.method) });
      return;
    }
    const nextText = text ?? '';
    if (nextText !== cachedText) { cachedText = nextText; cachedTextCounts.clear(); }
    let counted = cachedTextCounts.get(model.tokenizer);
    if (!counted) { counted = countText(nextText, model); cachedTextCounts.set(model.tokenizer, counted); }
    self.postMessage({ id, ok: true, result: calculateResult(counted.tokens, model, model.textAccuracy, counted.method) });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : 'Calculation failed.' });
  }
};
