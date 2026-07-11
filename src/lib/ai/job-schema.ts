import { z } from 'zod';

// ─── Job Description Extraction Schema ─────────────────────────────────────

export const JobRequirementSchema = z.object({
  jobTitle: z.string().describe('The exact job title'),
  company: z.string().describe('Company name, or "UNKNOWN" if not found'),
  department: z.string().optional().describe('Department e.g. Engineering, Finance, Civil'),
  industry: z.string().optional().describe('Industry vertical e.g. FinTech, Manufacturing'),
  seniority: z.string().optional().describe('Entry | Mid | Senior | Lead | Manager | Director'),
  responsibilities: z.array(z.string()).describe('Key responsibilities listed'),
  requiredSkills: z.array(z.string()).describe('Hard skills explicitly required'),
  preferredSkills: z.array(z.string()).describe('Nice-to-have or bonus skills'),
  requiredTools: z.array(z.string()).describe('Specific tools, software, or platforms required'),
  keywords: z.array(z.string()).describe('Top ATS keywords from the description'),
  experienceYears: z.number().nullable().describe('Minimum years required, null if not stated'),
  educationRequirements: z.array(z.string()).describe('Degree or certification requirements'),
});

// ─── Match Analysis Schema ──────────────────────────────────────────────────

export const MatchedSkillSchema = z.object({
  skill: z.string(),
  evidenceFactId: z.string().describe('ID of the fact from the Master Profile proving this'),
  evidenceType: z.string().describe('skill | experience | project | certification'),
  explanation: z.string().describe('How the profile satisfies this requirement'),
  matchStrength: z.enum(['STRONG', 'PARTIAL']).describe('STRONG = direct match; PARTIAL = adjacent or transferable'),
});

export const MissingSkillSchema = z.object({
  skill: z.string(),
  criticality: z.enum(['HIGH', 'MEDIUM', 'LOW']),
  improvementPlan: z.string().describe('Actionable advice to bridge this gap'),
});

export const MatchAnalysisSchema = z.object({
  overallScore: z.number().min(0).max(100).describe('Match score 0-100'),
  matchedSkills: z.array(MatchedSkillSchema),
  missingSkills: z.array(MissingSkillSchema),
  resumeRecommendations: z.array(z.string()).describe('Specific resume improvements to improve match'),
  interviewRecommendations: z.array(z.string()).describe('Topics the candidate should prepare for this role'),
});

export type JobRequirement = z.infer<typeof JobRequirementSchema>;
export type MatchAnalysis = z.infer<typeof MatchAnalysisSchema>;
