import { prisma } from '@/lib/prisma';
import { isAiAvailable } from '@/lib/ai/gateway';

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
  static async processTurn(sessionId: string, candidateAnswer: string, userId: string) {
    const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
    if (session && session.userId !== userId) throw new Error('Unauthorized');
    if (!session) throw new Error('Session not found');

    // 1. EVALUATOR AGENT (Privately evaluates the answer)
    // 2. FOLLOW-UP AGENT (Decides if deeper questioning is needed)
    // 3. ORCHESTRATOR (Checks time/plan limits)
    // 4. INTERVIEWER AGENT (Generates next professional question)

    // Check if an AI provider is available.
    let isAiReady = false;
    try {
      isAiReady = isAiAvailable();
    } catch(e) { }

    if (!isAiReady) {
      // Use Native Intelligence static scripted fallback
      const log = Array.isArray(session.conversationLog) ? session.conversationLog : [];
      const turnCount = log.length;

      let nextQuestion = 'Thank you for that response. Can you elaborate further?';
      let nextAction: 'ASK_NEW' | 'FOLLOW_UP' | 'END_INTERVIEW' = 'ASK_NEW';
      let status = session.status;

      if (turnCount === 0) {
        nextQuestion = `Hello! I'll be conducting your ${session.type} interview for the ${session.targetRole} position. Tell me about yourself and your background.`;
      } else if (turnCount === 1) {
        nextQuestion = session.type === 'BEHAVIORAL' 
          ? "Great. Can you describe a time you had to work under a tight deadline and how you managed it?"
          : "Thanks. Let's dive in. Can you explain the difference between a process and a thread in an operating system?";
      } else if (turnCount === 2) {
        nextQuestion = "Interesting approach. What were the key challenges you faced there, and how did you overcome them?";
      } else if (turnCount >= 3) {
        nextQuestion = "Thank you for your time today. That concludes our interview. I'll pass your results to the team.";
        nextAction = 'END_INTERVIEW';
        status = 'COMPLETED';
      }

      const updatedLog = [
        ...log,
        { role: 'user', content: candidateAnswer, timestamp: new Date() },
        { role: 'assistant', content: nextQuestion, timestamp: new Date() }
      ];

      await prisma.interviewSession.update({
        where: { id: sessionId },
        data: {
          conversationLog: updatedLog,
          status,
          ...(status === 'COMPLETED' ? { completedAt: new Date() } : {})
        }
      });

      return {
        reply: nextQuestion,
        action: nextAction,
        isNativeIntelligence: true
      };
    }

    // Real AI logic would go here if available
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
