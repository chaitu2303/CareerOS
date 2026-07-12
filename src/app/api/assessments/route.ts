import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({
      where: { email: user.email! },
      include: { careerProfile: true }
    });
    const userDomain = dbUser?.careerProfile?.domain || 'General';

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
          select: { attempts: { where: { userId: user.id! } } }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ assessments, userDomain });
  } catch (error: any) {
    console.error('List assessments error:', error);
    return NextResponse.json({ error: 'Failed to fetch assessments' }, { status: 500 });
  }
}
