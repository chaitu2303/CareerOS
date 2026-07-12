import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const MIN_PASSWORD_LENGTH = 8;

export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json();

    if (!token || !newPassword) {
      return NextResponse.json({ error: 'Token and new password are required' }, { status: 400 });
    }

    if (typeof newPassword !== 'string' || newPassword.length < MIN_PASSWORD_LENGTH) {
      return NextResponse.json(
        { error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters` },
        { status: 400 }
      );
    }

    // Find all valid (unused, unexpired) reset tokens and check which one matches
    const validTokens = await prisma.passwordResetToken.findMany({
      where: {
        usedAt: null,
        expiresAt: { gt: new Date() }
      },
      include: { user: { select: { id: true, email: true } } }
    });

    // bcrypt.compare each token hash — token is a raw base64url string
    let matchedRecord: typeof validTokens[0] | null = null;
    for (const record of validTokens) {
      const matches = await bcrypt.compare(token, record.tokenHash);
      if (matches) {
        matchedRecord = record;
        break;
      }
    }

    if (!matchedRecord) {
      return NextResponse.json(
        { error: 'This reset link is invalid or has expired. Please request a new one.' },
        { status: 400 }
      );
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and mark token as used — in a transaction
    await prisma.$transaction([
      prisma.user.update({
        where: { id: matchedRecord.userId },
        data: { password: hashedPassword }
      }),
      prisma.passwordResetToken.update({
        where: { id: matchedRecord.id },
        data: { usedAt: new Date() }
      })
    ]);

    return NextResponse.json({ message: 'Password updated successfully. You can now sign in.' });

  } catch (error) {
    console.error('[reset-password] Error:', error);
    return NextResponse.json({ error: 'An error occurred. Please try again.' }, { status: 500 });
  }
}
