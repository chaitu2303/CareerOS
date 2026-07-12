import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test.describe('E2E Features', () => {
  let cookies: any;

  test('Resume Upload & Extraction', async ({ page, request }) => {
    // 1. Register a fresh user
    const email = `resume_${Date.now()}@example.com`;
    await page.goto('http://localhost:3000/register');
    await page.fill('#name-input', 'Resume Tester');
    await page.fill('#email-input', email);
    await page.fill('#password-input', 'Password123!');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL(/.*\/onboarding/, { timeout: 10000 });
    
    // 2. We are on onboarding page. Test the upload.
    // The user has test.pdf in the root directory.
    const pdfPath = path.resolve(process.cwd(), 'test.pdf');
    if (fs.existsSync(pdfPath)) {
      // Find the file input and upload
      const fileInput = page.locator('input[type="file"]');
      await expect(fileInput).toBeAttached();
      await fileInput.setInputFiles(pdfPath);
      
      // Wait for extraction to complete (it should show extracted data forms or a success message)
      // We will look for some text from the resume or a specific element that shows up after extraction
      await expect(page.locator('text="Extraction Complete"').or(page.locator('text="Review your profile"'))).toBeVisible({ timeout: 15000 });
    }
  });
});
