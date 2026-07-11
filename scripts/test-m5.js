/**
 * Milestone 5 Runtime Smoke Test
 * Tests: create resume → fetch → tailor → persist new version
 * Run: node scripts/test-m5.js
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
  console.log('\n🧪 MILESTONE 5 — Runtime Smoke Test\n');
  try {
    const userId = uuidv4();
    const profileId = uuidv4();
    
    console.log('1. Setup User & Profile');
    await pool.query(
      'INSERT INTO "User" (id, email, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())',
      [userId, `m5-test-${Date.now()}@careeros.local`]
    );
    await pool.query(
      'INSERT INTO "CareerProfile" (id, "userId", "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())',
      [profileId, userId]
    );

    const resumeId = uuidv4();
    const content = {
      templateId: 'clean',
      sections: [{ type: 'summary', visible: true, data: { text: 'Initial summary' } }]
    };

    console.log('\n2. Create Resume');
    await pool.query(
      'INSERT INTO "Resume" (id, "userId", title, content, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
      [resumeId, userId, 'Test Resume', JSON.stringify(content)]
    );
    const resumeCheck = await pool.query('SELECT title, content FROM "Resume" WHERE id=$1', [resumeId]);
    ok('Resume created', resumeCheck.rows[0]?.title === 'Test Resume');

    console.log('\n3. Create ResumeVersion (autosave)');
    const versionId = uuidv4();
    await pool.query(
      'INSERT INTO "ResumeVersion" (id, "resumeId", "versionNumber", title, content, "createdAt") VALUES ($1, $2, $3, $4, $5, NOW())',
      [versionId, resumeId, 1, 'Initial version', JSON.stringify(content)]
    );
    const versionCheck = await pool.query('SELECT "versionNumber" FROM "ResumeVersion" WHERE id=$1', [versionId]);
    ok('ResumeVersion saved', versionCheck.rows[0]?.versionNumber === 1);

    console.log('\n4. Tailoring & JobTarget');
    const jobId = uuidv4();
    await pool.query(
      `INSERT INTO "JobTarget" (id, "userId", company, "roleTitle", "jobDescription", "sourceType", "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [jobId, userId, 'Tailor Corp', 'Frontend Dev', 'React job', 'TEXT']
    );
    ok('JobTarget created for tailoring', true);
    
    console.log('\n5. Creating Tailored Version');
    const tailoredVersionId = uuidv4();
    const tailoredContent = { ...content, sections: [{ type: 'summary', visible: true, data: { text: 'Tailored summary' } }] };
    await pool.query(
      'INSERT INTO "ResumeVersion" (id, "resumeId", "versionNumber", "tailoredForJob", title, content, "createdAt") VALUES ($1, $2, $3, $4, $5, $6, NOW())',
      [tailoredVersionId, resumeId, 2, jobId, 'Tailored version', JSON.stringify(tailoredContent)]
    );
    const tailoredCheck = await pool.query('SELECT "tailoredForJob" FROM "ResumeVersion" WHERE id=$1', [tailoredVersionId]);
    ok('Tailored version saved with JobTarget reference', tailoredCheck.rows[0]?.tailoredForJob === jobId);

    console.log('\n6. Cleanup');
    await pool.query('DELETE FROM "ResumeVersion" WHERE "resumeId"=$1', [resumeId]);
    await pool.query('DELETE FROM "Resume" WHERE id=$1', [resumeId]);
    await pool.query('DELETE FROM "JobTarget" WHERE id=$1', [jobId]);
    await pool.query('DELETE FROM "CareerProfile" WHERE id=$1', [profileId]);
    await pool.query('DELETE FROM "User" WHERE id=$1', [userId]);
    ok('Cleanup complete', true);

  } catch(e) {
    console.error('Error:', e);
    FAIL++;
  } finally {
    await pool.end();
    console.log(`\nResults: ${PASS} passed, ${FAIL} failed`);
  }
}
run();
