const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

const dbUrl = process.env.DATABASE_URL || 'postgres://user@localhost:5433/careeros_test';
const pool = new Pool({ connectionString: dbUrl });

async function seed() {
  console.log('Connecting to database for Domain Intelligence Seed...');
  try {
    // CSE Domain
    await pool.query(`
      INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, NOW(), NOW()) 
      ON CONFLICT (slug) DO NOTHING`,
      [crypto.randomUUID(), 'cse', 'Computer Science & Engineering', 'Software development, engineering, and architecture.']);
    
    const cseRes = await pool.query(`SELECT id FROM "CareerDomain" WHERE slug = 'cse'`);
    if(cseRes.rows.length > 0) {
      await pool.query(`
        INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING`,
        [crypto.randomUUID(), cseRes.rows[0].id, 'software-engineer', 'Software Engineer', 'Designs and builds software systems.', JSON.stringify([{ competencyId: 'comp-swe-1', weight: 1.0 }])]);
    }
    
    // Civil Domain
    await pool.query(`
      INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING`,
      [crypto.randomUUID(), 'civil', 'Civil Engineering', 'Design, construction, and maintenance of the physical and naturally built environment.']);
    
    const civilRes = await pool.query(`SELECT id FROM "CareerDomain" WHERE slug = 'civil'`);
    if (civilRes.rows.length > 0) {
      await pool.query(`
        INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING`,
        [crypto.randomUUID(), civilRes.rows[0].id, 'site-engineer', 'Site Engineer', 'Manages parts of a construction project and oversees quality.', JSON.stringify([])]);
    }

    // ECE Domain
    await pool.query(`
      INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING`,
      [crypto.randomUUID(), 'ece', 'Electronics & Communication', 'Electronic devices, circuits, communication equipment and integrated circuits.']);
    
    const eceRes = await pool.query(`SELECT id FROM "CareerDomain" WHERE slug = 'ece'`);
    if(eceRes.rows.length > 0) {
      await pool.query(`
        INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING`,
        [crypto.randomUUID(), eceRes.rows[0].id, 'embedded-engineer', 'Embedded Engineer', 'Designs and implements software for embedded devices.', JSON.stringify([])]);
    }

    // Management
    await pool.query(`
      INSERT INTO "CareerDomain" (id, slug, name, description, "createdAt", "updatedAt") 
      VALUES ($1, $2, $3, $4, NOW(), NOW())
      ON CONFLICT (slug) DO NOTHING`,
      [crypto.randomUUID(), 'management', 'Management', 'Business administration, operations, and leadership.']);

    const mgmtRes = await pool.query(`SELECT id FROM "CareerDomain" WHERE slug = 'management'`);
    if (mgmtRes.rows.length > 0) {
      await pool.query(`
        INSERT INTO "CareerRole" (id, "domainId", slug, title, description, competencies, "createdAt", "updatedAt") 
        VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
        ON CONFLICT (slug) DO NOTHING`,
        [crypto.randomUUID(), mgmtRes.rows[0].id, 'product-manager', 'Product Manager', 'Identifies customer needs and the larger business objectives.', JSON.stringify([])]);
    }

    console.log('✅ Domain Seed completed successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
