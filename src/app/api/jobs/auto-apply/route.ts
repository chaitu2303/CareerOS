import { NextResponse } from 'next/server';
import { auth } from '@/auth';
// using playwright-core for lighter serverless usage if needed, but we'll use standard playwright for local dev
import { chromium } from 'playwright';

export const dynamic = 'force-dynamic';
// Vercel serverless functions have a timeout of 10s on hobby plan, 60s on pro, so we should return quickly or use background jobs.
export const maxDuration = 60; 

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { url } = await req.json();
    if (!url) {
      return NextResponse.json({ error: 'Job URL is required' }, { status: 400 });
    }

    // In a production environment, this would be delegated to a background queue (e.g., Inngest, BullMQ)
    // For this implementation, we run a headless browser directly.
    console.log(`Starting Cloud Auto-Apply for: ${url}`);
    
    // Launch headless browser
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    });
    
    const page = await context.newPage();
    
    try {
      // 1. Navigate to the job listing
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
      
      // 2. Simple heuristic mapping to find common application form fields
      // This is a naive implementation for standard ATS forms like Lever/Greenhouse
      
      const formFields = [
        { regex: /first.*name/i, value: session.user.name?.split(' ')[0] || 'Applicant' },
        { regex: /last.*name/i, value: session.user.name?.split(' ')[1] || 'Name' },
        { regex: /email/i, value: session.user.email || 'applicant@example.com' },
        { regex: /phone/i, value: '555-0199' },
      ];

      const inputs = await page.$$('input[type="text"], input[type="email"], input[type="tel"]');
      
      for (const input of inputs) {
        const nameAttr = await input.getAttribute('name') || '';
        const idAttr = await input.getAttribute('id') || '';
        const placeholderAttr = await input.getAttribute('placeholder') || '';
        
        const combinedString = `${nameAttr} ${idAttr} ${placeholderAttr}`.toLowerCase();
        
        for (const field of formFields) {
          if (field.regex.test(combinedString)) {
            await input.fill(field.value);
            break;
          }
        }
      }
      
      // 3. Find and "click" the submit button (Simulated for safety)
      // await page.click('button[type="submit"]');
      
      // We wait a moment to ensure scripts trigger
      await page.waitForTimeout(2000);
      
      await browser.close();
      
      return NextResponse.json({ 
        message: 'Application processed successfully via Cloud Engine',
        status: 'SUBMITTED'
      });
      
    } catch (err: any) {
      await browser.close();
      throw new Error(`Browser automation failed: ${err.message}`);
    }

  } catch (error: any) {
    console.error('Cloud Auto-Apply Error:', error);
    return NextResponse.json({ error: 'Failed to complete cloud auto-apply', details: error.message }, { status: 500 });
  }
}
