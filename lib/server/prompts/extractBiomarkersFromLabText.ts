import 'server-only';

/**
 * Prompts for OpenAI extraction of structured biomarkers from raw lab report text.
 * Used by the extract-biomarkers API after PDF text is parsed on the client.
 */
export const EXTRACT_BIOMARKERS_SYSTEM_PROMPT = [
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

export function buildExtractBiomarkersUserPrompt(labReportText: string): string {
  return 'Extract biomarker values from this lab report: ' + labReportText;
}
