const TEXT_EXTENSIONS = new Set(['txt', 'md', 'markdown', 'json', 'csv', 'js', 'jsx', 'ts', 'tsx', 'py', 'go', 'rs', 'java', 'c', 'cpp', 'h', 'hpp', 'css', 'html', 'xml', 'yaml', 'yml', 'toml', 'sql', 'sh']);
const MAX_FILE_BYTES = 12 * 1024 * 1024;

export async function extractDocument(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) throw new Error('File exceeds the 12 MB local-processing limit.');
  const extension = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (TEXT_EXTENSIONS.has(extension)) return file.text();

  if (extension === 'docx') {
    const mammoth = await import('mammoth/mammoth.browser');
    const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
    if (!result.value.trim()) throw new Error('No readable text was found in this DOCX file.');
    return result.value;
  }

  if (extension === 'pdf') {
    const pdfjs = await import('pdfjs-dist/legacy/build/pdf.mjs');
    const workerModule = await import('pdfjs-dist/legacy/build/pdf.worker.min.mjs?worker');
    pdfjs.GlobalWorkerOptions.workerPort = new workerModule.default();
    const pdf = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()), useWorkerFetch: false, useSystemFonts: true }).promise;
    const pages: string[] = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
      const page = await pdf.getPage(pageNumber);
      const content = await page.getTextContent();
      pages.push(content.items.map((item) => ('str' in item ? item.str : '')).join(' '));
    }
    const text = pages.join('\n\n').trim();
    if (!text) throw new Error('No readable text was found. Scanned PDFs need OCR, which is not supported.');
    return text;
  }

  throw new Error('Unsupported file type. Use a text file, PDF, or DOCX.');
}
