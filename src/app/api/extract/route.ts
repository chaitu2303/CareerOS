import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractEntities } from '@/lib/ai/gateway';
import { MasterCareerSchema } from '@/lib/ai/schema';
import { LocalExtractionAdapter } from '@/lib/extraction/local-adapter';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { filePath, mimeType } = await req.json();

    if (!filePath || !filePath.startsWith(user.id)) {
      return NextResponse.json({ error: 'Invalid file path or ownership' }, { status: 403 });
    }

    // Download file from Supabase Storage securely
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('resumes')
      .download(filePath);

    if (downloadError || !fileData) {
      return NextResponse.json({ error: 'Failed to download file from secure storage' }, { status: 500 });
    }

    const arrayBuffer = await fileData.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Use the abstraction adapter
    const adapter = new LocalExtractionAdapter();
    let extractedText = await adapter.extract(buffer, mimeType);

    // Text normalization & PII-aware preprocessing (basic version)
    extractedText = extractedText.replace(/\s+/g, ' ').trim();
    const textToProcess = extractedText.substring(0, 15000);

    const parsedData = await extractEntities(
      `Extract all career facts accurately from this resume text. Do not invent any information. If a section is missing, return an empty array or null. Include your confidence score (0-100) and an exact source text snippet for each fact.\n\nRESUME TEXT:\n${textToProcess}`,
      MasterCareerSchema
    );

    return NextResponse.json({ 
      message: 'Extraction successful',
      parsedData
    });

  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
