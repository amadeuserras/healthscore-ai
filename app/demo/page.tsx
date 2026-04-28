'use client';

import { useState } from 'react';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';
import { requestAnalysis } from '@/lib/client/api/requestAnalysis';
import BiomarkerForm from '@/components/BiomarkerForm';
import LoadingState from '@/components/LoadingState';
import ResultsDashboard from '@/components/ResultsDashboard';
import Link from 'next/link';

const primaryCta =
  'inline-flex h-11 min-w-0 items-center justify-center rounded-[33px] border border-brand-lime bg-brand-ink px-6 text-sm font-medium text-brand-lime transition hover:bg-[#0a3233] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ink';

const navLink = 'text-[15px] font-medium text-ink/80 transition-colors hover:text-brand-ink';

export default function DemoPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);

  const handleAnalyze = async (data: BiomarkerData) => {
    setIsAnalyzing(true);
    try {
      const analysisResult = await requestAnalysis(data);
      setResults(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <div className="min-h-screen bg-surface-mute">
      <nav className="border-b border-hairline bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-container items-center justify-between px-4 py-6">
          <Link
            href="/"
            className="font-tight text-2xl font-semibold tracking-tight text-brand-ink"
          >
            HealthScore AI
          </Link>
          <div className="flex items-center gap-6">
            <Link href="/auth/login" className={navLink}>
              Log In
            </Link>
            <Link href="/auth/signup" className={primaryCta}>
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-container px-4 py-12 md:py-16">
        {!isAnalyzing && !results && (
          <>
            <div className="mx-auto mb-10 max-w-3xl">
              <h1 className="mb-4 font-tight text-4xl font-semibold tracking-tight text-ink md:text-5xl">
                Try the Demo
              </h1>
              <p className="text-lg leading-relaxed text-ink/70">
                Enter your biomarker values below to see how HealthScore AI analyzes your lab
                results. Don&apos;t have your results handy? We&apos;ve pre-filled some example
                values.
              </p>
            </div>
            <BiomarkerForm onSubmit={handleAnalyze} />
          </>
        )}

        {isAnalyzing && <LoadingState />}

        {!isAnalyzing && results && <ResultsDashboard results={results} onReset={handleReset} />}
      </main>
    </div>
  );
}
