import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';
import { extractEntities } from '@/lib/ai/gateway';
import { JobRequirementSchema, MatchAnalysisSchema } from '@/lib/ai/job-schema';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    // ── Auth Guard ──────────────────────────────────────────────────────────
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Ensure a User record exists in our DB (created on first use)
    let dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: { id: authUser.id, email: authUser.email!, name: authUser.user_metadata?.full_name }
      });
    }

    const { text, sourceType = 'TEXT' } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: 'Job description text is required' }, { status: 400 });
    }

    // ── Stage 1: Extract structured requirements from raw JD ────────────────
    const jobData = await extractEntities(
      `Extract the following job requirements from this job description:\n\n${text}`,
      JobRequirementSchema,
      {
        systemPrompt: 'You are an expert HR analyst. Extract only information explicitly stated in the job description. Never infer or fabricate.',
      }
    );

    // ── Stage 2: Persist the JobTarget ─────────────────────────────────────
    const jobTarget = await prisma.jobTarget.create({
      data: {
        userId: dbUser.id,
        company: jobData.company,
        roleTitle: jobData.jobTitle,
        department: jobData.department,
        industry: jobData.industry,
        seniority: jobData.seniority,
        jobDescription: text,
        sourceType,
        extractedSkills: {
          required: jobData.requiredSkills,
          preferred: jobData.preferredSkills,
          tools: jobData.requiredTools,
        },
        extractedReqs: {
          experience: jobData.experienceYears,
          education: jobData.educationRequirements,
          responsibilities: jobData.responsibilities,
        },
        keywords: jobData.keywords,
      }
    });

    // ── Stage 3: Load the canonical Master Career Profile ──────────────────
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

    // ── Stage 4: AI Gap Analysis ────────────────────────────────────────────
    // Build a fact-indexed profile context (evidence IDs for grounding)
    const profileContext = {
      skills: profile?.skills.map(s => ({ id: s.id, name: s.name, category: s.category })) ?? [],
      experience: profile?.experiences.map(e => ({ id: e.id, role: e.role, company: e.company, description: e.description })) ?? [],
      education: profile?.educations.map(e => ({ id: e.id, degree: e.degree, institution: e.institution })) ?? [],
      projects: profile?.projects.map(p => ({ id: p.id, name: p.name, description: p.description, techStack: p.techStack })) ?? [],
      certifications: profile?.certifications.map(c => ({ id: c.id, name: c.name, issuer: c.issuer })) ?? [],
    };

    const hasProfile = Object.values(profileContext).some(arr => arr.length > 0);

    let matchAnalysis;
    if (hasProfile) {
      matchAnalysis = await extractEntities(
        `You are an expert Career Coach performing an ATS compatibility and gap analysis.

JOB REQUIREMENTS:
${JSON.stringify({ ...jobData }, null, 2)}

CANDIDATE VERIFIED PROFILE (use fact IDs as evidence references):
${JSON.stringify(profileContext, null, 2)}

Perform a comprehensive gap analysis:
1. For matched skills, reference the EXACT fact ID (e.g., skill.id, experience.id) as evidenceFactId.
2. For missing skills, clearly classify criticality.
3. Recommend resume improvements and interview prep topics.
4. Never claim the candidate has skills not present in their profile.
5. PARTIAL matches are valid for adjacent/transferable skills.`,
        MatchAnalysisSchema,
        {
          systemPrompt: 'You are a career intelligence system. Only reference facts that exist in the candidate profile. Never fabricate.',
        }
      );
    } else {
      // No profile yet — return a basic job analysis only
      matchAnalysis = {
        overallScore: 0,
        matchedSkills: [],
        missingSkills: (jobData.requiredSkills ?? []).map((skill: string) => ({
          skill,
          criticality: 'HIGH' as const,
          improvementPlan: 'Complete your Master Career Profile to see gap analysis.',
        })),
        resumeRecommendations: ['Complete your Master Career Profile first.'],
        interviewRecommendations: [],
      };
    }

    // ── Stage 5: Persist Match Analysis ────────────────────────────────────
    await prisma.jobMatchAnalysis.create({
      data: {
        jobId: jobTarget.id,
        overallScore: matchAnalysis.overallScore,
        matchedSkills: matchAnalysis.matchedSkills,
        partialMatches: matchAnalysis.matchedSkills.filter((m: { matchStrength?: string }) => m.matchStrength === 'PARTIAL'),
        missingSkills: matchAnalysis.missingSkills,
        resumeRecommendations: matchAnalysis.resumeRecommendations,
        interviewRecommendations: matchAnalysis.interviewRecommendations,
        status: 'COMPLETED',
      }
    });

    return NextResponse.json({ jobId: jobTarget.id });

  } catch (error) {
    console.error('[Job Analyze Error]:', error);
    return NextResponse.json({ error: 'Failed to analyze job description' }, { status: 500 });
  }
}
