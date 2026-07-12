/**
 * Resume Intelligence Engine
 * Handles: profile → resume generation, tailoring, truth-guard validation
 * All operations are grounded against verified Master Career Profile facts.
 */
import { TailoringResultSchema, ResumeContentSchema, type ResumeContent, type TailoringChange } from '@/lib/ai/resume-schema';


// ─── Types for grounded profile context ─────────────────────────────────────

export interface GroundedSkill { id: string; name: string; category?: string | null; proficiency?: string | null; }
export interface GroundedExperience { id: string; role: string; company: string; duration?: string | null; description?: string | null; highlights?: unknown; }
export interface GroundedEducation { id: string; degree: string; institution: string; year?: string | null; gpa?: string | null; field?: string | null; }
export interface GroundedProject { id: string; name: string; description?: string | null; techStack?: unknown; url?: string | null; }
export interface GroundedCertification { id: string; name: string; issuer?: string | null; year?: string | null; }
export interface GroundedBasics { name?: string | null; email?: string | null; phone?: string | null; location?: string | null; linkedinUrl?: string | null; githubUrl?: string | null; portfolioUrl?: string | null; summary?: string | null; }

export interface GroundedProfile {
  basics: GroundedBasics;
  skills: GroundedSkill[];
  experiences: GroundedExperience[];
  educations: GroundedEducation[];
  projects: GroundedProject[];
  certifications: GroundedCertification[];
}

// ─── Fetch Grounded Profile from Database ───────────────────────────────────

import { prisma } from '@/lib/prisma';

export async function getGroundedProfile(userId: string): Promise<GroundedProfile> {
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

  if (!profile) {
    return {
      basics: {}, skills: [], experiences: [], educations: [], projects: [], certifications: []
    };
  }

  return {
    basics: profile.basics ?? {},
    skills: profile.skills,
    experiences: profile.experiences,
    educations: profile.educations,
    projects: profile.projects,
    certifications: profile.certifications,
  };
}

// ─── Generate resume content from Master Career Profile ─────────────────────

export function buildResumeFromProfile(profile: GroundedProfile): ResumeContent {
  const b = profile.basics;

  // Group skills by category
  const skillMap: Record<string, string[]> = {};
  for (const s of profile.skills) {
    const cat = s.category ?? 'General';
    if (!skillMap[cat]) skillMap[cat] = [];
    skillMap[cat].push(s.name);
  }

  const sections: ResumeContent['sections'] = [];

  // Contact
  sections.push({
    type: 'contact',
    visible: true,
    data: {
      name: b.name ?? 'Your Name',
      email: b.email ?? '',
      phone: b.phone ?? undefined,
      location: b.location ?? undefined,
      linkedinUrl: b.linkedinUrl ?? undefined,
      githubUrl: b.githubUrl ?? undefined,
      portfolioUrl: b.portfolioUrl ?? undefined,
    }
  });

  // Summary
  if (b.summary) {
    sections.push({ type: 'summary', visible: true, data: { text: b.summary } });
  }

  // Experience
  if (profile.experiences.length > 0) {
    sections.push({
      type: 'experience',
      visible: true,
      data: {
        items: profile.experiences.map(e => ({
          id: e.id,
          role: e.role,
          company: e.company,
          duration: e.duration ?? undefined,
          bullets: Array.isArray(e.highlights) ? (e.highlights as string[]) : e.description ? [e.description] : [],
          sourceFactId: e.id,
        }))
      }
    });
  }

  // Education
  if (profile.educations.length > 0) {
    sections.push({
      type: 'education',
      visible: true,
      data: {
        items: profile.educations.map(ed => ({
          id: ed.id,
          degree: ed.degree,
          institution: ed.institution,
          year: ed.year ?? undefined,
          gpa: ed.gpa ?? undefined,
          field: ed.field ?? undefined,
          sourceFactId: ed.id,
        }))
      }
    });
  }

  // Skills
  if (Object.keys(skillMap).length > 0) {
    sections.push({
      type: 'skills',
      visible: true,
      data: { groups: Object.entries(skillMap).map(([category, skills]) => ({ category, skills })) }
    });
  }

  // Projects
  if (profile.projects.length > 0) {
    sections.push({
      type: 'projects',
      visible: true,
      data: {
        items: profile.projects.map(p => ({
          id: p.id,
          name: p.name,
          description: p.description ?? '',
          techStack: Array.isArray(p.techStack) ? (p.techStack as string[]) : [],
          url: p.url ?? undefined,
          bullets: [],
          sourceFactId: p.id,
        }))
      }
    });
  }

  // Certifications
  if (profile.certifications.length > 0) {
    sections.push({
      type: 'certifications',
      visible: true,
      data: {
        items: profile.certifications.map(c => ({
          id: c.id,
          name: c.name,
          issuer: c.issuer ?? undefined,
          year: c.year ?? undefined,
          sourceFactId: c.id,
        }))
      }
    });
  }

  return {
    templateId: 'clean',
    font: 'Inter',
    fontSize: 10,
    lineSpacing: 1.4,
    margins: { top: 20, bottom: 20, left: 20, right: 20 },
    sections,
  };
}

// ─── AI Job-Specific Tailoring with Truth Guard ──────────────────────────────

