/**
 * Universal Evaluation Engine
 * Evaluates a given subject (Resume, Interview, Code) against a set of rules.
 */
import { extractEntities } from '@/lib/ai/gateway';
import { z } from 'zod';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export interface EvaluationFinding {
  ruleId: string;
  type: string;
  severity: Severity;
  message: string;
  evidence?: string | null;
  recommendedFix?: string | null;
  aiFixable: boolean;
  scoreImpact: number; // e.g. -5, -10
}

export interface RuleContext<TSubject, TGrounding> {
  subject: TSubject;
  grounding?: TGrounding;
}

export type DeterministicRule<TSubject, TGrounding = any> = {
  id: string;
  type: 'DETERMINISTIC';
  category: string;
  evaluate: (ctx: RuleContext<TSubject, TGrounding>) => EvaluationFinding[];
};

export type SemanticRule<TSubject, TGrounding = any> = {
  id: string;
  type: 'SEMANTIC';
  category: string;
  systemPrompt: string;
  promptBuilder: (ctx: RuleContext<TSubject, TGrounding>) => string;
};

export type EvaluationRule<TSubject, TGrounding = any> = 
  | DeterministicRule<TSubject, TGrounding>
  | SemanticRule<TSubject, TGrounding>;

export interface EvaluationResult {
  overallScore: number;
  breakdown: Record<string, number>;
  findings: EvaluationFinding[];
}

const SemanticFindingSchema = z.object({
  severity: z.enum(['CRITICAL', 'HIGH', 'MEDIUM', 'LOW']),
  message: z.string(),
  evidence: z.string().optional(),
  recommendedFix: z.string().optional(),
  aiFixable: z.boolean(),
  scoreImpact: z.number().max(0),
});

const SemanticFindingsSchema = z.object({
  findings: z.array(SemanticFindingSchema)
});

/**
 * Runs a set of rules against a subject and calculates a final score.
 */
export async function runEvaluation<TSubject, TGrounding>(
  rules: EvaluationRule<TSubject, TGrounding>[],
  ctx: RuleContext<TSubject, TGrounding>,
  baseScore: number = 100
): Promise<EvaluationResult> {
  let allFindings: EvaluationFinding[] = [];

  // Run deterministic rules
  const deterministicRules = rules.filter(r => r.type === 'DETERMINISTIC') as DeterministicRule<TSubject, TGrounding>[];
  for (const rule of deterministicRules) {
    try {
      const findings = rule.evaluate(ctx);
      allFindings.push(...findings);
    } catch (e) {
      console.error(`Error in deterministic rule ${rule.id}:`, e);
    }
  }

  // Run semantic rules via AI
  const semanticRules = rules.filter(r => r.type === 'SEMANTIC') as SemanticRule<TSubject, TGrounding>[];
  for (const rule of semanticRules) {
    try {
      const prompt = rule.promptBuilder(ctx);
      const result = await extractEntities(prompt, SemanticFindingsSchema, {
        systemPrompt: rule.systemPrompt
      });
      if (result && result.findings) {
        allFindings.push(...result.findings.map(f => ({
          ...f,
          ruleId: rule.id,
          type: rule.id,
          evidence: f.evidence ?? null,
          recommendedFix: f.recommendedFix ?? null,
        })));
      }
    } catch (e) {
      console.error(`Error in semantic rule ${rule.id}:`, e);
    }
  }

  // Calculate scores
  let currentScore = baseScore;
  const breakdown: Record<string, number> = {};

  // Group by category to apply penalties
  const penaltiesByCategory: Record<string, number> = {};
  
  for (const rule of rules) {
    if (!breakdown[rule.category]) {
      breakdown[rule.category] = 100;
      penaltiesByCategory[rule.category] = 0;
    }
  }

  for (const finding of allFindings) {
    currentScore += finding.scoreImpact;
    const rule = rules.find(r => r.id === finding.ruleId);
    if (rule) {
      penaltiesByCategory[rule.category] += finding.scoreImpact;
    }
  }

  currentScore = Math.max(0, Math.min(100, currentScore));
  
  for (const cat in breakdown) {
    breakdown[cat] = Math.max(0, Math.min(100, 100 + penaltiesByCategory[cat]));
  }

  // Sort findings by severity
  const severityOrder = { CRITICAL: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
  allFindings.sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return {
    overallScore: currentScore,
    breakdown,
    findings: allFindings
  };
}
