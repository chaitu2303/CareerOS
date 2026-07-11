const { Pool } = require('pg');
const crypto = require('crypto');
require('dotenv').config();

const apiKey = (() => {
  try {
    return new URL(process.env.DATABASE_URL).searchParams.get('api_key');
  } catch { return null; }
})() || 'eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjE0L3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xMCZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNS90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MTAmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAifQ';
const decoded = JSON.parse(Buffer.from(apiKey, 'base64').toString());
const pool = new Pool({ connectionString: decoded.databaseUrl });

async function seed() {
  console.log('Connecting to database for Coding Arena Seed...');
  
  const problem1Id = crypto.randomUUID();
  const problem2Id = crypto.randomUUID();
  
  try {
    console.log('Seeding CodingProblems...');
    await pool.query(`
      INSERT INTO "CodingProblem" (id, title, slug, difficulty, topic, description, "timeLimit", "memoryLimit", status, "createdAt", "updatedAt")
      VALUES 
      ($1, 'Two Sum', 'two-sum', 'EASY', 'Arrays', '<p>Given an array of integers <code>nums</code> and an integer <code>target</code>, return indices of the two numbers such that they add up to <code>target</code>.</p>', 2000, 256, 'PUBLISHED', NOW(), NOW()),
      ($2, 'Reverse String', 'reverse-string', 'EASY', 'Strings', '<p>Write a function that reverses a string. The input string is given as an array of characters <code>s</code>.</p>', 2000, 256, 'PUBLISHED', NOW(), NOW())
    `, [problem1Id, problem2Id]);

    console.log('Seeding Templates...');
    await pool.query(`
      INSERT INTO "CodeTemplate" (id, "problemId", language, code)
      VALUES 
      ($1, $2, 'javascript', 'function twoSum(nums, target) {\n  // Write your code here\n}'),
      ($3, $2, 'python', 'def twoSum(nums, target):\n    # Write your code here\n    pass'),
      ($4, $5, 'javascript', 'function reverseString(s) {\n  // Write your code here\n}')
    `, [crypto.randomUUID(), problem1Id, crypto.randomUUID(), crypto.randomUUID(), problem2Id]);

    console.log('Seeding Examples...');
    await pool.query(`
      INSERT INTO "ProblemExample" (id, "problemId", input, output, explanation, "orderIndex")
      VALUES 
      ($1, $2, 'nums = [2,7,11,15], target = 9', '[0,1]', 'Because nums[0] + nums[1] == 9, we return [0, 1].', 0),
      ($3, $4, 's = ["h","e","l","l","o"]', '["o","l","l","e","h"]', 'Reversed successfully.', 0)
    `, [crypto.randomUUID(), problem1Id, crypto.randomUUID(), problem2Id]);

    console.log('Seeding Test Cases...');
    await pool.query(`
      INSERT INTO "TestCase" (id, "problemId", input, "expectedOutput", "isHidden", "orderIndex")
      VALUES 
      ($1, $2, '[2,7,11,15]\n9', '[0,1]', false, 0),
      ($3, $2, '[3,2,4]\n6', '[1,2]', true, 1),
      ($4, $5, '["h","e","l","l","o"]', '["o","l","l","e","h"]', false, 0),
      ($6, $5, '["H","a","n","n","a","h"]', '["h","a","n","n","a","H"]', true, 1)
    `, [crypto.randomUUID(), problem1Id, crypto.randomUUID(), crypto.randomUUID(), problem2Id, crypto.randomUUID()]);

    console.log('✅ Seed completed successfully.');
  } catch (error) {
    console.error('❌ Seeding failed:', error);
  } finally {
    await pool.end();
  }
}

seed();
