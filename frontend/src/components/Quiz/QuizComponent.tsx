import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  AlertCircle,
  Trophy,
  Target,
} from 'lucide-react';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';
import Button from '../Common/Button';
import ProgressBar from '../LearningPath/ProgressBar';
import { Quiz, QuizAnswer, QuizSubmission } from '../../types/quiz';

interface QuizComponentProps {
  quiz: Quiz;
  onSubmit: (submission: QuizSubmission) => void;
  onExit?: () => void;
}

const QuizComponent: React.FC<QuizComponentProps> = ({ quiz, onSubmit, onExit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, QuizAnswer>>({});
  const [timeRemaining, setTimeRemaining] = useState(quiz.time_limit_minutes * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const answeredCount = Object.keys(answers).length;

  // Timer effect
  useEffect(() => {
    if (!isSubmitted && timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeRemaining, isSubmitted]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = (questionId: string, answer: QuizAnswer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const handleNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    const submission: QuizSubmission = {
      quiz_id: quiz.id,
      answers,
      time_spent: quiz.time_limit_minutes * 60 - timeRemaining,
    };

    setIsSubmitted(true);
    
    // Simulate submission and getting results
    setTimeout(() => {
      const mockResults = {
        score: 85,
        passed: true,
        correct_answers: 8,
        total_questions: 10,
        points_earned: 100,
        feedback: {
          q1: 'Correct! Great understanding of cloud concepts.',
          q2: 'Incorrect. Review the documentation on service models.',
        },
      };
      setResults(mockResults);
      setShowResults(true);
    }, 1000);

    onSubmit(submission);
  };

  if (showResults && results) {
    return <QuizResults quiz={quiz} results={results} onClose={onExit} />;
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {quiz.title}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">{quiz.description}</p>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${
              timeRemaining < 300 ? 'text-red-600' : 'text-gray-900 dark:text-white'
            }`}>
              <Clock className="inline-block w-5 h-5 mr-2" />
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-gray-500 mt-1">Time Remaining</p>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {totalQuestions}
            </span>
            <span className="text-gray-600 dark:text-gray-400">
              {answeredCount} answered
            </span>
          </div>
          <ProgressBar progress={progress} size="md" />
        </div>
      </div>

      {/* Question Navigation Pills */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {quiz.questions.map((q, index) => (
            <button
              key={q.id}
              onClick={() => setCurrentQuestionIndex(index)}
              className={`w-10 h-10 rounded-lg font-medium transition-all ${
                index === currentQuestionIndex
                  ? 'bg-indigo-600 text-white'
                  : answers[q.id]
                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
              } hover:opacity-80`}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>

      {/* Question */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <QuizQuestion
            question={currentQuestion}
            answer={answers[currentQuestion.id]}
            onChange={(answer) => handleAnswerChange(currentQuestion.id, answer)}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8">
        <Button
          variant="secondary"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0}
        >
          <ChevronLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>

        <div className="flex gap-4">
          {onExit && (
            <Button variant="secondary" onClick={onExit}>
              Save & Exit
            </Button>
          )}
        </div>

        {currentQuestionIndex === totalQuestions - 1 ? (
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={answeredCount < totalQuestions}
          >
            Submit Quiz
            <Check className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button variant="primary" onClick={handleNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Warning for unanswered questions */}
      {currentQuestionIndex === totalQuestions - 1 && answeredCount < totalQuestions && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
        >
          <div className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">
              You have {totalQuestions - answeredCount} unanswered question(s). Please answer all questions before submitting.
            </p>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default QuizComponent;