import { NextRequest, NextResponse } from 'next/server';
import { analyzeData } from '@/lib/analysis';
import { BiomarkerData } from '@/types/biomarkers';

function isNumberOrNull(x: unknown): x is number | null {
  return x === null || (typeof x === 'number' && !Number.isNaN(x));
}

function isValidPayload(body: unknown): body is BiomarkerData {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  const keys = [
    'fastingGlucose',
    'hba1c',
    'totalCholesterol',
    'ldlCholesterol',
    'hdlCholesterol',
    'triglycerides',
    'vitaminD',
    'tsh',
  ] as const;
  for (const k of keys) {
    if (!isNumberOrNull(b[k])) return false;
  }
  return true;
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return NextResponse.json({ error: 'Invalid biomarker payload' }, { status: 400 });
  }

  try {
    const result = await analyzeData(body);
    return NextResponse.json(result);
  } catch (err) {
    console.error('POST /api/analyze failed:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 });
  }
}
