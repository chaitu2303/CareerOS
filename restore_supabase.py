import glob
import re

files = [
    'e:/Ai Job Tracer/careeros/src/app/api/extract/route.ts',
    'e:/Ai Job Tracer/careeros/src/app/api/jobs/analyze/route.ts',
    'e:/Ai Job Tracer/careeros/src/app/api/resumes/[id]/tailor/route.ts',
    'e:/Ai Job Tracer/careeros/src/app/api/resumes/[id]/versions/[versionId]/ats/route.ts',
    'e:/Ai Job Tracer/careeros/src/app/api/resumes/[id]/versions/[versionId]/route.ts',
    'e:/Ai Job Tracer/careeros/src/app/api/resumes/ai-edit/route.ts',
    'e:/Ai Job Tracer/careeros/src/app/api/resumes/route.ts'
]

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    if 'supabase.' in content or 'supabase)' in content:
        # Add import if missing
        if 'createClient' not in content:
            content = "import { createClient } from '@/utils/supabase/server';\n" + content
            
        # Add const supabase = await createClient(); inside POST/GET
        # Let's insert it right after `const user = authSession?.user;` or `const user = session?.user;`
        # wait, my previous regex replaced it.
        # Let's just insert it after `const session = await auth();`
        content = re.sub(r'(const\s+session\s*=\s*await\s+auth\(\);)', r'\1\n    const supabase = await createClient();', content)
        
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
