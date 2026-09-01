import { describe, expect, it } from 'vitest';
import { measureModel } from '../packages/n8n-nodes-tokencalculator/nodes/TokenCalculator/calculator';
import { resolveBinaryPropertyNames } from '../packages/n8n-nodes-tokencalculator/nodes/TokenCalculator/extractInput';

describe('n8n multi-file input', () => {
  const binary = { uploads0: {}, uploads1: {}, avatar: {} };

  it('selects all binary properties', () => {
    expect(resolveBinaryPropertyNames(binary, '*')).toEqual(['uploads0', 'uploads1', 'avatar']);
  });

  it('selects form-upload properties by prefix', () => {
    expect(resolveBinaryPropertyNames(binary, 'uploads*')).toEqual(['uploads0', 'uploads1']);
  });

  it('selects comma-separated properties without duplicates', () => {
    expect(resolveBinaryPropertyNames(binary, 'avatar, uploads0, avatar')).toEqual(['avatar', 'uploads0']);
  });

  it('adds multiple image allocations', async () => {
    const result = await measureModel({ images: [{ width: 100, height: 100, detail: 'low' }, { width: 200, height: 200, detail: 'low' }] }, 'gpt-5.6-terra');
    expect(result.inputTokens).toBe(170);
  });
});
