import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, cameraAccess, micAccess, tabMonitoring, fullscreenMonitoring, clipboardLogging, videoRecording, audioRecording, visualSignals } = body;

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
