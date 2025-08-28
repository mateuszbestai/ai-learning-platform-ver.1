import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import QuizComponent from '../components/Quiz/QuizComponent';
import { quizService } from '../services/quiz.service';
import { Quiz, QuizSubmission } from '../types/quiz';
import toast from 'react-hot-toast';

const QuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchQuiz(id);
    }
  }, [id]);

  const fetchQuiz = async (quizId: string) => {
    try {
      setLoading(true);
      const data = await quizService.getById(quizId);
      setQuiz(data);
    } catch (error) {
      console.error('Error fetching quiz:', error);
      // Use mock data as fallback
      setQuiz(getMockQuiz(quizId));
    } finally {
      setLoading(false);
    }
  };

  const getMockQuiz = (quizId: string): Quiz => ({
    id: quizId,
    title: 'Cloud Computing Fundamentals',
    description: 'Test your knowledge of cloud computing basics',
    questions: [
      {
        id: 'q1',
        question: 'What is the primary benefit of cloud computing?',
        type: 'multiple_choice',
        options: [
          'Reduced capital expenditure',
          'Unlimited storage',
          'No maintenance required',
          'Free services',
        ],
        points: 10,
      },
      {
        id: 'q2',
        question: 'Which of the following are cloud service models? (Select all that apply)',
        type: 'multiple_select',
        options: ['IaaS', 'PaaS', 'SaaS', 'XaaS'],
        points: 15,
      },
      {
        id: 'q3',
        question: 'Public cloud services always require internet connectivity.',
        type: 'true_false',
        points: 5,
      },
      {
        id: 'q4',
        question: 'What does "elasticity" mean in cloud computing?',
        type: 'multiple_choice',
        options: [
          'The ability to scale resources up or down based on demand',
          'The flexibility of pricing models',
          'The durability of data storage',
          'The speed of network connections',
        ],
        points: 10,
      },
      {
        id: 'q5',
        question: 'Which cloud deployment model provides the highest level of control?',
        type: 'multiple_choice',
        options: [
          'Public Cloud',
          'Private Cloud',
          'Hybrid Cloud',
          'Community Cloud',
        ],
        points: 10,
      },
    ],
    time_limit_minutes: 30,
    passing_score: 70,
    max_attempts: 3,
    attempts_remaining: 3,
  });

  const handleSubmit = async (submission: QuizSubmission) => {
    try {
      const result = await quizService.submit(id!, submission);
      
      if (result.passed) {
        toast.success(`Quiz passed! Score: ${result.score}%`);
      } else {
        toast.error(`Quiz not passed. Score: ${result.score}%`);
      }
      
      // The QuizComponent handles showing results internally
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Failed to submit quiz');
    }
  };

  const handleExit = () => {
    navigate('/learning-path');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Quiz Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The quiz you're looking for doesn't exist
          </p>
          <button
            onClick={() => navigate('/learning-path')}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            Back to Learning Path
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <button
            onClick={handleExit}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learning Path
          </button>
        </div>
      </div>

      {/* Quiz Content */}
      <QuizComponent
        quiz={quiz}
        onSubmit={handleSubmit}
        onExit={handleExit}
      />
    </div>
  );
};

export default QuizPage;