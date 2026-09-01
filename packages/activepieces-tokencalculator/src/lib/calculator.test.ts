import { describe, expect, it } from 'vitest';
import { compareModels, measureModel } from './calculator';

describe('calculator', () => {
  it('measures text and expected output cost', async () => {
    const result = await measureModel({ text: 'hello world', outputTokens: 100 }, 'gpt-5.6-terra');
    expect(result.inputTokens).toBeGreaterThan(0);
    expect(result.outputTokens).toBe(100);
    expect(result.cost.total).toBeGreaterThan(0);
  });

  it('compares selected models', async () => {
    const results = await compareModels({ text: 'hello world' }, ['gpt-5.6-terra', 'claude-sonnet-5']);
    expect(results).toHaveLength(2);
  });

  it('adds token allocations for multiple images', async () => {
    const result = await measureModel({ images: [{ width: 100, height: 100, detail: 'low' }, { width: 200, height: 200, detail: 'low' }] }, 'gpt-5.6-terra');
    expect(result.inputTokens).toBe(170);
  });

  it('rejects impossible cached token values', async () => {
    await expect(measureModel({ text: 'x', cachedInputTokens: 99 }, 'gpt-5.6-terra')).rejects.toThrow('cannot exceed');
  });
});
