import { z } from 'zod';

const FactBase = z.object({
  confidence: z.number().min(0).max(100),
  sourceText: z.string().nullable(),
  verificationStatus: z.literal('AI_EXTRACTED').default('AI_EXTRACTED'),
});

export const MasterCareerSchema = z.object({
  basics: FactBase.extend({
    value: z.object({
      name: z.string().nullable(),
      email: z.string().nullable(),
      phone: z.string().nullable(),
      location: z.string().nullable(),
    }).nullable()
  }),
  summary: FactBase.extend({
    value: z.string().nullable()
  }),
  education: z.array(FactBase.extend({
    value: z.object({
      degree: z.string(),
      institution: z.string(),
      year: z.string().nullable(),
    })
  })).default([]),
  skills: z.array(FactBase.extend({
    value: z.string()
  })).default([]),
  experience: z.array(FactBase.extend({
    value: z.object({
      role: z.string(),
      company: z.string(),
      duration: z.string().nullable(),
      description: z.string().nullable(),
    })
  })).default([]),
  projects: z.array(FactBase.extend({
    value: z.object({
      name: z.string(),
      description: z.string().nullable(),
      url: z.string().nullable(),
    })
  })).default([]),
  certifications: z.array(FactBase.extend({
    value: z.object({
      name: z.string(),
      issuer: z.string().nullable(),
      year: z.string().nullable(),
    })
  })).default([]),
});

export type CareerExtraction = z.infer<typeof MasterCareerSchema>;
