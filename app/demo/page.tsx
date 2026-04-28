'use client';

import { useState } from 'react';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';
import { requestAnalysis } from '@/lib/client/api/requestAnalysis';
import BiomarkerForm from '@/components/BiomarkerForm';
import LoadingState from '@/components/LoadingState';
import ResultsDashboard from '@/components/ResultsDashboard';
import { CtaLink } from '@/components/ui';
import Link from 'next/link';

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
    <div className="h-screen flex flex-col bg-stone-50">
      <nav>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-tight text-2xl font-semibold tracking-[-1.2px]">
            Healthscore <span className="text-lime-800">AI</span>
          </Link>
          <div className="flex items-center gap-6">
            <CtaLink href="/auth/login" variant="secondary">
              Log In
            </CtaLink>
            <CtaLink href="/auth/signup" variant="primary">
              Sign Up
            </CtaLink>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-container px-4 py-20 md:py-24 flex-1">
        {!isAnalyzing && !results && (
          <>
            <div className="mx-auto max-w-4xl text-center">
              <h2 className="mb-6 tracking-[-5px] text-4xl md:text-5xl lg:text-6xl">
                Try the Demo
              </h2>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed tracking-[-0.3px] text-stone-500">
                Enter your biomarker values below to see how HealthScore AI analyzes your lab
                results. Don&apos;t have your results handy? We&apos;ve pre-filled some example
                values.
              </p>
            </div>
            <div className="mx-auto mt-12 max-w-3xl">
              <BiomarkerForm onSubmit={handleAnalyze} />
            </div>
          </>
        )}

        {isAnalyzing && <LoadingState />}

        {!isAnalyzing && results && (
          <>
            <ResultsDashboard results={results} />
            <div className="mx-auto mt-6 flex max-w-6xl items-center justify-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-[33px] border border-stone-300 bg-white px-6 py-3 text-sm font-medium tracking-[-0.4px] text-stone-900 transition-colors cursor-pointer hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                ← Try Different Values
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
