import { createOpenAI } from '@ai-sdk/openai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';

export interface AIProviderConfig {
  provider: 'local' | 'gemini' | 'groq' | 'openai';
  baseUrl?: string;
  model?: string;
}

export interface ModelCapabilities {
  supportsStructuredOutput: boolean;
  supportsStreaming: boolean;
  contextWindow: number;
}

export function getProviderInstance(config: AIProviderConfig) {
  switch (config.provider) {
    case 'gemini':
      return createGoogleGenerativeAI({
        apiKey: process.env.GEMINI_API_KEY || '',
      });
    case 'groq':
      // Groq is OpenAI compatible
      return createOpenAI({
        baseURL: 'https://api.groq.com/openai/v1',
        apiKey: process.env.GROQ_API_KEY || '',
      });
    case 'local':
    default:
      // Default to Ollama via OpenAI compatibility or custom baseUrl
      return createOpenAI({
        baseURL: config.baseUrl || process.env.LOCAL_AI_BASE_URL || 'http://localhost:11434/v1',
        apiKey: 'local', // API key not required for local Ollama
      });
  }
}

export function getCapabilities(provider: AIProviderConfig['provider']): ModelCapabilities {
  switch (provider) {
    case 'gemini':
      return { supportsStructuredOutput: true, supportsStreaming: true, contextWindow: 128000 };
    case 'groq':
      return { supportsStructuredOutput: true, supportsStreaming: true, contextWindow: 8192 };
    case 'local':
    default:
      return { supportsStructuredOutput: true, supportsStreaming: true, contextWindow: 4096 };
  }
}
