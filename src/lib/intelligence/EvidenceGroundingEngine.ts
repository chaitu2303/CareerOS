import { prisma } from '@/lib/prisma';
import type { Prisma } from '@prisma/client';

export interface GroundedProfile {
  basics: {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    location?: string | null;
    linkedinUrl?: string | null;
    githubUrl?: string | null;
    portfolioUrl?: string | null;
    summary?: string | null;
  };
  skills: any[];
  experiences: any[];
  educations: any[];
  projects: any[];
  certifications: any[];
}

/**
 * The core foundation of the Native Intelligence Engine.
 * Fetches and filters only verified user evidence (USER_CONFIRMED, USER_CREATED).
 * No AI models are allowed to hallucinate past this grounding context.
 */
export class EvidenceGroundingEngine {
  static async getGroundedProfile(userId: string): Promise<GroundedProfile | null> {
    const profile = await prisma.careerProfile.findUnique({
      where: { userId },
      include: {
        basics: true,
        skills: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        experiences: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        educations: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        projects: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
        certifications: { where: { status: { in: ['USER_CONFIRMED', 'USER_CREATED'] } } },
      }
    });

    if (!profile) return null;

    return {
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
  }
}
