import { getModel } from '../data/models';
import { calculateResult } from '../engines/pricing/calculate';
import { countText } from '../engines/tokenizers/count';
import { countImage } from '../engines/vision/count';

self.onmessage = (event: MessageEvent<{ id: number; modelId: string; text?: string; image?: { width: number; height: number; detail?: 'low' | 'high' } }>) => {
  const { id, modelId, text, image } = event.data;
  try {
    const model = getModel(modelId);
    if (image) {
      const counted = countImage(image, model);
      self.postMessage({ id, ok: true, result: calculateResult(counted.tokens, model, 'provider-formula', counted.method) });
      return;
    }
    const counted = countText(text ?? '', model);
    self.postMessage({ id, ok: true, result: calculateResult(counted.tokens, model, model.textAccuracy, counted.method) });
  } catch (error) {
    self.postMessage({ id, ok: false, error: error instanceof Error ? error.message : 'Calculation failed.' });
  }
};
