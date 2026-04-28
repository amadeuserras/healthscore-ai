import { AnalysisResult } from '@/types/biomarkers';
import { BiomarkerCard } from '@/components/BiomarkerPreviewCard';

interface ResultsDashboardProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ results, onReset }: ResultsDashboardProps) {
  const scoreColor =
    results.healthScore >= 80
      ? 'text-lime-800'
      : results.healthScore >= 60
        ? 'text-amber-700'
        : 'text-rose-700';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Health Score */}
      <div className="rounded-xl border border-stone-200/70 bg-white p-8 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
        <h2 className="mb-1 font-tight text-3xl font-semibold tracking-[-1.6px]">
          Your health score
        </h2>
        <p className="mb-8 text-sm tracking-[-0.2px] text-stone-500">
          A quick snapshot based on your current biomarker inputs.
        </p>

        <p className={`mb-4 text-5xl font-semibold tracking-[-2.4px] ${scoreColor}`}>
          {results.healthScore}
          <span className="text-stone-400">/100</span>
        </p>

        <p className="text-stone-500">
          {results.healthScore >= 80
            ? 'Excellent health foundation'
            : results.healthScore >= 60
              ? 'Good foundation, with room to optimize'
              : 'Areas requiring attention identified'}
        </p>
      </div>

      {/* Biomarker Status Grid */}
      <div>
        <h2 className="mb-6 font-tight text-3xl font-semibold tracking-[-1.6px]">
          Biomarker status
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {results.biomarkers.map((biomarker) => (
            <BiomarkerCard key={biomarker.name} biomarker={biomarker} />
          ))}
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="rounded-xl border border-stone-200/70 bg-white p-8 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
        {/* Key Areas for Improvement */}
        {results.insights.keyAreas.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-6 flex items-center gap-2 font-tight text-3xl font-semibold tracking-[-1.6px]">
              🎯 Key Areas for Improvement
            </h2>
            <div className="space-y-6">
              {results.insights.keyAreas.map((area, index) => (
                <div key={index} className="border-l-2 border-stone-200 pl-6">
                  <h3 className="mb-2 text-lg font-semibold tracking-[-0.6px] text-stone-900">
                    {index + 1}. {area.title}
                  </h3>
                  <p className="mb-3 text-sm leading-relaxed text-stone-600">{area.description}</p>
                  <p className="text-sm font-medium text-stone-900">
                    → <span className="text-lime-800">{area.recommendation}</span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Going Well */}
        {results.insights.goingWell.length > 0 && (
          <div className="mb-8 border-t border-stone-200 pt-8">
            <h2 className="mb-4 flex items-center gap-2 font-tight text-3xl font-semibold tracking-[-1.6px]">
              ✨ What's Going Well
            </h2>
            <ul className="space-y-2">
              {results.insights.goingWell.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-sm text-stone-600">
                  <span className="text-lime-800">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Next Steps */}
        <div className="border-t border-stone-200 pt-8">
          <h2 className="mb-4 flex items-center gap-2 font-tight text-3xl font-semibold tracking-[-1.6px]">
            📋 Recommended Next Steps
          </h2>
          <ol className="space-y-2">
            {results.insights.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-stone-600">
                <span className="font-semibold text-lime-800">{index + 1}.</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center justify-center rounded-[33px] border border-stone-300 bg-white px-6 py-3 text-sm font-medium tracking-[-0.4px] text-stone-900 transition-colors cursor-pointer hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
        >
          ← Try Different Values
        </button>
      </div>
    </div>
  );
}
