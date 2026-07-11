import { prisma } from '@/lib/prisma';

export class CommandRouter {
  static async processCommand(userId: string, input: string) {
    const rawInput = input.trim().toLowerCase();
    
    // Deterministic Routing First
    if (rawInput === 'navigate home' || rawInput === 'home') {
      return { action: 'NAVIGATE', target: '/dashboard' };
    }
    
    if (rawInput.includes('create resume') || rawInput.includes('new resume')) {
      return { action: 'NAVIGATE', target: '/dashboard/resume-studio/new' };
    }
    
    if (rawInput.includes('performance') || rawInput.includes('readiness')) {
      return { action: 'NAVIGATE', target: '/dashboard/performance' };
    }
    
    if (rawInput.includes('compress image') || rawInput.includes('pdf tool')) {
      return { action: 'NAVIGATE', target: '/dashboard/tools' };
    }
    
    // Capability Aware Routing
    if (rawInput.includes('code') || rawInput.includes('coding')) {
      // Mocking capability check
      const hasSecureCodeExecution = false;
      if (!hasSecureCodeExecution) {
        return { 
          action: 'ERROR', 
          message: 'Verified secure code execution is currently unavailable. Redirecting to text-based assessments.',
          fallbackTarget: '/dashboard/assessments'
        };
      }
    }
    
    if (rawInput.includes('interview')) {
      const hasAiProvider = !!(process.env.OPENAI_API_KEY);
      if (!hasAiProvider) {
        return {
          action: 'ERROR',
          message: 'AI Provider is required for live mock interviews. This capability is currently unavailable.',
        };
      }
      return { action: 'NAVIGATE', target: '/dashboard/interviews' };
    }

    // Entity Resolution for "continue"
    if (rawInput.includes('continue')) {
      const lastSession = await prisma.practiceSession.findFirst({
        where: { userId, endedAt: null },
        orderBy: { startedAt: 'desc' }
      });
      if (lastSession) {
        return { action: 'NAVIGATE', target: `/dashboard/practice/${lastSession.id}` };
      }
      return { action: 'INFO', message: 'You have no active sessions to continue.' };
    }

    // Natural Language Fallback (Simulated if AI available, else error)
    const hasAiProvider = !!(process.env.OPENAI_API_KEY);
    if (hasAiProvider) {
      return { action: 'AI_PROCESSED', message: `Interpreting intent for: "${input}"` };
    } else {
      return { action: 'ERROR', message: `I couldn't understand that deterministic command, and AI natural language routing is currently unavailable.` };
    }
  }
}
