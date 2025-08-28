export const exerciseService = {
  // Generate new exercise with AI
  generateExercise: async (topic: string, type: string, difficulty: string): Promise<any> => {
    const response = await api.post('/exercise/generate', {
      topic,
      exercise_type: type,
      difficulty
    });
    return response.data;
  },

  // AI evaluation of submission
  evaluateSubmission: async (exerciseId: string, submission: any): Promise<any> => {
    const response = await api.post(`/exercise/${exerciseId}/evaluate`, submission);
    return response.data;
  },

  // Get AI hint
  getHint: async (exerciseId: string, currentCode: string, hintLevel: number): Promise<string> => {
    const response = await api.post(`/exercise/${exerciseId}/hint`, {
      current_code: currentCode,
      hint_level: hintLevel
    });
    return response.data.hint;
  },
};