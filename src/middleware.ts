import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';

const { auth } = NextAuth(authConfig);

const rateLimitMap = new Map<string, { count: number, resetAt: number }>();

export default auth((req) => {
  if (req.nextUrl.pathname.startsWith('/api/')) {
    const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1';
    const now = Date.now();
    const windowMs = 60 * 1000;
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
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|.*\\.png$).*)'],
};
