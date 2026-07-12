import { GroundedProfile } from './EvidenceGroundingEngine';

export class InterviewQuestionEngine {
  static generateQuestions(profile: GroundedProfile | null, targetRole: string, difficulty: string) {
    const questions = [];

    // Base behavioral questions
    questions.push({
      text: "Tell me about a time you had to learn a new technology quickly.",
      competency: "Adaptability",
      expectedKeywords: ["documentation", "hands-on", "team", "delivery"]
    });

    questions.push({
      text: "Describe a situation where you disagreed with a team member. How did you resolve it?",
      competency: "Conflict Resolution",
      expectedKeywords: ["communication", "compromise", "perspective", "solution"]
    });

    // Role specific
    if (targetRole.toLowerCase().includes('engineer') || targetRole.toLowerCase().includes('developer')) {
      questions.push({
        text: "How do you ensure your code is scalable and maintainable?",
        competency: "System Design",
        expectedKeywords: ["patterns", "testing", "modularity", "reviews", "clean code"]
      });
    }

    // Profile specific
    if (profile && profile.skills.length > 0) {
      const topSkill = profile.skills[0].name;
      questions.push({
        text: `I see you have experience with ${topSkill}. Can you describe a complex problem you solved using it?`,
        competency: "Technical Depth",
        expectedKeywords: ["architecture", "performance", "optimization"]
      });
    }

    return questions;
  }
}
