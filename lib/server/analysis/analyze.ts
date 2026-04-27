import 'server-only';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';
import { computeBiomarkersAndScore } from '@/lib/shared/biomarkers/scoring';
import { getOpenAIClient } from '@/lib/server/openai/client';
import { fetchOpenAIInsights } from './openaiInsights';
import { buildRuleBasedInsights } from './ruleBasedInsights';

/**
 * Scores biomarkers locally, then requests AI insights when OPENAI_API_KEY is set; otherwise uses rule-based insights.
 */
export async function analyzeData(data: BiomarkerData): Promise<AnalysisResult> {
  const { biomarkers, healthScore } = computeBiomarkersAndScore(data);

  let insights: AnalysisResult['insights'] | null = null;
  const openai = getOpenAIClient();
  if (openai) {
    try {
      insights = await fetchOpenAIInsights(openai, data, healthScore, biomarkers);
    } catch (err) {
      console.error('OpenAI analysis failed, using rule-based insights:', err);
    }
  }
  if (!insights) {
    insights = buildRuleBasedInsights(data);
  }

  return { healthScore, biomarkers, insights };
}
