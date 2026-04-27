import { BiomarkerData, AnalysisResult } from "@/types/biomarkers";

export async function requestAnalysis(
  data: BiomarkerData,
): Promise<AnalysisResult> {
  const res = await fetch("/api/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let message = "Analysis failed";
    try {
      const err = (await res.json()) as { error?: string };
      if (typeof err.error === "string") message = err.error;
    } catch {
      // ignore
    }
    throw new Error(message);
  }

  return res.json() as Promise<AnalysisResult>;
}
