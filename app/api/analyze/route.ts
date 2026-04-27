import { NextRequest, NextResponse } from 'next/server';
import { analyzeData } from '@/lib/server/analysis';
import { isValidBiomarkerData } from '@/lib/shared/validation/biomarkerPayload';
import { applyAnalyzeRateLimit } from '@/lib/server/http/withRateLimit';

export async function POST(request: NextRequest) {
  const { headers: baseHeaders, blockedResponse } = applyAnalyzeRateLimit(request);
  if (blockedResponse) return blockedResponse;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400, headers: baseHeaders });
  }

  if (!isValidBiomarkerData(body)) {
    return NextResponse.json(
      { error: 'Invalid biomarker payload' },
      { status: 400, headers: baseHeaders },
    );
  }

  try {
    const result = await analyzeData(body);
    return NextResponse.json(result, { headers: baseHeaders });
  } catch (err) {
    console.error('POST /api/analyze failed:', err);
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500, headers: baseHeaders });
  }
}
