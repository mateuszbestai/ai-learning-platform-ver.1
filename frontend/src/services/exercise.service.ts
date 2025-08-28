import api from './api';

export interface ExerciseSubmission {
  exercise_id: string;
  solution: string;
  language?: string;
  time_spent: number; // Changed from timeSpent
}

export interface ExerciseResult {
  passed: boolean;
  test_results: Array<{
    name: string;
    passed: boolean;
    error?: string;
  }>;
  feedback: string;
  points_earned: number;
}

export const exerciseService = {
  // Get exercise by ID
  getById: async (exerciseId: string): Promise<any> => {
    const response = await api.get(`/exercise/${exerciseId}`);
    return response.data;
  },

  // Submit exercise solution
  submit: async (
    exerciseId: string,
    submission: ExerciseSubmission
  ): Promise<ExerciseResult> => {
    const response = await api.post<ExerciseResult>(
      `/exercise/${exerciseId}/submit`,
      submission
    );
    return response.data;
  },

  // Run tests (for immediate feedback)
  runTests: async (
    exerciseId: string,
    code: string,
    language: string = 'javascript'
  ): Promise<any> => {
    const response = await api.post(`/exercise/${exerciseId}/test`, {
      code,
      language,
    });
    return response.data;
  },

  // Get hints for exercise
  getHints: async (exerciseId: string, hintLevel: number = 1): Promise<string[]> => {
    const response = await api.get(`/exercise/${exerciseId}/hints`, {
      params: { level: hintLevel },
    });
    return response.data.hints;
  },

  // Save progress (auto-save)
  saveProgress: async (exerciseId: string, code: string): Promise<void> => {
    await api.post(`/exercise/${exerciseId}/save`, { code });
  },
};