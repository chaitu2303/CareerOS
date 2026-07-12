import { GroundedProfile } from './EvidenceGroundingEngine';

export class JobIntelligenceEngine {
  static analyze(jobDescription: string, profile: GroundedProfile | null) {
    const text = jobDescription.toLowerCase();

    // A slightly broader local dictionary
    const techDictionary = [
      'javascript', 'typescript', 'react', 'next.js', 'node.js', 'python',
      'java', 'c++', 'c#', 'sql', 'postgresql', 'mysql', 'docker', 'kubernetes', 'aws',
      'gcp', 'azure', 'machine learning', 'ai', 'tailwind', 'prisma', 'mongodb',
      'redis', 'graphql', 'rest', 'agile', 'scrum', 'ci/cd', 'git', 'linux'
    ];

    const extractedRequiredSkills = [];
    const extractedPreferredSkills = [];

    // Simple heuristic: if the word "preferred" or "bonus" or "plus" is near a skill, it's preferred.
    // Otherwise required.
    for (const skill of techDictionary) {
      // Escape regex special chars and avoid \b if it's not a word char
      const escapedSkill = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // For skills like c++, \b doesn't work well at the end because + is not a word character.
      // We will just pad it with a non-word boundary check or use a simpler match.
      const isAlphaNum = /^\w+$/.test(skill);
      // For non-alphanumeric trailing chars, we use a simpler boundary check
      const regex = new RegExp(isAlphaNum ? `\\b${escapedSkill}\\b` : `(?:^|\\W)${escapedSkill}(?:\\W|$)`, 'i');
      const match = regex.exec(text);
      if (match) {
        // Look at the text 50 chars before the match
        const contextBefore = text.substring(Math.max(0, match.index - 50), match.index);
        if (contextBefore.includes('prefer') || contextBefore.includes('bonus') || contextBefore.includes('plus')) {
          extractedPreferredSkills.push(skill);
        } else {
          extractedRequiredSkills.push(skill);
        }
      }
    }

    // Determine Job Title from first line
    const lines = jobDescription.split('\n').map(l => l.trim()).filter(l => l.length > 0);
    const inferredRoleTitle = lines.length > 0 ? lines[0] : 'Unknown Role';
    const inferredCompany = lines.length > 1 ? lines[1] : 'Unknown Company';

    return {
      roleTitle: inferredRoleTitle,
      company: inferredCompany,
      extractedSkills: {
        required: extractedRequiredSkills,
        preferred: extractedPreferredSkills,
        tools: []
      },
      extractedReqs: {
        experience: text.includes('senior') ? 5 : text.includes('junior') ? 1 : 3,
        education: text.includes('master') ? ['Master\'s Degree'] : ['Bachelor\'s Degree'],
        responsibilities: []
      },
      keywords: [...extractedRequiredSkills, ...extractedPreferredSkills],
      matchAnalysis: this.calculateMatch(extractedRequiredSkills, extractedPreferredSkills, profile)
    };
  }

  private static calculateMatch(required: string[], preferred: string[], profile: GroundedProfile | null) {
    if (!profile) {
      return {
        overallScore: 0,
        skillMatchScore: 0,
        experienceMatchScore: 0,
        missingSkills: required,
        matchingSkills: [],
        recommendations: ['Complete your profile to see match scores.']
      };
    }

    const profileSkills = new Set(profile.skills.map(s => (s.name || '').toLowerCase()));
    
    let matchCount = 0;
    const matchingSkills = [];
    const missingSkills = [];

    for (const req of required) {
      if (profileSkills.has(req.toLowerCase())) {
        matchCount++;
        matchingSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    const skillScore = required.length > 0 ? Math.round((matchCount / required.length) * 100) : 100;
    const overallScore = skillScore; // Simplified for native engine

    const recommendations = [];
    if (missingSkills.length > 0) {
      recommendations.push(`You are missing ${missingSkills.length} required skills. Consider adding them if you have experience.`);
    }

    return {
      overallScore,
      skillMatchScore: skillScore,
      experienceMatchScore: 100, // Hardcoded for baseline
      missingSkills,
      matchingSkills,
      recommendations
    };
  }
}
