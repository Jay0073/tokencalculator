import { describe, expect, it } from 'vitest';
import { getModel } from '../src/data/models';
import { calculateResult } from '../src/engines/pricing/calculate';
import { countImage } from '../src/engines/vision/count';

describe('pricing and context', () => {
  it('calculates per-million input pricing', () => {
    const model = getModel('gpt-5.6-sol');
    expect(calculateResult(100_000, model, 'exact', 'test').cost).toBe(0.5);
  });

  it('marks context overflow', () => {
    const model = getModel('deepseek-v4-flash');
    expect(calculateResult(1_000_001, model, 'estimated', 'test').overContext).toBe(true);
  });
});

describe('published image formulas', () => {
  it('uses OpenAI low-detail fixed allocation', () => {
    expect(countImage({ width: 4000, height: 2000, detail: 'low' }, getModel('gpt-5.6-terra')).tokens).toBe(85);
  });

  it('uses Gemini small-image allocation', () => {
    expect(countImage({ width: 384, height: 384 }, getModel('gemini-3.1-flash-lite')).tokens).toBe(258);
  });

  it('fits Claude visual patches within the standard tier', () => {
    expect(countImage({ width: 8000, height: 8000 }, getModel('claude-haiku-4.5')).tokens).toBe(1521);
  });

  it('resizes Claude images while preserving their aspect ratio', () => {
    expect(countImage({ width: 1920, height: 1080 }, getModel('claude-haiku-4.5')).tokens).toBe(1560);
  });
});
