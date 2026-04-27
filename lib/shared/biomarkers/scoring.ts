import { BiomarkerData, BiomarkerResult, BiomarkerStatus } from '@/types/biomarkers';

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

export function computeBiomarkersAndScore(data: BiomarkerData): {
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
