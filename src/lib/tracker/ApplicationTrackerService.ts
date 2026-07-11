import { prisma } from '@/lib/prisma';

export class ApplicationTrackerService {
  /**
   * Safely transition an application status.
   */
  static async updateStatus(applicationId: string, newStatus: string, reason?: string) {
    const validTransitions: Record<string, string[]> = {
      'DISCOVERED': ['SAVED', 'PREPARING', 'ARCHIVED'],
      'SAVED': ['PREPARING', 'ARCHIVED'],
      'PREPARING': ['READY_TO_APPLY', 'SAVED', 'ARCHIVED'],
      'READY_TO_APPLY': ['APPLIED', 'PREPARING', 'ARCHIVED'],
      'APPLIED': ['ASSESSMENT', 'INTERVIEW', 'REJECTED', 'WITHDRAWN'],
      'ASSESSMENT': ['INTERVIEW', 'REJECTED', 'WITHDRAWN'],
      'INTERVIEW': ['OFFER', 'REJECTED', 'WITHDRAWN'],
      'OFFER': ['HIRED', 'REJECTED', 'WITHDRAWN']
    };

    const application = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
    if (!application) throw new Error('Application not found');

    const currentStatus = application.status;
    const allowed = validTransitions[currentStatus] || [];
    
    if (!allowed.includes(newStatus)) {
      throw new Error(`Invalid status transition from ${currentStatus} to ${newStatus}`);
    }

    return await prisma.$transaction(async (tx: any) => {
      const updated = await tx.jobApplication.update({
        where: { id: applicationId },
        data: { 
          status: newStatus,
          appliedAt: newStatus === 'APPLIED' && !application.appliedAt ? new Date() : application.appliedAt 
        }
      });

      await tx.applicationStatusHistory.create({
        data: {
          applicationId,
          previousStatus: currentStatus,
          newStatus,
          reason
        }
      });

      return updated;
    });
  }

  static async getNextBestAction(applicationId: string) {
    const app = await prisma.jobApplication.findUnique({ where: { id: applicationId } });
    if (!app) return null;

    if (app.status === 'PREPARING' && !app.resumeId) {
      return "Select or tailor a resume for this application.";
    }
    
    if (app.status === 'APPLIED') {
      const daysSince = (new Date().getTime() - (app.appliedAt?.getTime() || 0)) / (1000 * 3600 * 24);
      if (daysSince > 7) return "Application submitted 7 days ago. Consider following up.";
    }
    
    if (app.status === 'INTERVIEW') {
      return "Interview scheduled. Start a job-specific mock interview.";
    }

    return "Review application details.";
  }
}
