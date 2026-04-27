import 'server-only';
import type { NextRequest } from 'next/server';

export function getClientIp(request: NextRequest): string {
  const direct = (request as unknown as { ip?: string }).ip;
  if (direct) return direct;

  const xff = request.headers.get('x-forwarded-for');
  if (xff) return xff.split(',')[0]?.trim() || 'unknown';

  const realIp = request.headers.get('x-real-ip');
  if (realIp) return realIp.trim();

  return 'unknown';
}
