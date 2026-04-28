'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        setMessage('Account created! Please check your email to verify your account.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 px-4">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center py-16">
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-baseline justify-center gap-2 font-tight text-3xl font-semibold tracking-[-1.6px]"
          >
            Healthscore <span className="text-lime-800">AI</span>
          </Link>
          <h2 className="mt-4 font-tight text-2xl font-semibold tracking-[-1.2px] text-stone-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm tracking-[-0.2px] text-stone-500">
            Start tracking your biomarkers today.
          </p>
        </div>

        <div className="rounded-xl border border-stone-200/70 bg-white p-8 shadow-[2px_2px_5px_rgba(0,0,0,0.02)]">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium tracking-[-0.2px] text-stone-700"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm tracking-[-0.2px] text-stone-900 shadow-sm placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium tracking-[-0.2px] text-stone-700"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-stone-300 bg-white px-4 py-2 text-sm tracking-[-0.2px] text-stone-900 shadow-sm placeholder:text-stone-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
                placeholder="••••••••"
                minLength={6}
              />
              <p className="mt-1 text-xs text-stone-500">Must be at least 6 characters.</p>
            </div>

            {error && (
              <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-900">
                {error}
              </div>
            )}

            {message && (
              <div className="rounded-lg border border-lime-200 bg-lime-50 px-4 py-3 text-sm text-lime-900">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center rounded-[33px] border border-lime-950 bg-lime-950 px-6 py-3 text-sm font-semibold tracking-[-0.4px] text-lime-100 shadow-[2px_2px_5px_rgba(0,0,0,0.06)] transition-colors hover:bg-lime-950/90 hover:border-lime-950/90 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-stone-900"
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-stone-500">
              Already have an account?{' '}
              <Link
                href="/auth/login"
                className="font-medium text-lime-800 underline underline-offset-4 hover:text-lime-900"
              >
                Log In
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-stone-500 underline underline-offset-4 hover:text-stone-900"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
