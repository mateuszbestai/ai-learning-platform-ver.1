import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';

interface ProgressData {
  completedNodes: string[];
  currentNodeId: string | null;
  overallProgress: number;
  totalPointsEarned: number;
  badgesEarned: string[];
  timeSpentHours: number;
}

export const useProgress = (pathId?: string) => {
  const [localProgress, setLocalProgress] = useState<ProgressData>(() => {
    const stored = localStorage.getItem(`progress_${pathId}`);
    return stored
      ? JSON.parse(stored)
      : {
          completedNodes: [],
          currentNodeId: null,
          overallProgress: 0,
          totalPointsEarned: 0,
          badgesEarned: [],
          timeSpentHours: 0,
        };
  });

  // Save progress to localStorage
  useEffect(() => {
    if (pathId) {
      localStorage.setItem(`progress_${pathId}`, JSON.stringify(localProgress));
    }
  }, [pathId, localProgress]);

  // Mark node as completed
  const completeNode = useCallback((nodeId: string, points: number = 0) => {
    setLocalProgress((prev) => ({
      ...prev,
      completedNodes: [...new Set([...prev.completedNodes, nodeId])],
      totalPointsEarned: prev.totalPointsEarned + points,
    }));
  }, []);

  // Update current node
  const setCurrentNode = useCallback((nodeId: string) => {
    setLocalProgress((prev) => ({
      ...prev,
      currentNodeId: nodeId,
    }));
  }, []);

  // Add badge
  const earnBadge = useCallback((badge: string) => {
    setLocalProgress((prev) => ({
      ...prev,
      badgesEarned: [...new Set([...prev.badgesEarned, badge])],
    }));
  }, []);

  // Calculate overall progress
  const calculateProgress = useCallback((totalNodes: number) => {
    const progress = (localProgress.completedNodes.length / totalNodes) * 100;
    setLocalProgress((prev) => ({
      ...prev,
      overallProgress: Math.round(progress),
    }));
  }, [localProgress.completedNodes.length]);

  // Add time spent
  const addTimeSpent = useCallback((hours: number) => {
    setLocalProgress((prev) => ({
      ...prev,
      timeSpentHours: prev.timeSpentHours + hours,
    }));
  }, []);

  // Reset progress
  const resetProgress = useCallback(() => {
    setLocalProgress({
      completedNodes: [],
      currentNodeId: null,
      overallProgress: 0,
      totalPointsEarned: 0,
      badgesEarned: [],
      timeSpentHours: 0,
    });
    if (pathId) {
      localStorage.removeItem(`progress_${pathId}`);
    }
  }, [pathId]);

  return {
    progress: localProgress,
    completeNode,
    setCurrentNode,
    earnBadge,
    calculateProgress,
    addTimeSpent,
    resetProgress,
    isNodeCompleted: (nodeId: string) => localProgress.completedNodes.includes(nodeId),
  };
};