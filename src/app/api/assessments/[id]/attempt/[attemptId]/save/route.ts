import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function POST(req: Request, context: any) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const { answers, timeTakenSeconds } = await req.json();

    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: params.attemptId }
    });

    if (!attempt || attempt.userId !== user.id!) {
      return NextResponse.json({ error: 'Attempt not found or unauthorized' }, { status: 404 });
    }

    if (attempt.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Attempt already completed' }, { status: 400 });
    }

    // Save answers (auto-save)
    const dbAnswers = answers.map((ans: any) => ({
      attemptId: attempt.id,
      questionId: ans.questionId,
      answer: ans.answer,
      timeTakenSeconds: ans.timeTakenSeconds || 0,
      isMarkedForReview: ans.isMarkedForReview || false,
    }));

    // Perform upsert for each answer
    await prisma.$transaction(
      dbAnswers.map((ans: any) => 
        prisma.attemptAnswer.upsert({
          where: { attemptId_questionId: { attemptId: ans.attemptId, questionId: ans.questionId } },
          update: ans,
          create: ans
        })
      )
    );

    if (timeTakenSeconds != null) {
      await prisma.assessmentAttempt.update({
        where: { id: attempt.id },
        data: { timeTakenSeconds }
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Save attempt error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save attempt' }, { status: 500 });
  }
}
