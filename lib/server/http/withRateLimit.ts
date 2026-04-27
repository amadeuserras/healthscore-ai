import 'server-only';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { rateLimitFixedWindow } from '@/lib/server/rateLimit';
import { getClientIp } from './getClientIp';

type RateLimitHeaders = Record<string, string>;

export function applyAnalyzeRateLimit(request: NextRequest): {
  headers: RateLimitHeaders;
  blockedResponse: NextResponse | null;
} {
  const ip = getClientIp(request);
  const rl = rateLimitFixedWindow({ key: `analyze:${ip}`, limit: 5, windowMs: 15 * 60 * 1000 });

  const resetIso = new Date(rl.resetAt).toISOString();
  const headers: RateLimitHeaders = {
    'X-RateLimit-Limit': String(rl.limit),
    'X-RateLimit-Remaining': String(rl.remaining),
    'X-RateLimit-Reset': resetIso,
  };

  if (rl.ok) return { headers, blockedResponse: null };

  const retryAfterSeconds = Math.max(0, Math.ceil((rl.resetAt - Date.now()) / 1000));
  const blockedResponse = NextResponse.json(
    { error: 'Rate limit exceeded. Try again later.' },
    {
      status: 429,
      headers: {
        ...headers,
        'Retry-After': String(retryAfterSeconds),
      },
    },
  );

  return { headers, blockedResponse };
}
