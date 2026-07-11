import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { analyzeResume } from '@/lib/ats/analyzer';
import { getGroundedProfile } from '@/lib/resume/engine';
import { ResumeContentSchema } from '@/lib/ai/resume-schema';
import type { Prisma } from '@prisma/client';

export const dynamic = 'force-dynamic';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id: resumeId, versionId } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
    if (!dbUser) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    // Validate ownership
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: dbUser.id } });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    const version = await prisma.resumeVersion.findFirst({ where: { id: versionId, resumeId } });
    if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 });

    const body = await req.json().catch(() => ({}));
    const jobId = body.jobId as string | undefined;

    let jobTarget = null;
    if (jobId) {
      const job = await prisma.jobTarget.findFirst({ where: { id: jobId, userId: dbUser.id } });
      if (job) {
        jobTarget = {
          roleTitle: job.roleTitle,
          company: job.company,
          extractedSkills: (job.extractedSkills as string[]) || [],
          extractedReqs: (job.extractedReqs as string[]) || [],
          keywords: (job.keywords as string[]) || []
        };
      }
    }

    const content = ResumeContentSchema.parse(version.content);
    const profile = await getGroundedProfile(dbUser.id);

    const result = await analyzeResume({
      resume: content,
      profile,
      jobTarget
    });

    const report = await prisma.atsReport.create({
      data: {
        resumeId,
        resumeVersionId: versionId,
        jobId: jobId || null,
        overallScore: result.overallScore,
        breakdown: result.breakdown as unknown as Prisma.InputJsonValue,
        findings: result.findings as unknown as Prisma.InputJsonValue,
        parserSimulation: result.parserSimulation as unknown as Prisma.InputJsonValue,
      }
    });

    return NextResponse.json({ report });
  } catch (e) {
    console.error('[POST /api/resumes/[id]/versions/[versionId]/ats]', e);
    return NextResponse.json({ error: 'Failed to analyze resume' }, { status: 500 });
  }
}
