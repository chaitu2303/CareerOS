import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const authSession = await auth();
    const user = authSession?.user;
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { sessionId, cameraAccess, micAccess, tabMonitoring, fullscreenMonitoring, clipboardLogging, videoRecording, audioRecording, visualSignals } = body;

    
    const session = await prisma.interviewSession.findUnique({ where: { id: sessionId } });
    if (!session || session.userId !== user.id!) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing session ID' }, { status: 400 });
    }

    const consent = await prisma.interviewConsent.upsert({
      where: { sessionId },
      create: {
        sessionId,
        cameraAccess: !!cameraAccess,
        micAccess: !!micAccess,
        tabMonitoring: !!tabMonitoring,
        fullscreenMonitoring: !!fullscreenMonitoring,
        clipboardLogging: !!clipboardLogging,
        videoRecording: !!videoRecording,
        audioRecording: !!audioRecording,
        visualSignals: !!visualSignals
      },
      update: {
        cameraAccess: !!cameraAccess,
        micAccess: !!micAccess,
        tabMonitoring: !!tabMonitoring,
        fullscreenMonitoring: !!fullscreenMonitoring,
        clipboardLogging: !!clipboardLogging,
        videoRecording: !!videoRecording,
        audioRecording: !!audioRecording,
        visualSignals: !!visualSignals,
        consentedAt: new Date()
      }
    });

    return NextResponse.json({ success: true, consent });
  } catch (error: any) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
