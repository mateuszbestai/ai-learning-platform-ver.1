// frontend/src/services/learningPath.service.ts
import api from './api';
import { LearningPathData, LearningPathRequest } from '../types/learningPath';

export const learningPathService = {
  // Generate completely AI-powered learning path
  generate: async (request: LearningPathRequest): Promise<LearningPathData> => {
    const response = await api.post<LearningPathData>('/learning-path/generate', request);
    return response.data;
  },

  // Get learning path by ID
  getById: async (pathId: string): Promise<LearningPathData> => {
    const response = await api.get<LearningPathData>(`/learning-path/${pathId}`);
    return response.data;
  },

  // Get mock learning path
  getMock: async (): Promise<LearningPathData> => {
    // Return mock data for development
    return {
      id: 'path_mock_001',
      title: 'Azure AI Engineer Learning Path',
      description: 'Master Azure AI services and machine learning',
      total_duration_hours: 120,
      nodes: [
        {
          id: 'node_1',
          title: 'Cloud Fundamentals',
          description: 'Learn the basics of cloud computing',
          order: 1,
          duration_hours: 20,
          type: 'module',
          status: 'in_progress',
          topics: ['Cloud Concepts', 'Azure Basics', 'Core Services'],
          exercises: [],
          quiz: {
            id: 'quiz_1',
            title: 'Cloud Basics Quiz',
            description: 'Test your knowledge',
            questions: [],
            passing_score: 70,
            time_limit_minutes: 30
          }
        }
      ],
      progress: {
        completed_nodes: [],
        current_node_id: 'node_1',
        overall_progress: 0,
        total_points_earned: 0,
        badges_earned: [],
        last_activity: new Date().toISOString(),
        time_spent_hours: 0
      }
    };
  },

  // Get AI-generated content for a specific node
  getNodeContent: async (pathId: string, nodeId: string): Promise<any> => {
    const response = await api.get(`/learning-path/${pathId}/content/${nodeId}`);
    return response.data;
  },

  // Get AI explanation for a concept
  explainConcept: async (pathId: string, concept: string, context?: string): Promise<any> => {
    const response = await api.post(`/learning-path/${pathId}/explain`, {
      concept,
      context
    });
    return response.data;
  },

  // Update progress
  updateProgress: async (pathId: string, nodeId: string, status: string, pointsEarned?: number): Promise<any> => {
    const response = await api.patch(`/learning-path/${pathId}/progress`, {
      node_id: nodeId,
      status,
      points_earned: pointsEarned
    });
    return response.data;
  },

  // Save to localStorage
  saveToLocal: (learningPath: LearningPathData): void => {
    localStorage.setItem('currentLearningPath', JSON.stringify(learningPath));
  },

  // Get from localStorage
  getFromLocal: (): LearningPathData | null => {
    const stored = localStorage.getItem('currentLearningPath');
    return stored ? JSON.parse(stored) : null;
  },
};