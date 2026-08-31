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

  it('reads PNG dimensions without a runtime dependency', async () => {
    const png = Buffer.alloc(24);
    Buffer.from([0x89, 0x50, 0x4e, 0x47]).copy(png);
    png.writeUInt32BE(640, 16);
    png.writeUInt32BE(480, 20);
    const result = await extractBinaryInput(png, 'image.png', 'image/png');
    expect(result.image).toEqual({ width: 640, height: 480 });
  });
});
