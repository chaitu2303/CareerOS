/**
 * Truth Guard
 * Validates AI outputs against the user's verified Master Career Profile.
 */
import { CareerContext } from './rag';

export enum FactStatus {
  VERIFIED_FACT = 'VERIFIED_FACT',
  USER_PROVIDED = 'USER_PROVIDED',
  AI_SUGGESTION = 'AI_SUGGESTION',
  UNKNOWN = 'UNKNOWN',
  INSUFFICIENT_EVIDENCE = 'INSUFFICIENT_EVIDENCE'
}

export function validateClaim(claim: string, context: CareerContext): FactStatus {
  // Simple deterministic validation for demonstration
  const lowerClaim = claim.toLowerCase();
  
  // Check against verified facts
  if (context.verifiedFacts.some(f => lowerClaim.includes(f.toLowerCase()))) {
    return FactStatus.VERIFIED_FACT;
  }
  
  // Check against skills
  if (context.skills.some(s => lowerClaim.includes(s.toLowerCase()))) {
    return FactStatus.VERIFIED_FACT;
  }
  
  // If it's a completely new, bold claim with no evidence
  if (lowerClaim.includes('managed 50 people') || lowerClaim.includes('invented')) {
    return FactStatus.INSUFFICIENT_EVIDENCE;
  }
  
  return FactStatus.UNKNOWN;
}

export function validateOutput<T extends object>(output: T, context: CareerContext): T {
  // Structural validation hook that would throw if INSUFFICIENT_EVIDENCE is detected on critical fields
  return output;
}
