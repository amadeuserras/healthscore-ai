import OpenAI from 'openai';
import {
  BiomarkerData,
  AnalysisResult,
  BiomarkerResult,
  BiomarkerStatus,
} from '@/types/biomarkers';
import { getOpenAIClient } from '@/lib/openai';
import { buildAnalysisPrompt } from '@/lib/prompts';

const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

function getBiomarkerStatus(
  value: number,
  optimalMin: number,
  optimalMax: number,
  concerningMin?: number,
  concerningMax?: number,
): BiomarkerStatus {
  if (concerningMin !== undefined && value < concerningMin) return 'concerning';
  if (concerningMax !== undefined && value > concerningMax) return 'concerning';
  if (value < optimalMin || value > optimalMax) return 'suboptimal';
  return 'optimal';
}

function computeBiomarkersAndScore(data: BiomarkerData): {
  biomarkers: BiomarkerResult[];
  healthScore: number;
} {
  const biomarkers: BiomarkerResult[] = [];
  let totalScore = 0;
  let count = 0;

  if (data.fastingGlucose !== null) {
    const status = getBiomarkerStatus(data.fastingGlucose, 70, 99, 0, 125);
    biomarkers.push({
      name: 'Fasting Glucose',
      value: data.fastingGlucose,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Elevated' : 'High',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.hba1c !== null) {
    const status = getBiomarkerStatus(data.hba1c, 4.0, 5.6, 0, 6.4);
    biomarkers.push({
      name: 'HbA1c',
      value: data.hba1c,
      unit: '%',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Elevated' : 'High',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.totalCholesterol !== null) {
    const status = getBiomarkerStatus(data.totalCholesterol, 125, 200, 0, 239);
    biomarkers.push({
      name: 'Total Cholesterol',
      value: data.totalCholesterol,
      unit: 'mg/dL',
      status,
      statusLabel:
        status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Borderline High' : 'High',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.ldlCholesterol !== null) {
    const status = getBiomarkerStatus(data.ldlCholesterol, 0, 100, undefined, 159);
    biomarkers.push({
      name: 'LDL Cholesterol',
      value: data.ldlCholesterol,
      unit: 'mg/dL',
      status,
      statusLabel:
        status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Borderline High' : 'High',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.hdlCholesterol !== null) {
    const status = getBiomarkerStatus(data.hdlCholesterol, 40, 100, 20, undefined);
    biomarkers.push({
      name: 'HDL Cholesterol',
      value: data.hdlCholesterol,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Low' : 'Very Low',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.triglycerides !== null) {
    const status = getBiomarkerStatus(data.triglycerides, 0, 150, undefined, 199);
    biomarkers.push({
      name: 'Triglycerides',
      value: data.triglycerides,
      unit: 'mg/dL',
      status,
      statusLabel:
        status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Borderline High' : 'High',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.vitaminD !== null) {
    const status = getBiomarkerStatus(data.vitaminD, 30, 50, 0, 20);
    biomarkers.push({
      name: 'Vitamin D',
      value: data.vitaminD,
      unit: 'ng/mL',
      status,
      statusLabel:
        status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Below Optimal' : 'Deficient',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  if (data.tsh !== null) {
    const status = getBiomarkerStatus(data.tsh, 0.5, 4.5, 0.1, 10);
    biomarkers.push({
      name: 'TSH',
      value: data.tsh,
      unit: 'mIU/L',
      status,
      statusLabel:
        status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Suboptimal' : 'Abnormal',
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  const healthScore = count > 0 ? Math.round(totalScore / count) : 0;
  return { biomarkers, healthScore };
}

function isKeyArea(
  o: unknown,
): o is { title: string; description: string; recommendation: string } {
  if (!o || typeof o !== 'object') return false;
  const r = o as Record<string, unknown>;
  return (
    typeof r.title === 'string' &&
    typeof r.description === 'string' &&
    typeof r.recommendation === 'string'
  );
}

function parseStructuredInsights(
  raw: string | null | undefined,
): AnalysisResult['insights'] | null {
  if (!raw) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
  if (!parsed || typeof parsed !== 'object') return null;
  const p = parsed as Record<string, unknown>;
  const keyAreasIn = p.keyAreas;
  const goingWellIn = p.goingWell;
  const nextStepsIn = p.nextSteps;

  const keyAreas = Array.isArray(keyAreasIn) ? keyAreasIn.filter(isKeyArea) : [];
  const goingWell = Array.isArray(goingWellIn)
    ? goingWellIn.filter((s): s is string => typeof s === 'string')
    : [];
  const nextSteps = Array.isArray(nextStepsIn)
    ? nextStepsIn.filter((s): s is string => typeof s === 'string')
    : [];

  if (keyAreas.length === 0 && goingWell.length === 0 && nextSteps.length === 0) {
    return null;
  }
  return { keyAreas, goingWell, nextSteps };
}

/**
 * Rule-based insights when OpenAI is unavailable or fails.
 * Lipid "elevated" uses explicit grouping so LDL-only or trig-only still trigger correctly.
 */
function buildRuleBasedInsights(data: BiomarkerData): AnalysisResult['insights'] {
  const keyAreas: AnalysisResult['insights']['keyAreas'] = [];

  if (
    data.fastingGlucose !== null &&
    (data.fastingGlucose >= 100 || (data.hba1c !== null && data.hba1c >= 5.7))
  ) {
    keyAreas.push({
      title: 'Blood Sugar Management',
      description: `Your fasting glucose (${data.fastingGlucose} mg/dL)${data.hba1c !== null ? ` and HbA1c (${data.hba1c}%)` : ''} suggest you're in the prediabetic range. This is reversible.`,
      recommendation: 'Consider: Reduce refined carbs, add 30min walking after meals',
    });
  }

  if (data.vitaminD !== null && data.vitaminD < 30) {
    keyAreas.push({
      title: 'Vitamin D Deficiency',
      description: `At ${data.vitaminD} ng/mL, you're below the optimal range (30-50 ng/mL). This affects immune function and bone health.`,
      recommendation: 'Consider: 2000-4000 IU daily supplementation, get morning sunlight',
    });
  }

  const ldlHigh = data.ldlCholesterol !== null && data.ldlCholesterol > 100;
  const trigHigh = data.triglycerides !== null && data.triglycerides > 150;
  if (ldlHigh || trigHigh) {
    const parts: string[] = [];
    if (ldlHigh) parts.push(`LDL (${data.ldlCholesterol})`);
    if (trigHigh) parts.push(`triglycerides (${data.triglycerides})`);
    const isAre = ldlHigh && trigHigh ? 'are' : 'is';
    keyAreas.push({
      title: 'Lipid Panel Optimization',
      description: `${parts.join(' and ')} ${isAre} elevated. Often improves with the same interventions that help blood sugar.`,
      recommendation: 'Consider: Increase omega-3 intake, reduce saturated fats',
    });
  }

  const goingWell: string[] = [];

  if (data.tsh !== null && data.tsh >= 0.5 && data.tsh <= 4.5) {
    goingWell.push('Your TSH is optimal - thyroid function looks good');
  }

  if (data.hdlCholesterol !== null && data.hdlCholesterol >= 40) {
    goingWell.push('HDL cholesterol is in healthy range');
  }

  if (
    data.fastingGlucose !== null &&
    data.fastingGlucose < 100 &&
    data.hba1c !== null &&
    data.hba1c < 5.7
  ) {
    goingWell.push('Blood sugar levels are well controlled');
  }

  if (data.vitaminD !== null && data.vitaminD >= 30) {
    goingWell.push('Vitamin D levels are optimal');
  }

  const nextSteps: string[] = [
    'Retest in 3 months to track progress',
    keyAreas.length > 0
      ? 'Consider seeing a healthcare provider about the areas identified'
      : 'Continue your current health practices',
    keyAreas.some((area) => area.title.includes('Vitamin D'))
      ? 'Start Vitamin D supplementation'
      : null,
  ].filter((s): s is string => s !== null);

  return { keyAreas, goingWell, nextSteps };
}

async function fetchOpenAIInsights(
  openai: OpenAI,
  data: BiomarkerData,
  healthScore: number,
  biomarkers: BiomarkerResult[],
): Promise<AnalysisResult['insights'] | null> {
  const userContent = buildAnalysisPrompt(data, healthScore, biomarkers);

  const completion = await openai.chat.completions.create({
    model: OPENAI_MODEL,
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

/**
 * Server-only: scores biomarkers locally, then requests AI insights when OPENAI_API_KEY is set; otherwise uses rule-based insights.
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