export type TailoringMode = 'CONSERVATIVE' | 'BALANCED' | 'AGGRESSIVE';

export async function tailorResumeToJob(params: {
  resumeContent: ResumeContent;
  jobRequirements: {
    jobTitle: string;
    company: string;
    requiredSkills: string[];
    preferredSkills: string[];
    keywords: string[];
    responsibilities: string[];
  };
  groundedProfile: GroundedProfile; // canonical fact IDs for grounding
  mode: TailoringMode;
}) {
  const { resumeContent, jobRequirements, groundedProfile, mode } = params;

  const modeInstructions = {
    CONSERVATIVE: 'Make minimal changes. Only improve wording and keyword alignment without restructuring.',
    BALANCED: 'Reorder sections and bullets to prioritize relevant experience. Improve wording significantly.',
    AGGRESSIVE: 'Restructure aggressively. Reorder all sections, rewrite bullets for maximum relevance. Still, never add skills not in the profile.',
  };

  // Build a minimal, fact-indexed context (do NOT send entire DB)
  const profileFactIndex = {
    verifiedSkills: groundedProfile.skills.map(s => ({ id: s.id, name: s.name })),
    verifiedExperience: groundedProfile.experiences.map(e => ({ id: e.id, role: e.role, company: e.company })),
    verifiedProjects: groundedProfile.projects.map(p => ({ id: p.id, name: p.name })),
    verifiedCertifications: groundedProfile.certifications.map(c => ({ id: c.id, name: c.name })),
  };

  // Native Tailoring Rule Engine
  const changes: TailoringChange[] = [];
  const rejectedRequirements: string[] = [];

  // 1. Check required skills
  for (const reqSkill of jobRequirements.requiredSkills) {
    const hasSkill = groundedProfile.skills.some(s => s.name.toLowerCase() === reqSkill.toLowerCase());
    if (!hasSkill) {
      rejectedRequirements.push(reqSkill);
    }
  }

  // 2. Simple bullet re-ordering based on keywords
  const keywords = jobRequirements.keywords.map(k => k.toLowerCase());
  for (const section of resumeContent.sections) {
    if (section.type === 'experience') {
      const data = (section as any).data;
      if (data && data.items) {
        for (const item of data.items) {
          if (item.bullets) {
            // Find bullets with matching keywords
            item.bullets.forEach((bullet: string, idx: number) => {
              const lowerBullet = bullet.toLowerCase();
              if (keywords.some(k => lowerBullet.includes(k))) {
                changes.push({
                  sectionType: 'experience',
                  itemId: item.id,
                  field: `bullets[${idx}]`,
                  original: bullet,
                  proposed: `${bullet} (Highlighted for ${jobRequirements.company})`,
                  reason: 'Matches target job keywords.',
                  sourceFactId: item.sourceFactId,
                  isFabricated: false,
                });
              }
            });
          }
        }
      }
    }
  }

  const tailoring = { changes, rejectedRequirements };

  // ── Truth Guard Pass ──────────────────────────────────────────────────────
  // Post-process: flag any proposed skill insertions not in verified profile
  const verifiedSkillNames = new Set(groundedProfile.skills.map(s => s.name.toLowerCase()));
  const guardedChanges: TailoringChange[] = tailoring.changes.map(change => {
    // If a change proposes adding a new skill keyword to a skills section
    if (change.sectionType === 'skills' && change.field === 'skills') {
      const proposed = change.proposed.toLowerCase();
      // Check if every proposed skill exists in the verified profile
      const proposedSkills = proposed.split(/,|\n/).map(s => s.trim()).filter(Boolean);
      const hasUnverified = proposedSkills.some(s => !verifiedSkillNames.has(s));
      if (hasUnverified) {
        return { ...change, isFabricated: true };
      }
    }
    return change;
  });

  const fabricatedCount = guardedChanges.filter(c => c.isFabricated).length;
  if (fabricatedCount > 0) {
    console.warn(`[Truth Guard] Caught ${fabricatedCount} potentially fabricated changes. These will be flagged for user review.`);
  }

  return { ...tailoring, changes: guardedChanges };
}

// ─── Apply accepted changes to resume content ─────────────────────────────────

export function applyTailoringChange(content: ResumeContent, change: TailoringChange): ResumeContent {
  // Deep clone
  const next: ResumeContent = JSON.parse(JSON.stringify(content));

  for (const section of next.sections) {
    if (section.type !== change.sectionType) continue;

    if (section.type === 'summary' && change.field === 'text') {
      (section as any).data.text = change.proposed;
    }

    if (section.type === 'experience' && change.itemId) {
      const item = (section as any).data.items.find((i: any) => i.id === change.itemId);
      if (item && change.field.startsWith('bullets[')) {
        const idx = parseInt(change.field.replace('bullets[', '').replace(']', ''));
        if (!isNaN(idx)) item.bullets[idx] = change.proposed;
      } else if (item) {
        item[change.field] = change.proposed;
      }
    }

    if (section.type === 'skills' && change.field === 'groups') {
      // Replace groups with parsed proposed
      try {
        (section as any).data.groups = JSON.parse(change.proposed);
      } catch { /* leave as is */ }
    }
  }

  return next;
}
