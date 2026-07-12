import { prisma } from '@/lib/prisma';
import { isAiAvailable } from '@/lib/ai/gateway';

export class CareerReadinessEngine {
  static async calculateReadiness(userId: string, targetRole: string) {
    // Determine context availability
    const hasSecureCodeExecution = false;
    const hasAiProvider = isAiAvailable();
    const isCodingRole = targetRole.toLowerCase().includes('engineer') || targetRole.toLowerCase().includes('developer');

    // Define weights deterministically based on role type
    let weights: Record<string, number> = {
      'PROFILE': 0.15,
      'RESUME': 0.25,
      'DOMAIN': 0.35,
      'INTERVIEW': 0.25
    };

    if (isCodingRole && hasSecureCodeExecution) {
      weights = {
        'PROFILE': 0.10,
        'RESUME': 0.15,
        'DOMAIN': 0.25,
        'CODING': 0.25,
        'INTERVIEW': 0.25
      };
    }

    const dimensions = [];
    let calculableWeight = 0;
    let totalScore = 0;

    // Simulate Profile Data fetch
    dimensions.push({
      dimension: 'PROFILE',
      status: 'STRONG',
      score: 95,
      weight: weights['PROFILE'],
      evidence: ['Master Profile 100% Complete']
    });
    calculableWeight += weights['PROFILE'];
    totalScore += 95 * weights['PROFILE'];

    // Simulate Resume Data fetch
    dimensions.push({
      dimension: 'RESUME',
      status: 'DEVELOPING',
      score: 70,
      weight: weights['RESUME'],
      evidence: ['1 ATS Report available (70%)']
    });
    calculableWeight += weights['RESUME'];
    totalScore += 70 * weights['RESUME'];

    // Domain Assessments
    dimensions.push({
      dimension: 'DOMAIN',
      status: 'NO_EVIDENCE',
      score: null,
      weight: weights['DOMAIN'],
      evidence: ['No assessments completed for this domain.']
    });

    // Coding Engine (if applicable)
    if (isCodingRole) {
      if (hasSecureCodeExecution) {
        dimensions.push({
          dimension: 'CODING',
          status: 'NO_EVIDENCE',
          score: null,
          weight: weights['CODING'],
          evidence: ['No verified coding submissions.']
        });
      } else {
        dimensions.push({
          dimension: 'CODING',
          status: 'NOT_AVAILABLE',
          score: null,
          weight: 0,
          evidence: ['Secure execution provider not configured.']
        });
      }
    }

    // Interview Engine
    if (hasAiProvider) {
      dimensions.push({
        dimension: 'INTERVIEW',
        status: 'NO_EVIDENCE',
        score: null,
        weight: weights['INTERVIEW'],
        evidence: ['No interviews completed.']
      });
    } else {
      dimensions.push({
        dimension: 'INTERVIEW',
        status: 'NOT_AVAILABLE',
        score: null,
        weight: 0,
        evidence: ['AI Provider required for live evaluation.']
      });
    }

    // Determine final score calculation if enough data exists
    // We require at least 40% of the weight to be calculable to output a meaningful score.
    let overallScore = null;
    if (calculableWeight >= 0.40) {
      overallScore = Math.round(totalScore / calculableWeight);
    }

    return await prisma.careerReadinessSnapshot.create({
      data: {
        userId,
        targetRole,
        overallScore,
        dimensionScores: JSON.stringify(dimensions),
        formulaVersion: 'READINESS_V1'
      }
    });
  }

  static async getNextBestAction(snapshotId: string) {
    const snap = await prisma.careerReadinessSnapshot.findUnique({ where: { id: snapshotId } });
    if (!snap) return null;

    const dimensions = JSON.parse(snap.dimensionScores as string);
    
    // Sort by largest gap that is actually measurable
    const actionable = dimensions.filter((d: any) => d.status !== 'NOT_AVAILABLE');
    
    // Look for NO_EVIDENCE in high weight areas first
    const missingEvidence = actionable.filter((d: any) => d.status === 'NO_EVIDENCE').sort((a: any, b: any) => b.weight - a.weight);
    if (missingEvidence.length > 0) {
      return `Complete a ${missingEvidence[0].dimension.toLowerCase()} assessment to establish a baseline.`;
    }

    // Then look for gaps in existing scores
    const weak = actionable.filter((d: any) => d.score !== null).sort((a: any, b: any) => a.score - b.score);
    if (weak.length > 0 && weak[0].score < 80) {
      return `Improve your ${weak[0].dimension.toLowerCase()} score (currently ${weak[0].score}).`;
    }

    return "Continue preparing active applications.";
  }
}
