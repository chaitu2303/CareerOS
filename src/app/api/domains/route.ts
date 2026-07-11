import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const domains = await prisma.careerDomain.findMany({
      where: { isActive: true },
      include: {
        roles: true,
      },
      orderBy: { name: 'asc' }
    });
    
    return NextResponse.json({ domains });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch domains' }, { status: 500 });
  }
}
