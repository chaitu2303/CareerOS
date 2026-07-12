import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { facts } = await req.json();

    // Ensure a CareerProfile exists for the user
    const profile = await prisma.careerProfile.upsert({
      where: { userId: user.id! },
      update: {
        domain: facts.basics?.value?.domain,
        department: facts.basics?.value?.department,
        targetRole: facts.basics?.value?.targetRole,
        careerGoal: facts.basics?.value?.careerGoal,
      },
      create: {
        userId: user.id!,
        domain: facts.basics?.value?.domain,
        department: facts.basics?.value?.department,
        targetRole: facts.basics?.value?.targetRole,
        careerGoal: facts.basics?.value?.careerGoal,
      }
    });

    // Mark onboarding complete
    await prisma.user.update({
      where: { id: user.id! },
      data: { onboardingCompleted: true }
    });

    // Transactional save
    await prisma.$transaction(async (tx) => {

      // Save Skills
      if (facts.skills) {
        for (const skill of facts.skills) {
          const existing = await tx.skillFact.findFirst({
            where: { profileId: profile.id, name: skill.value }
          });

          if (!existing) {
            const created = await tx.skillFact.create({
              data: {
                profileId: profile.id,
                name: skill.value,
                status: skill.verificationStatus,
              }
            });
            await tx.factProvenance.create({
              data: {
                skillId: created.id,
                confidence: skill.confidence,
                sourceText: skill.sourceText,
                extractionMethod: 'gpt-4o'
              }
            });
          } else if (existing.status !== 'USER_CONFIRMED') {
            await tx.skillFact.update({
              where: { id: existing.id },
              data: { status: skill.verificationStatus }
            });
          }
        }
      }

      // Save Experience
      if (facts.experience) {
        for (const exp of facts.experience) {
          const existing = await tx.experienceFact.findFirst({
            where: {
              profileId: profile.id,
              role: exp.value.role,
              company: exp.value.company
            }
          });

          if (!existing) {
            const created = await tx.experienceFact.create({
              data: {
                profileId: profile.id,
                role: exp.value.role,
                company: exp.value.company,
                duration: exp.value.duration,
                description: exp.value.description,
                status: exp.verificationStatus,
              }
            });
            await tx.factProvenance.create({
              data: {
                experienceId: created.id,
                confidence: exp.confidence,
                sourceText: exp.sourceText,
                extractionMethod: 'gpt-4o'
              }
            });
          } else if (existing.status !== 'USER_CONFIRMED') {
            await tx.experienceFact.update({
              where: { id: existing.id },
              data: { status: exp.verificationStatus }
            });
          }
        }
      }

      // Save Education
      if (facts.education) {
        for (const edu of facts.education) {
          const existing = await tx.educationFact.findFirst({
            where: {
              profileId: profile.id,
              degree: edu.value.degree,
              institution: edu.value.institution
            }
          });

          if (!existing) {
            const created = await tx.educationFact.create({
              data: {
                profileId: profile.id,
                degree: edu.value.degree,
                institution: edu.value.institution,
                year: edu.value.year,
                status: edu.verificationStatus,
              }
            });
            await tx.factProvenance.create({
              data: {
                educationId: created.id,
                confidence: edu.confidence,
                sourceText: edu.sourceText,
                extractionMethod: 'gpt-4o'
              }
            });
          } else if (existing.status !== 'USER_CONFIRMED') {
            await tx.educationFact.update({
              where: { id: existing.id },
              data: { status: edu.verificationStatus }
            });
          }
        }
      }
    });

    return NextResponse.json({ message: 'Profile saved securely' });

  } catch (error) {
    console.error('Profile Save Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
