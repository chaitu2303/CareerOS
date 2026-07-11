import { NextResponse } from 'next/server';
import { AssessmentService } from '@/lib/assessment/AssessmentService';
import { getCurrentUser } from '@/lib/auth/session';

export async function GET(req: Request, context: any) {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const url = new URL(req.url);
    const mode = url.searchParams.get('mode') || 'PRACTICE';
    
    const assessment = await AssessmentService.getAssessmentForClient(params.id, mode);

    return NextResponse.json({ assessment });
  } catch (error: any) {
    console.error('Get assessment error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch assessment' }, { status: 500 });
  }
}
