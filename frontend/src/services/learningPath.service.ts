import api from './api';

export const learningPathService = {
  // Generate completely AI-powered learning path
  generate: async (request: LearningPathRequest): Promise<LearningPathData> => {
    const response = await api.post<LearningPathData>('/learning-path/generate', request);
    return response.data;
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
};