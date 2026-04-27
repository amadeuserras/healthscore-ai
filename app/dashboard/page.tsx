'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { BiomarkerData, AnalysisResult } from '@/types/biomarkers';
import { requestAnalysis } from '@/lib/analysisRequest';
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
      const { data: { user } } = await supabase.auth.getUser();
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

      alert('Results saved to your history!');
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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navigation */}
      <nav className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-blue-900">
            HealthScore AI
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/history" className="text-gray-700 hover:text-blue-900">
              My History
            </Link>
            <span className="text-gray-600">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {!isAnalyzing && !results && (
          <>
            <div className="max-w-3xl mx-auto mb-8">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">Analyze Your Biomarkers</h1>
              <p className="text-gray-600">
                Enter your latest lab results to get personalized health insights. Your results will be saved to your history.
              </p>
            </div>
            <BiomarkerForm onSubmit={handleAnalyze} />
          </>
        )}

        {isAnalyzing && <LoadingState />}

        {!isAnalyzing && results && (
          <>
            <ResultsDashboard results={results} onReset={handleReset} />
            <div className="max-w-6xl mx-auto mt-8 text-center">
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
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
