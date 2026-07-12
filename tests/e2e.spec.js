const { test, expect } = require('@playwright/test');

const PROD_URL = 'https://careeros-iota.vercel.app';

test.describe('CareerOS Production E2E Tests', () => {
  const user1Email = `testuser1_${Date.now()}@example.com`;
  const user2Email = `testuser2_${Date.now()}@example.com`;
  const password = 'Password123!';
  const name = 'Test User';

  test.describe.configure({ mode: 'serial' });

  test('User 1: Signup, Onboarding, and Routing', async ({ page }) => {
    test.setTimeout(60000);
    // 1. Signup — button now says "Create Account"
    await page.goto(`${PROD_URL}/register`);
    await page.getByLabel('Full Name').fill(name);
    await page.getByLabel('Email').fill(user1Email);
    // Password label has trailing "(min 8 characters)" — use exact:false
    await page.getByLabel('Password', { exact: false }).fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // After register, new flow: auto-signin → /onboarding (no intermediate /login step)
    await page.waitForURL('**/onboarding', { timeout: 30000 });
    expect(page.url()).toContain('/onboarding');

    // 2. API Validations for Core Modules (session cookie carried by page.request)

    // A. Profile API returns profile data (no write to avoid marking onboarding complete)
    const profileRes = await page.request.get(`${PROD_URL}/api/profile`);
    expect(profileRes.status()).toBe(200);

    // B. Application Tracker CRUD — Create
    const createRes = await page.request.post(`${PROD_URL}/api/applications`, {
      data: { company: 'Vercel', roleTitle: 'Engineer', status: 'SAVED', notes: 'Test note' }
    });
    expect(createRes.status()).toBe(200);
    const createdApp = await createRes.json();
    expect(createdApp.application.id).toBeDefined();

    // Read
    const readRes = await page.request.get(`${PROD_URL}/api/applications`);
    expect(readRes.status()).toBe(200);
    const appsBody = await readRes.json();
    expect(appsBody.applications.length).toBeGreaterThan(0);

    // C. Assessments list loads
    const assessRes = await page.request.get(`${PROD_URL}/api/assessments`);
    expect(assessRes.status()).toBe(200);

    // D. Health check (confirms server is up, avoids redirect-looping page requests)
    const healthRes = await page.request.get(`${PROD_URL}/api/health`);
    expect(healthRes.status()).toBe(200);

    // 3. Logout via Auth.js signout endpoint
    await page.goto(`${PROD_URL}/api/auth/signout`);
    const signoutBtn = page.getByRole('button', { name: /sign out/i });
    if (await signoutBtn.isVisible({ timeout: 5000 }).catch(() => false)) {
      await signoutBtn.click();
      await page.waitForLoadState('networkidle');
    }
  });

  test('User 2: Cross Account Isolation', async ({ page }) => {
    test.setTimeout(60000);
    // Signup user 2
    await page.goto(`${PROD_URL}/register`);
    await page.getByLabel('Full Name').fill(name);
    await page.getByLabel('Email').fill(user2Email);
    await page.getByLabel('Password', { exact: false }).fill(password);
    await page.getByRole('button', { name: 'Create Account' }).click();

    // New flow goes directly to /onboarding
    await page.waitForURL('**/onboarding', { timeout: 30000 });

    // User 2's application list must be empty (proving cross-user isolation)
    const response = await page.request.get(`${PROD_URL}/api/applications`);
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.applications).toEqual([]);
  });

  test('Mobile Viewport Login', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(`${PROD_URL}/login`);
    await page.getByLabel('Email').fill(user1Email);
    await page.getByLabel('Password', { exact: false }).fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    // User 1 completed onboarding? If not, may land on /onboarding again
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });
    expect(page.url()).toMatch(/\/(dashboard|onboarding)/);
  });

  test('Core Workflows & Tools', async ({ page }) => {
    test.setTimeout(90000);
    // Login as User 1
    await page.goto(`${PROD_URL}/login`);
    await page.getByLabel('Email').fill(user1Email);
    await page.getByLabel('Password', { exact: false }).fill(password);
    await page.getByRole('button', { name: 'Sign In', exact: true }).click();
    await page.waitForURL(/\/(dashboard|onboarding)/, { timeout: 30000 });

    // 1. Resume Creation (API)
    const resumeRes = await page.request.post(`${PROD_URL}/api/resumes`, {
      data: { mode: 'BLANK', title: 'E2E Blank Resume' }
    });
    expect(resumeRes.status()).toBe(200);
    const createdResume = await resumeRes.json();

    // 2. Job Intelligence (Native Engine)
    const jobRes = await page.request.post(`${PROD_URL}/api/jobs/analyze`, {
      data: { text: 'Looking for a software engineer with Next.js experience.', sourceType: 'TEXT' }
    });
    expect(jobRes.status()).toBe(200);

    // 3. ATS Analysis (fetch version ID first)
    const resumeDetailsRes = await page.request.get(`${PROD_URL}/api/resumes/${createdResume.resumeId}`);
    expect(resumeDetailsRes.status()).toBe(200);
    const resumeDetails = await resumeDetailsRes.json();
    const versionId = resumeDetails.resume.versions[0].id;

    const atsRes = await page.request.post(
      `${PROD_URL}/api/resumes/${createdResume.resumeId}/versions/${versionId}/ats`
    );
    expect(atsRes.status()).toBe(200);

    // 4. Utility Studio Navigation
    await page.goto(`${PROD_URL}/dashboard/tools`);
    expect(page.url()).toContain('/dashboard/tools');
  });

  test('Error States & Unauthorized Access', async ({ request, page }) => {
    test.setTimeout(30000);
    // 1. 401 on unauthenticated API access
    const unauthorizedRes = await request.get(`${PROD_URL}/api/profile`);
    expect(unauthorizedRes.status()).toBe(401);

    // 2. Dashboard redirects unauthenticated user to /login (302/200 after redirect)
    const dashRes = await page.goto(`${PROD_URL}/dashboard`);
    expect(page.url()).toContain('/login');
  });
});
