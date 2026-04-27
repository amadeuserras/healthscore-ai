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
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
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
            <Link href="/dashboard" className="text-gray-700 hover:text-blue-900">
              New Analysis
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
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">Your Biomarker History</h1>

          {history.length === 0 ? (
            <div className="bg-white rounded-xl shadow-lg p-12 text-center">
              <p className="text-gray-600 mb-6">You haven't analyzed any biomarkers yet.</p>
              <Link
                href="/dashboard"
                className="inline-block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Analyze Your First Results
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((entry) => (
                <div key={entry.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {formatDate(entry.created_at)}
                      </h3>
                      <p className="text-2xl font-bold text-blue-600 mt-1">
                        Score: {entry.health_score}/100
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {entry.biomarker_data.slice(0, 3).map((biomarker: any, index: number) => (
                      <div key={index} className="flex items-center justify-between text-gray-700">
                        <span>
                          {getStatusEmoji(biomarker.value, biomarker.name)} {biomarker.name}:
                        </span>
                        <span className="font-semibold">
                          {biomarker.value} {biomarker.unit} ({biomarker.statusLabel})
                        </span>
                      </div>
                    ))}
                    {entry.biomarker_data.length > 3 && (
                      <p className="text-sm text-gray-500">
                        + {entry.biomarker_data.length - 3} more biomarkers
                      </p>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="font-semibold text-gray-900 mb-2">Key Insights:</h4>
                    <ul className="space-y-1">
                      {entry.analysis_results.keyAreas
                        .slice(0, 2)
                        .map((area: any, index: number) => (
                          <li key={index} className="text-sm text-gray-600">
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
