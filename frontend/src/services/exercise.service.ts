// frontend/src/services/exercise.service.ts
import api from './api';
import { Exercise } from '../types/exercise';

export const exerciseService = {
  // Get exercise by ID
  getById: async (exerciseId: string): Promise<Exercise> => {
    try {
      const response = await api.get(`/exercise/${exerciseId}`);
      return response.data;
    } catch (error) {
      // Return mock data as fallback
      return getMockExercise(exerciseId);
    }
  },

  // Submit exercise
  submit: async (exerciseId: string, submission: any): Promise<any> => {
    const response = await api.post(`/exercise/${exerciseId}/submit`, submission);
    return response.data;
  },

  // Run tests
  runTests: async (exerciseId: string, code: string): Promise<any> => {
    const response = await api.post(`/exercise/${exerciseId}/test`, { code });
    return response.data;
  },

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

// Mock data function
function getMockExercise(exerciseId: string): Exercise {
  return {
    id: exerciseId,
    title: 'Deploy a Virtual Machine',
    description: 'Learn to deploy and configure a virtual machine in the cloud',
    type: 'hands-on',
    difficulty: 'beginner',
    estimated_time_minutes: 45,
    points: 100,
    instructions: [
      'Access the cloud portal',
      'Navigate to Virtual Machines section',
      'Click on "Create new VM"',
      'Configure the VM settings',
      'Deploy and verify'
    ],
    starter_code: '// Write your solution here',
    test_cases: [
      { input: 'test1', expected_output: 'result1' }
    ],
    hints: ['Start with the basics'],
    sandbox_url: 'https://portal.azure.com/sandbox'
  };
}