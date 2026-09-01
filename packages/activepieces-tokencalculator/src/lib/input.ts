import type { ApFile } from '@activepieces/pieces-framework';
import type { MeasurementInput } from './calculator';

const TEXT_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'json', 'csv', 'js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp', 'css', 'html', 'xml', 'yaml', 'yml', 'toml', 'sql', 'sh', 'log']);
const IMAGE_EXTENSIONS = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);
const MAX_FILE_BYTES = 10 * 1024 * 1024;

function imageSize(buffer: Buffer, extension: string): { width: number; height: number } {
  if (extension === 'png' && buffer.length >= 24 && buffer.subarray(1, 4).toString('ascii') === 'PNG') return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  if (extension === 'gif' && buffer.length >= 10 && buffer.subarray(0, 3).toString('ascii') === 'GIF') return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
  if (extension === 'webp' && buffer.length >= 30 && buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') {
    const kind = buffer.subarray(12, 16).toString('ascii');
    if (kind === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
    if (kind === 'VP8 ' && buffer.subarray(23, 26).equals(Buffer.from([0x9d, 0x01, 0x2a]))) return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L' && buffer[20] === 0x2f) {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >>> 14) & 0x3fff) + 1 };
    }
  }
  if ((extension === 'jpg' || extension === 'jpeg') && buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 8 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
      if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
      const length = buffer.readUInt16BE(offset + 2);
      if (length < 2) break;
      offset += 2 + length;
    }
  }
  throw new Error('Unsupported or invalid image data');
}

export function prepareInput(options: PrepareInputOptions): PreparedInput {
	const plainText = options.text?.trim() ?? '';
	const inputFiles = [...(options.files ?? []), ...(options.file ? [options.file] : [])];
	if (!plainText && inputFiles.length === 0) throw new Error('Provide text, one or more files, or both.');
	let text = plainText;
	const images: {width:number;height:number;detail:'low'|'high'}[] = [];
	const files: {name:string;extension:string;bytes:number;extraction:string}[] = [];
	for (const inputFile of inputFiles) {
		if (inputFile.data.byteLength > MAX_FILE_BYTES) throw new Error(`${inputFile.filename} must be 10 MB or smaller.`);
		const extension = (inputFile.extension ?? inputFile.filename.split('.').pop() ?? '').toLowerCase().replace(/^\./, '');
		const file = { name: inputFile.filename, extension, bytes: inputFile.data.byteLength };
		if (IMAGE_EXTENSIONS.has(extension)) {
			images.push({ ...imageSize(inputFile.data, extension), detail: options.imageDetail });
			files.push({ ...file, extraction: 'Image dimensions read inside the Activepieces runtime' });
			continue;
		}
		if (TEXT_EXTENSIONS.has(extension)) {
			text = [text, inputFile.data.toString('utf8')].filter(Boolean).join('\n\n');
			files.push({ ...file, extraction: 'UTF-8 text decoded inside the Activepieces runtime' });
			continue;
		}
		throw new Error(`Unsupported file type: ${inputFile.filename}`);
	}
	return { input: { text, images, outputTokens: options.outputTokens, cachedInputTokens: options.cachedInputTokens }, source: { characters: text.length, files } };
}

export interface PrepareInputOptions {
  text?: string;
  file?: ApFile;
  files?: readonly ApFile[];
  imageDetail: 'low' | 'high';
  outputTokens?: number;
  cachedInputTokens?: number;
}

export interface PreparedInput {
  input: MeasurementInput;
  source: { characters: number; files: { name: string; extension: string; bytes: number; extraction: string }[] };
}
