import { GroundedProfile } from './EvidenceGroundingEngine';
import type { ResumeContent } from '@/lib/ai/resume-schema';
import { simulateParser, atsRules } from '@/lib/ats/analyzer';
import { runEvaluation } from '@/lib/evaluation/engine';

export class ATSIntelligenceEngine {
  static async analyze(resumeContent: ResumeContent, profile: GroundedProfile | null, jobTarget: any | null) {
    // We reuse the deterministic rules from the existing ATS analyzer.
    // However, we MUST strip out the SEMANTIC (AI-based) rules so it doesn't crash in Native mode.
    const deterministicRules = atsRules.filter(r => r.type === 'DETERMINISTIC');
    
    // Add a native keyword matching rule if job target is present
    if (jobTarget) {
      deterministicRules.push({
        id: 'NativeJobAlignment',
        type: 'DETERMINISTIC',
        category: 'Keyword & Relevance',
        evaluate: ({ subject }: any) => {
          const findings = [];
          const rawText = simulateParser(subject.resume).rawText.toLowerCase();
          const required = subject.jobTarget.extractedSkills?.required || [];
          
          for (const skill of required) {
            if (!rawText.includes(skill.toLowerCase())) {
              findings.push({
                ruleId: 'NativeJobAlignment',
                type: 'MissingKeyword',
                severity: 'HIGH' as const,
                message: `Missing required keyword: "${skill}"`,
                recommendedFix: `Add "${skill}" to your resume to pass ATS filters.`,
                aiFixable: false,
                scoreImpact: -5,
              });
            }
          }
          return findings;
        }
      });
    }

    const simulation = simulateParser(resumeContent);
    const safeProfile = profile || { basics: {}, skills: [], experiences: [], educations: [], projects: [], certifications: [] };
    const result = await runEvaluation(deterministicRules, { 
      subject: { resume: resumeContent, profile: safeProfile, jobTarget } 
    });
    
    return {
      ...result,
      parserSimulation: simulation
    };
  }
}
