# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.js >> CareerOS Production E2E Tests >> Mobile Viewport Login
- Location: tests\e2e.spec.js:93:3

# Error details

```
Test timeout of 60000ms exceeded.
```

```
Error: locator.fill: Test timeout of 60000ms exceeded.
Call log:
  - waiting for getByLabel('Email')

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - img [ref=e4]
  - heading "This page couldn’t load" [level=1] [ref=e6]
  - paragraph [ref=e7]: Reload to try again, or go back.
  - generic [ref=e8]:
    - button "Reload" [ref=e10] [cursor=pointer]
    - button "Back" [ref=e11] [cursor=pointer]
```

# Test source

```ts
  1   | const { test, expect } = require('@playwright/test');
  2   | 
  3   | const PROD_URL = 'https://careeros-iota.vercel.app';
  4   | 
  5   | test.describe('CareerOS Production E2E Tests', () => {
  6   |   const user1Email = `testuser1_${Date.now()}@example.com`;
  7   |   const user2Email = `testuser2_${Date.now()}@example.com`;
  8   |   const password = 'Password123!';
  9   |   const name = 'Test User';
  10  | 
  11  |   test.describe.configure({ mode: 'serial' });
  12  | 
  13  |   test('User 1: Signup, Onboarding, and Routing', async ({ page }) => {
  14  |     test.setTimeout(60000);
  15  |     // 1. Signup — button now says "Create Account"
  16  |     await page.goto(`${PROD_URL}/register`);
  17  |     await page.getByLabel('Full Name').fill(name);
  18  |     await page.getByLabel('Email').fill(user1Email);
  19  |     // Password label has trailing "(min 8 characters)" — use exact:false
  20  |     await page.getByLabel('Password', { exact: false }).fill(password);
  21  |     await page.getByRole('button', { name: 'Create Account' }).click();
  22  | 
  23  |     // After register, new flow: auto-signin → /onboarding (no intermediate /login step)
  24  |     await page.waitForURL('**/onboarding', { timeout: 30000 });
  25  |     expect(page.url()).toContain('/onboarding');
  26  | 
  27  |     // 2. API Validations for Core Modules (session cookie carried by page.request)
  28  | 
  29  |     // A. Profile API returns profile data (no write to avoid marking onboarding complete)
  30  |     const profileRes = await page.request.get(`${PROD_URL}/api/profile`);
  31  |     expect(profileRes.status()).toBe(200);
  32  | 
  33  |     // B. Application Tracker CRUD — Create
  34  |     const createRes = await page.request.post(`${PROD_URL}/api/applications`, {
  35  |       data: { company: 'Vercel', roleTitle: 'Engineer', status: 'SAVED', notes: 'Test note' }
  36  |     });
  37  |     expect(createRes.status()).toBe(200);
  38  |     const createdApp = await createRes.json();
  39  |     expect(createdApp.application.id).toBeDefined();
  40  | 
  41  |     // Read
  42  |     const readRes = await page.request.get(`${PROD_URL}/api/applications`);
  43  |     expect(readRes.status()).toBe(200);
  44  |     const appsBody = await readRes.json();
  45  |     expect(appsBody.applications.length).toBeGreaterThan(0);
  46  | 
  47  |     // C. Assessments list loads
  48  |     const assessRes = await page.request.get(`${PROD_URL}/api/assessments`);
  49  |     expect(assessRes.status()).toBe(200);
  50  | 
  51  |     // D. Health check (confirms server is up, avoids redirect-looping page requests)
  52  |     const healthRes = await page.request.get(`${PROD_URL}/api/health`);
  53  |     expect(healthRes.status()).toBe(200);
  54  | 
  55  |     // 3. Logout via Auth.js signout endpoint
  56  |     await page.goto(`${PROD_URL}/api/auth/signout`);
  57  |     const signoutBtn = page.getByRole('button', { name: /sign out/i });
  58  |     if (await signoutBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
  59  |       await signoutBtn.click();
  60  |       await page.waitForLoadState('networkidle');
  61  |     }
  62  |   });
  63  | 
  64  |   test('User 2: Cross Account Isolation', async ({ page }) => {
  65  |     test.setTimeout(60000);
  66  |     // Signup user 2
  67  |     await page.goto(`${PROD_URL}/register`);
  68  |     await page.getByLabel('Full Name').fill(name);
  69  |     await page.getByLabel('Email').fill(user2Email);
  70  |     await page.getByLabel('Password', { exact: false }).fill(password);
  71  |     await page.getByRole('button', { name: 'Create Account' }).click();
  72  | 
  73  |     // New flow goes directly to /onboarding
  74  |     await page.waitForURL('**/onboarding', { timeout: 30000 });
  75  | 
  76  |     // User 2's application list must be empty (proving cross-user isolation)
  77  |     const response = await page.request.get(`${PROD_URL}/api/applications`);
  78  |     expect(response.status()).toBe(200);
  79  |     const body = await response.json();
  80  |     expect(body.applications).toEqual([]);
  81  | 
  82  |     // Sign out user 2 before next test
  83  |     await page.goto(`${PROD_URL}/api/auth/signout`);
  84  |     const signoutBtn2 = page.getByRole('button', { name: /sign out/i });
  85  |     if (await signoutBtn2.isVisible({ timeout: 5000 }).catch(() => false)) {
  86  |       await signoutBtn2.click();
  87  |       await page.waitForLoadState('networkidle');
  88  |     }
  89  |     // Ensure clean slate for next test
  90  |     await page.context().clearCookies();
  91  |   });
  92  | 
  93  |   test('Mobile Viewport Login', async ({ page }) => {
  94  |     test.setTimeout(60000);
  95  |     // Clear any session leftover from previous test (serial mode shares browser context)
  96  |     await page.context().clearCookies();
  97  |     await page.setViewportSize({ width: 375, height: 667 });
  98  |     await page.goto(`${PROD_URL}/login`);
> 99  |     await page.getByLabel('Email').fill(user1Email);
      |                                    ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  100 |     await page.getByLabel('Password', { exact: false }).fill(password);
  101 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  102 |     // User 1 completed onboarding? If not, may land on /onboarding again
  103 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  104 |     expect(page.url()).toMatch(/\/(dashboard|onboarding)/);
  105 |   });
  106 | 
  107 |   test('Core Workflows & Tools', async ({ page }) => {
  108 |     test.setTimeout(90000);
  109 |     // Login as User 1
  110 |     await page.goto(`${PROD_URL}/login`);
  111 |     await page.getByLabel('Email').fill(user1Email);
  112 |     await page.getByLabel('Password', { exact: false }).fill(password);
  113 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  114 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  115 | 
  116 |     // 1. Resume Creation (API)
  117 |     const resumeRes = await page.request.post(`${PROD_URL}/api/resumes`, {
  118 |       data: { mode: 'BLANK', title: 'E2E Blank Resume' }
  119 |     });
  120 |     expect(resumeRes.status()).toBe(200);
  121 |     const createdResume = await resumeRes.json();
  122 | 
  123 |     // 2. Job Intelligence (Native Engine)
  124 |     const jobRes = await page.request.post(`${PROD_URL}/api/jobs/analyze`, {
  125 |       data: { text: 'Looking for a software engineer with Next.js experience.', sourceType: 'TEXT' }
  126 |     });
  127 |     expect(jobRes.status()).toBe(200);
  128 | 
  129 |     // 3. ATS Analysis (fetch version ID first)
  130 |     const resumeDetailsRes = await page.request.get(`${PROD_URL}/api/resumes/${createdResume.resumeId}`);
  131 |     expect(resumeDetailsRes.status()).toBe(200);
  132 |     const resumeDetails = await resumeDetailsRes.json();
  133 |     const versionId = resumeDetails.resume.versions[0].id;
  134 | 
  135 |     const atsRes = await page.request.post(
  136 |       `${PROD_URL}/api/resumes/${createdResume.resumeId}/versions/${versionId}/ats`
  137 |     );
  138 |     expect(atsRes.status()).toBe(200);
  139 | 
  140 |     // 4. Utility Studio Navigation
  141 |     await page.goto(`${PROD_URL}/dashboard/tools`);
  142 |     expect(page.url()).toContain('/dashboard/tools');
  143 |   });
  144 | 
  145 |   test('Error States & Unauthorized Access', async ({ request, page }) => {
  146 |     test.setTimeout(30000);
  147 |     // 1. 401 on unauthenticated API access
  148 |     const unauthorizedRes = await request.get(`${PROD_URL}/api/profile`);
  149 |     expect(unauthorizedRes.status()).toBe(401);
  150 | 
  151 |     // 2. Dashboard redirects unauthenticated user to /login (302/200 after redirect)
  152 |     const dashRes = await page.goto(`${PROD_URL}/dashboard`);
  153 |     expect(page.url()).toContain('/login');
  154 |   });
  155 | });
  156 | 
```