import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const applications = await prisma.application.findMany({
      where: { userId: dbUser.id },
      orderBy: { updatedAt: 'desc' }
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error('[GET /api/applications]', error);
    return NextResponse.json({ error: 'Failed to fetch applications' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { company, roleTitle, status, jobId, resumeId, notes } = body;

    if (!company || !roleTitle) {
      return NextResponse.json({ error: 'Company and Role Title are required' }, { status: 400 });
    }

    const application = await prisma.application.create({
      data: {
        userId: dbUser.id,
        company,
        roleTitle,
        status: status || 'SAVED',
        jobId,
        resumeId,
        notes,
        statusHistory: [{ status: status || 'SAVED', timestamp: new Date().toISOString() }]
      }
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error('[POST /api/applications]', error);
    return NextResponse.json({ error: 'Failed to create application' }, { status: 500 });
  }
}
