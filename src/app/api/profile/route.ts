import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only return clean, canonical facts that are user confirmed or created.
    const profile = await prisma.careerProfile.findUnique({
      where: { userId: user.id! },
      include: {
        basics: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        skills: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        experiences: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } }, orderBy: { duration: 'desc' } },
        educations: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } }, orderBy: { year: 'desc' } },
        projects: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        certifications: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
      }
    });

    if (!profile) {
      return NextResponse.json({ profile: null });
    }

    return NextResponse.json({ profile });

  } catch (error) {
    console.error('Fetch Profile Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
