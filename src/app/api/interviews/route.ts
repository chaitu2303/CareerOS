import { NextResponse } from 'next/server';
import { InterviewOrchestrator } from '@/lib/interview/InterviewOrchestrator';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const authSession = await auth();
    const user = authSession?.user;
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    
    const session = await InterviewOrchestrator.initializeSession(user.id!, body);
    return NextResponse.json({ session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

