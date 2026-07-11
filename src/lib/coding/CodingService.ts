import { prisma } from '@/lib/prisma';
import { getExecutionProvider } from './CodeExecutionProvider';
import { ExecutionStatus } from './CodeExecutionProvider';

export class CodingService {
  /**
   * Submits code to be evaluated against public and hidden test cases.
   */
  static async submitCode(userId: string, problemId: string, language: string, code: string) {
    const provider = getExecutionProvider();
    
    // Create pending submission
    const submission = await prisma.codingSubmission.create({
      data: {
        userId,
        problemId,
        language,
        code,
        status: 'PENDING'
      }
    });

    if (!provider.isAvailable()) {
      // In compliance with Milestone 8 secure execution directive:
      // "clearly report execution as unavailable until a real isolated provider is connected. Never simulate a fake judge."
      await prisma.codingSubmission.update({
        where: { id: submission.id },
        data: {
          status: 'INTERNAL_ERROR',
          result: {
            create: {
              testsPassed: 0,
              testsTotal: 0,
              runtimeError: 'SECURE_EXECUTION_UNAVAILABLE: No secure code execution sandbox is configured for this environment. Arbitrary code execution is disabled for safety.'
            }
          }
        }
      });
      return { submissionId: submission.id, status: 'INTERNAL_ERROR', message: 'Execution Unavailable' };
    }

    // 1. Fetch test cases from DB
    const problem = await prisma.codingProblem.findUnique({
      where: { id: problemId },
      include: { testCases: { orderBy: { orderIndex: 'asc' } } }
    });

    if (!problem) throw new Error('Problem not found');

    const providerTestCases = problem.testCases.map(tc => ({
      id: tc.id,
      input: tc.input,
      expectedOutput: tc.expectedOutput
    }));

    // 2. Execute
    const results = await provider.execute({
      language,
      code,
      timeLimitMs: problem.timeLimit,
      memoryLimitMb: problem.memoryLimit,
      testCases: providerTestCases
    });

    // 3. Aggregate Verdict
    let finalVerdict: ExecutionStatus = 'ACCEPTED';
    let passed = 0;
    for (const r of results) {
      if (r.status === 'ACCEPTED') {
        passed++;
      } else if (finalVerdict === 'ACCEPTED') {
        finalVerdict = r.status; // First non-accepted status becomes final verdict
      }
    }

    const maxExecMs = Math.max(...results.map(r => r.executionMs || 0), 0);
    const maxMemKb = Math.max(...results.map(r => r.memoryUsedKb || 0), 0);

    // 4. Update Submission Result
    const updatedSubmission = await prisma.codingSubmission.update({
      where: { id: submission.id },
      data: {
        status: finalVerdict,
        result: {
          create: {
            testsPassed: passed,
            testsTotal: results.length,
            executionMs: maxExecMs,
            memoryUsedKb: maxMemKb
          }
        },
        testCaseResults: {
          create: results.map(r => ({
            testCaseId: r.testCaseId,
            status: r.status,
            executionMs: r.executionMs,
            memoryUsedKb: r.memoryUsedKb,
            // Only store actual output/errors for debugging (could be hidden based on rules)
            actualOutput: r.actualOutput,
            errorOutput: r.errorOutput
          }))
        }
      }
    });

    // 5. Update UserProgress if ACCEPTED
    await prisma.userProblemProgress.upsert({
      where: { userId_problemId: { userId, problemId } },
      update: {
        attempts: { increment: 1 },
        lastAttemptedAt: new Date(),
        ...(finalVerdict === 'ACCEPTED' ? { status: 'SOLVED' } : {}),
        ...(finalVerdict === 'ACCEPTED' ? { firstSolvedAt: new Date() } : {})
      },
      create: {
        userId,
        problemId,
        attempts: 1,
        status: finalVerdict === 'ACCEPTED' ? 'SOLVED' : 'ATTEMPTED',
        ...(finalVerdict === 'ACCEPTED' ? { firstSolvedAt: new Date() } : {})
      }
    });

    return updatedSubmission;
  }

  static async getProblemDetails(slug: string) {
    return await prisma.codingProblem.findUnique({
      where: { slug },
      include: {
        constraints: { orderBy: { orderIndex: 'asc' } },
        examples: { orderBy: { orderIndex: 'asc' } },
        languages: true,
        templates: true,
        testCases: { 
          where: { isHidden: false }, // only expose public tests
          orderBy: { orderIndex: 'asc' }
        }
      }
    });
  }

  static async getUserProgress(userId: string) {
    // For analytics dashboard
    return await prisma.userProblemProgress.findMany({
      where: { userId },
      include: {
        problem: {
          select: { id: true, title: true, difficulty: true, topic: true }
        }
      }
    });
  }
}
