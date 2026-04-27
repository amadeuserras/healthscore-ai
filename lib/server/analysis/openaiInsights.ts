import 'server-only';
import type OpenAI from 'openai';
import { BiomarkerData, BiomarkerResult, AnalysisResult } from '@/types/biomarkers';
import { getOpenAIModel } from '@/lib/server/env';
import { buildAnalysisPrompt } from '@/lib/shared/prompts/buildAnalysisPrompt';
import { parseStructuredInsights } from '@/lib/shared/validation/analysisInsights';

export async function fetchOpenAIInsights(
  openai: OpenAI,
  data: BiomarkerData,
  healthScore: number,
  biomarkers: BiomarkerResult[],
): Promise<AnalysisResult['insights'] | null> {
  const userContent = buildAnalysisPrompt(data, healthScore, biomarkers);

  const completion = await openai.chat.completions.create({
    model: getOpenAIModel(),
    messages: [
      {
        role: 'system',
        content:
          'You are a health literacy assistant. Output valid JSON only. Be supportive and educational. ' +
          'You do not diagnose or prescribe; encourage professional care when appropriate.',
      },
      { role: 'user', content: userContent },
    ],
    temperature: 0.5,
    max_tokens: 1200,
    response_format: { type: 'json_object' },
  });

  return parseStructuredInsights(completion.choices[0]?.message?.content);
}
