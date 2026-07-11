import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, type, metadata } = body;

    if (!sessionId || !type) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // In production we would rate-limit and validate the event type strictly
    const validTypes = ['TAB_HIDDEN', 'WINDOW_BLUR', 'FULLSCREEN_EXIT', 'COPY_ATTEMPT', 'PASTE_ATTEMPT', 'CAMERA_DISABLED', 'MIC_DISABLED', 'FACE_NOT_PRESENT'];
    if (!validTypes.includes(type)) {
      return NextResponse.json({ error: 'Invalid event type' }, { status: 400 });
    }

    await prisma.interviewIntegrityEvent.create({
      data: {
        sessionId,
        type,
        metadata: metadata || {},
        severity: type.includes('ATTEMPT') ? 'WARNING' : 'INFO'
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
