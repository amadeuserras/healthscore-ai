import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { parsePdfFile } from '@/lib/server/pdf-tools';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('pdf') as File;

    if (!file) {
      return NextResponse.json({ error: 'No PDF file provided' }, { status: 400 });
    }

    if (file.type !== 'application/pdf') {
      return NextResponse.json({ error: 'File must be a PDF' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    void Buffer.from(arrayBuffer);

    const { text: pdfText } = await parsePdfFile(file);

    const systemPrompt = [
      'You are a medical lab report parser. Extract biomarker values from lab reports.',
      '',
      'Extract the following biomarkers if present:',
      '  - Fasting Glucose (mg/dL)',
      '  - HbA1c (%)',
      '  - Total Cholesterol (mg/dL)',
      '  - LDL Cholesterol (mg/dL)',
      '  - HDL Cholesterol (mg/dL)',
      '  - Triglycerides (mg/dL)',
      '  - Vitamin D (ng/mL)',
      '  - TSH (mIU/L)',
      '',
      'Return a JSON object with these exact keys and structure:',
      '',
      '```json',
      '{',
      '  "fastingGlucose": number | null,',
      '  "hba1c": number | null,',
      '  "totalCholesterol": number | null,',
      '  "ldlCholesterol": number | null,',
      '  "hdlCholesterol": number | null,',
      '  "triglycerides": number | null,',
      '  "vitaminD": number | null,',
      '  "tsh": number | null',
      '}',
      '```',
      '',
      'If a biomarker is not found in the text, set its value to null.',
      'Only return the JSON object, no additional text.',
    ].join('\n');

    const userPrompt = 'Extract biomarker values from this lab report: ' + pdfText;

    try {
      const completion = await openai.chat.completions.create({
        model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: systemPrompt,
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
    console.error('PDF extraction error:', error);
    return NextResponse.json({ error: 'Failed to extract data from PDF' }, { status: 500 });
  }
}
