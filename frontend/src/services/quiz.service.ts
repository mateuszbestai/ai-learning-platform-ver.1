import api from './api';

export interface QuizSubmission {
  quiz_id: string;
  answers: Record<string, any>;
  time_spent: number; // Changed from timeSpent
}

export interface QuizResult {
  score: number;
  passed: boolean;
  correct_answers: number;
  total_questions: number;
  feedback: Record<string, string>;
  points_earned: number;
}

export const quizService = {
  // Get quiz by ID
  getById: async (quizId: string): Promise<any> => {
    const response = await api.get(`/quiz/${quizId}`);
    return response.data;
  },

  // Submit quiz answers
  submit: async (quizId: string, submission: QuizSubmission): Promise<QuizResult> => {
    const response = await api.post<QuizResult>(`/quiz/${quizId}/submit`, submission);
    return response.data;
  },

  // Get quiz history
  getHistory: async (userId?: string): Promise<any[]> => {
    const params = userId ? { user_id: userId } : {};
    const response = await api.get('/quiz/history', { params });
    return response.data;
  },

  // Validate answer (for immediate feedback)
  validateAnswer: async (
    quizId: string,
    questionId: string,
    answer: any
  ): Promise<boolean> => {
    const response = await api.post(`/quiz/${quizId}/validate`, {
      question_id: questionId,
      answer,
    });
    return response.data.correct;
  },
};