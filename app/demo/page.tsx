'use client';

import { useState } from 'react';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';
import { requestAnalysis } from '@/lib/client/api/requestAnalysis';
import BiomarkerForm from '@/components/BiomarkerForm';
import LoadingState from '@/components/LoadingState';
import ResultsDashboard from '@/components/ResultsDashboard';
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            HealthScore AI
          </Link>
          <div className="space-x-4">
            <Link href="/auth/login" className="text-gray-700 hover:text-blue-900">
              Log In
            </Link>
            <Link
              href="/auth/signup"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isAnalyzing && !results && (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Try the Demo</h1>
              <p className="text-gray-600">
                Enter your biomarker values below to see how HealthScore AI analyzes your lab
                results. Don't have your results handy? We've pre-filled some example values.
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
