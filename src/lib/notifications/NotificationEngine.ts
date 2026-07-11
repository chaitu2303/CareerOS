import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export class NotificationEngine {
  static async send(
    userId: string,
    type: string,
    title: string,
    body: string,
    options: { priority?: string, actionUrl?: string, sourceModule?: string, sourceEntityId?: string, deduplicationKey?: string } = {}
  ) {
    const prefs = await prisma.notificationPreference.findUnique({ where: { userId } });
    
    // Default to true if preferences don't exist yet
    if (prefs && !prefs.inAppEnabled) return null;

    // Smart Deduplication
    if (options.deduplicationKey) {
      // Check if identical active notification exists in the last 24 hours
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const existing = await prisma.notification.findFirst({
        where: {
          userId,
          deduplicationKey: options.deduplicationKey,
          createdAt: { gte: yesterday }
        }
      });
      if (existing) {
        console.log(`Notification deduped for key: ${options.deduplicationKey}`);
        return existing;
      }
    }

    return await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        body,
        priority: options.priority || 'INFO',
        actionUrl: options.actionUrl,
        sourceModule: options.sourceModule,
        sourceEntityId: options.sourceEntityId,
        deduplicationKey: options.deduplicationKey
      }
    });
  }

  static async markRead(notificationId: string) {
    return await prisma.notification.update({
      where: { id: notificationId },
      data: { isRead: true }
    });
  }
}
