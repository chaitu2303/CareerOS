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
    
    # We want to replace user.id with user.id! or user?.id as string. But only if it's not already user.id!
    # Wait, the safest is to just find user.id and replace it with user.id! when it's passed to a function or used in where: { ... }
    # Let's replace 'user.id' with 'user.id!' if it's not followed by '!'
    
    # Wait, if we replace `user.id` with `user.id as string` it might break JSX.
    # `user.id!` is safe in TS.
    
    content = re.sub(r'user\.id(?!\!)', r'user.id!', content)
    content = re.sub(r'authUser\.id(?!\!)', r'authUser.id!', content)
    
    if content != original:
        with open(file, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {file}")
