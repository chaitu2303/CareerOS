import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple in-memory store for staging rate limiting.
// In production, this would use Redis/Upstash.
const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export function proxy(request: NextRequest) {
  // Only rate limit API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const ip = request.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000; // 1 minute
    const maxRequests = 100;

    let record = rateLimitMap.get(ip);
    if (!record || now > record.resetAt) {
      record = { count: 0, resetAt: now + windowMs };
    }

    record.count++;
    rateLimitMap.set(ip, record);

    if (record.count > maxRequests) {
      return new NextResponse(JSON.stringify({ error: 'Too Many Requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}
