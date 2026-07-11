const { generateText } = require('ai');
const { createOpenAI } = require('@ai-sdk/openai');
require('dotenv').config({ path: '.env.staging' });

async function testAI() {
  console.log("--- Real AI Provider Validation ---");
  const openai = createOpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  if (!process.env.OPENAI_API_KEY) {
    console.error("❌ FAIL: OPENAI_API_KEY is not set in .env.staging");
    process.exit(1);
  }

  try {
    console.log("Sending ping to OpenAI...");
    const { text } = await generateText({
      model: openai('gpt-4o-mini'),
      prompt: 'Respond with exactly the word "pong".'
    });
    
    if (text.toLowerCase().includes('pong')) {
      console.log("✅ PASS: Real AI Provider successfully connected.");
    } else {
      console.log(`⚠️ WARNING: AI responded with unexpected text: ${text}`);
    }
  } catch (error) {
    console.error("❌ FAIL: AI Provider connection failed.", error.message);
    process.exit(1);
  }
}

testAI();
