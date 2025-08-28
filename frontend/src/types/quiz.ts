export interface Quiz {
    id: string;
    title: string;
    description: string;
    questions: QuizQuestion[];
    time_limit_minutes: number;
    passing_score: number;
    max_attempts: number;
    attempts_remaining: number;
  }
  
  export interface QuizQuestion {
    id: string;
    question: string;
    type: 'multiple_choice' | 'multiple_select' | 'true_false';
    options?: string[];
    points: number;
    code?: string;
    explanation?: string;
    correct_answer?: number | boolean;
    correct_answers?: number[];
  }
  
  export type QuizAnswer = number | number[] | boolean;
  
  export interface QuizSubmission {
    quiz_id: string;
    answers: Record<string, QuizAnswer>;
    time_spent: number;
  }
  
  export interface QuizResult {
    quiz_id: string;
    score: number;
    passed: boolean;
    correct_answers: number;
    total_questions: number;
    feedback: Record<string, string>;
    points_earned: number;
  }