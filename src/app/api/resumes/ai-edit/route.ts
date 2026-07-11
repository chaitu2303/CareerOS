/**
 * POST /api/resumes/ai-edit
 * Natural language AI editing of a resume section.
 * Never fabricates — edits only what already exists.
 */
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { extractEntities } from '@/lib/ai/gateway';
import { ResumeContentSchema } from '@/lib/ai/resume-schema';
import type { ResumeContent } from '@/lib/ai/resume-schema';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user: authUser } } = await supabase.auth.getUser();
    if (!authUser) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { command, content } = await req.json() as { command: string; content: ResumeContent };

    if (!command?.trim()) {
      return NextResponse.json({ error: 'Command is required' }, { status: 400 });
    }

    const prompt = `You are a professional resume writer. Apply the following instruction to the resume content.

INSTRUCTION: ${command}

CURRENT RESUME CONTENT:
${JSON.stringify(content, null, 2)}

STRICT RULES:
1. Only improve what already exists. Do not add facts, skills, or experience not present in the content.
2. You may reword, restructure, reorder, and improve bullet points.
3. If the instruction asks you to add something you cannot verify (e.g. "add Python skill"), ignore that part.
4. Return the complete modified resume content as a structured JSON object matching the exact same schema.
5. Preserve all section types, section structure, IDs, and sourceFactIds.`;

    const updated = await extractEntities(prompt, ResumeContentSchema, {
      systemPrompt: 'You are a truthful resume writer. Never fabricate facts.',
    });

    return NextResponse.json({ content: updated });
  } catch (e) {
    console.error('[POST /api/resumes/ai-edit]', e);
    return NextResponse.json({ error: 'AI edit failed' }, { status: 500 });
  }
}
