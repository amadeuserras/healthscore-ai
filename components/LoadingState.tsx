export default function LoadingState() {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="rounded-xl border border-stone-200/70 bg-white p-12 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
        <h2 className="mb-2 font-tight text-3xl font-semibold tracking-[-1.6px]">
          Analyzing your data…
        </h2>
        <p className="mb-10 text-sm tracking-[-0.2px] text-stone-500">
          This usually takes a few seconds.
        </p>

        <div className="mb-10 flex justify-center gap-2">
          <span className="text-6xl animate-pulse">⚡</span>
          <span className="text-6xl animate-pulse" style={{ animationDelay: '0.2s' }}>
            ⚡
          </span>
          <span className="text-6xl animate-pulse" style={{ animationDelay: '0.4s' }}>
            ⚡
          </span>
        </div>

        <div className="space-y-3 text-sm text-stone-600">
          <p className="flex items-center justify-center gap-2">
            <span className="inline-block h-2 w-2 rounded-full bg-lime-800 animate-pulse"></span>
            Reviewing biomarker levels
          </p>
          <p className="flex items-center justify-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-lime-800 animate-pulse"
              style={{ animationDelay: '0.3s' }}
            ></span>
            Comparing to optimal ranges
          </p>
          <p className="flex items-center justify-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full bg-lime-800 animate-pulse"
              style={{ animationDelay: '0.6s' }}
            ></span>
            Generating personalized insights
          </p>
        </div>
      </div>
    </div>
  );
}
