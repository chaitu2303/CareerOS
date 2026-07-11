import { prisma } from '@/lib/prisma';

export interface AgentDecision {
  nextAction: 'ASK_NEW' | 'FOLLOW_UP' | 'CHALLENGE' | 'TRANSITION' | 'END_INTERVIEW';
  competencyTarget?: string;
  questionText?: string;
  evaluation?: any;
}

export class InterviewOrchestrator {
  /**
   * Initializes a new interview session.
   */
  static async initializeSession(userId: string, params: any) {
    const { title, type, department, targetRole, difficulty, mode } = params;
    
    // We would normally fetch the DomainPack and CareerRole to build the initial plan.
    const plan = {
      stages: ['INTRO', 'TECHNICAL', 'BEHAVIORAL', 'CONCLUSION'],
      currentStage: 'INTRO',
      competenciesToCover: ['Problem Solving', 'Domain Knowledge'],
      maxQuestions: 10,
      questionsAsked: 0,
      targetDifficulty: difficulty
    };

    return await prisma.interviewSession.create({
      data: {
        userId,
        title,
        type,
        department,
        targetRole,
        difficulty,
        mode,
        status: 'IN_PROGRESS',
        interviewPlan: plan,
        competencyCoverage: {},
        conversationLog: []
      }
    });
  }

  /**
   * Processes a candidate's answer and orchestrates the multi-agent response.
   */
  static async processTurn(sessionId: string, candidateAnswer: string) {
    const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
    if (!session) throw new Error('Session not found');

    // 1. EVALUATOR AGENT (Privately evaluates the answer)
    // 2. FOLLOW-UP AGENT (Decides if deeper questioning is needed)
    // 3. ORCHESTRATOR (Checks time/plan limits)
    // 4. INTERVIEWER AGENT (Generates next professional question)

    // Check if an AI provider is available.
    const aiProviderAvailable = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY;
    if (!aiProviderAvailable) {
      // In compliance with M10 boundary: "Do not fake a successful AI interview if no functioning model provider is available."
      throw new Error('AI_UNAVAILABLE');
    }

    // Since we don't have a real AI key injected in the sandbox, this would fail.
    // For testing purposes, if we are in a test script, the test script will intercept this or we can throw.
    throw new Error('AI_UNAVAILABLE');
  }

  static async endSession(sessionId: string) {
    // COACH AGENT: Generates final report
    return await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        // mock evaluation data would be inserted here normally
      }
    });
  }
}
