import { BiomarkerData, AnalysisResult, BiomarkerStatus } from '@/types/biomarkers';

function getBiomarkerStatus(
  value: number,
  optimalMin: number,
  optimalMax: number,
  concerningMin?: number,
  concerningMax?: number
): BiomarkerStatus {
  if (concerningMin !== undefined && value < concerningMin) return 'concerning';
  if (concerningMax !== undefined && value > concerningMax) return 'concerning';
  if (value < optimalMin || value > optimalMax) return 'suboptimal';
  return 'optimal';
}

export async function analyzeData(data: BiomarkerData): Promise<AnalysisResult> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const biomarkers = [];
  let totalScore = 0;
  let count = 0;

  // Fasting Glucose
  if (data.fastingGlucose !== null) {
    const status = getBiomarkerStatus(data.fastingGlucose, 70, 99, 0, 125);
    biomarkers.push({
      name: 'Fasting Glucose',
      value: data.fastingGlucose,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Elevated' : 'High'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // HbA1c
  if (data.hba1c !== null) {
    const status = getBiomarkerStatus(data.hba1c, 4.0, 5.6, 0, 6.4);
    biomarkers.push({
      name: 'HbA1c',
      value: data.hba1c,
      unit: '%',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Elevated' : 'High'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // Total Cholesterol
  if (data.totalCholesterol !== null) {
    const status = getBiomarkerStatus(data.totalCholesterol, 125, 200, 0, 239);
    biomarkers.push({
      name: 'Total Cholesterol',
      value: data.totalCholesterol,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Borderline High' : 'High'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // LDL Cholesterol
  if (data.ldlCholesterol !== null) {
    const status = getBiomarkerStatus(data.ldlCholesterol, 0, 100, undefined, 159);
    biomarkers.push({
      name: 'LDL Cholesterol',
      value: data.ldlCholesterol,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Borderline High' : 'High'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // HDL Cholesterol
  if (data.hdlCholesterol !== null) {
    const status = getBiomarkerStatus(data.hdlCholesterol, 40, 100, 20, undefined);
    biomarkers.push({
      name: 'HDL Cholesterol',
      value: data.hdlCholesterol,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Low' : 'Very Low'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // Triglycerides
  if (data.triglycerides !== null) {
    const status = getBiomarkerStatus(data.triglycerides, 0, 150, undefined, 199);
    biomarkers.push({
      name: 'Triglycerides',
      value: data.triglycerides,
      unit: 'mg/dL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Borderline High' : 'High'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // Vitamin D
  if (data.vitaminD !== null) {
    const status = getBiomarkerStatus(data.vitaminD, 30, 50, 0, 20);
    biomarkers.push({
      name: 'Vitamin D',
      value: data.vitaminD,
      unit: 'ng/mL',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Below Optimal' : 'Deficient'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  // TSH
  if (data.tsh !== null) {
    const status = getBiomarkerStatus(data.tsh, 0.5, 4.5, 0.1, 10);
    biomarkers.push({
      name: 'TSH',
      value: data.tsh,
      unit: 'mIU/L',
      status,
      statusLabel: status === 'optimal' ? 'Optimal' : status === 'suboptimal' ? 'Suboptimal' : 'Abnormal'
    });
    totalScore += status === 'optimal' ? 100 : status === 'suboptimal' ? 60 : 30;
    count++;
  }

  const healthScore = count > 0 ? Math.round(totalScore / count) : 0;

  // Generate insights based on the data
  const keyAreas = [];
  const goingWell = [];

  if (data.fastingGlucose !== null && (data.fastingGlucose >= 100 || (data.hba1c !== null && data.hba1c >= 5.7))) {
    keyAreas.push({
      title: 'Blood Sugar Management',
      description: `Your fasting glucose (${data.fastingGlucose} mg/dL)${data.hba1c !== null ? ` and HbA1c (${data.hba1c}%)` : ''} suggest you're in the prediabetic range. This is reversible.`,
      recommendation: 'Consider: Reduce refined carbs, add 30min walking after meals'
    });
  }

  if (data.vitaminD !== null && data.vitaminD < 30) {
    keyAreas.push({
      title: 'Vitamin D Deficiency',
      description: `At ${data.vitaminD} ng/mL, you're below the optimal range (30-50 ng/mL). This affects immune function and bone health.`,
      recommendation: 'Consider: 2000-4000 IU daily supplementation, get morning sunlight'
    });
  }

  if (data.ldlCholesterol !== null && data.ldlCholesterol > 100 || data.triglycerides !== null && data.triglycerides > 150) {
    keyAreas.push({
      title: 'Lipid Panel Optimization',
      description: `${data.ldlCholesterol !== null && data.ldlCholesterol > 100 ? `LDL (${data.ldlCholesterol})` : ''}${data.ldlCholesterol !== null && data.ldlCholesterol > 100 && data.triglycerides !== null && data.triglycerides > 150 ? ' and ' : ''}${data.triglycerides !== null && data.triglycerides > 150 ? `triglycerides (${data.triglycerides})` : ''} ${data.ldlCholesterol !== null && data.ldlCholesterol > 100 && data.triglycerides !== null && data.triglycerides > 150 ? 'are' : 'is'} elevated. Often improves with the same interventions that help blood sugar.`,
      recommendation: 'Consider: Increase omega-3 intake, reduce saturated fats'
    });
  }

  if (data.tsh !== null && data.tsh >= 0.5 && data.tsh <= 4.5) {
    goingWell.push('Your TSH is optimal - thyroid function looks good');
  }

  if (data.hdlCholesterol !== null && data.hdlCholesterol >= 40) {
    goingWell.push('HDL cholesterol is in healthy range');
  }

  if (data.fastingGlucose !== null && data.fastingGlucose < 100 && data.hba1c !== null && data.hba1c < 5.7) {
    goingWell.push('Blood sugar levels are well controlled');
  }

  if (data.vitaminD !== null && data.vitaminD >= 30) {
    goingWell.push('Vitamin D levels are optimal');
  }

  const nextSteps = [
    'Retest in 3 months to track progress',
    keyAreas.length > 0 ? 'Consider seeing a healthcare provider about the areas identified' : 'Continue your current health practices',
    keyAreas.some(area => area.title.includes('Vitamin D')) ? 'Start Vitamin D supplementation' : null
  ].filter(Boolean) as string[];

  return {
    healthScore,
    biomarkers,
    insights: {
      keyAreas,
      goingWell,
      nextSteps
    }
  };
}
