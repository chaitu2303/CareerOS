import { prisma } from '@/lib/prisma';
import { SubmitAttemptPayload } from './types';

export class EvaluationService {
  /**
   * Evaluates an assessment attempt server-side and stores the EvaluationResult
   */
  static async evaluateAttempt(attemptId: string, payload: SubmitAttemptPayload) {
    const attempt = await prisma.assessmentAttempt.findUnique({
      where: { id: attemptId },
      include: {
        assessment: {
          include: {
            sections: true
          }
        }
      }
    });

    if (!attempt) throw new Error('Attempt not found');
    if (attempt.status === 'COMPLETED') throw new Error('Attempt already evaluated');

    // Get all questions for this assessment
    let questionIds: string[] = [];
    for (const section of attempt.assessment.sections) {
      const qIds = section.questionIds as string[];
      questionIds = questionIds.concat(qIds);
    }

    const questions = await prisma.question.findMany({
      where: { id: { in: questionIds } }
    });

    let totalScore = 0;
    let maxScore = questions.length; // Assume 1 point per question for now
    let totalCorrect = 0;
    let totalIncorrect = 0;
    let totalUnanswered = 0;

    const topicStats: Record<string, { correct: number, total: number, timeSpent: number }> = {};
    const difficultyStats: Record<string, { correct: number, total: number }> = {};

    const dbAnswers = [];

    for (const question of questions) {
      if (!topicStats[question.topic]) {
        topicStats[question.topic] = { correct: 0, total: 0, timeSpent: 0 };
      }
      if (!difficultyStats[question.difficulty]) {
        difficultyStats[question.difficulty] = { correct: 0, total: 0 };
      }

      topicStats[question.topic].total++;
      difficultyStats[question.difficulty].total++;

      const userAnswer = payload.answers.find(a => a.questionId === question.id);
      
      let isCorrect = false;
      let score = 0;

      if (!userAnswer || userAnswer.answer == null || userAnswer.answer === '') {
        totalUnanswered++;
      } else {
        // Evaluate based on type
        if (question.type === 'MCQ' || question.type === 'TRUE_FALSE') {
          // Compare answer ID or text depending on implementation, assume options has isCorrect
          const options = question.options as any[] || [];
          const correctOption = options.find(o => o.isCorrect);
          if (correctOption && String(userAnswer.answer) === String(correctOption.id)) {
            isCorrect = true;
            score = 1;
            totalCorrect++;
            topicStats[question.topic].correct++;
            difficultyStats[question.difficulty].correct++;
          } else {
            totalIncorrect++;
          }
        } else if (question.type === 'NUMERICAL') {
          if (String(userAnswer.answer).trim() === String(question.correctAnswer).trim()) {
            isCorrect = true;
            score = 1;
            totalCorrect++;
            topicStats[question.topic].correct++;
            difficultyStats[question.difficulty].correct++;
          } else {
            totalIncorrect++;
          }
        } else {
          // Other types require manual grading or complex AI grading (stub for M8)
          totalUnanswered++; // Temporarily count as unanswered or needs review
        }

        if (userAnswer.timeTakenSeconds) {
          topicStats[question.topic].timeSpent += userAnswer.timeTakenSeconds;
        }
      }

      totalScore += score;

      dbAnswers.push({
        attemptId,
        questionId: question.id,
        answer: userAnswer ? userAnswer.answer : null,
        isCorrect: userAnswer ? isCorrect : null,
        score,
        timeTakenSeconds: userAnswer?.timeTakenSeconds || 0,
        isMarkedForReview: userAnswer?.isMarkedForReview || false,
      });
    }

    const accuracy = totalCorrect / (totalCorrect + totalIncorrect || 1) * 100;
    
    // Save answers
    await prisma.$transaction(
      dbAnswers.map(ans => 
        prisma.attemptAnswer.upsert({
          where: { attemptId_questionId: { attemptId: ans.attemptId, questionId: ans.questionId } },
          update: ans,
          create: ans
        })
      )
    );

    // Topic Performance
    const topicPerformance = Object.keys(topicStats).map(topic => ({
      topic,
      accuracy: topicStats[topic].total > 0 ? (topicStats[topic].correct / topicStats[topic].total) * 100 : 0,
      timeSpent: topicStats[topic].timeSpent,
      totalQuestions: topicStats[topic].total
    }));

    const difficultyPerformance = Object.keys(difficultyStats).map(difficulty => ({
      difficulty,
      accuracy: difficultyStats[difficulty].total > 0 ? (difficultyStats[difficulty].correct / difficultyStats[difficulty].total) * 100 : 0
    }));

    topicPerformance.sort((a, b) => b.accuracy - a.accuracy);
    const strongestTopics = topicPerformance.filter(t => t.accuracy >= 70).map(t => t.topic);
    const weakestTopics = topicPerformance.filter(t => t.accuracy < 50).map(t => t.topic);

    // Save Evaluation Result
    const evaluationResult = await prisma.evaluationResult.create({
      data: {
        attemptId,
        overallScore: totalScore,
        accuracy,
        totalCorrect,
        totalIncorrect,
        totalUnanswered,
        topicPerformance: topicPerformance as any,
        difficultyPerformance: difficultyPerformance as any,
        strongestTopics: strongestTopics as any,
        weakestTopics: weakestTopics as any,
      }
    });

    // Update attempt
    await prisma.assessmentAttempt.update({
      where: { id: attemptId },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        score: totalScore,
        maxScore,
        accuracy,
        securityEvents: payload.securityEvents as any || []
      }
    });

    // Award XP
    try {
      const { XpEngine } = await import('@/lib/gamification/XpEngine');
      await XpEngine.awardXp(
        attempt.userId,
        'ASSESSMENT_COMPLETED',
        'ASSESSMENT_ARENA',
        attemptId,
        { score: totalScore, accuracy }
      );
    } catch (e) {
      console.error('Failed to award XP:', e);
    }

    // Update Streak
    try {
      const { StreakEngine } = await import('@/lib/gamification/StreakEngine');
      await StreakEngine.processActivity(attempt.userId);
    } catch (e) {
      console.error('Failed to update streak:', e);
    }

    // Update Readiness
    try {
      const user = await prisma.user.findUnique({ where: { id: attempt.userId }, include: { careerProfile: true } });
      if (user?.careerProfile?.targetRole) {
        const { CareerReadinessEngine } = await import('@/lib/analytics/CareerReadinessEngine');
        await CareerReadinessEngine.calculateReadiness(attempt.userId, user.careerProfile.targetRole);
      }
    } catch (e) {
      console.error('Failed to update readiness:', e);
    }

    return evaluationResult;
  }
}
