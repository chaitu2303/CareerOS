import { test, expect } from '@playwright/test';

test.describe('Authentication & Protected Routes', () => {
  const testEmail = `testuser_${Date.now()}@example.com`;
  const testPassword = 'Password123!';

  test('Protected route blocks unauthenticated access', async ({ page }) => {
    await page.goto('http://localhost:3000/dashboard');
    // Should redirect to login
    await expect(page).toHaveURL(/.*\/login/);
  });

  test('Registration Flow & Onboarding', async ({ page }) => {
    await page.goto('http://localhost:3000/register');
    
    // Check Google OAuth button
    await expect(page.locator('button:has-text("Sign up with Google")')).toBeVisible();

    // Fill registration
    await page.fill('#name-input', 'Test User');
    await page.fill('#email-input', testEmail);
    await page.fill('#password-input', testPassword);
    
    // Test show/hide password
    const passwordInput = page.locator('#password-input');
    await expect(passwordInput).toHaveAttribute('type', 'password');
    // Find the button inside the password field container (usually a button with an eye icon)
    const toggleButton = passwordInput.locator('..').locator('button');
    if (await toggleButton.count() > 0) {
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'text');
      await toggleButton.click();
      await expect(passwordInput).toHaveAttribute('type', 'password');
    }

    // Submit registration
    await page.click('button[type="submit"]');

    // Should redirect to onboarding since it's a new user
    await expect(page).toHaveURL(/.*\/onboarding/, { timeout: 10000 });
  });

  test('Login Flow', async ({ page }) => {
    // First, register a user directly in the test to ensure it exists
    const loginEmail = `login_${Date.now()}@example.com`;
    await page.goto('http://localhost:3000/register');
    await page.fill('#name-input', 'Test User Login');
    await page.fill('#email-input', loginEmail);
    await page.fill('#password-input', testPassword);
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/onboarding/, { timeout: 10000 });
    
    // Logout by going to default next-auth signout page
    await page.goto('http://localhost:3000/api/auth/signout');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('http://localhost:3000/');
    
    // Login
    await page.goto('http://localhost:3000/login');
    await page.fill('#email-input', loginEmail);
    await page.fill('#password-input', testPassword);
    await page.click('button[type="submit"]');
    
    // Should redirect to onboarding (since not completed) or dashboard
    await expect(page).toHaveURL(/.*\/onboarding|.*\/dashboard/, { timeout: 10000 });
  });

  test('Forgot Password Form Loads', async ({ page }) => {
    await page.goto('http://localhost:3000/login');
    await page.click('text="Forgot password?"');
    await expect(page).toHaveURL(/.*\/forgot-password/);
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});
