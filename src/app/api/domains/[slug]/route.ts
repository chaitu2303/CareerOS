import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const domain = await prisma.careerDomain.findUnique({
      where: { slug: params.slug },
      include: {
        roles: true,
        competencies: {
          include: {
            skills: true,
            subjects: { include: { topics: true } }
          }
        },
      }
    });

    if (!domain) {
      return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
    }
    
    return NextResponse.json({ domain });
  } catch (error: any) {
    return NextResponse.json({ error: 'Failed to fetch domain' }, { status: 500 });
  }
}
