import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

async function seed() {
  console.log('Seeding Assessment Data...');
  process.env.DATABASE_URL = process.env.DATABASE_URL || 'postgres://user@localhost:5433/careeros_test';
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  // 1. Create Questions for CSE (Programming Fundamentals)
  const q1Text = 'What is the index of the first element in an array in C/C++?';
  const q1Hash = crypto.createHash('md5').update(q1Text).digest('hex');
  const q1 = await prisma.question.upsert({
    where: { contentHash: q1Hash },
    update: {},
    create: {
      department: 'CSE',
      domain: 'Programming Fundamentals',
      topic: 'Arrays',
      type: 'MCQ',
      difficulty: 'EASY',
      questionText: q1Text,
      options: [
        { id: '1', text: '1', isCorrect: false },
        { id: '2', text: '0', isCorrect: true },
        { id: '3', text: '-1', isCorrect: false },
        { id: '4', text: 'Depends on the compiler', isCorrect: false },
      ],
      explanation: 'In C/C++ (and most programming languages), arrays are 0-indexed.',
      status: 'PUBLISHED',
      source: 'CURATED',
      contentHash: q1Hash
    }
  });

  const q2Text = 'Which operator is used to get the memory address of a variable in C?';
  const q2Hash = crypto.createHash('md5').update(q2Text).digest('hex');
  const q2 = await prisma.question.upsert({
    where: { contentHash: q2Hash },
    update: {},
    create: {
      department: 'CSE',
      domain: 'Programming Fundamentals',
      topic: 'Pointers',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      questionText: q2Text,
      options: [
        { id: '1', text: '*', isCorrect: false },
        { id: '2', text: '->', isCorrect: false },
        { id: '3', text: '&', isCorrect: true },
        { id: '4', text: '&&', isCorrect: false },
      ],
      explanation: 'The address-of operator (&) returns the memory address of its operand.',
      status: 'PUBLISHED',
      source: 'CURATED',
      contentHash: q2Hash
    }
  });

  // 2. Create Questions for Civil (Structural Engineering)
  const q3Text = 'What is the standard curing time for concrete to reach its characteristic strength?';
  const q3Hash = crypto.createHash('md5').update(q3Text).digest('hex');
  const q3 = await prisma.question.upsert({
    where: { contentHash: q3Hash },
    update: {},
    create: {
      department: 'CIVIL',
      domain: 'Structural Engineering',
      topic: 'Concrete Technology',
      type: 'MCQ',
      difficulty: 'EASY',
      questionText: q3Text,
      options: [
        { id: '1', text: '7 days', isCorrect: false },
        { id: '2', text: '14 days', isCorrect: false },
        { id: '3', text: '21 days', isCorrect: false },
        { id: '4', text: '28 days', isCorrect: true },
      ],
      explanation: 'Concrete typically reaches its full characteristic design strength after 28 days of proper curing.',
      status: 'PUBLISHED',
      source: 'CURATED',
      contentHash: q3Hash
    }
  });

  // 3. Create Assessments
  // To make assessments idempotent, we can check by title or id if we pre-defined them.
  // Instead of upsert which requires a unique constraint, we'll try to find first.
  let cseAssessment = await prisma.assessment.findFirst({
    where: { title: 'Programming Fundamentals Basics' }
  });
  if (!cseAssessment) {
    cseAssessment = await prisma.assessment.create({
      data: {
        title: 'Programming Fundamentals Basics',
        description: 'Test your basic knowledge of arrays and pointers.',
        instructions: 'Choose the best answer for each question. No negative marking.',
        department: 'CSE',
        domain: 'Programming Fundamentals',
        type: 'TECHNICAL',
        difficulty: 'EASY',
        durationMinutes: 10,
        topicCoverage: ['Arrays', 'Pointers'],
        isPublished: true,
        mode: 'TIMED',
        sections: {
          create: [
            {
              title: 'Core Concepts',
              orderIndex: 0,
              questionIds: [q1.id, q2.id]
            }
          ]
        }
      }
    });
  }

  let civilAssessment = await prisma.assessment.findFirst({
    where: { title: 'Concrete Technology Basics' }
  });
  if (!civilAssessment) {
    civilAssessment = await prisma.assessment.create({
      data: {
        title: 'Concrete Technology Basics',
        description: 'Basic structural engineering concepts.',
        instructions: 'Select the correct standard curing practices.',
        department: 'CIVIL',
        domain: 'Structural Engineering',
        type: 'TECHNICAL',
        difficulty: 'EASY',
        durationMinutes: 5,
        topicCoverage: ['Concrete Technology'],
        isPublished: true,
        mode: 'PRACTICE',
        sections: {
          create: [
            {
              title: 'Materials',
              orderIndex: 0,
              questionIds: [q3.id]
            }
          ]
        }
      }
    });
  }

  console.log('Successfully seeded Assessment data.');
  console.log('CSE Assessment ID:', cseAssessment.id);
  console.log('Civil Assessment ID:', civilAssessment.id);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
});
