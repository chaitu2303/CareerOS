import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const application = await prisma.application.findFirst({
      where: { id, userId: dbUser.id }
    });

    if (!application) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    return NextResponse.json({ application });
  } catch (error) {
    console.error('[GET /api/applications/[id]]', error);
    return NextResponse.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const body = await req.json();
    const { status, notes } = body;

    const existing = await prisma.application.findFirst({
      where: { id, userId: dbUser.id }
    });

    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const newHistory = existing.statusHistory ? [...(existing.statusHistory as any[])] : [];
    if (status && status !== existing.status) {
      newHistory.push({ status, timestamp: new Date().toISOString() });
    }

    const application = await prisma.application.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes && { notes }),
        statusHistory: newHistory
      }
    });

    return NextResponse.json({ application });
  } catch (error) {
    console.error('[PUT /api/applications/[id]]', error);
    return NextResponse.json({ error: 'Failed to update application' }, { status: 500 });
  }
}
