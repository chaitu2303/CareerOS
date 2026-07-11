import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const assessments = await prisma.assessment.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        description: true,
        department: true,
        domain: true,
        type: true,
        difficulty: true,
        durationMinutes: true,
        topicCoverage: true,
        mode: true,
        _count: {
          select: { attempts: { where: { userId: user.id } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ assessments });
  } catch (error: any) {
    console.error('List assessments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}
