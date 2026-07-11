/**
 * Milestone 6 Runtime Smoke Test
 * Tests: create resume → create JobTarget → create AtsReport → link → verify
 * Run: node scripts/test-m6.js
 */
const { Pool } = require('pg');
const crypto = require('crypto');
const uuidv4 = () => crypto.randomUUID();

const apiKey = process.env.DATABASE_URL
  ? (() => {
      try {
        return new URL(process.env.DATABASE_URL).searchParams.get('api_key');
      } catch { return null; }
    })()
  : 'eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xMCZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MTAmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAifQ';

const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
const pool = new Pool({ connectionString: decoded.databaseUrl });

let PASS = 0;
let FAIL = 0;

function ok(label, condition) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    PASS++;
  } else {
    console.log(`  ❌ FAIL: ${label}`);
    FAIL++;
  }
}

async function run() {
  console.log('\n🧪 MILESTONE 6 — Runtime Smoke Test\n');
  try {
    const userId = uuidv4();
    const resumeId = uuidv4();
    const versionId = uuidv4();
    const jobId = uuidv4();
    const reportId = uuidv4();

    console.log('1. Setup User & Dependencies');
    await pool.query(
      'INSERT INTO "User" (id, email, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())',
      [userId, `m6-test-${Date.now()}@careeros.local`]
    );

    const content = {
      templateId: 'clean',
      sections: [{ type: 'summary', visible: true, data: { text: 'Testing ATS' } }]
    };

    await pool.query(
      'INSERT INTO "Resume" (id, "userId", title, content, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [resumeId, userId, 'ATS Test Resume', JSON.stringify(content)]
    );

    await pool.query(
      'INSERT INTO "ResumeVersion" (id, "resumeId", "versionNumber", title, content, "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
      [versionId, resumeId, 1, 'v1', JSON.stringify(content)]
    );

    await pool.query(
      `INSERT INTO "JobTarget" (id, "userId", company, "roleTitle", "jobDescription", "sourceType", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [jobId, userId, 'Test Corp', 'Tester', 'Test job', 'TEXT']
    );

    console.log('\n2. Create AtsReport');
    await pool.query(
      `INSERT INTO "AtsReport" (
        id, "resumeId", "resumeVersionId", "jobId", "overallScore", 
        breakdown, findings, "missingKeywords", suggestions, "parserSimulation", "createdAt"
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NOW())`,
      [
        reportId, resumeId, versionId, jobId, 85,
        JSON.stringify({ "Structure & Safety": 100 }),
        JSON.stringify([{ type: 'MissingEducation', severity: 'HIGH' }]),
        JSON.stringify([]),
        JSON.stringify([]),
        JSON.stringify({ parsedOrder: ['SUMMARY'], rawText: 'Testing ATS' })
      ]
    );

    const reportCheck = await pool.query('SELECT "overallScore" FROM "AtsReport" WHERE id=$1', [reportId]);
    ok('AtsReport created successfully', reportCheck.rows[0]?.overallScore === 85);

    const resumeRelation = await pool.query('SELECT COUNT(*) FROM "AtsReport" WHERE "resumeId"=$1', [resumeId]);
    ok('AtsReport linked to Resume', parseInt(resumeRelation.rows[0].count) === 1);

    const jobRelation = await pool.query('SELECT COUNT(*) FROM "AtsReport" WHERE "jobId"=$1', [jobId]);
    ok('AtsReport linked to JobTarget', parseInt(jobRelation.rows[0].count) === 1);

    console.log(`\n🎉 DONE! ${PASS} passed, ${FAIL} failed\n`);
  } catch (err) {
    console.error('💥 Test execution failed:', err);
  } finally {
    await pool.end();
  }
}

run();
