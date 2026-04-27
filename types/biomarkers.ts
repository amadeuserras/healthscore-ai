export interface Biomarker {
  name: string;
  value: number | null;
  unit: string;
  optimalMin: number;
  optimalMax: number;
  info?: string;
}

export interface BiomarkerData {
  fastingGlucose: number | null;
  hba1c: number | null;
  totalCholesterol: number | null;
  ldlCholesterol: number | null;
  hdlCholesterol: number | null;
  triglycerides: number | null;
  vitaminD: number | null;
  tsh: number | null;
}

export type BiomarkerStatus = 'optimal' | 'suboptimal' | 'concerning';

export interface BiomarkerResult {
  name: string;
  value: number;
  unit: string;
  status: BiomarkerStatus;
  statusLabel: string;
}

export interface AnalysisResult {
  healthScore: number;
  biomarkers: BiomarkerResult[];
  insights: {
    keyAreas: Array<{
      title: string;
      description: string;
      recommendation: string;
    }>;
    goingWell: string[];
    nextSteps: string[];
  };
}
