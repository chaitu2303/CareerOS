import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { InterviewOrchestrator } from '@/lib/interview/InterviewOrchestrator';

export async function POST(req: Request, context: any) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const params = await context.params;
    const body = await req.json();
    
    // Process candidate answer
    const result = await InterviewOrchestrator.processTurn(params.id, body.answer, user.id!);
    return NextResponse.json({ result });
  } catch (error: any) {
    if (error.message === 'AI_UNAVAILABLE') {
      return NextResponse.json({ 
        error: 'AI_UNAVAILABLE',
        message: 'No functioning AI provider is configured. The interview session is safely paused. Please connect a provider.'
      }, { status: 503 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
