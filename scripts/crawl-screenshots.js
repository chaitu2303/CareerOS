const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

async function crawl() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const email = `crawl_${Date.now()}@example.com`;
  const { PrismaClient } = require('@prisma/client');
  const bcrypt = require('bcryptjs');
  const prisma = new PrismaClient();

  const hashedPassword = await bcrypt.hash('Password123!', 10);
  await prisma.user.create({
    data: {
      name: 'Crawler Bot',
      email: email,
      password: hashedPassword,
      onboardingCompleted: true,
      careerProfile: {
        create: {
          currentRole: 'Software Engineer',
          targetRole: 'Senior Software Engineer',
          yearsOfExperience: 3,
        }
      }
    }
  });
  await prisma.$disconnect();

  console.log('Logging in...');
  await page.goto('http://localhost:3000/login');
  await page.fill('#email-input', email);
  await page.fill('#password-input', 'Password123!');
  await page.click('button[type="submit"]');
  
  try {
    await page.waitForURL(/.*\/onboarding/, { timeout: 10000 });
    console.log('Registration successful, now in onboarding.');
  } catch (e) {
    console.log('Failed to reach onboarding:', e);
  }

  // Complete onboarding via API
  console.log('Completing onboarding via API...');
  await page.evaluate(async () => {
    await fetch('/api/profile/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ step: 4, onboardingCompleted: true })
    });
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

  const screenshotsDir = path.join(__dirname, '../tests/screenshots');
  if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir, { recursive: true });
  }

  for (const route of routes) {
    console.log(`Visiting ${route}...`);
    try {
      const res = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'networkidle' });
      console.log(`Final URL for ${route}: ${page.url()}`);
      
      if (res && res.status() !== 200) {
        console.log(`Error on ${route}: HTTP ${res.status()}`);
      } else {
        const bodyText = await page.textContent('body');
        if (bodyText.includes('404') || bodyText.includes('500') || bodyText.toLowerCase().includes('error')) {
          console.log(`Possible error text on ${route}. Title: ${await page.title()}`);
        } else {
          console.log(`Success on ${route}`);
        }
      }
      const safeName = route.replace(/\//g, '_') || 'index';
      await page.screenshot({ path: path.join(screenshotsDir, `${safeName}.png`) });
    } catch (e) {
      console.log(`Failed to load ${route}:`, e.message);
    }
  }

  await browser.close();
}

crawl().catch(console.error);
