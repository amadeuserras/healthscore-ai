import { AnalysisResult } from '@/types/biomarkers';

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

export function parseStructuredInsights(
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
