import { NextResponse } from 'next/server';
import { InterviewOrchestrator } from '@/lib/interview/InterviewOrchestrator';

export async function POST(req: Request) {
  try {
    // In a real app we'd get the user ID from the session. For testing we hardcode.
    const userId = "test-user-id"; // We'll bypass auth for test setup or fetch the real user in the test.
    const body = await req.json();
    
    const session = await InterviewOrchestrator.initializeSession(body.userId || userId, body);
    return NextResponse.json({ session });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
