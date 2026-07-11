import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export class ApplicationCopilot {
  /**
   * Generates a structured ApplicationPlan from a detected form schema.
   */
  static async analyzeApplicationForm(userId: string, formFields: any[], jobTargetId?: string) {
    const plan = {
      jobTargetId,
      detectedFieldsCount: formFields.length,
      fields: [] as any[],
      recommendedResumeId: null,
      missingInformation: [] as string[]
    };

    // Simulated lookup for verified profile
    const profile = await prisma.careerProfile.findUnique({ where: { userId } });

    for (const field of formFields) {
      const normalizedName = field.name.toLowerCase();
      let classification = 'UNSUPPORTED';
      let suggestedValue = null;

      // 1. Check for SENSITIVE_OR_LEGAL
      if (
        normalizedName.includes('ssn') || 
        normalizedName.includes('race') || 
        normalizedName.includes('gender') || 
        normalizedName.includes('visa') || 
        normalizedName.includes('salary') ||
        normalizedName.includes('signature') ||
        normalizedName.includes('veteran') ||
        normalizedName.includes('disability')
      ) {
        classification = 'SENSITIVE_OR_LEGAL';
      }
      // 2. Check for VERIFIED_AUTOFILL (Basic mappings)
      else if (normalizedName.includes('first name') || normalizedName.includes('firstname')) {
        classification = 'VERIFIED_AUTOFILL';
        const user = await prisma.user.findUnique({ where: { id: userId } });
        suggestedValue = user?.name?.split(' ')[0] || '';
      }
      else if (normalizedName.includes('last name') || normalizedName.includes('lastname')) {
        classification = 'VERIFIED_AUTOFILL';
        const user = await prisma.user.findUnique({ where: { id: userId } });
        suggestedValue = user?.name?.split(' ').slice(1).join(' ') || '';
      }
      else if (normalizedName.includes('email')) {
        classification = 'VERIFIED_AUTOFILL';
        const user = await prisma.user.findUnique({ where: { id: userId } });
        suggestedValue = user?.email || '';
      }
      // 3. Check for Custom AI Draft Required
      else if (normalizedName.includes('why') || normalizedName.includes('cover letter') || normalizedName.includes('describe')) {
        classification = 'AI_DRAFT_REVIEW_REQUIRED';
        // In a real system, we would ping the AI Gateway here to draft this
        suggestedValue = `[DRAFT] I am highly interested in this role because...`;
      }
      // 4. Fallback to USER_REQUIRED
      else {
        classification = 'USER_REQUIRED';
      }

      plan.fields.push({
        id: field.id || crypto.randomUUID(),
        name: field.name,
        type: field.type,
        classification,
        suggestedValue,
        confidence: classification === 'VERIFIED_AUTOFILL' ? 1.0 : (classification === 'SENSITIVE_OR_LEGAL' ? 0.0 : 0.5)
      });
    }

    return plan;
  }
}
