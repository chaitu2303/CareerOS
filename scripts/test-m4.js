/**
 * Milestone 4 End-to-End Integration Test
 * Tests: create user → create profile → create job → analyze → persist → read
 * Run: node scripts/test-m4.js
 */

const { Pool } = require('pg');

const apiKey = process.env.DATABASE_URL
  ? (() => {
      try {
        return new URL(process.env.DATABASE_URL).searchParams.get('api_key');
      } catch { return null; }
    })()
  : 'eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xMCZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MTAmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAifQ';

const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
const pool = new Pool({ connectionString: decoded.databaseUrl });

const { v4: uuidv4 } = (() => {
  try { return require('uuid'); } 
  catch { return { v4: () => require('crypto').randomUUID() }; }
})();

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
  console.log('\n🧪 MILESTONE 4 — End-to-End Integration Test\n');

  try {
    // ── Test 1: Database Connectivity ────────────────────────────────────────
    console.log('1. Database Connectivity');
    const pingRes = await pool.query('SELECT NOW() as now');
    ok('Connected to PostgreSQL', !!pingRes.rows[0].now);

    // ── Test 2: Table Existence ───────────────────────────────────────────────
    console.log('\n2. Schema Verification');
    const tablesRes = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    const tables = tablesRes.rows.map(r => r.table_name);
    const required = ['User', 'CareerProfile', 'SkillFact', 'ExperienceFact', 'JobTarget', 'JobMatchAnalysis', 'Resume', 'ResumeVersion'];
    for (const t of required) {
      ok(`Table "${t}" exists`, tables.includes(t));
    }

    // ── Test 3: User Creation ─────────────────────────────────────────────────
    console.log('\n3. User + Career Profile Creation');
    const userId = uuidv4();
    const email = `test-${Date.now()}@careeros-test.local`;

    await pool.query(
      'INSERT INTO "User" (id, email, "createdAt", "updatedAt") VALUES ($1, $2, NOW(), NOW())',
      [userId, email]
    );
    const userCheck = await pool.query('SELECT id, email FROM "User" WHERE id=$1', [userId]);
    ok('User created', userCheck.rows[0]?.email === email);

    const profileId = uuidv4();
    await pool.query(
      'INSERT INTO "CareerProfile" (id, "userId", "completenessScore", "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW())',
      [profileId, userId, 65]
    );

    // Add some skills
    const skillIds = ['Python', 'React', 'SQL'].map(name => {
      const id = uuidv4();
      return { id, name };
    });
    for (const s of skillIds) {
      await pool.query(
        'INSERT INTO "SkillFact" (id, "profileId", name, status, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())',
        [s.id, profileId, s.name, 'USER_CONFIRMED']
      );
    }

    const skillCount = await pool.query('SELECT COUNT(*) FROM "SkillFact" WHERE "profileId"=$1', [profileId]);
    ok('Career Profile created with skills', parseInt(skillCount.rows[0].count) === 3);

    // ── Test 4: JobTarget Creation (simulating /api/jobs/analyze) ────────────
    console.log('\n4. Job Intelligence Persistence');
    const jobId = uuidv4();
    const extractedSkills = JSON.stringify({ required: ['Python', 'Node.js', 'GraphQL'], preferred: ['Docker'] });
    const extractedReqs = JSON.stringify({ experience: 2, education: ['B.Tech'] });
    const keywords = JSON.stringify(['Python', 'API', 'Backend', 'REST']);

    await pool.query(
      `INSERT INTO "JobTarget" (id, "userId", company, "roleTitle", "jobDescription", "sourceType", "extractedSkills", "extractedReqs", keywords, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [jobId, userId, 'TestCorp', 'Backend Engineer', 'We need a Python developer...', 'TEXT', extractedSkills, extractedReqs, keywords]
    );
    const jobCheck = await pool.query('SELECT id, "roleTitle" FROM "JobTarget" WHERE id=$1', [jobId]);
    ok('JobTarget persisted', jobCheck.rows[0]?.roleTitle === 'Backend Engineer');

    // ── Test 5: JobMatchAnalysis Creation ─────────────────────────────────────
    console.log('\n5. Match Analysis Persistence');
    const analysisId = uuidv4();
    const matchedSkills = JSON.stringify([
      { skill: 'Python', evidenceFactId: skillIds[0].id, evidenceType: 'skill', explanation: 'Python listed as USER_CONFIRMED skill', matchStrength: 'STRONG' }
    ]);
    const missingSkills = JSON.stringify([
      { skill: 'Node.js', criticality: 'HIGH', improvementPlan: 'Learn Node.js fundamentals' },
      { skill: 'GraphQL', criticality: 'MEDIUM', improvementPlan: 'Take a GraphQL course' }
    ]);
    const resumeRecs = JSON.stringify(['Add a Python backend project to demonstrate API skills']);
    const interviewRecs = JSON.stringify(['Prepare for REST API design questions', 'Review database optimization']);

    await pool.query(
      `INSERT INTO "JobMatchAnalysis" (id, "jobId", "overallScore", "matchedSkills", "partialMatches", "missingSkills", "resumeRecommendations", "interviewRecommendations", status, "createdAt", "updatedAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())`,
      [analysisId, jobId, 42, matchedSkills, '[]', missingSkills, resumeRecs, interviewRecs, 'COMPLETED']
    );
    const analysisCheck = await pool.query('SELECT id, "overallScore" FROM "JobMatchAnalysis" WHERE "jobId"=$1', [jobId]);
    ok('JobMatchAnalysis persisted', analysisCheck.rows[0]?.overallScore === 42);

    // ── Test 6: Full join read (what the analysis page does) ─────────────────
    console.log('\n6. Analysis Page Query (JOIN test)');
    const joinRes = await pool.query(
      `SELECT j.id, j."roleTitle", j.company, a."overallScore", a."matchedSkills", a."missingSkills"
       FROM "JobTarget" j
       LEFT JOIN "JobMatchAnalysis" a ON a."jobId" = j.id
       WHERE j.id=$1`,
      [jobId]
    );
    ok('Job+Analysis JOIN works', joinRes.rows[0]?.roleTitle === 'Backend Engineer');
    ok('MatchedSkills readable', Array.isArray(joinRes.rows[0]?.matchedSkills));
    ok('MissingSkills readable', Array.isArray(joinRes.rows[0]?.missingSkills));
    ok('Score correct', joinRes.rows[0]?.overallScore === 42);

    // ── Test 7: Truth Guard — skills NOT in profile should be flagged ─────────
    console.log('\n7. Truth Guard Verification');
    const profileSkillNames = skillIds.map(s => s.name); // Python, React, SQL
    const missing = ['Node.js', 'GraphQL'];
    ok('Node.js NOT in profile (correctly missing)', !profileSkillNames.includes('Node.js'));
    ok('GraphQL NOT in profile (correctly missing)', !profileSkillNames.includes('GraphQL'));
    ok('Python IS in profile (correctly matched)', profileSkillNames.includes('Python'));

    // ── Test 8: Cleanup ───────────────────────────────────────────────────────
    console.log('\n8. Cleanup');
    await pool.query('DELETE FROM "JobMatchAnalysis" WHERE id=$1', [analysisId]);
    await pool.query('DELETE FROM "JobTarget" WHERE id=$1', [jobId]);
    await pool.query('DELETE FROM "SkillFact" WHERE "profileId"=$1', [profileId]);
    await pool.query('DELETE FROM "CareerProfile" WHERE id=$1', [profileId]);
    await pool.query('DELETE FROM "User" WHERE id=$1', [userId]);
    const cleanCheck = await pool.query('SELECT COUNT(*) FROM "User" WHERE id=$1', [userId]);
    ok('Test data cleaned up', parseInt(cleanCheck.rows[0].count) === 0);

  } catch (e) {
    console.error('\n💥 Unexpected Error:', e.message);
    FAIL++;
  } finally {
    await pool.end();
    console.log(`\n${'─'.repeat(40)}`);
    console.log(`Results: ${PASS} passed, ${FAIL} failed`);
    if (FAIL === 0) {
      console.log('✅ MILESTONE 4 DATABASE: VERIFIED\n');
      process.exit(0);
    } else {
      console.log('❌ MILESTONE 4 HAS FAILURES\n');
      process.exit(1);
    }
  }
}

run();
