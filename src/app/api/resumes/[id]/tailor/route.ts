/**
 * POST /api/resumes/[id]/tailor
 * Job-specific AI tailoring with Truth Guard validation
 * Body: { jobId, mode: 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE' }
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { tailorResumeToJob } from '@/lib/resume/engine';
import type { TailoringMode, GroundedProfile } from '@/lib/resume/engine';
import type { ResumeContent } from '@/lib/ai/resume-schema';
import { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resumeId } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
    if (!dbUser) return NextResponse.json({ error: 'Profile not found' }, { status: 404 });

    const body = await req.json();
    const { jobId, mode = 'BALANCED' } = body as { jobId: string; mode: TailoringMode };

    // ── Load the resume (verify ownership) ─────────────────────────────────
    const resume = await prisma.resume.findFirst({
      where: { id: resumeId, userId: dbUser.id }
    });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    // ── Load the job + its extracted requirements ───────────────────────────
    const job = await prisma.jobTarget.findFirst({
      where: { id: jobId, userId: dbUser.id },
      include: { matchAnalysis: true }
    });
    if (!job) return NextResponse.json({ error: 'Job target not found' }, { status: 404 });

    const extractedSkills = job.extractedSkills as { required?: string[]; preferred?: string[]; tools?: string[] } | null;
    const extractedReqs = job.extractedReqs as { experience?: number; education?: string[]; responsibilities?: string[] } | null;

    const jobRequirements = {
      jobTitle: job.roleTitle,
      company: job.company,
      requiredSkills: extractedSkills?.required ?? [],
      preferredSkills: extractedSkills?.preferred ?? [],
      keywords: Array.isArray(job.keywords) ? (job.keywords as string[]) : [],
      responsibilities: extractedReqs?.responsibilities ?? [],
    };

    // ── Load ONLY verified profile facts ────────────────────────────────────
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

    if (!profile) return NextResponse.json({ error: 'Career profile not found' }, { status: 404 });

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

    // ── Run AI Tailoring + Truth Guard ──────────────────────────────────────
    const tailoringResult = await tailorResumeToJob({
      resumeContent: resume.content as unknown as ResumeContent,
      jobRequirements,
      groundedProfile,
      mode,
    });

    // ── Persist as a new Resume Version (never overwrite original) ──────────
    const lastVersion = await prisma.resumeVersion.findFirst({
      where: { resumeId },
      orderBy: { versionNumber: 'desc' }
    });

    const newVersion = await prisma.resumeVersion.create({
      data: {
        resumeId,
        versionNumber: (lastVersion?.versionNumber ?? 0) + 1,
        title: `Tailored for ${job.roleTitle} @ ${job.company} (${mode})`,
        content: resume.content as Prisma.InputJsonValue,
        changeNote: `AI tailoring: ${mode} mode`,
        tailoredForJob: jobId,
      }
    });

    return NextResponse.json({
      versionId: newVersion.id,
      tailoringResult,
      jobTitle: job.roleTitle,
      company: job.company,
    });

  } catch (e) {
    console.error('[POST /api/resumes/[id]/tailor]', e);
    return NextResponse.json({ error: 'Tailoring failed' }, { status: 500 });
  }
}
