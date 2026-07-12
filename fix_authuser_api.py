import glob
import re

directories = ['e:/Ai Job Tracer/careeros/src/app/api']
files = []
for d in directories:
    files.extend(glob.glob(f'{d}/**/*.ts', recursive=True))

for file in files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content
    
    # Replace getUser -> authUser
    content = re.sub(
        r'const\s+supabase\s*=\s*await\s+createClient\(\);?\s*const\s+\{\s*data\:\s*\{\s*user\:\s*authUser\s*\}\s*\}\s*=\s*await\s+supabase\.auth\.getUser\(\);?',
        r'const session = await auth();\n    const authUser = session?.user;',
        content
    )
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
