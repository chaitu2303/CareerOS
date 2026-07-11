import { EvaluationRule, runEvaluation, EvaluationFinding } from '@/lib/evaluation/engine';
import type { ResumeContent } from '@/lib/ai/resume-schema';
import type { GroundedProfile } from '@/lib/resume/engine';

export interface AtsAnalysisContext {
  resume: ResumeContent;
  profile: GroundedProfile;
  jobTarget?: {
    roleTitle: string;
    company: string;
    extractedSkills: string[];
    extractedReqs: string[];
    keywords: string[];
  } | null;
}

/**
 * Simulates how an ATS parser reads the JSON resume, extracting sections linearly.
 */
export function simulateParser(resume: ResumeContent) {
  const extractedSections: string[] = [];
  const rawTextLines: string[] = [];
  
  const contactSection = resume.sections.find(s => s.type === 'contact' && s.visible);
  if (contactSection) {
    const data = contactSection.data as any;
    extractedSections.push('Contact Details');
    if (data.name) rawTextLines.push(data.name);
    if (data.email) rawTextLines.push(data.email);
    if (data.phone) rawTextLines.push(data.phone);
  }

  // Follow the section ordering in the resume
  for (const section of resume.sections) {
    if (!section.visible) continue;
    
    extractedSections.push(section.type.toUpperCase());
    
    if (section.type === 'summary' && section.data.text) {
      rawTextLines.push(section.data.text);
    }
    
    if (section.type === 'experience' && (section.data as any).items) {
      for (const item of (section.data as any).items) {
        if (item.role) rawTextLines.push(item.role);
        if (item.company) rawTextLines.push(item.company);
        if (item.bullets) rawTextLines.push(item.bullets.join('\n'));
      }
    }
    
    if (section.type === 'skills' && (section.data as any).groups) {
      for (const group of (section.data as any).groups) {
        if (group.skills) rawTextLines.push(group.skills.join(', '));
      }
    }
    
    if (section.type === 'education' && (section.data as any).items) {
      for (const item of (section.data as any).items) {
        if (item.degree) rawTextLines.push(item.degree);
        if (item.institution) rawTextLines.push(item.institution);
      }
    }
    
    if (section.type === 'projects' && (section.data as any).items) {
      for (const item of (section.data as any).items) {
        if (item.name) rawTextLines.push(item.name);
        if (item.description) rawTextLines.push(item.description);
        if (item.bullets) rawTextLines.push(item.bullets.join('\n'));
      }
    }
  }

  return {
    parsedOrder: extractedSections,
    rawText: rawTextLines.join('\n')
  };
}

// ─── ATS RULES ─────────────────────────────────────────────────────────────

const HasContactInfoRule: EvaluationRule<AtsAnalysisContext> = {
  id: 'HasContactInfo',
  type: 'DETERMINISTIC',
  category: 'Structure & Safety',
  evaluate: ({ subject }) => {
    const findings: EvaluationFinding[] = [];
    const contactSection = subject.resume.sections.find(s => s.type === 'contact' && s.visible);
    const b = contactSection ? (contactSection.data as any) : null;
    if (!b?.email || !b?.phone) {
      findings.push({
        ruleId: 'HasContactInfo',
        type: 'MissingContactInfo',
        severity: 'CRITICAL',
        message: 'Missing essential contact information (Email or Phone).',
        evidence: 'Contact section is incomplete.',
        recommendedFix: 'Add email and phone number to your profile basics.',
        aiFixable: false,
        scoreImpact: -15,
      });
    }
    return findings;
  }
};

const MissingStandardSectionsRule: EvaluationRule<AtsAnalysisContext> = {
  id: 'MissingStandardSections',
  type: 'DETERMINISTIC',
  category: 'Structure & Safety',
  evaluate: ({ subject }) => {
    const findings: EvaluationFinding[] = [];
    const types = subject.resume.sections.filter(s => s.visible).map(s => s.type);
    
    if (!types.includes('experience') && !types.includes('projects')) {
      findings.push({
        ruleId: 'MissingStandardSections',
        type: 'NoExperienceOrProjects',
        severity: 'CRITICAL',
        message: 'Resume lacks both Experience and Projects sections.',
        evidence: 'No active experience or projects found.',
        recommendedFix: 'Add at least one professional experience or major project.',
        aiFixable: false,
        scoreImpact: -20,
      });
    }
    
    if (!types.includes('education')) {
      findings.push({
        ruleId: 'MissingStandardSections',
        type: 'NoEducation',
        severity: 'HIGH',
        message: 'Resume lacks an Education section.',
        recommendedFix: 'Add your highest level of education.',
        aiFixable: false,
        scoreImpact: -10,
      });
    }

    if (!types.includes('skills')) {
      findings.push({
        ruleId: 'MissingStandardSections',
        type: 'NoSkills',
        severity: 'MEDIUM',
        message: 'Resume lacks a Skills section.',
        recommendedFix: 'Add a dedicated skills section for better ATS keyword matching.',
        aiFixable: false,
        scoreImpact: -5,
      });
    }

    return findings;
  }
};

