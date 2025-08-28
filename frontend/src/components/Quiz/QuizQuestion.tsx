import React from 'react';
import { motion } from 'framer-motion';
import { Check, Circle } from 'lucide-react';
import { QuizQuestion as QuizQuestionType, QuizAnswer } from '../../types/quiz';
import Card from '../Common/Card';

interface QuizQuestionProps {
  question: QuizQuestionType;
  answer?: QuizAnswer;
  onChange: (answer: QuizAnswer) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  answer,
  onChange,
  showResult,
  isCorrect,
}) => {
  const handleSingleChoice = (optionIndex: number) => {
    onChange(optionIndex);
  };

  const handleMultipleChoice = (optionIndex: number) => {
    const currentAnswers = (answer as number[]) || [];
    const newAnswers = currentAnswers.includes(optionIndex)
      ? currentAnswers.filter(i => i !== optionIndex)
      : [...currentAnswers, optionIndex];
    onChange(newAnswers);
  };

  const handleTrueFalse = (value: boolean) => {
    onChange(value);
  };

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Question */}
        <div>
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                {question.points}
              </span>
            </div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex-1">
              {question.question}
            </h2>
          </div>
          {question.code && (
            <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto">
              <code className="text-sm">{question.code}</code>
            </pre>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3">
          {question.type === 'multiple_choice' && question.options && (
            <>
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => handleSingleChoice(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    answer === index
                      ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  } ${
                    showResult && answer === index
                      ? isCorrect
                        ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                        : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      : ''
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      answer === index
                        ? 'border-indigo-500 bg-indigo-500'
                        : 'border-gray-400'
                    }`}>
                      {answer === index && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </motion.button>
              ))}
            </>
          )}

          {question.type === 'multiple_select' && question.options && (
            <>
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                Select all that apply
              </p>
              {question.options.map((option, index) => {
                const isSelected = (answer as number[])?.includes(index) || false;
                return (
                  <motion.button
                    key={index}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleMultipleChoice(index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-500'
                          : 'border-gray-400'
                      }`}>
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="text-gray-900 dark:text-white">{option}</span>
                    </div>
                  </motion.button>
                );
              })}
            </>
          )}

          {question.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTrueFalse(true)}
                className={`p-4 rounded-lg border-2 font-medium transition-all ${
                  answer === true
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                True
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleTrueFalse(false)}
                className={`p-4 rounded-lg border-2 font-medium transition-all ${
                  answer === false
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600'
                    : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                }`}
              >
                False
              </motion.button>
            </div>
          )}
        </div>

        {/* Explanation (shown after submission) */}
        {showResult && question.explanation && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg ${
              isCorrect
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            }`}
          >
            <p className="text-sm text-gray-800 dark:text-gray-200">
              <strong>Explanation:</strong> {question.explanation}
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default QuizQuestion;