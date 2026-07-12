import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

export async function GET(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    
    // We fetch problems
    const problems = await prisma.codingProblem.findMany({
      where: { status: 'PUBLISHED' },
      select: {
        id: true,
        title: true,
        slug: true,
        difficulty: true,
        topic: true,
        timeLimit: true,
        memoryLimit: true,
        progress: user ? {
          where: { userId: user.id! }
        } : false
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ problems });
  } catch (error: any) {
    console.error('List problems error:', error);
    return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 });
  }
}
