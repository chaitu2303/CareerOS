import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CareerIntelligenceEngine } from '@/lib/intelligence/CareerIntelligenceEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // if (!isAiAvailable()) {
    //   return NextResponse.json({ error: 'AI features are currently disabled.' }, { status: 503 });
    // }

    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const mimeType = file.type;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    
    const { parsedData } = await CareerIntelligenceEngine.Resume.parse(buffer, mimeType);

    return NextResponse.json({ 
      message: 'Extraction successful',
      parsedData
    });

  } catch (error: any) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
