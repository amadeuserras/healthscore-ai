import { NextRequest, NextResponse } from 'next/server';
import { analyzeData } from '@/lib/server/analysis';
import { isValidBiomarkerData } from '@/lib/shared/validation/biomarkerPayload';

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  if (!isValidBiomarkerData(body)) {
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
