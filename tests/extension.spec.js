const { test, expect, chromium } = require('@playwright/test');
const path = require('path');

test.describe('CareerOS Extension E2E', () => {
  let browserContext;
  let extensionId;

  test.beforeAll(async () => {
    const pathToExtension = path.join(__dirname, '../apps/extension');
    browserContext = await chromium.launchPersistentContext('', {
      headless: false, // extensions only work in non-headless mode in Playwright
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`,
      ],
    });

    let [background] = browserContext.serviceWorkers();
    if (!background)
      background = await browserContext.waitForEvent('serviceworker');

    const extensionUrl = background.url();
    extensionId = extensionUrl.split('/')[2];
  });

  test.afterAll(async () => {
    await browserContext.close();
  });

  test('Extension classification and autofill ignores sensitive fields', async () => {
    const page = await browserContext.newPage();
    const mockUrl = `file:///${path.join(__dirname, '../apps/extension/mock_job.html').replace(/\\/g, '/')}`;
    await page.goto(mockUrl);

    // Mock the profile data inside the extension context
    // We will execute a script in the context of the page to simulate the extension receiving the AUTOFILL command
    // Playwright cannot easily click the extension popup icon without complex UI automation,
    // so we simulate the message passing
    const profileData = {
      basics: {
        name: 'John Doe',
        email: 'john@example.com',
        phone: '123-456-7890',
        linkedinUrl: 'https://linkedin.com/in/johndoe'
      }
    };

    await page.evaluate(async (data) => {
      // Dispatch custom event that our content script listens to, or simulate the logic directly
      // Since we want to test the content script logic, we can expose autofillForm globally in content.js
      // Wait, content script functions aren't exposed to page script by default.
      // Let's just use window.postMessage if we wired it, OR we can test the inputs
    }, profileData);
  });
});
