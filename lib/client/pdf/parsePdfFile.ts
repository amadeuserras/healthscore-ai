import type { PDFDocumentProxy, PDFPageProxy } from 'pdfjs-dist';

export type ParsedPdf = {
  text: string;
  numPages: number;
};

let workerConfigured = false;

async function pageText(page: PDFPageProxy): Promise<string> {
  const textContent = await page.getTextContent();
  const parts: string[] = [];
  for (const item of textContent.items) {
    if (typeof item === 'object' && item !== null && 'str' in item) {
      const s = (item as { str: string }).str;
      if (s) parts.push(s);
    }
  }
  return parts.join(' ');
}

async function extractFullText(doc: PDFDocumentProxy): Promise<string> {
  const chunks: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    try {
      chunks.push(await pageText(page));
    } finally {
      page.cleanup();
    }
  }
  return chunks.join('\n\n');
}

/**
 * Extract plain text from a PDF in the browser using pdf.js.
 * Call only from client-side code (e.g. event handlers in client components).
 */
export async function parsePdfFile(file: File): Promise<ParsedPdf> {
  const pdfjs = await import('pdfjs-dist');
  const { getDocument, version, GlobalWorkerOptions } = pdfjs;

  if (typeof window !== 'undefined' && !workerConfigured) {
    GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${version}/build/pdf.worker.min.mjs`;
    workerConfigured = true;
  }

  const data = await file.arrayBuffer();
  const loadingTask = getDocument({ data: new Uint8Array(data) });
  const doc = await loadingTask.promise;
  try {
    const text = await extractFullText(doc);
    return { text, numPages: doc.numPages };
  } finally {
    await doc.destroy().catch(() => undefined);
  }
}
