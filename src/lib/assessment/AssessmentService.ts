import { prisma } from '@/lib/prisma';
import { ClientAssessment, ClientQuestion, QuestionOption } from './types';

export class AssessmentService {
  /**
   * Fetches an assessment and strips sensitive info (like correct answers)
   * before sending it to the client.
   */
  static async getAssessmentForClient(assessmentId: string, mode: string = 'PRACTICE'): Promise<ClientAssessment> {
    const assessment = await prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: {
        sections: {
          orderBy: { orderIndex: 'asc' }
        }
      }
    });

    if (!assessment) throw new Error('Assessment not found');
    if (!assessment.isPublished) throw new Error('Assessment is not published');

    let allQuestionIds: string[] = [];
    assessment.sections.forEach(s => {
      allQuestionIds = allQuestionIds.concat(s.questionIds as string[]);
    });

    const questions = await prisma.question.findMany({
      where: { id: { in: allQuestionIds } }
    });

    const questionMap = new Map(questions.map(q => [q.id, q]));

    const clientSections = assessment.sections.map(section => {
      const qIds = section.questionIds as string[];
      const clientQuestions: ClientQuestion[] = qIds.map(id => {
        const q = questionMap.get(id);
        if (!q) return null;

        // Strip correct answer logic
        const rawOptions = (q.options as any[]) || [];
        const cleanOptions: QuestionOption[] = rawOptions.map(opt => ({
          id: opt.id,
          text: opt.text,
          // Only send isCorrect if it's practice mode and client requests it post-answer,
          // but for strict/timed mode we completely strip it on initial fetch.
          // In practice mode we can let the client verify locally to save round trips, or keep it strict.
          // Following strict security: NEVER expose correct answers before submission in strict modes.
          isCorrect: mode === 'PRACTICE' ? opt.isCorrect : undefined
        }));

        return {
          id: q.id,
          type: q.type as any,
          department: q.department,
          domain: q.domain,
          topic: q.topic,
          questionText: q.questionText,
          options: cleanOptions,
          hints: mode === 'PRACTICE' ? (q.hints as string[]) : [],
          difficulty: q.difficulty as any,
        };
      }).filter(Boolean) as ClientQuestion[];

      return {
        id: section.id,
        title: section.title,
        description: section.description,
        questions: clientQuestions
      };
    });

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      instructions: assessment.instructions,
      department: assessment.department,
      domain: assessment.domain,
      difficulty: assessment.difficulty,
      durationMinutes: assessment.durationMinutes,
      mode: assessment.mode as any, // default allowed mode
      sections: clientSections
    };
  }

  static async startAttempt(userId: string, assessmentId: string, mode: string) {
    // Check for existing in-progress attempt to resume
    const existing = await prisma.assessmentAttempt.findFirst({
      where: {
        userId,
        assessmentId,
        status: 'IN_PROGRESS'
      }
    });

    if (existing) {
      await prisma.assessmentAttempt.update({
        where: { id: existing.id },
        data: { isResumed: true }
      });
      return existing;
    }

    return await prisma.assessmentAttempt.create({
      data: {
        userId,
        assessmentId,
        mode,
        status: 'IN_PROGRESS'
      }
    });
  }
}
