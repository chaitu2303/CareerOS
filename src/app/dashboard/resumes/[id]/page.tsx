import { notFound, redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { ResumeStudio } from '@/components/resume/ResumeStudio';

export const dynamic = 'force-dynamic';

export default async function ResumeEditorPage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  const session = await auth();
  const authUser = session?.user;
  if (!authUser) redirect('/');

  const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
  if (!dbUser) redirect('/onboarding');

  const resume = await prisma.resume.findFirst({
    where: { id, userId: dbUser.id },
    include: {
      versions: { orderBy: { versionNumber: 'desc' }, take: 20 },
    }
  });

  if (!resume) notFound();

  // Load available job targets for tailoring
  const jobTargets = await prisma.jobTarget.findMany({
    where: { userId: dbUser.id },
    select: { id: true, roleTitle: true, company: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <ResumeStudio
      resume={{
        ...resume,
        updatedAt: resume.updatedAt.toISOString(),
      }}
      versions={resume.versions.map(v => ({
        ...v,
        createdAt: v.createdAt.toISOString(),
      }))}
      jobTargets={jobTargets}
    />
  );
}
