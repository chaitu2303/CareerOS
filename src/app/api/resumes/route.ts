/**
 * GET  /api/resumes        → list user's resumes
 * POST /api/resumes        → create new resume (from scratch or from profile)
 */
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { buildResumeFromProfile } from '@/lib/resume/engine';
import type { GroundedProfile } from '@/lib/resume/engine';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const session = await auth();
    const authUser = session?.user;
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
    if (!dbUser) return NextResponse.json({ resumes: [] });

    const resumes = await prisma.resume.findMany({
      where: { userId: dbUser.id },
      select: { id: true, title: true, templateId: true, isDefault: true, atsScore: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json({ resumes });
  } catch (e) {
    console.error('[GET /api/resumes]', e);
    return NextResponse.json({ error: 'Failed to list resumes' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    const authUser = session?.user;
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    let dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { id: authUser.id!, email: authUser.email!, name: authUser.name }
      });
    }

    const body = await req.json();
    const { mode, title } = body; // mode: 'BLANK' | 'FROM_PROFILE'

    let content: object;

    if (mode === 'FROM_PROFILE') {
      // Load canonical profile
      const profile = await prisma.careerProfile.findUnique({
        where: { userId: dbUser.id },
        include: {
          basics: true,
          skills: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          experiences: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          educations: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          projects: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
          certifications: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        }
      });

      if (!profile) {
        return NextResponse.json({ error: 'No career profile found. Complete onboarding first.' }, { status: 404 });
      }

      const groundedProfile: GroundedProfile = {
        basics: {
          name: profile.basics?.name,
          email: profile.basics?.email,
          phone: profile.basics?.phone,
          location: profile.basics?.location,
          linkedinUrl: profile.basics?.linkedinUrl,
          githubUrl: profile.basics?.githubUrl,
          portfolioUrl: profile.basics?.portfolioUrl,
          summary: profile.basics?.summary,
        },
        skills: profile.skills,
        experiences: profile.experiences,
        educations: profile.educations,
        projects: profile.projects,
        certifications: profile.certifications,
      };

      content = buildResumeFromProfile(groundedProfile);
    } else {
      // Blank resume — minimal scaffold
      content = {
        templateId: 'clean',
        font: 'Inter',
        fontSize: 10,
        lineSpacing: 1.4,
        margins: { top: 20, bottom: 20, left: 20, right: 20 },
        sections: [
          { type: 'contact', visible: true, data: { name: dbUser.name ?? 'Your Name', email: authUser.email! } },
          { type: 'summary', visible: true, data: { text: '' } },
          { type: 'experience', visible: true, data: { items: [] } },
          { type: 'education', visible: true, data: { items: [] } },
          { type: 'skills', visible: true, data: { groups: [{ category: 'Technical Skills', skills: [] }] } },
          { type: 'projects', visible: true, data: { items: [] } },
        ]
      };
    }

    const resume = await prisma.resume.create({
      data: {
        userId: dbUser.id,
        title: title ?? (mode === 'FROM_PROFILE' ? 'Resume from Profile' : 'New Resume'),
        templateId: 'clean',
        content,
      }
    });

    // Persist initial version
    await prisma.resumeVersion.create({
      data: {
        resumeId: resume.id,
        versionNumber: 1,
        title: 'Initial version',
        content,
        changeNote: mode === 'FROM_PROFILE' ? 'Generated from Master Career Profile' : 'Created from scratch',
      }
    });

    return NextResponse.json({ resumeId: resume.id });
  } catch (e) {
    console.error('[POST /api/resumes]', e);
    return NextResponse.json({ error: 'Failed to create resume' }, { status: 500 });
  }
}
