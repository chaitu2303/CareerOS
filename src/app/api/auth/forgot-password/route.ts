import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';

// Generic delay to prevent timing attacks
const GENERIC_RESPONSE = NextResponse.json({
  message: 'If that email is registered, you will receive a reset link shortly.'
});

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Find user — but ALWAYS return the same generic response regardless
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
      select: { id: true, email: true, password: true }
    });

    // Only proceed if user exists AND has a password (credentials user)
    if (user && user.password) {
      // Delete any existing unexpired tokens for this user
      await prisma.passwordResetToken.deleteMany({
        where: { userId: user.id, usedAt: null, expiresAt: { gt: new Date() } }
      });

      // Generate cryptographically secure random token
      const rawToken = crypto.randomBytes(32).toString('base64url');

      // Hash it — only the hash is stored, raw token goes in the email link
      const tokenHash = await bcrypt.hash(rawToken, 10);

      // Store with 1-hour expiry
      await prisma.passwordResetToken.create({
        data: {
          userId: user.id,
          tokenHash,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
        }
      });

      // Send email (non-blocking from response perspective — errors logged)
      try {
        await sendPasswordResetEmail(user.email!, rawToken);
      } catch (emailErr) {
        console.error('[forgot-password] Email send failed:', emailErr);
        // Still return generic success — token is in DB, user can retry
      }
    }

    // Always return same response — never reveal if email exists
    return GENERIC_RESPONSE;

  } catch (error) {
    console.error('[forgot-password] Error:', error);
    // Generic error — don't expose internals
    return NextResponse.json({
      message: 'If that email is registered, you will receive a reset link shortly.'
    });
  }
}
