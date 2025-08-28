import React from 'react';
import { motion } from 'framer-motion';
import {
  Trophy,
  Award,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  RefreshCw,
  ArrowRight,
} from 'lucide-react';
import Button from '../Common/Button';
import Card from '../Common/Card';
import ProgressBar from '../LearningPath/ProgressBar';
import Badge from '../Common/Badge';
import { Quiz } from '../../types/quiz';

interface QuizResultsProps {
  quiz: Quiz;
  results: {
    score: number;
    passed: boolean;
    correct_answers: number;
    total_questions: number;
    points_earned: number;
    time_spent?: number;
    feedback?: Record<string, string>;
  };
  onRetry?: () => void;
  onClose?: () => void;
  onReview?: () => void;
}

const QuizResults: React.FC<QuizResultsProps> = ({
  quiz,
  results,
  onRetry,
  onClose,
  onReview,
}) => {
  const performanceLevel =
    results.score >= 90 ? 'Excellent' :
    results.score >= 70 ? 'Good' :
    results.score >= 50 ? 'Fair' : 'Needs Improvement';

  const performanceColor =
    results.score >= 90 ? 'text-green-600' :
    results.score >= 70 ? 'text-blue-600' :
    results.score >= 50 ? 'text-yellow-600' : 'text-red-600';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-2xl mx-auto p-6"
    >
      <Card className="overflow-hidden">
        {/* Header with gradient background */}
        <div className={`p-8 text-white text-center ${
          results.passed
            ? 'bg-gradient-to-r from-green-500 to-emerald-600'
            : 'bg-gradient-to-r from-orange-500 to-red-600'
        }`}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-24 h-24 mx-auto mb-4 bg-white/20 backdrop-blur rounded-full flex items-center justify-center"
          >
            {results.passed ? (
              <Trophy className="w-12 h-12 text-white" />
            ) : (
              <Target className="w-12 h-12 text-white" />
            )}
          </motion.div>
          
          <h1 className="text-3xl font-bold mb-2">
            {results.passed ? 'Congratulations!' : 'Keep Practicing!'}
          </h1>
          <p className="text-lg opacity-90">
            {results.passed
              ? 'You passed the quiz!'
              : 'You didn\'t pass this time, but keep learning!'}
          </p>
        </div>

        {/* Score Section */}
        <div className="p-8">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3 }}
              className="text-6xl font-bold mb-2"
            >
              <span className={performanceColor}>{Math.round(results.score)}%</span>
            </motion.div>
            <p className="text-gray-600 dark:text-gray-400">Your Score</p>
            <Badge variant={results.passed ? 'success' : 'warning'} className="mt-2">
              {performanceLevel}
            </Badge>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.correct_answers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Correct</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <XCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.total_questions - results.correct_answers}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Incorrect</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Award className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                +{results.points_earned}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Points</p>
            </div>
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <Clock className="w-8 h-8 text-blue-500 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {results.time_spent ? Math.round(results.time_spent / 60) : 0}m
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">Time</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600 dark:text-gray-400">Passing Score</span>
              <span className="font-medium text-gray-900 dark:text-white">
                {quiz.passing_score}%
              </span>
            </div>
            <div className="relative">
              <ProgressBar progress={results.score} size="lg" />
              <div
                className="absolute top-0 h-full w-0.5 bg-gray-400"
                style={{ left: `${quiz.passing_score}%` }}
              >
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 whitespace-nowrap">
                  Pass Line
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            {onReview && (
              <Button
                variant="secondary"
                onClick={onReview}
                className="flex-1"
              >
                Review Answers
              </Button>
            )}
            {onRetry && !results.passed && (
              <Button
                variant="primary"
                onClick={onRetry}
                className="flex-1"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            )}
            <Button
              variant={results.passed ? 'primary' : 'secondary'}
              onClick={onClose}
              className="flex-1"
            >
              Continue Learning
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

export default QuizResults;
