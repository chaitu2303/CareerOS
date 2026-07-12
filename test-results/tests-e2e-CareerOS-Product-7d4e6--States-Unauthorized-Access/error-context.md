# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\e2e.spec.js >> CareerOS Production E2E Tests >> Error States & Unauthorized Access
- Location: tests\e2e.spec.js:167:3

# Error details

```
Error: expect(received).toContain(expected) // indexOf

Expected substring: "/login"
Received string:    "https://careeros-iota.vercel.app/"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - main [ref=e2]:
    - heading "CareerOS AI" [level=1] [ref=e3]
    - paragraph [ref=e4]: One intelligent platform for Resume Building, Job Tailoring, ATS Optimization, AI Video Interviews, and Application Copilot.
    - link "Get Started" [ref=e5] [cursor=pointer]:
      - /url: /login
      - button "Get Started" [ref=e6]
  - alert [ref=e7]
```

# Test source

```ts
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
  99  |     await page.getByLabel('Email').fill(user1Email);
  100 |     await page.getByLabel('Password', { exact: false }).fill(password);
  101 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  102 |     // User 1 completed onboarding? If not, may land on /onboarding again
  103 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  104 |     expect(page.url()).toMatch(/\/(dashboard|onboarding)/);
  105 |   });
  106 | 
  107 |   test('Core Workflows & Tools', async ({ page }) => {
  108 |     test.setTimeout(90000);
  109 |     // Clear any leftover session from previous test
  110 |     await page.context().clearCookies();
  111 | 
  112 |     // Login as User 1
  113 |     await page.goto(`${PROD_URL}/login`);
  114 |     await page.getByLabel('Email').fill(user1Email);
  115 |     await page.getByLabel('Password', { exact: false }).fill(password);
  116 |     await page.getByRole('button', { name: 'Sign In', exact: true }).click();
  117 |     await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
  118 | 
  119 |     // Complete onboarding via API so dashboard routes are accessible
  120 |     const onboardRes = await page.request.post(`${PROD_URL}/api/profile/save`, {
  121 |       data: {
  122 |         facts: {
  123 |           basics: {
  124 |             value: {
  125 |               name: 'Test User',
  126 |               domain: 'swe',
  127 |               department: 'Software Engineering',
  128 |               targetRole: 'Full Stack Developer',
  129 |               careerGoal: 'Build great products'
  130 |             }
  131 |           }
  132 |         }
  133 |       }
  134 |     });
  135 |     expect(onboardRes.status()).toBe(200);
  136 | 
  137 |     // 1. Resume Creation (API)
  138 |     const resumeRes = await page.request.post(`${PROD_URL}/api/resumes`, {
  139 |       data: { mode: 'BLANK', title: 'E2E Blank Resume' }
  140 |     });
  141 |     expect(resumeRes.status()).toBe(200);
  142 |     const createdResume = await resumeRes.json();
  143 | 
  144 |     // 2. Job Intelligence (Native Engine)
  145 |     const jobRes = await page.request.post(`${PROD_URL}/api/jobs/analyze`, {
  146 |       data: { text: 'Looking for a software engineer with Next.js experience.', sourceType: 'TEXT' }
  147 |     });
  148 |     expect(jobRes.status()).toBe(200);
  149 | 
  150 |     // 3. ATS Analysis (fetch version ID first)
  151 |     const resumeDetailsRes = await page.request.get(`${PROD_URL}/api/resumes/${createdResume.resumeId}`);
  152 |     expect(resumeDetailsRes.status()).toBe(200);
  153 |     const resumeDetails = await resumeDetailsRes.json();
  154 |     const versionId = resumeDetails.resume.versions[0].id;
  155 | 
  156 |     const atsRes = await page.request.post(
  157 |       `${PROD_URL}/api/resumes/${createdResume.resumeId}/versions/${versionId}/ats`
  158 |     );
  159 |     expect(atsRes.status()).toBe(200);
  160 | 
  161 |     // 4. Utility Studio Navigation (full page navigate — onboarding now complete)
  162 |     await page.goto(`${PROD_URL}/dashboard/tools`);
  163 |     await page.waitForURL('**/dashboard/tools', { timeout: 15000 });
  164 |     expect(page.url()).toContain('/dashboard/tools');
  165 |   });
  166 | 
  167 |   test('Error States & Unauthorized Access', async ({ request, page }) => {
  168 |     test.setTimeout(30000);
  169 |     // 1. 401 on unauthenticated API access (fresh request context, no cookies by design)
  170 |     const unauthorizedRes = await request.get(`${PROD_URL}/api/profile`);
  171 |     expect(unauthorizedRes.status()).toBe(401);
  172 | 
  173 |     // 2. Dashboard redirects unauthenticated user to /login
  174 |     // Clear session from previous test first to ensure truly unauthenticated
  175 |     await page.context().clearCookies();
  176 |     await page.goto(`${PROD_URL}/dashboard`);
> 177 |     expect(page.url()).toContain('/login');
      |                        ^ Error: expect(received).toContain(expected) // indexOf
  178 |   });
  179 | });
  180 | 
```