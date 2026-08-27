import { imageSize } from 'image-size';

const TEXT_EXTENSIONS = new Set(['txt','md','markdown','json','csv','js','jsx','ts','tsx','py','go','rs','java','c','cpp','h','hpp','css','html','xml','yaml','yml','toml','sql','sh','log']);

export interface ExtractedInput {
	text: string;
	image?: { width: number; height: number };
	file?: { name: string; mimeType?: string; bytes: number; extraction: string };
}

export async function extractBinaryInput(buffer: Buffer, fileName = 'binary', mimeType?: string): Promise<ExtractedInput> {
	const extension = fileName.split('.').pop()?.toLowerCase() ?? '';
	const file = { name: fileName, mimeType, bytes: buffer.byteLength, extraction: '' };

	if (mimeType?.startsWith('image/') || ['png','jpg','jpeg','gif','webp'].includes(extension)) {
		const dimensions = imageSize(buffer);
		if (!dimensions.width || !dimensions.height) throw new Error(`Unable to read image dimensions from ${fileName}`);
		return { text: '', image: { width: dimensions.width, height: dimensions.height }, file: { ...file, extraction: 'Image dimensions read locally' } };
	}
	if (extension === 'docx') {
		const mammoth = await import('mammoth');
		const result = await mammoth.extractRawText({ buffer });
		if (!result.value.trim()) throw new Error(`No readable text was found in ${fileName}`);
		return { text: result.value, file: { ...file, extraction: 'DOCX text extracted locally' } };
	}
	if (extension === 'pdf') {
		const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
		const pdf = await pdfjs.getDocument({ data: new Uint8Array(buffer) }).promise;
		const pages: string[] = [];
		for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
			const page = await pdf.getPage(pageNumber);
			const content = await page.getTextContent();
			pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
		}
		const text = pages.join('\n\n').trim();
		if (!text) throw new Error(`No readable text was found in ${fileName}; scanned PDFs require OCR`);
		return { text, file: { ...file, extraction: `PDF text extracted locally from ${pdf.numPages} page(s)` } };
	}
	if (TEXT_EXTENSIONS.has(extension) || mimeType?.startsWith('text/') || mimeType === 'application/json') {
		return { text: buffer.toString('utf8'), file: { ...file, extraction: 'UTF-8 text decoded locally' } };
	}
	throw new Error(`Unsupported binary file type: ${fileName}`);
}
