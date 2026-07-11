/**
 * GET /api/resumes/[id]/versions/[versionId]
 * Retrieve a specific version's content for restoration.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string; versionId: string }> }
) {
  try {
    const { id: resumeId, versionId } = await params;
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { email: authUser.email! } });
    if (!dbUser) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // Verify resume ownership
    const resume = await prisma.resume.findFirst({ where: { id: resumeId, userId: dbUser.id } });
    if (!resume) return NextResponse.json({ error: 'Resume not found' }, { status: 404 });

    const version = await prisma.resumeVersion.findFirst({
      where: { id: versionId, resumeId },
    });
    if (!version) return NextResponse.json({ error: 'Version not found' }, { status: 404 });

    return NextResponse.json({ content: version.content, versionNumber: version.versionNumber });
  } catch (e) {
    console.error('[GET /api/resumes/[id]/versions/[versionId]]', e);
    return NextResponse.json({ error: 'Failed to load version' }, { status: 500 });
  }
}
