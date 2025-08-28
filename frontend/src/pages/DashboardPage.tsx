import React, { useEffect, useState } from 'react';
import LearningPath from '../components/LearningPath/LearningPath';
import axios from 'axios';

const DashboardPage: React.FC = () => {
  const [learningPath, setLearningPath] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLearningPath();
  }, []);

  const fetchLearningPath = async () => {
    try {
      // Try to get from localStorage first (if generated from home)
      const stored = localStorage.getItem('currentLearningPath');
      if (stored) {
        setLearningPath(JSON.parse(stored));
      } else {
        // Otherwise fetch mock data
        const response = await axios.get('/api/v1/learning-path/mock');
        setLearningPath(response.data);
      }
    } catch (error) {
      // Use mock data as fallback
      setLearningPath(getMockData());
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => ({
    id: 'path_001',
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
        exercises: [],
        quiz: null
      }
    ],
    progress: {
      completed_nodes: [],
      current_node_id: 'node_1',
      overall_progress: 15,
      total_points_earned: 150,
      badges_earned: ['Quick Starter'],
      last_activity: new Date().toISOString()
    }
  });

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LearningPath data={learningPath} />
    </div>
  );
};

export default DashboardPage;