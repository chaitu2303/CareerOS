import os
import glob
import re

directories = ['e:/Ai Job Tracer/careeros/src/app/api', 'e:/Ai Job Tracer/careeros/src/app/dashboard', 'e:/Ai Job Tracer/careeros/src/app/onboarding']
files = []
for d in directories:
    files.extend(glob.glob(f'{d}/**/*.ts', recursive=True))
    files.extend(glob.glob(f'{d}/**/*.tsx', recursive=True))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # In extract API, they might have used `supabase` somewhere
    # Replace `const supabase = await createClient();` with `// const session = await auth();` if it's there
    content = re.sub(
        r'const\s+supabase\s*=\s*await\s+createClient\(\);',
        r'',
        content
    )

    # Some API routes did `await createClient()` instead of `const supabase = await createClient()`
    content = re.sub(
        r'await\s+createClient\(\)',
        r'',
        content
    )

    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
