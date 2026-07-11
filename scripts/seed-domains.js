const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const apiKey = (() => {
  try { return new URL(process.env.DATABASE_URL).searchParams.get('api_key'); }
  catch { return null; }
})() || 'eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xMCZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MTAmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAifQ';
const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
const pool = new Pool({ connectionString: decoded.databaseUrl });

async function seed() {
  console.log('Connecting to database for Domain Intelligence Seed...');
  try {
    // CSE Domain
    const cseDomainId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [cseDomainId, 'cse', 'Computer Science & Engineering', 'Software development, engineering, and architecture.']);
    
    const sweRoleId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [sweRoleId, cseDomainId, 'software-engineer', 'Software Engineer', 'Designs and builds software systems.', JSON.stringify([{ competencyId: 'comp-swe-1', weight: 1.0 }])]);
    
    // Civil Domain
    const civilDomainId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [civilDomainId, 'civil', 'Civil Engineering', 'Design, construction, and maintenance of the physical and naturally built environment.']);
    
    const siteEngRoleId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [siteEngRoleId, civilDomainId, 'site-engineer', 'Site Engineer', 'Manages parts of a construction project and oversees quality.', JSON.stringify([])]);

    // ECE Domain
    const eceDomainId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [eceDomainId, 'ece', 'Electronics & Communication', 'Electronic devices, circuits, communication equipment and integrated circuits.']);
    
    const embedRoleId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [embedRoleId, eceDomainId, 'embedded-engineer', 'Embedded Engineer', 'Designs and implements software for embedded devices.', JSON.stringify([])]);

    // Management
    const mgmtDomainId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, NOW(), NOW())`,
      [mgmtDomainId, 'management', 'Management', 'Business administration, operations, and leadership.']);

    const prodMgrId = crypto.randomUUID();
    await pool.query(`INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())`,
      [prodMgrId, mgmtDomainId, 'product-manager', 'Product Manager', 'Identifies customer needs and the larger business objectives.', JSON.stringify([])]);

    console.log('✅ Domain Seed completed successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
