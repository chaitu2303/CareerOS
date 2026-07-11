import { prisma } from '@/lib/prisma';

export class XpEngine {
  static async awardXp(userId: string, eventType: string, sourceModule: string, sourceEntityId: string, metadata: any = {}) {
    // 1. Idempotency Check
    const idempotencyKey = `${userId}:${eventType}:${sourceEntityId}`;
    
    const existing = await prisma.activityEvent.findUnique({ where: { idempotencyKey } });
    if (existing) {
      console.warn(`Idempotent block: XP already awarded for ${idempotencyKey}`);
      return null;
    }

    // 2. Rules engine
    const xpRules: Record<string, number> = {
      'PROFILE_COMPLETED': 500,
      'RESUME_CREATED': 200,
      'ASSESSMENT_COMPLETED': 100,
      'CODING_PROBLEM_SOLVED': 150,
      'SIMULATION_COMPLETED': 300,
      'APPLICATION_SUBMITTED': 50
    };

    let baseXP = xpRules[eventType] || 0;
    
    // Anti-farming check (simplified)
    if (baseXP === 0) return null;

    // 3. Persist Event
    const event = await prisma.activityEvent.create({
      data: {
        userId,
        type: eventType,
        sourceModule,
        sourceEntityId,
        metadata,
        idempotencyKey
      }
    });

    // 4. Award XP Ledger
    const xpRecord = await prisma.xpRecord.upsert({
      where: { userId },
      create: { userId, totalXp: baseXP },
      update: { totalXp: { increment: baseXP } }
    });

    await prisma.xpEvent.create({
      data: {
        xpRecordId: xpRecord.id,
        activity: eventType,
        xpEarned: baseXP,
        description: `Earned from ${sourceModule}`
      }
    });

    // Handle leveling up
    const newLevel = Math.floor(Math.sqrt(xpRecord.totalXp / 100)) + 1;
    if (newLevel > xpRecord.currentLevel) {
      await prisma.xpRecord.update({
        where: { id: xpRecord.id },
        data: { currentLevel: newLevel }
      });
    }

    return { event, xpEarned: baseXP, newLevel };
  }
}
