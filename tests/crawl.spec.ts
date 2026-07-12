import { test, expect } from '@playwright/test';

test.describe('Route Crawl & Features', () => {
  let email = `crawl_${Date.now()}@example.com`;
  
  test('Register and complete onboarding', async ({ page }) => {
    // 1. Register
    await page.goto('http://localhost:3000/register');
    await page.fill('#name-input', 'Crawler Bot');
    await page.fill('#email-input', email);
    await page.fill('#password-input', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/onboarding/, { timeout: 10000 });
    
    // 2. Skip onboarding (assuming there's a skip or next button, or we can just navigate to dashboard and it gets handled, wait we need to complete it)
    // Actually, let's call the API to complete onboarding to make it fast
    await page.request.post('http://localhost:3000/api/profile/save', {
      data: {
        step: 4,
        onboardingCompleted: true
      }
    });
    
    // 3. Go to Dashboard
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*\/dashboard/);
  });

  const routes = [
    '/dashboard',
    '/dashboard/profile',
    '/dashboard/ats',
    '/dashboard/code',
    '/dashboard/assess',
    '/dashboard/interview',
    '/dashboard/paths',
    '/dashboard/passport',
    '/dashboard/performance',
    '/dashboard/settings',
    '/dashboard/tools'
  ];

  for (const route of routes) {
    test(`Visit ${route}`, async ({ page }) => {
      // Login first
      await page.goto('http://localhost:3000/login');
      await page.fill('#email-input', email);
      await page.fill('#password-input', 'Password123!');
      await page.click('button[type="submit"]');
      
      // Wait for navigation
      await page.waitForURL(/.*\/dashboard/);

      // Listen for console errors
      const errors: string[] = [];
      page.on('pageerror', error => errors.push(error.message));
      
      const res = await page.goto(`http://localhost:3000${route}`);
      expect(res?.status()).toBe(200);
      
      // Ensure no 404 or 500 text is shown
      const bodyText = await page.textContent('body');
      expect(bodyText).not.toContain('404');
      expect(bodyText).not.toContain('500');
      
      // Expect no unhandled page errors
      expect(errors).toHaveLength(0);
    });
  }
});
