import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request, context: any) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: params.attemptId }
    });

    if (!attempt || attempt.userId !== user.id!) {
      return NextResponse.json({ error: 'Attempt not found or unauthorized' }, { status: 404 });
    }

    return NextResponse.json({ attempt });
  } catch (error: any) {
    console.error('Get attempt error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch attempt' }, { status: 500 });
  }
}
