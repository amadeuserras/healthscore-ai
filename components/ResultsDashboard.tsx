import { AnalysisResult } from '@/types/biomarkers';

interface ResultsDashboardProps {
  results: AnalysisResult;
  onReset: () => void;
}

export default function ResultsDashboard({ results, onReset }: ResultsDashboardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'optimal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'suboptimal':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'concerning':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getStatusEmoji = (status: string) => {
    switch (status) {
      case 'optimal':
        return '✅';
      case 'suboptimal':
        return '⚠️';
      case 'concerning':
        return '❌';
      default:
        return '⚪';
    }
  };

  const scoreColor = results.healthScore >= 80 ? 'text-green-600' : results.healthScore >= 60 ? 'text-yellow-600' : 'text-red-600';

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Overall Health Score */}
      <div className="bg-white rounded-xl shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Health Score</h2>
        
        <div className="flex justify-center gap-2 mb-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className={`w-8 h-8 rounded-full ${
                i < Math.floor(results.healthScore / 10) ? scoreColor.replace('text-', 'bg-') : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <p className={`text-5xl font-bold ${scoreColor} mb-4`}>
          {results.healthScore}/100
        </p>
        
        <p className="text-gray-600">
          {results.healthScore >= 80 
            ? 'Excellent health foundation'
            : results.healthScore >= 60
            ? 'Good foundation, with room to optimize'
            : 'Areas requiring attention identified'}
        </p>
      </div>

      {/* Biomarker Status Grid */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Biomarker Status</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {results.biomarkers.map((biomarker, index) => (
            <div
              key={index}
              className={`rounded-xl p-6 border-2 ${getStatusColor(biomarker.status)}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{biomarker.name}</h3>
                  <p className="text-2xl font-bold">
                    {biomarker.value} {biomarker.unit}
                  </p>
                </div>
                <span className="text-3xl">{getStatusEmoji(biomarker.status)}</span>
              </div>
              <p className="font-medium">{biomarker.statusLabel}</p>
            </div>
          ))}
        </div>
      </div>

      {/* AI-Generated Insights */}
      <div className="bg-white rounded-xl shadow-lg p-8">
        {/* Key Areas for Improvement */}
        {results.insights.keyAreas.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              🎯 Key Areas for Improvement
            </h2>
            <div className="space-y-6">
              {results.insights.keyAreas.map((area, index) => (
                <div key={index} className="border-l-4 border-blue-600 pl-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {index + 1}. {area.title}
                  </h3>
                  <p className="text-gray-700 mb-3">{area.description}</p>
                  <p className="text-blue-600 font-medium">→ {area.recommendation}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* What's Going Well */}
        {results.insights.goingWell.length > 0 && (
          <div className="mb-8 pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              ✨ What's Going Well
            </h2>
            <ul className="space-y-2">
              {results.insights.goingWell.map((item, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700">
                  <span className="text-green-600">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommended Next Steps */}
        <div className="pt-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            📋 Recommended Next Steps
          </h2>
          <ol className="space-y-2">
            {results.insights.nextSteps.map((step, index) => (
              <li key={index} className="flex items-start gap-3 text-gray-700">
                <span className="font-bold text-blue-600">{index + 1}.</span>
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
          className="px-6 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition"
        >
          ← Try Different Values
        </button>
        <button
          className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          onClick={() => alert('PDF download feature coming soon!')}
        >
          📄 Download PDF Report
        </button>
      </div>
    </div>
  );
}
