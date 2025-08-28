import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { learningPathService } from '../services/learningPath.service';
import { LearningPathData, LearningPathRequest } from '../types/learningPath';
import toast from 'react-hot-toast';

export const useLearningPath = (pathId?: string) => {
  const queryClient = useQueryClient();

  // Fetch learning path
  const {
    data: learningPath,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['learningPath', pathId],
    queryFn: async () => {
      if (pathId) {
        return learningPathService.getById(pathId);
      }
      // Try to get from local storage first
      const localPath = learningPathService.getFromLocal();
      if (localPath) {
        return localPath;
      }
      // Otherwise get mock data
      return learningPathService.getMock();
    },
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Generate learning path mutation
  const generateMutation = useMutation({
    mutationFn: (request: LearningPathRequest) => learningPathService.generate(request),
    onSuccess: (data) => {
      queryClient.setQueryData(['learningPath', data.id], data);
      learningPathService.saveToLocal(data);
      toast.success('Learning path generated successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to generate learning path');
    },
  });

  // Update progress mutation
  const updateProgressMutation = useMutation({
    mutationFn: ({
      nodeId,
      status,
      pointsEarned,
    }: {
      nodeId: string;
      status: string;
      pointsEarned?: number;
    }) => {
      if (!learningPath?.id) throw new Error('No learning path ID');
      return learningPathService.updateProgress(learningPath.id, nodeId, status, pointsEarned);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningPath', pathId] });
      toast.success('Progress updated!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update progress');
    },
  });

  return {
    learningPath,
    isLoading,
    error,
    refetch,
    generateLearningPath: generateMutation.mutate,
    isGenerating: generateMutation.isPending,
    updateProgress: updateProgressMutation.mutate,
    isUpdatingProgress: updateProgressMutation.isPending,
  };
};