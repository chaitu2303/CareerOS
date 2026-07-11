import { prisma } from '@/lib/prisma';
import { fromZonedTime, toZonedTime, format } from 'date-fns-tz';

export class StreakEngine {
  static async processActivity(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    
    const tz = user.timezone || 'UTC';
    
    // Get current date in user's timezone
    const nowUtc = new Date();
    const nowZoned = toZonedTime(nowUtc, tz);
    const todayStr = format(nowZoned, 'yyyy-MM-dd', { timeZone: tz });

    const streakRecord = await prisma.streakRecord.upsert({
      where: { userId },
      create: { userId, currentStreak: 1, longestStreak: 1, lastActivityAt: nowUtc },
      update: {}
    });

    const lastActivityUtc = streakRecord.lastActivityAt;
    let newStreak = streakRecord.currentStreak;
    let longest = streakRecord.longestStreak;
    let didIncrement = false;

    if (!lastActivityUtc) {
      newStreak = 1;
      didIncrement = true;
    } else {
      const lastZoned = toZonedTime(lastActivityUtc, tz);
      const lastStr = format(lastZoned, 'yyyy-MM-dd', { timeZone: tz });
      
      if (lastStr === todayStr) {
        // Already incremented today in user's timezone
        return { ...streakRecord, didIncrement: false, timezoneUsed: tz };
      }

      // Check if consecutive
      const yesterdayZoned = new Date(nowZoned);
      yesterdayZoned.setDate(yesterdayZoned.getDate() - 1);
      const yesterdayStr = format(yesterdayZoned, 'yyyy-MM-dd', { timeZone: tz });

      if (lastStr === yesterdayStr) {
        newStreak += 1;
        didIncrement = true;
      } else {
        // Streak broken
        newStreak = 1;
        didIncrement = true;
      }
    }

    if (newStreak > longest) {
      longest = newStreak;
    }

    if (didIncrement) {
      await prisma.streakRecord.update({
        where: { userId },
        data: {
          currentStreak: newStreak,
          longestStreak: longest,
          lastActivityAt: nowUtc
        }
      });
    }

    return { currentStreak: newStreak, longestStreak: longest, didIncrement, timezoneUsed: tz };
  }
}
