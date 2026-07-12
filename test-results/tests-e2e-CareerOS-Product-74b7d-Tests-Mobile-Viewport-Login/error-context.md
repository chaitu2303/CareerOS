# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.js >> CareerOS Production E2E Tests >> Mobile Viewport Login
- Location: tests\e2e.spec.js:83:3

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
  81  |   });
  82  | 
  83  |   test('Mobile Viewport Login', async ({ page }) => {
  84  |     test.setTimeout(60000);
  85  |     await page.setViewportSize({ width: 375, height: 667 });
  86  |     await page.goto(`${PROD_URL}/login`);
> 87  |     await page.getByLabel('Email').fill(user1Email);
      |                                    ^ Error: locator.fill: Test timeout of 60000ms exceeded.
  88  |     await page.getByLabel('Password', { exact: false }).fill(password);
  89  |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  90  |     // User 1 completed onboarding? If not, may land on /onboarding again
  91  |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  92  |     expect(page.url()).toMatch(/\/(dashboard|onboarding)/);
  93  |   });
  94  | 
  95  |   test('Core Workflows & Tools', async ({ page }) => {
  96  |     test.setTimeout(90000);
  97  |     // Login as User 1
  98  |     await page.goto(`${PROD_URL}/login`);
  99  |     await page.getByLabel('Email').fill(user1Email);
  100 |     await page.getByLabel('Password', { exact: false }).fill(password);
  101 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  102 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  103 | 
  104 |     // 1. Resume Creation (API)
  105 |     const resumeRes = await page.request.post(`${PROD_URL}/api/resumes`, {
  106 |       data: { mode: 'BLANK', title: 'E2E Blank Resume' }
  107 |     });
  108 |     expect(resumeRes.status()).toBe(200);
  109 |     const createdResume = await resumeRes.json();
  110 | 
  111 |     // 2. Job Intelligence (Native Engine)
  112 |     const jobRes = await page.request.post(`${PROD_URL}/api/jobs/analyze`, {
  113 |       data: { text: 'Looking for a software engineer with Next.js experience.', sourceType: 'TEXT' }
  114 |     });
  115 |     expect(jobRes.status()).toBe(200);
  116 | 
  117 |     // 3. ATS Analysis (fetch version ID first)
  118 |     const resumeDetailsRes = await page.request.get(`${PROD_URL}/api/resumes/${createdResume.resumeId}`);
  119 |     expect(resumeDetailsRes.status()).toBe(200);
  120 |     const resumeDetails = await resumeDetailsRes.json();
  121 |     const versionId = resumeDetails.resume.versions[0].id;
  122 | 
  123 |     const atsRes = await page.request.post(
  124 |       `${PROD_URL}/api/resumes/${createdResume.resumeId}/versions/${versionId}/ats`
  125 |     );
  126 |     expect(atsRes.status()).toBe(200);
  127 | 
  128 |     // 4. Utility Studio Navigation
  129 |     await page.goto(`${PROD_URL}/dashboard/tools`);
  130 |     expect(page.url()).toContain('/dashboard/tools');
  131 |   });
  132 | 
  133 |   test('Error States & Unauthorized Access', async ({ request, page }) => {
  134 |     test.setTimeout(30000);
  135 |     // 1. 401 on unauthenticated API access
  136 |     const unauthorizedRes = await request.get(`${PROD_URL}/api/profile`);
  137 |     expect(unauthorizedRes.status()).toBe(401);
  138 | 
  139 |     // 2. Dashboard redirects unauthenticated user to /login (302/200 after redirect)
  140 |     const dashRes = await page.goto(`${PROD_URL}/dashboard`);
  141 |     expect(page.url()).toContain('/login');
  142 |   });
  143 | });
  144 | 
```