import os
import glob
import re

api_dir = 'e:/Ai Job Tracer/careeros/src/app/api'
files = glob.glob(f'{api_dir}/**/*.ts', recursive=True)

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Replace import
    content = content.replace("import { createClient } from '@/utils/supabase/server';", "import { auth } from '@/auth';")
    content = content.replace('import { createClient } from "@/utils/supabase/server";', "import { auth } from '@/auth';")

    # Replace getUser
    content = re.sub(
        r'const\s+supabase\s*=\s*await\s+createClient\(\);?\s*const\s+\{\s*data\:\s*\{\s*user\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);?',
        r'const session = await auth();\n    const user = session?.user;',
        content
    )

    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
