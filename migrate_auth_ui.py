import os
import glob
import re

directories = ['e:/Ai Job Tracer/careeros/src/app/dashboard', 'e:/Ai Job Tracer/careeros/src/app/onboarding', 'e:/Ai Job Tracer/careeros/src/components']
files = []
for d in directories:
    files.extend(glob.glob(f'{d}/**/*.tsx', recursive=True))
    files.extend(glob.glob(f'{d}/**/*.ts', recursive=True))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Replace import
    content = content.replace("import { createClient } from '@/utils/supabase/server';", "import { auth } from '@/auth';")
    content = content.replace('import { createClient } from "@/utils/supabase/server";', "import { auth } from '@/auth';")
    
    # In some pages, they might use createClient from client. We'll handle server first.

    # Replace getUser -> authUser
    content = re.sub(
        r'const\s+supabase\s*=\s*await\s+createClient\(\);?\s*const\s+\{\s*data\:\s*\{\s*user\:\s*authUser\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);?',
        r'const session = await auth();\n  const authUser = session?.user;',
        content
    )
    
    # Replace getUser -> user
    content = re.sub(
        r'const\s+supabase\s*=\s*await\s+createClient\(\);?\s*const\s+\{\s*data\:\s*\{\s*user\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);?',
        r'const session = await auth();\n  const user = session?.user;',
        content
    )

    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
