import { NextResponse } from 'next/server';
import { AssessmentService } from '@/lib/assessment/AssessmentService';
import { auth } from '@/auth';

export async function POST(req: Request, context: any) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const { mode = 'PRACTICE' } = await req.json();

    const attempt = await AssessmentService.startAttempt(user.id!, params.id, mode);

    return NextResponse.json({ attempt });
  } catch (error: any) {
    console.error('Start attempt error:', error);
    return NextResponse.json({ error: error.message || 'Failed to start attempt' }, { status: 500 });
  }
}
