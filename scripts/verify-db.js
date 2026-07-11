const { Pool } = require('pg');

// Decode the prisma+postgres connection string to get raw postgres URL
const apiKey = 'eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xMCZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MTAmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAifQ';
const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
const pool = new Pool({ connectionString: decoded.databaseUrl });

async function verify() {
  try {
    // 1. List all public tables
    const tablesRes = await pool.query(
      "SELECT table_name FROM information_schema.tables WHERE table_schema='public' ORDER BY table_name"
    );
    console.log('\n=== DATABASE TABLES ===');
    tablesRes.rows.forEach(r => console.log(' -', r.table_name));

    // 2. Check specifically for Milestone 4 tables
    const m4Tables = ['JobTarget', 'JobMatchAnalysis'];
    for (const t of m4Tables) {
      const exists = tablesRes.rows.some(r => r.table_name === t);
      console.log(`\nMilestone 4 [${t}]: ${exists ? '✅ EXISTS' : '❌ MISSING'}`);
    }

    // 3. Row counts
    const countRes = await pool.query(`
      SELECT 
        (SELECT COUNT(*) FROM "User") as users,
        (SELECT COUNT(*) FROM "CareerProfile") as profiles,
        (SELECT COUNT(*) FROM "JobTarget") as job_targets,
        (SELECT COUNT(*) FROM "JobMatchAnalysis") as job_analyses,
        (SELECT COUNT(*) FROM "Resume") as resumes
    `);
    console.log('\n=== ROW COUNTS ===');
    const counts = countRes.rows[0];
    Object.entries(counts).forEach(([k, v]) => console.log(` ${k}: ${v}`));

  } catch (e) {
    console.error('DB Error:', e.message);
  } finally {
    await pool.end();
  }
}

verify();
