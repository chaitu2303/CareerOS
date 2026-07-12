import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    const p1 = await prisma.codingProblem.upsert({
      where: { slug: 'two-sum' },
      update: {},
      create: {
        title: 'Two Sum',
        slug: 'two-sum',
        difficulty: 'EASY',
        topic: 'Arrays',
        description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.',
        status: 'PUBLISHED',
        timeLimit: 2000,
        memoryLimit: 256,
        examples: {
          create: [
            { input: '[[2,7,11,15], 9]', output: '[0,1]', orderIndex: 0 },
            { input: '[[3,2,4], 6]', output: '[1,2]', orderIndex: 1 }
          ]
        },
        templates: {
          create: [
            { language: 'javascript', code: '/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nfunction twoSum(nums, target) {\n    \n}' }
          ]
        },
        testCases: {
          create: [
            { input: '[[2,7,11,15], 9]', expectedOutput: '[0,1]', isHidden: false, orderIndex: 0 },
            { input: '[[3,2,4], 6]', expectedOutput: '[1,2]', isHidden: false, orderIndex: 1 },
            { input: '[[3,3], 6]', expectedOutput: '[0,1]', isHidden: true, orderIndex: 2 }
          ]
        }
      }
    });

    const p2 = await prisma.codingProblem.upsert({
      where: { slug: 'valid-palindrome' },
      update: {},
      create: {
        title: 'Valid Palindrome',
        slug: 'valid-palindrome',
        difficulty: 'EASY',
        topic: 'Strings',
        description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Alphanumeric characters include letters and numbers. Given a string s, return true if it is a palindrome, or false otherwise.',
        status: 'PUBLISHED',
        timeLimit: 2000,
        memoryLimit: 256,
        examples: {
          create: [
            { input: '["A man, a plan, a canal: Panama"]', output: 'true', orderIndex: 0 },
            { input: '["race a car"]', output: 'false', orderIndex: 1 }
          ]
        },
        templates: {
          create: [
            { language: 'javascript', code: '/**\n * @param {string} s\n * @return {boolean}\n */\nfunction isPalindrome(s) {\n    \n}' }
          ]
        },
        testCases: {
          create: [
            { input: '["A man, a plan, a canal: Panama"]', expectedOutput: 'true', isHidden: false, orderIndex: 0 },
            { input: '["race a car"]', expectedOutput: 'false', isHidden: false, orderIndex: 1 },
            { input: '[" "]', expectedOutput: 'true', isHidden: true, orderIndex: 2 }
          ]
        }
      }
    });

    return NextResponse.json({ success: true, seeded: [p1.title, p2.title] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
