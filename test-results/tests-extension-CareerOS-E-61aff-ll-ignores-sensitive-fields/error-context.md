# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: tests\extension.spec.js >> CareerOS Extension E2E >> Extension classification and autofill ignores sensitive fields
- Location: tests\extension.spec.js:30:3

# Error details

```
"beforeAll" hook timeout of 30000ms exceeded.
```

```
TypeError: Cannot read properties of undefined (reading 'close')
```

# Test source

```ts
  1  | const { test, expect, chromium } = require('@playwright/test');
  2  | const path = require('path');
  3  | 
  4  | test.describe('CareerOS Extension E2E', () => {
  5  |   let browserContext;
  6  |   let extensionId;
  7  | 
  8  |   test.beforeAll(async () => {
  9  |     const pathToExtension = path.join(__dirname, '../apps/extension');
  10 |     browserContext = await chromium.launchPersistentContext('', {
  11 |       headless: false, // extensions only work in non-headless mode in Playwright
  12 |       args: [
  13 |         `--disable-extensions-except=${pathToExtension}`,
  14 |         `--load-extension=${pathToExtension}`,
  15 |       ],
  16 |     });
  17 | 
  18 |     let [background] = browserContext.serviceWorkers();
  19 |     if (!background)
  20 |       background = await browserContext.waitForEvent('serviceworker');
  21 | 
  22 |     const extensionUrl = background.url();
  23 |     extensionId = extensionUrl.split('/')[2];
  24 |   });
  25 | 
  26 |   test.afterAll(async () => {
> 27 |     await browserContext.close();
     |                          ^ TypeError: Cannot read properties of undefined (reading 'close')
  28 |   });
  29 | 
  30 |   test('Extension classification and autofill ignores sensitive fields', async () => {
  31 |     const page = await browserContext.newPage();
  32 |     const mockUrl = `file:///${path.join(__dirname, '../apps/extension/mock_job.html').replace(/\\/g, '/')}`;
  33 |     await page.goto(mockUrl);
  34 | 
  35 |     // Mock the profile data inside the extension context
  36 |     // We will execute a script in the context of the page to simulate the extension receiving the AUTOFILL command
  37 |     // Playwright cannot easily click the extension popup icon without complex UI automation,
  38 |     // so we simulate the message passing
  39 |     const profileData = {
  40 |       basics: {
  41 |         name: 'John Doe',
  42 |         email: 'john@example.com',
  43 |         phone: '123-456-7890',
  44 |         linkedinUrl: 'https://linkedin.com/in/johndoe'
  45 |       }
  46 |     };
  47 | 
  48 |     await page.evaluate(async (data) => {
  49 |       // Dispatch custom event that our content script listens to, or simulate the logic directly
  50 |       // Since we want to test the content script logic, we can expose autofillForm globally in content.js
  51 |       // Wait, content script functions aren't exposed to page script by default.
  52 |       // Let's just use window.postMessage if we wired it, OR we can test the inputs
  53 |     }, profileData);
  54 |   });
  55 | });
  56 | 
```