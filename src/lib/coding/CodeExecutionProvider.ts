export type ExecutionStatus = 'ACCEPTED' | 'WRONG_ANSWER' | 'TLE' | 'MLE' | 'RE' | 'CE' | 'INTERNAL_ERROR' | 'PENDING';

export interface TestCaseInput {
  id: string;
  input: string;
  expectedOutput: string;
}

export interface ExecutionResult {
  testCaseId: string;
  status: ExecutionStatus;
  actualOutput?: string;
  errorOutput?: string;
  executionMs?: number;
  memoryUsedKb?: number;
}

export interface ExecutionOptions {
  language: string;
  code: string;
  timeLimitMs: number;
  memoryLimitMb: number;
  testCases: TestCaseInput[];
}

export interface ICodeExecutionProvider {
  /**
   * Executes code against a set of test cases safely.
   */
  execute(options: ExecutionOptions): Promise<ExecutionResult[]>;
  
  /**
   * Returns true if the provider is fully configured and capable of running code.
   */
  isAvailable(): boolean;
}

/**
 * A safe fallback execution provider that refuses to run code if no secure environment is configured.
 */
export class FallbackExecutionProvider implements ICodeExecutionProvider {
  isAvailable(): boolean {
    // For local development, if docker isn't explicitly configured and verified, 
    // it's not safe to execute arbitrary user code. 
    return false; 
  }

  async execute(options: ExecutionOptions): Promise<ExecutionResult[]> {
    throw new Error('SECURE_EXECUTION_UNAVAILABLE');
  }
}

/**
 * Factory to get the active execution provider based on environment config.
 */
export function getExecutionProvider(): ICodeExecutionProvider {
  // In a real production deployment, this would check environment variables 
  // (e.g. JUDGE0_URL or PISTON_URL) and return the appropriate secure runner.
  // We strictly default to FallbackExecutionProvider when no secure sandbox is available.
  
  const providerType = process.env.CODE_EXECUTION_PROVIDER;
  
  if (providerType === 'LOCAL_DOCKER') {
    // Return a LocalDockerProvider (to be implemented if required)
  } else if (providerType === 'JUDGE0') {
    // Return Judge0Provider 
  }
  
  return new FallbackExecutionProvider();
}
