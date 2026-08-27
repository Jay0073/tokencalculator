import { describe, expect, it } from 'vitest';
import { extractBinaryInput } from '../packages/n8n-nodes-tokencalculator/nodes/TokenCalculator/extractInput';

describe('n8n binary input extraction', () => {
  it('decodes text and code files locally', async () => {
    const result = await extractBinaryInput(Buffer.from('const answer = 42;'), 'example.ts', 'text/typescript');
    expect(result.text).toBe('const answer = 42;');
    expect(result.file).toMatchObject({ name: 'example.ts', bytes: 18, extraction: 'UTF-8 text decoded locally' });
  });

  it('rejects unsupported binary formats with a useful error', async () => {
    await expect(extractBinaryInput(Buffer.from([0, 1, 2]), 'archive.bin')).rejects.toThrow('Unsupported binary file type');
  });
});
