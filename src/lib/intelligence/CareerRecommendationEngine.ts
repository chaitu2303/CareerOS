import { GroundedProfile } from './EvidenceGroundingEngine';

export class CareerRecommendationEngine {
  static generateRecommendations(profile: GroundedProfile | null, jobTargets: any[]) {
    const recommendations = [];

    if (!profile) {
      recommendations.push({
        type: 'PROFILE_COMPLETION',
        title: 'Complete Your Master Profile',
        description: 'Your profile lacks verified evidence. Add experiences and skills.',
        actionTarget: '/dashboard/profile'
      });
      return recommendations;
    }

    if (jobTargets.length === 0) {
      recommendations.push({
        type: 'TARGET_ROLE',
        title: 'Define Your Target Role',
        description: 'You haven\'t analyzed any job descriptions. Upload a JD to get started.',
        actionTarget: '/dashboard/jobs/new'
      });
    } else {
      // Analyze the most recent job target
      const recentJob = jobTargets[0];
      const extractedRequired = recentJob.extractedSkills || [];
      const profileSkills = new Set(profile.skills.map(s => (s.name || '').toLowerCase()));
      
      const missingSkills = extractedRequired.filter((s: string) => !profileSkills.has(s.toLowerCase()));

      if (missingSkills.length > 0) {
        recommendations.push({
          type: 'SKILL_GAP',
          title: `Learn ${missingSkills[0]}`,
          description: `This is required for your target role: ${recentJob.roleTitle}.`,
          actionTarget: '/dashboard/learn'
        });
      }

      recommendations.push({
        type: 'TAILOR_RESUME',
        title: 'Tailor Your Resume',
        description: `Create a customized resume for ${recentJob.company}.`,
        actionTarget: `/dashboard/resumes/new?jobId=${recentJob.id}`
      });
    }

    return recommendations;
  }
}
