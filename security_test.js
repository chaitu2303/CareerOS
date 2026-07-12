
async function runTests() {
  const baseUrl = 'https://careeros-iota.vercel.app';
  console.log('Running Security Audit on', baseUrl);
  const matrix = [];

  // 1. Unauthenticated Dashboard Access (Should redirect to / or throw error boundary)
  const dashRes = await fetch(baseUrl + '/dashboard', { redirect: 'manual' });
  const isRedirect = dashRes.status === 307 || dashRes.status === 308 || dashRes.status === 302;
  matrix.push({ Route: '/dashboard', Test: 'Unauthenticated Access', Expected: 'Redirect', Actual: isRedirect ? 'Redirect' : dashRes.status, Status: isRedirect ? 'PASS' : 'FAIL' });

  // 2. Unauthenticated API - Code Submit (Should 401)
  const submitRes = await fetch(baseUrl + '/api/code/submit', { method: 'POST', body: JSON.stringify({}) });
  matrix.push({ Route: '/api/code/submit', Test: 'Unauthenticated API', Expected: 401, Actual: submitRes.status, Status: submitRes.status === 401 ? 'PASS' : 'FAIL' });

  // 3. Unauthenticated API - Interviews (Should 401)
  const intRes = await fetch(baseUrl + '/api/interviews', { method: 'POST', body: JSON.stringify({}) });
  matrix.push({ Route: '/api/interviews', Test: 'Unauthenticated API', Expected: 401, Actual: intRes.status, Status: intRes.status === 401 ? 'PASS' : 'FAIL' });

  // 4. Missing Env Fallback Test (Mock route check)
  const mockRes = await fetch(baseUrl + '/api/auth/session');
  matrix.push({ Route: '/api/auth/*', Test: 'Mock Auth Removed', Expected: 404, Actual: mockRes.status, Status: mockRes.status === 404 ? 'PASS' : 'FAIL' });

  console.table(matrix);
}
runTests();

