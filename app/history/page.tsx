'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface HistoryEntry {
  id: string;
  created_at: string;
  health_score: number;
  biomarker_data: any[];
  analysis_results: any;
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndLoadHistory = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);

      // Load history
      const { data, error } = await supabase
        .from('biomarker_history')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading history:', error);
      } else {
        setHistory(data || []);
      }

      setLoading(false);
    };

    checkUserAndLoadHistory();
  }, [router]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusEmoji = (value: number, name: string) => {
    // Simple logic based on common ranges
    if (name.includes('Glucose') && value > 100) return '⚠️';
    if (name.includes('Vitamin D') && value < 30) return '⚠️';
    if (name.includes('LDL') && value > 100) return '⚠️';
    if (name.includes('Triglycerides') && value > 150) return '⚠️';
    return '✅';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-sm text-stone-500">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
              href="/dashboard"
              className="rounded-full px-3 py-2 text-sm font-medium tracking-[-0.2px] text-stone-600 transition-colors hover:bg-stone-100 hover:text-stone-900"
            >
              New Analysis
            </Link>
            <span className="hidden text-sm text-stone-500 md:inline">{user.email}</span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-[33px] border border-stone-300 bg-white px-4 py-2 text-sm font-medium tracking-[-0.4px] text-stone-900 transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              Log Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-container px-4 py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          <h1 className="mb-8 font-tight text-4xl font-semibold tracking-[-2.4px] md:text-5xl">
            Your biomarker history
          </h1>

          {history.length === 0 ? (
            <div className="rounded-xl border border-stone-200/70 bg-white p-12 text-center shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
              <p className="mb-8 text-sm text-stone-500">
                You haven't analyzed any biomarkers yet.
              </p>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center rounded-[33px] border border-lime-950 bg-lime-950 px-6 py-3 text-sm font-semibold tracking-[-0.4px] text-lime-100 shadow-[2px_2px_5px_rgba(0,0,0,0.06)] transition-colors hover:bg-lime-950/90 hover:border-lime-950/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
              >
                Analyze Your First Results
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="rounded-xl border border-stone-200/70 bg-white p-6 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-tight text-2xl font-semibold tracking-[-1.2px]">
                        {formatDate(entry.created_at)}
                      </h3>
                      <p className="mt-1 text-sm text-stone-500">
                        Score:{' '}
                        <span className="font-semibold tracking-[-0.2px] text-lime-800">
                          {entry.health_score}/100
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {entry.biomarker_data.slice(0, 3).map((biomarker: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between gap-4 text-sm text-stone-700"
                      >
                        <span>
                          {getStatusEmoji(biomarker.value, biomarker.name)} {biomarker.name}:
                        </span>
                        <span className="shrink-0 font-medium text-stone-900">
                          {biomarker.value} {biomarker.unit} ({biomarker.statusLabel})
                        </span>
                      </div>
                    ))}
                    {entry.biomarker_data.length > 3 && (
                      <p className="text-xs text-stone-500">
                        + {entry.biomarker_data.length - 3} more biomarkers
                      </p>
                    )}
                  </div>

                  <div className="mt-6 border-t border-stone-200 pt-4">
                    <h4 className="mb-2 text-sm font-semibold tracking-[-0.2px] text-stone-900">
                      Key insights
                    </h4>
                    <ul className="space-y-1">
                      ¬
                      {entry.analysis_results.keyAreas
                        .slice(0, 2)
                        .map((area: any, index: number) => (
                          <li key={index} className="text-sm text-stone-600">
                            • {area.title}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
