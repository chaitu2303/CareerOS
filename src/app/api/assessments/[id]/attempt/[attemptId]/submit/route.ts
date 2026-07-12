import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';
import { EvaluationService } from '@/lib/assessment/EvaluationService';

export async function POST(req: Request, context: any) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const payload = await req.json(); // SubmitAttemptPayload

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: params.attemptId }
    });

    if (!attempt || attempt.userId !== user.id!) {
      return NextResponse.json({ error: 'Attempt not found or unauthorized' }, { status: 404 });
    }

    if (attempt.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 400 });
    }

    const evaluationResult = await EvaluationService.evaluateAttempt(attempt.id, payload);

    return NextResponse.json({ success: true, evaluationResult });
  } catch (error: any) {
    console.error('Submit attempt error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit attempt' }, { status: 500 });
  }
}
