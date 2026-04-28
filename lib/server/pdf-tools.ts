'use server';

import 'server-only';
import { createRequire } from 'module';
import { PDFParse } from 'pdf-parse';

export type ParsedPdf = {
  text: string;
  numpages: number;
  info?: unknown;
  metadata?: unknown;
  version?: string;
};

let workerInitialized = false;
function ensurePdfWorker() {
  if (workerInitialized) return;
  workerInitialized = true;

  // Turbopack dev can fail to emit pdf.worker.* into .next/server/chunks.
  // Point pdfjs-dist at the worker file inside node_modules instead.
  const require = createRequire(import.meta.url);
  const workerSrc = require.resolve('pdfjs-dist/legacy/build/pdf.worker.mjs');
  PDFParse.setWorker(workerSrc);
}

export async function parsePdfFile(file: File): Promise<ParsedPdf> {
  ensurePdfWorker();

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const parser = new PDFParse({ data: buffer });
  try {
    const textResult = await parser.getText();
    const info = await parser.getInfo().catch(() => undefined);

    return {
      text: textResult.text ?? '',
      numpages: textResult.total ?? 0,
      info,
    };
  } finally {
    await parser.destroy().catch(() => undefined);
  }
}

// Server Action version (use with <form action={parsePdfAction} />)
export async function parsePdfAction(formData: FormData) {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('Missing "file" in form data');
  }

  const data = await parsePdfFile(file);

  console.log('Text content:', data.text);
  console.log('Number of pages:', data.numpages);

  return data.text;
}
