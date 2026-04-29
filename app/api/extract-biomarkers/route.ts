import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import {
  buildExtractBiomarkersUserPrompt,
  EXTRACT_BIOMARKERS_SYSTEM_PROMPT,
} from '@/lib/server/prompts/extractBiomarkersFromLabText';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** Upper bound on pasted / extracted text length (characters) to protect the API. */
const MAX_LAB_TEXT_LENGTH = 400_000;

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    if (
      typeof body !== 'object' ||
      body === null ||
      !('text' in body) ||
      typeof (body as { text: unknown }).text !== 'string'
    ) {
      return NextResponse.json(
        { error: 'Expected JSON body with a string "text" field' },
        { status: 400 },
      );
    }

    const labReportText = (body as { text: string }).text.trim();
    if (!labReportText) {
      return NextResponse.json({ error: 'Lab report text is empty' }, { status: 400 });
    }
    if (labReportText.length > MAX_LAB_TEXT_LENGTH) {
      return NextResponse.json({ error: 'Lab report text is too long' }, { status: 400 });
    }

    const userPrompt = buildExtractBiomarkersUserPrompt(labReportText);

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: EXTRACT_BIOMARKERS_SYSTEM_PROMPT,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.1,
      });

      const extractedData = JSON.parse(completion.choices[0].message.content || '{}');

      return NextResponse.json(extractedData);
    } catch (error) {
      console.log('JSON parsing error:', error);
      return NextResponse.json({ error: 'Failed to parse JSON' }, { status: 500 });
    }
  } catch (error) {
    console.error('Biomarker extraction error:', error);
    return NextResponse.json(
      { error: 'Failed to extract biomarkers from lab report' },
      { status: 500 },
    );
  }
}
