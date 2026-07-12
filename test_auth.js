import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000';

async function testAuth() {
  console.log('--- Starting Auth E2E Test ---');
  
  // 1. Register User A
  const userA = { email: 'userA@example.com', password: 'password123', name: 'User A' };
  const regA = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userA)
  });
  console.log('Register User A:', regA.status);

  // 2. Register User B
  const userB = { email: 'userB@example.com', password: 'password123', name: 'User B' };
  const regB = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userB)
  });
  console.log('Register User B:', regB.status);

  // Note: For NextAuth credentials login, we'd need to simulate the login form or use an API route that returns the session cookie.
  // Since this is a test script, we might need a custom test endpoint or rely on Prisma directly to verify DB state.
  
  console.log('Auth test setup complete. For full session testing, playwright/cypress is recommended.');
}

testAuth().catch(console.error);
