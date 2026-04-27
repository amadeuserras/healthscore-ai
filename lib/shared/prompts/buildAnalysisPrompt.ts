import { BiomarkerData, BiomarkerResult } from '@/types/biomarkers';

/**
 * User message for a structured JSON response matching AnalysisResult['insights'].
 */
export function buildAnalysisPrompt(
  data: BiomarkerData,
  healthScore: number,
  biomarkers: BiomarkerResult[],
): string {
  const lines: string[] = [
    'Patient-submitted lab values (for educational context only; not a diagnosis):',
    '',
    `Overall app-computed health score: ${healthScore} / 100 (based on how many markers are in range).`,
    '',
    'Per-marker status from our rules:',
  ];

  for (const b of biomarkers) {
    lines.push(`- ${b.name}: ${b.value} ${b.unit} — ${b.statusLabel} (${b.status})`);
  }

  lines.push(
    '',
    'Raw values for reference:',
    ...([
      data.fastingGlucose !== null && `Fasting Glucose: ${data.fastingGlucose} mg/dL`,
      data.hba1c !== null && `HbA1c: ${data.hba1c} %`,
      data.totalCholesterol !== null && `Total Cholesterol: ${data.totalCholesterol} mg/dL`,
      data.ldlCholesterol !== null && `LDL: ${data.ldlCholesterol} mg/dL`,
      data.hdlCholesterol !== null && `HDL: ${data.hdlCholesterol} mg/dL`,
      data.triglycerides !== null && `Triglycerides: ${data.triglycerides} mg/dL`,
      data.vitaminD !== null && `Vitamin D: ${data.vitaminD} ng/mL`,
      data.tsh !== null && `TSH: ${data.tsh} mIU/L`,
    ].filter(Boolean) as string[]),
    '',
    'Respond with JSON only (no markdown) using this exact shape:',
    '{ "keyAreas": [ { "title": string, "description": string, "recommendation": string } ], "goingWell": [ string ], "nextSteps": [ string ] }',
    '',
    'Rules: prioritize the most important 0–3 key areas. Use clear, supportive language. Include lifestyle and follow-up ideas where appropriate. Remind the user this is not medical advice. Keep strings concise.',
    'If a marker was not provided, do not invent values for it.',
  );

  return lines.join('\n');
}
