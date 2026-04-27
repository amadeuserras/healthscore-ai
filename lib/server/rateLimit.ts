import 'server-only';

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult =
  | {
      ok: true;
      remaining: number;
      limit: number;
      resetAt: number;
    }
  | {
      ok: false;
      remaining: 0;
      limit: number;
      resetAt: number;
    };

declare global {
  // eslint-disable-next-line no-var
  var __healthscore_rate_limit_store: Map<string, RateLimitEntry> | undefined;
}

function getStore(): Map<string, RateLimitEntry> {
  if (!globalThis.__healthscore_rate_limit_store) {
    globalThis.__healthscore_rate_limit_store = new Map();
  }
  return globalThis.__healthscore_rate_limit_store;
}

function pruneExpired(now: number, store: Map<string, RateLimitEntry>) {
  // Opportunistic pruning to keep memory bounded (serverless-friendly).
  // Only prune when the store grows a bit to avoid O(n) work each request.
  if (store.size < 1000) return;
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt <= now) store.delete(key);
  }
}

export function rateLimitFixedWindow(opts: {
  key: string;
  limit: number;
  windowMs: number;
  now?: number;
}): RateLimitResult {
  const store = getStore();
  const now = opts.now ?? Date.now();

  pruneExpired(now, store);

  const existing = store.get(opts.key);
  if (!existing || existing.resetAt <= now) {
    const resetAt = now + opts.windowMs;
    store.set(opts.key, { count: 1, resetAt });
    return { ok: true, remaining: Math.max(0, opts.limit - 1), limit: opts.limit, resetAt };
  }

  if (existing.count >= opts.limit) {
    return { ok: false, remaining: 0, limit: opts.limit, resetAt: existing.resetAt };
  }

  existing.count += 1;
  store.set(opts.key, existing);
  return {
    ok: true,
    remaining: Math.max(0, opts.limit - existing.count),
    limit: opts.limit,
    resetAt: existing.resetAt,
  };
}
