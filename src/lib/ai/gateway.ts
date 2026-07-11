/**
 * CareerOS AI Gateway
 * Provider-independent AI routing with graceful fallbacks.
 * Never call AI providers directly — always use this gateway.
 */

import { openai } from '@ai-sdk/openai';
import { generateText, generateObject } from 'ai';
import { z } from 'zod';

// Model tiers: primary → fallback → minimal
function getPrimaryModel() {
  return openai('gpt-4o');
}

function getFallbackModel() {
  return openai('gpt-4o-mini');
}

/**
 * Gateway for unstructured generation (text completions).
 */
export async function askGateway(
  prompt: string,
  options?: { systemPrompt?: string; maxTokens?: number }
): Promise<string> {
  try {
    const { text } = await generateText({
      model: getPrimaryModel(),
      system: options?.systemPrompt,
      prompt,
      maxOutputTokens: options?.maxTokens ?? 4096,
    });
    return text;
  } catch {
    // Fallback to smaller model
    const { text } = await generateText({
      model: getFallbackModel(),
      system: options?.systemPrompt,
      prompt,
      maxOutputTokens: options?.maxTokens ?? 2048,
    });
    return text;
  }
}

/**
 * Gateway for structured extraction with Zod schema validation and repair.
 */
export async function extractEntities<T>(
  prompt: string,
  schema: z.ZodType<T>,
  options?: { systemPrompt?: string }
): Promise<T> {
  try {
    const { object } = await generateObject({
      model: getPrimaryModel(),
      schema,
      system: options?.systemPrompt,
      prompt,
    });
    return object;
  } catch {
    // Fallback
    const { object } = await generateObject({
      model: getFallbackModel(),
      schema,
      system: options?.systemPrompt,
      prompt,
    });
    return object;
  }
}
