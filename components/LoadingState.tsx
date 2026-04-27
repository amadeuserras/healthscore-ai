export default function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-12 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Analyzing your data...</h2>
        
        <div className="flex justify-center gap-2 mb-8">
          <span className="text-6xl animate-pulse">⚡</span>
          <span className="text-6xl animate-pulse" style={{ animationDelay: '0.2s' }}>⚡</span>
          <span className="text-6xl animate-pulse" style={{ animationDelay: '0.4s' }}>⚡</span>
        </div>

        <div className="space-y-3 text-gray-600">
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse"></span>
            Reviewing biomarker levels
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></span>
            Comparing to optimal ranges
          </p>
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block w-2 h-2 bg-blue-600 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></span>
            Generating personalized insights
          </p>
        </div>
      </div>
    </div>
  );
}
