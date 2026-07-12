import { NextResponse } from 'next/server';
import { CodingService } from '@/lib/coding/CodingService';
import { auth } from '@/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const payload = await req.json();
    const { problemId, language, code } = payload;

    if (!problemId || !language || !code) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const result = await CodingService.submitCode(user.id!, problemId, language, code);

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Submit code error:', error);
    return NextResponse.json({ error: error.message || 'Failed to submit code' }, { status: 500 });
  }
}
