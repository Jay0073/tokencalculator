import { describe, expect, it } from 'vitest';
import { ApFile } from '@activepieces/pieces-framework';
import { prepareInput } from './input';

describe('prepareInput', () => {
  it('accepts mapped text', () => {
    const result = prepareInput({ text: 'hello world', imageDetail: 'high' });
    expect(result.input.text).toBe('hello world');
    expect(result.source.characters).toBe(11);
  });

  it('decodes an uploaded UTF-8 file', () => {
    const file = new ApFile('prompt.md', Buffer.from('file text'), 'md');
    const result = prepareInput({ text: 'prefix', file, imageDetail: 'high' });
    expect(result.input.text).toBe('prefix\n\nfile text');
    expect(result.source.files[0]?.extension).toBe('md');
  });

  it('combines multiple uploaded files', () => {
    const files = [
      new ApFile('first.txt', Buffer.from('first'), 'txt'),
      new ApFile('second.md', Buffer.from('second'), 'md'),
    ];
    const result = prepareInput({ files, imageDetail: 'high' });
    expect(result.input.text).toBe('first\n\nsecond');
    expect(result.source.files).toHaveLength(2);
  });

  it('reads PNG dimensions', () => {
    const data = Buffer.alloc(24);
    data.write('PNG', 1, 'ascii');
    data.writeUInt32BE(640, 16);
    data.writeUInt32BE(480, 20);
    const result = prepareInput({ file: new ApFile('image.png', data, 'png'), imageDetail: 'low' });
    expect(result.input.images).toEqual([{ width: 640, height: 480, detail: 'low' }]);
  });

  it('rejects empty and unsupported input', () => {
    expect(() => prepareInput({ imageDetail: 'high' })).toThrow('Provide text');
    expect(() => prepareInput({ file: new ApFile('document.pdf', Buffer.from('pdf'), 'pdf'), imageDetail: 'high' })).toThrow('Unsupported file type');
  });
});
