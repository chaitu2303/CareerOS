const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const PROD_URL = 'https://careeros-kontlk7nr-ck0815185-2081s-projects.vercel.app';

async function testUpload() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const email = `prod_upload_${Date.now()}@example.com`;
  const password = 'Password123!';

  console.log('1. Registering on PROD...');
  await page.goto(`${PROD_URL}/register`);
  await page.waitForSelector('#name-input', { state: 'visible', timeout: 60000 });
  await page.fill('#name-input', 'Prod Tester');
  await page.fill('#email-input', email);
  await page.fill('#password-input', password);
  await page.click('button[type="submit"]');
  
  await page.waitForURL(/.*\/onboarding/, { timeout: 15000 });
  console.log('Registration successful.');

  console.log('2. Direct API Upload to /api/extract...');
  const pdfPath = path.resolve(process.cwd(), 'test.pdf');
  const pdfBuffer = fs.readFileSync(pdfPath);

  const response = await context.request.post(`${PROD_URL}/api/extract`, {
    multipart: {
      file: {
        name: 'test.pdf',
        mimeType: 'application/pdf',
        buffer: pdfBuffer
      }
    }
  });

  console.log(`Upload Response Status: ${response.status()}`);
  
  const responseData = await response.json();
  if (response.ok()) {
    console.log('Extraction Success! Data:', Object.keys(responseData));
    if (responseData.basics && responseData.basics.name) {
      console.log('Extracted Name:', responseData.basics.name);
      console.log('✅ Real PDF extraction verified on PROD!');
    } else {
      console.log('Extraction succeeded but data format is missing basics.name.');
    }
  } else {
    console.error('Extraction Failed on PROD:', responseData);
  }

  await browser.close();
}

testUpload().catch(console.error);
