import 'server-only';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';

/**
 * Rule-based insights when OpenAI is unavailable or fails.
 * Lipid "elevated" uses explicit grouping so LDL-only or trig-only still trigger correctly.
 */
export function buildRuleBasedInsights(data: BiomarkerData): AnalysisResult['insights'] {
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
