# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\crawl.spec.ts >> Route Crawl & Features >> Visit /dashboard/profile
- Location: tests\crawl.spec.ts:44:9

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e3]:
    - generic [ref=e4]:
      - heading "Welcome back" [level=1] [ref=e5]
      - paragraph [ref=e6]: Sign in to your CareerOS account
    - generic [ref=e7]: Invalid email or password. Please try again.
    - generic [ref=e8]:
      - generic [ref=e9]:
        - generic [ref=e10]: Email
        - textbox "Email" [ref=e11]: crawl_1783863601327@example.com
      - generic [ref=e12]:
        - generic [ref=e13]:
          - generic [ref=e14]: Password
          - link "Forgot password?" [ref=e15] [cursor=pointer]:
            - /url: /forgot-password
        - generic [ref=e16]:
          - textbox "Password" [ref=e17]: Password123!
          - button "Show password" [ref=e18]:
            - img [ref=e19]
      - button "Sign In" [ref=e22]
    - generic [ref=e27]: Or continue with
    - button "Sign in with Google" [ref=e28]:
      - img [ref=e29]
      - text: Sign in with Google
    - generic [ref=e34]:
      - text: Don't have an account?
      - link "Create one" [ref=e35] [cursor=pointer]:
        - /url: /register
  - alert [ref=e36]
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
  26 |     await expect(page).toHaveURL(/.*\/dashboard/);
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
> 52 |       await page.waitForURL(/.*\/dashboard/);
     |                  ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
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