const TruthGuardGroundingRule: EvaluationRule<AtsAnalysisContext> = {
  id: 'TruthGuardGrounding',
  type: 'DETERMINISTIC',
  category: 'Truth & Evidence',
  evaluate: ({ subject }) => {
    const findings: EvaluationFinding[] = [];
    const profileSkills = new Set(subject.profile.skills.map(s => s.name.toLowerCase()));
    
    const skillSection = subject.resume.sections.find(s => s.type === 'skills' && s.visible);
    if (skillSection && (skillSection.data as any).groups) {
      for (const group of (skillSection.data as any).groups) {
        if (!group.skills) continue;
        for (const skillName of group.skills) {
          if (!profileSkills.has(skillName.toLowerCase())) {
            findings.push({
              ruleId: 'TruthGuardGrounding',
              type: 'UnverifiedSkill',
              severity: 'HIGH',
              message: `Skill "${skillName}" is on your resume but not in your verified Career Profile.`,
              evidence: `Found "${skillName}" in resume skills.`,
              recommendedFix: 'Remove the skill or add it to your Master Career Profile with evidence.',
              aiFixable: true,
              scoreImpact: -5,
            });
          }
        }
      }
    }
    return findings;
  }
};

const SemanticContentQualityRule: EvaluationRule<AtsAnalysisContext> = {
  id: 'SemanticContentQuality',
  type: 'SEMANTIC',
  category: 'Content Quality',
  systemPrompt: `You are an expert ATS (Applicant Tracking System) intelligence engine. 
Analyze the resume content for vague bullets, weak action verbs, repeated words, and overall impact.
Do NOT fabricate issues. If the resume is good, return no findings.
Limit to at most 3 findings. Do not check keywords here.
If a bullet point is weak, suggest an impactful rewrite using the STAR method if possible, and set aiFixable=true.`,
  promptBuilder: ({ subject }) => `
RESUME TEXT:
${simulateParser(subject.resume).rawText}
`
};

const SemanticJobAlignmentRule: EvaluationRule<AtsAnalysisContext> = {
  id: 'SemanticJobAlignment',
  type: 'SEMANTIC',
  category: 'Keyword & Relevance',
  systemPrompt: `You are an expert ATS (Applicant Tracking System) matching engine.
Compare the resume text against the target job requirements.
Identify MISSING important hard skills or keywords from the job description.
If a missing skill is NOT in the user's verified profile, set aiFixable=false (do not fabricate).
If a skill IS in the user's profile but missing from the resume, set aiFixable=true.
Return findings for critical gaps.`,
  promptBuilder: ({ subject }) => {
    if (!subject.jobTarget) return `No job target provided. Return empty findings.`;
    
    return `
TARGET JOB:
Role: ${subject.jobTarget.roleTitle}
Company: ${subject.jobTarget.company}
Keywords: ${subject.jobTarget.keywords.join(', ')}

USER'S VERIFIED PROFILE SKILLS (Canonical Truth):
${subject.profile.skills.map(s => s.name).join(', ')}

RESUME TEXT:
${simulateParser(subject.resume).rawText}
    `;
  }
};

export const atsRules: EvaluationRule<AtsAnalysisContext>[] = [
  HasContactInfoRule,
  MissingStandardSectionsRule,
  TruthGuardGroundingRule,
  SemanticContentQualityRule,
  SemanticJobAlignmentRule
];

export async function analyzeResume(context: AtsAnalysisContext) {
  const simulation = simulateParser(context.resume);
  const rules = context.jobTarget ? atsRules : atsRules.filter(r => r.category !== 'Keyword & Relevance');
  
  const result = await runEvaluation(rules, { subject: context });
  
  return {
    ...result,
    parserSimulation: simulation
  };
}
