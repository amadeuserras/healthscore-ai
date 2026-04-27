import { BiomarkerData } from '@/types/biomarkers';

const BIOMARKER_KEYS: (keyof BiomarkerData)[] = [
  'fastingGlucose',
  'hba1c',
  'totalCholesterol',
  'ldlCholesterol',
  'hdlCholesterol',
  'triglycerides',
  'vitaminD',
  'tsh',
];

export function isNumberOrNull(x: unknown): x is number | null {
  return x === null || (typeof x === 'number' && !Number.isNaN(x));
}

export function isValidBiomarkerData(body: unknown): body is BiomarkerData {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  for (const k of BIOMARKER_KEYS) {
    if (!isNumberOrNull(b[k])) return false;
  }
  return true;
}
