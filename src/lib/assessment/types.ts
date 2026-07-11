export type QuestionType = 'MCQ' | 'MULTI_SELECT' | 'TRUE_FALSE' | 'NUMERICAL' | 'SHORT_ANSWER' | 'LONG_ANSWER' | 'SCENARIO';
export type AssessmentMode = 'PRACTICE' | 'TIMED' | 'STRICT' | 'DAILY' | 'TOPIC' | 'MOCK';
export type QuestionDifficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type AssessmentStatus = 'IN_PROGRESS' | 'COMPLETED' | 'ABANDONED';

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect?: boolean; // Hidden from client unless in practice mode after answering
}

export interface ClientQuestion {
  id: string;
  type: QuestionType;
  department: string;
  domain: string;
  topic: string;
  questionText: string;
  options?: QuestionOption[]; // isCorrect stripped out
  hints?: string[]; // Only provided if mode allows
  difficulty: QuestionDifficulty;
}

export interface ClientAssessment {
  id: string;
  title: string;
  description: string | null;
  instructions: string | null;
  department: string;
  domain: string;
  difficulty: string;
  durationMinutes: number | null;
  mode: AssessmentMode;
  sections: {
    id: string;
    title: string;
    description: string | null;
    questions: ClientQuestion[];
  }[];
}

export interface SecurityEvent {
  type: 'TAB_SWITCH' | 'FOCUS_LOSS' | 'PASTE';
  timestamp: string;
}

export interface SubmitAttemptPayload {
  answers: {
    questionId: string;
    answer: any;
    timeTakenSeconds: number;
    isMarkedForReview: boolean;
  }[];
  securityEvents?: SecurityEvent[];
}
