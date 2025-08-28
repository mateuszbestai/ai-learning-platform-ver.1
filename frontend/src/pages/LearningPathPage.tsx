import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import LearningPath from '../components/LearningPath/LearningPath';
import { useLearningPath } from '../hooks/useLearningPath';
import { learningPathService } from '../services/learningPath.service';

const LearningPathPage: React.FC = () => {
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();
  const { learningPath, isLoading, error } = useLearningPath(id);

  useEffect(() => {
    if (!id) {
      // If no ID, try to load from localStorage or fetch mock
      const localPath = learningPathService.getFromLocal();
      if (!localPath) {
        // Fetch mock data if nothing in localStorage
        learningPathService.getMock().then((mockPath) => {
          learningPathService.saveToLocal(mockPath);
        });
      }
    }
  }, [id]);

  const handleNodeClick = (nodeId: string) => {
    console.log('Node clicked:', nodeId);
  };

  const handleExerciseClick = (exerciseId: string) => {
    navigate(`/exercise/${exerciseId}`);
  };

  const handleQuizClick = (quizId: string) => {
    navigate(`/quiz/${quizId}`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Error Loading Learning Path
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {error.message || 'Something went wrong'}
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!learningPath) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            No Learning Path Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Generate a learning path to get started
          </p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Create Learning Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <LearningPath
        data={learningPath}
        onNodeClick={handleNodeClick}
        onExerciseClick={handleExerciseClick}
        onQuizClick={handleQuizClick}
      />
    </div>
  );
};

export default LearningPathPage;