import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { CareerIntelligenceEngine } from '@/lib/intelligence/CareerIntelligenceEngine';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const session = await auth();
    const user = session?.user;

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized', stage: 'auth' }, { status: 401 });
    }

    let formData: FormData;
    try {
      formData = await req.formData();
    } catch (e) {
      return NextResponse.json({ error: 'Failed to parse form data', stage: 'upload' }, { status: 400 });
    }

    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'No file provided', stage: 'validation' }, { status: 400 });
    }

    if (file.size > 4.5 * 1024 * 1024) {
      return NextResponse.json({ error: 'File exceeds 4.5MB limit for serverless upload', stage: 'validation' }, { status: 400 });
    }

    const mimeType = file.type;
    let buffer: Buffer;
    try {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } catch (e) {
      return NextResponse.json({ error: 'Failed to read file buffer', stage: 'validation' }, { status: 400 });
    }
    
    let parsedData;
    try {
      const result = await CareerIntelligenceEngine.Resume.parse(buffer, mimeType);
      parsedData = result.parsedData;
    } catch (e: any) {
      console.error('Extraction Engine Error:', e);
      return NextResponse.json({ error: 'Failed to extract text from document. Ensure it is a valid PDF or DOCX.', stage: 'extraction', details: e.message }, { status: 422 });
    }

    return NextResponse.json({ 
      message: 'Extraction successful',
      parsedData
    });

  } catch (error: any) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Internal server error', stage: 'unknown' }, { status: 500 });
  }
}
