# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\crawl.spec.ts >> Route Crawl & Features >> Register and complete onboarding
- Location: tests\crawl.spec.ts:6:7

# Error details

```
Error: expect(page).toHaveURL(expected) failed

Expected pattern: /.*\/dashboard/
Received string:  "http://localhost:3000/onboarding"
Timeout: 5000ms

Call log:
  - Expect "toHaveURL" with timeout 5000ms
    14 × unexpected value "http://localhost:3000/onboarding"

```

```yaml
- text: CareerOS System Initialization
- heading "Your Career. Operating System." [level=1]
- paragraph: We're building your Master Career Profile. This will act as the brain for your tailored resumes, applications, and mock interviews.
- button "Initialize Profile"
- text: Career Identity Master Profile Job Search Intelligence Practice Arenas Utility Studio
- alert
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Route Crawl & Features', () => {
  4  |   let email = `crawl_${Date.now()}@example.com`;
  5  |   
  6  |   test('Register and complete onboarding', async ({ page }) => {
  7  |     // 1. Register
  8  |     await page.goto('http://localhost:3000/register');
  9  |     await page.fill('#name-input', 'Crawler Bot');
  10 |     await page.fill('#email-input', email);
  11 |     await page.fill('#password-input', 'Password123!');
  12 |     await page.click('button[type="submit"]');
  13 |     await expect(page).toHaveURL(/.*\/onboarding/, { timeout: 10000 });
  14 |     
  15 |     // 2. Skip onboarding (assuming there's a skip or next button, or we can just navigate to dashboard and it gets handled, wait we need to complete it)
  16 |     // Actually, let's call the API to complete onboarding to make it fast
  17 |     await page.request.post('http://localhost:3000/api/profile/save', {
  18 |       data: {
  19 |         step: 4,
  20 |         onboardingCompleted: true
  21 |       }
  22 |     });
  23 |     
  24 |     // 3. Go to Dashboard
  25 |     await page.goto('http://localhost:3000/dashboard');
> 26 |     await expect(page).toHaveURL(/.*\/dashboard/);
     |                        ^ Error: expect(page).toHaveURL(expected) failed
  27 |   });
  28 | 
  29 |   const routes = [
  30 |     '/dashboard',
  31 |     '/dashboard/profile',
  32 |     '/dashboard/ats',
  33 |     '/dashboard/code',
  34 |     '/dashboard/assess',
  35 |     '/dashboard/interview',
  36 |     '/dashboard/paths',
  37 |     '/dashboard/passport',
  38 |     '/dashboard/performance',
  39 |     '/dashboard/settings',
  40 |     '/dashboard/tools'
  41 |   ];
  42 | 
  43 |   for (const route of routes) {
  44 |     test(`Visit ${route}`, async ({ page }) => {
  45 |       // Login first
  46 |       await page.goto('http://localhost:3000/login');
  47 |       await page.fill('#email-input', email);
  48 |       await page.fill('#password-input', 'Password123!');
  49 |       await page.click('button[type="submit"]');
  50 |       
  51 |       // Wait for navigation
  52 |       await page.waitForURL(/.*\/dashboard/);
  53 | 
  54 |       // Listen for console errors
  55 |       const errors: string[] = [];
  56 |       page.on('pageerror', error => errors.push(error.message));
  57 |       
  58 |       const res = await page.goto(`http://localhost:3000${route}`);
  59 |       expect(res?.status()).toBe(200);
  60 |       
  61 |       // Ensure no 404 or 500 text is shown
  62 |       const bodyText = await page.textContent('body');
  63 |       expect(bodyText).not.toContain('404');
  64 |       expect(bodyText).not.toContain('500');
  65 |       
  66 |       // Expect no unhandled page errors
  67 |       expect(errors).toHaveLength(0);
  68 |     });
  69 |   }
  70 | });
  71 | 
```