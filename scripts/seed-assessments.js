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

const decoded = JSON.parse(Buffer.from(apiKey || '', 'base64').toString());
const pool = new Pool({ connectionString: decoded.databaseUrl });

async function seed() {
  console.log('Seeding Assessment Data via PG...');

  try {
    const q1Id = uuidv4();
    await pool.query(
      `INSERT INTO "Question" (id, department, domain, topic, type, difficulty, "questionText", options, explanation, status, source, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
      [
        q1Id, 'CSE', 'Programming Fundamentals', 'Arrays', 'MCQ', 'EASY',
        'What is the index of the first element in an array in C/C++?',
        JSON.stringify([
          { id: '1', text: '1', isCorrect: false },
          { id: '2', text: '0', isCorrect: true },
          { id: '3', text: '-1', isCorrect: false },
          { id: '4', text: 'Depends on the compiler', isCorrect: false }
        ]),
        'In C/C++ (and most programming languages), arrays are 0-indexed.',
        'PUBLISHED', 'CURATED'
      ]
    );

    const q2Id = uuidv4();
    await pool.query(
      `INSERT INTO "Question" (id, department, domain, topic, type, difficulty, "questionText", options, explanation, status, source, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
      [
        q2Id, 'CSE', 'Programming Fundamentals', 'Pointers', 'MCQ', 'MEDIUM',
        'Which operator is used to get the memory address of a variable in C?',
        JSON.stringify([
          { id: '1', text: '*', isCorrect: false },
          { id: '2', text: '->', isCorrect: false },
          { id: '3', text: '&', isCorrect: true },
          { id: '4', text: '&&', isCorrect: false }
        ]),
        'The address-of operator (&) returns the memory address of its operand.',
        'PUBLISHED', 'CURATED'
      ]
    );

    const q3Id = uuidv4();
    await pool.query(
      `INSERT INTO "Question" (id, department, domain, topic, type, difficulty, "questionText", options, explanation, status, source, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())`,
      [
        q3Id, 'CIVIL', 'Structural Engineering', 'Concrete Technology', 'MCQ', 'EASY',
        'What is the standard curing time for concrete to reach its characteristic strength?',
        JSON.stringify([
          { id: '1', text: '7 days', isCorrect: false },
          { id: '2', text: '14 days', isCorrect: false },
          { id: '3', text: '21 days', isCorrect: false },
          { id: '4', text: '28 days', isCorrect: true }
        ]),
        'Concrete typically reaches its full characteristic design strength after 28 days of proper curing.',
        'PUBLISHED', 'CURATED'
      ]
    );

    const a1Id = uuidv4();
    await pool.query(
      `INSERT INTO "Assessment" (id, title, description, instructions, department, domain, type, difficulty, "durationMinutes", "topicCoverage", "isPublished", mode, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
      [
        a1Id, 'Programming Fundamentals Basics', 'Test your basic knowledge of arrays and pointers.', 
        'Choose the best answer for each question. No negative marking.', 'CSE', 'Programming Fundamentals', 
        'TECHNICAL', 'EASY', 10, JSON.stringify(['Arrays', 'Pointers']), true, 'TIMED'
      ]
    );

    await pool.query(
      `INSERT INTO "AssessmentSection" (id, "assessmentId", title, "orderIndex", "questionIds", "createdAt") 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [uuidv4(), a1Id, 'Core Concepts', 0, JSON.stringify([q1Id, q2Id])]
    );

    const a2Id = uuidv4();
    await pool.query(
      `INSERT INTO "Assessment" (id, title, description, instructions, department, domain, type, difficulty, "durationMinutes", "topicCoverage", "isPublished", mode, "createdAt", "updatedAt") 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, NOW(), NOW())`,
      [
        a2Id, 'Concrete Technology Basics', 'Basic structural engineering concepts.', 
        'Select the correct standard curing practices.', 'CIVIL', 'Structural Engineering', 
        'TECHNICAL', 'EASY', 5, JSON.stringify(['Concrete Technology']), true, 'PRACTICE'
      ]
    );

    await pool.query(
      `INSERT INTO "AssessmentSection" (id, "assessmentId", title, "orderIndex", "questionIds", "createdAt") 
       VALUES ($1, $2, $3, $4, $5, NOW())`,
      [uuidv4(), a2Id, 'Materials', 0, JSON.stringify([q3Id])]
    );

    console.log('Successfully seeded Assessment data.');
    console.log('CSE Assessment ID:', a1Id);
    console.log('Civil Assessment ID:', a2Id);
  } catch (err) {
    console.error('Error seeding data:', err);
  } finally {
    await pool.end();
  }
}

seed();
