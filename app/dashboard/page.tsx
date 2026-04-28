'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';
import { requestAnalysis } from '@/lib/client/api/requestAnalysis';
import BiomarkerForm from '@/components/BiomarkerForm';
import LoadingState from '@/components/LoadingState';
import ResultsDashboard from '@/components/ResultsDashboard';
import Link from 'next/link';

export default function DashboardPage() {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [results, setResults] = useState<AnalysisResult | null>(null);
  const [user, setUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
      } else {
        setUser(user);
      }
    };
    checkUser();
  }, [router]);

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

  const handleSave = async () => {
    if (!results || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase.from('biomarker_history').insert({
        user_id: user.id,
        health_score: results.healthScore,
        biomarker_data: results.biomarkers,
        analysis_results: results.insights,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Save failed:', error);
      alert('Failed to save results. Please make sure your database is set up correctly.');
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setResults(null);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-stone-500">Loading…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Navigation */}
      <nav>
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link href="/" className="font-tight text-2xl font-semibold tracking-[-1.2px]">
            Healthscore <span className="text-lime-800">AI</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/history"
              className="rounded-full px-3 py-2 text-sm font-medium tracking-[-0.2px] text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              My History
            </Link>
            <span className="hidden text-sm text-stone-500 md:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-[33px] border border-stone-300 bg-white px-4 py-2 text-sm font-medium tracking-[-0.4px] text-stone-900 transition-colors cursor-pointer hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-4 py-10 md:py-14">
        {!isAnalyzing && !results && (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <h1 className="mb-4 font-tight text-4xl font-semibold tracking-[-2.4px] md:text-5xl">
                Analyze your biomarkers
              </h1>
              <p className="max-w-2xl text-sm leading-relaxed tracking-[-0.2px] text-stone-500">
                Enter your latest lab results to get personalized health insights. Your results will
                be saved to your history.
              </p>
            </div>
            <BiomarkerForm onSubmit={handleAnalyze} />
          </>
        )}

        {isAnalyzing && <LoadingState />}

        {!isAnalyzing && results && (
          <>
            <ResultsDashboard results={results} />
            <div className="mx-auto mt-6 flex max-w-6xl flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <button
                onClick={handleReset}
                className="inline-flex items-center justify-center rounded-[33px] border border-stone-300 bg-white px-6 py-3 text-sm font-medium tracking-[-0.4px] text-stone-900 transition-colors cursor-pointer hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                ← Try Different Values
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center justify-center rounded-[33px] border border-lime-950 bg-lime-950 px-8 py-3 text-sm font-semibold tracking-[-0.4px] text-lime-100 shadow-[2px_2px_5px_rgba(0,0,0,0.06)] transition-colors enabled:cursor-pointer hover:bg-lime-950/90 hover:border-lime-950/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                {saving ? 'Saving...' : '💾 Save to My History'}
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
