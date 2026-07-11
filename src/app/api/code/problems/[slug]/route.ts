import { NextResponse } from 'next/server';
import { CodingService } from '@/lib/coding/CodingService';

export async function GET(req: Request, context: any) {
  try {
    const params = await context.params;
    const problem = await CodingService.getProblemDetails(params.slug);

    if (!problem) {
      return NextResponse.json({ error: 'Problem not found' }, { status: 404 });
    }

    return NextResponse.json({ problem });
  } catch (error: any) {
    console.error('Get problem error:', error);
    return NextResponse.json({ error: 'Failed to fetch problem' }, { status: 500 });
  }
}
