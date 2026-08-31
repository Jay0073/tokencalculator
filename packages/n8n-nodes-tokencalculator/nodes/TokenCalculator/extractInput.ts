const TEXT_EXTENSIONS = new Set(['txt','md','markdown','json','csv','js','jsx','ts','tsx','py','go','rs','java','c','cpp','h','hpp','css','html','xml','yaml','yml','toml','sql','sh','log']);

function imageSize(buffer: Buffer, extension: string): { width: number; height: number } {
	if (extension === 'png' && buffer.length >= 24 && buffer.subarray(1, 4).toString('ascii') === 'PNG') {
		return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
	}
	if (extension === 'gif' && buffer.length >= 10 && buffer.subarray(0, 3).toString('ascii') === 'GIF') {
		return { width: buffer.readUInt16LE(6), height: buffer.readUInt16LE(8) };
	}
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
			if ([0xc0,0xc1,0xc2,0xc3,0xc5,0xc6,0xc7,0xc9,0xca,0xcb,0xcd,0xce,0xcf].includes(marker)) return { height: buffer.readUInt16BE(offset + 5), width: buffer.readUInt16BE(offset + 7) };
			if (marker === 0xd8 || marker === 0xd9) { offset += 2; continue; }
			const length = buffer.readUInt16BE(offset + 2);
			if (length < 2) break;
			offset += 2 + length;
		}
	}
	throw new Error('Unsupported or invalid image data');
}

export interface ExtractedInput {
	text: string;
	image?: { width: number; height: number };
	file?: { name: string; mimeType?: string; bytes: number; extraction: string };
}

export async function extractBinaryInput(buffer: Buffer, fileName = 'binary', mimeType?: string): Promise<ExtractedInput> {
	const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
	const file = { name: fileName, mimeType, bytes: buffer.byteLength, extraction: '' };

	if (mimeType?.startsWith('image/') || ['png','jpg','jpeg','gif','webp'].includes(extension)) {
		const dimensions = imageSize(buffer, extension);
		if (!dimensions.width || !dimensions.height) throw new Error(`Unable to read image dimensions from ${fileName}`);
		return { text: '', image: { width: dimensions.width, height: dimensions.height }, file: { ...file, extraction: 'Image dimensions read locally' } };
	}
	if (TEXT_EXTENSIONS.has(extension) || mimeType?.startsWith('text/') || mimeType === 'application/json') {
		return { text: buffer.toString('utf8'), file: { ...file, extraction: 'UTF-8 text decoded locally' } };
	}
	throw new Error(`Unsupported binary file type: ${fileName}`);
}
