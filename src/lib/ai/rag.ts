/**
 * RAG Context Builder
 * Securely retrieves and injects user-specific context into AI prompts.
 */

export interface CareerContext {
  userId: string;
  verifiedFacts: string[];
  jobTarget?: string;
  careerRole?: string;
  skills: string[];
}

export async function buildContext(userId: string): Promise<CareerContext> {
  // In a real implementation, this would query the Prisma DB for the master profile.
  // For the AI Gateway implementation, we'll return the structural interface.
  return {
    userId,
    verifiedFacts: [
      "User has 5 years of software engineering experience.",
      "Primary language is TypeScript."
    ],
    jobTarget: "Senior Frontend Engineer",
    careerRole: "Software Engineer",
    skills: ["TypeScript", "React", "Next.js", "Node.js"]
  };
}

export function formatContextForPrompt(context: CareerContext): string {
  return `
[CAREEROS VERIFIED CONTEXT]
Role: ${context.careerRole || 'Not specified'}
Target: ${context.jobTarget || 'Not specified'}
Verified Facts:
${context.verifiedFacts.map(f => `- ${f}`).join('\n')}
Skills: ${context.skills.join(', ')}
  `.trim();
}
