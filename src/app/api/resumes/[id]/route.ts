/**
 * GET  /api/resumes/[id]     → load single resume with versions
 * PUT  /api/resumes/[id]     → save updated content (auto-save)
 * DELETE /api/resumes/[id]   → delete resume
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

async function getAuthUser() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

async function getDbUser(email: string) {
  return prisma.user.findUnique({ where: { email } });
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getDbUser(authUser.email!);
    if (!dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const resume = await prisma.resume.findFirst({
      where: { id, userId: dbUser.id },
      include: {
        versions: { orderBy: { versionNumber: 'desc' }, take: 20 },
        atsReports: { orderBy: { createdAt: 'desc' }, take: 1 },
      }
    });

    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    return NextResponse.json({ resume });
  } catch (e) {
    console.error('[GET /api/resumes/[id]]', e);
    return NextResponse.json({ error: 'Failed to load resume' }, { status: 500 });
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getDbUser(authUser.email!);
    if (!dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    const body = await req.json();
    const { content, title, saveVersion, versionNote } = body;

    // Verify ownership
    const existing = await prisma.resume.findFirst({ where: { id, userId: dbUser.id } });
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Transactional update
    const updated = await prisma.$transaction(async (tx) => {
      const resume = await tx.resume.update({
        where: { id },
        data: {
          ...(content && { content }),
          ...(title && { title }),
        }
      });

      let newVersionId = null;
      if (saveVersion && content) {
        const lastVersion = await tx.resumeVersion.findFirst({
          where: { resumeId: id },
          orderBy: { versionNumber: 'desc' }
        });
        const v = await tx.resumeVersion.create({
          data: {
            resumeId: id,
            versionNumber: (lastVersion?.versionNumber ?? 0) + 1,
            content,
            title: versionNote ?? `Version ${(lastVersion?.versionNumber ?? 0) + 1}`,
            changeNote: versionNote,
          }
        });
        newVersionId = v.id;
      }

      return { resume, newVersionId };
    });

    return NextResponse.json({ ok: true, updatedAt: updated.resume.updatedAt, versionId: updated.newVersionId });
  } catch (e) {
    console.error('[PUT /api/resumes/[id]]', e);
    return NextResponse.json({ error: 'Failed to save resume' }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = await getAuthUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await getDbUser(authUser.email!);
    if (!dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    await prisma.resume.deleteMany({ where: { id, userId: dbUser.id } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[DELETE /api/resumes/[id]]', e);
    return NextResponse.json({ error: 'Failed to delete resume' }, { status: 500 });
  }
}
