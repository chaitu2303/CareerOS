import crypto from 'crypto';

process.env.DATABASE_URL = "prisma+postgres://localhost:51213/?api_key=eyJkYXRhYmFzZVVybCI6InBvc3RncmVzOi8vcG9zdGdyZXM6cG9zdGdyZXNAbG9jYWxob3N0OjUxMjEzL3RlbXBsYXRlMT9zc2xtb2RlPWRpc2FibGUmY29ubmVjdGlvbl9saW1pdD0xMCZjb25uZWN0X3RpbWVvdXQ9MCZtYXhfaWRsZV9jb25uZWN0aW9uX2xpZmV0aW1lPTAmcG9vbF90aW1lb3V0PTAmc29ja2V0X3RpbWVvdXQ9MCIsIm5hbWUiOiJkZWZhdWx0Iiwic2hhZG93RGF0YWJhc2VVcmwiOiJwb3N0Z3JlczovL3Bvc3RncmVzOnBvc3RncmVzQGxvY2FsaG9zdDo1MTIxNC90ZW1wbGF0ZTE_c3NsbW9kZT1kaXNhYmxlJmNvbm5lY3Rpb25fbGltaXQ9MTAmY29ubmVjdF90aW1lb3V0PTAmbWF4X2lkbGVfY29ubmVjdGlvbl9saWZldGltZT0wJnBvb2xfdGltZW91dD0wJnNvY2tldF90aW1lb3V0PTAifQ";

import { prisma } from '../src/lib/prisma';

async function seed() {
  console.log('Seeding Assessment Data...');

  // 1. Create Questions for CSE (Programming Fundamentals)
  const q1 = await prisma.question.create({
    data: {
      department: 'CSE',
      domain: 'Programming Fundamentals',
      topic: 'Arrays',
      type: 'MCQ',
      difficulty: 'EASY',
      questionText: 'What is the index of the first element in an array in C/C++?',
      options: [
        { id: '1', text: '1', isCorrect: false },
        { id: '2', text: '0', isCorrect: true },
        { id: '3', text: '-1', isCorrect: false },
        { id: '4', text: 'Depends on the compiler', isCorrect: false },
      ],
      explanation: 'In C/C++ (and most programming languages), arrays are 0-indexed.',
      status: 'PUBLISHED',
      source: 'CURATED',
      contentHash: crypto.createHash('md5').update('What is the index of the first element in an array in C/C++?').digest('hex')
    }
  });

  const q2 = await prisma.question.create({
    data: {
      department: 'CSE',
      domain: 'Programming Fundamentals',
      topic: 'Pointers',
      type: 'MCQ',
      difficulty: 'MEDIUM',
      questionText: 'Which operator is used to get the memory address of a variable in C?',
      options: [
        { id: '1', text: '*', isCorrect: false },
        { id: '2', text: '->', isCorrect: false },
        { id: '3', text: '&', isCorrect: true },
        { id: '4', text: '&&', isCorrect: false },
      ],
      explanation: 'The address-of operator (&) returns the memory address of its operand.',
      status: 'PUBLISHED',
      source: 'CURATED',
      contentHash: crypto.createHash('md5').update('Which operator is used to get the memory address of a variable in C?').digest('hex')
    }
  });

  // 2. Create Questions for Civil (Structural Engineering)
  const q3 = await prisma.question.create({
    data: {
      department: 'CIVIL',
      domain: 'Structural Engineering',
      topic: 'Concrete Technology',
      type: 'MCQ',
      difficulty: 'EASY',
      questionText: 'What is the standard curing time for concrete to reach its characteristic strength?',
      options: [
        { id: '1', text: '7 days', isCorrect: false },
        { id: '2', text: '14 days', isCorrect: false },
        { id: '3', text: '21 days', isCorrect: false },
        { id: '4', text: '28 days', isCorrect: true },
      ],
      explanation: 'Concrete typically reaches its full characteristic design strength after 28 days of proper curing.',
      status: 'PUBLISHED',
      source: 'CURATED',
      contentHash: crypto.createHash('md5').update('What is the standard curing time for concrete to reach its characteristic strength?').digest('hex')
    }
  });

  // 3. Create Assessments
  const cseAssessment = await prisma.assessment.create({
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

  const civilAssessment = await prisma.assessment.create({
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

  console.log('Successfully seeded Assessment data.');
  console.log('CSE Assessment ID:', cseAssessment.id);
  console.log('Civil Assessment ID:', civilAssessment.id);
}

seed().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
});
