import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Only return clean, canonical facts that are user confirmed or created.
    const profile = await prisma.careerProfile.findUnique({
      where: { userId: user.id },
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
