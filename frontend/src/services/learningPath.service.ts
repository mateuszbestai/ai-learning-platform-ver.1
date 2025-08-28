import api from './api';
import { LearningPathData, LearningPathRequest } from '../types/learningPath';

export const learningPathService = {
  // Generate a new learning path
  generate: async (request: LearningPathRequest): Promise<LearningPathData> => {
    const response = await api.post<LearningPathData>('/learning-path/generate', request);
    return response.data;
  },

  // Get mock learning path
  getMock: async (certification?: string): Promise<LearningPathData> => {
    const params = certification ? { certification } : {};
    const response = await api.get<LearningPathData>('/learning-path/mock', { params });
    return response.data;
  },

  // Get learning path by ID
  getById: async (pathId: string): Promise<LearningPathData> => {
    const response = await api.get<LearningPathData>(`/learning-path/${pathId}`);
    return response.data;
  },

  // Update progress
  updateProgress: async (
    pathId: string,
    nodeId: string,
    status: string,
    pointsEarned?: number
  ): Promise<any> => {
    const response = await api.post(`/learning-path/${pathId}/progress`, {
      node_id: nodeId,
      status,
      points_earned: pointsEarned,
    });
    return response.data;
  },

  // Get all learning paths (for dashboard)
  getAll: async (): Promise<LearningPathData[]> => {
    const response = await api.get<LearningPathData[]>('/learning-path');
    return response.data;
  },

  // Save learning path to local storage
  saveToLocal: (path: LearningPathData): void => {
    localStorage.setItem('currentLearningPath', JSON.stringify(path));
  },

  // Get from local storage
  getFromLocal: (): LearningPathData | null => {
    const stored = localStorage.getItem('currentLearningPath');
    return stored ? JSON.parse(stored) : null;
  },

  // Clear local storage
  clearLocal: (): void => {
    localStorage.removeItem('currentLearningPath');
  },
};