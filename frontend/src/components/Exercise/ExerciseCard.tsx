// frontend/src/components/Exercise/ExerciseCard.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Play,
  Check,
  X,
  Lightbulb,
  FileCode,
  Clock,
  Trophy,
} from 'lucide-react';
import CodeEditor from './CodeEditor';
import Button from '../Common/Button';
import Card from '../Common/Card';
import Badge from '../Common/Badge';
import { Exercise } from '../../types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  onSubmit: (submission: any) => void;
  onRunTests?: (code: string) => void;
  onGetHint?: () => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  onSubmit,
  onRunTests,
  onGetHint,
}) => {
  const [code, setCode] = useState(exercise.starter_code || '');
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<any[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [currentHintIndex, setCurrentHintIndex] = useState(0);
  const [timeSpent] = useState(0);

  const handleRunTests = async () => {
    setIsRunning(true);
    
    // Simulate test execution
    setTimeout(() => {
      const mockResults = exercise.test_cases?.map((test, index) => ({
        name: `Test ${index + 1}`,
        passed: Math.random() > 0.3,
        input: test.input,
        expected: test.expected_output,
        actual: test.expected_output,
        error: Math.random() > 0.7 ? 'Output mismatch' : null,
      })) || [];
      
      setTestResults(mockResults);
      setIsRunning(false);
    }, 2000);
    
    if (onRunTests) {
      onRunTests(code);
    }
  };

  const handleSubmit = () => {
    const submission = {
      exercise_id: exercise.id,
      solution: code,
      language: 'javascript',
      time_spent: timeSpent,
    };
    onSubmit(submission);
  };

  const handleGetHint = () => {
    if (!showHints) {
      setShowHints(true);
    } else if (currentHintIndex < (exercise.hints?.length || 0) - 1) {
      setCurrentHintIndex(currentHintIndex + 1);
    }
    
    if (onGetHint) {
      onGetHint();
    }
  };

  const allTestsPassed = testResults.length > 0 && testResults.every(test => test.passed);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Exercise Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <FileCode className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {exercise.title}
              </h1>
              <Badge variant="secondary">{exercise.type}</Badge>
              <Badge variant={
                exercise.difficulty === 'beginner' ? 'success' :
                exercise.difficulty === 'intermediate' ? 'warning' : 'danger'
              }>
                {exercise.difficulty}
              </Badge>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {exercise.description}
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {exercise.estimated_time_minutes} min
              </span>
              <span className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                {exercise.points} points
              </span>
            </div>
          </div>
          {exercise.sandbox_url && (
            <Button
              variant="secondary"
              onClick={() => window.open(exercise.sandbox_url, '_blank')}
            >
              Open Sandbox
            </Button>
          )}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Instructions & Code Editor */}
        <div className="space-y-6">
          {/* Instructions */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Instructions
            </h2>
            <ol className="space-y-3">
              {exercise.instructions.map((instruction, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3"
                >
                  <span className="flex-shrink-0 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{instruction}</span>
                </motion.li>
              ))}
            </ol>
          </Card>

          {/* Code Editor */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Code Editor
              </h2>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleGetHint}
                  disabled={currentHintIndex >= (exercise.hints?.length || 0) - 1 && showHints}
                >
                  <Lightbulb className="w-4 h-4 mr-1" />
                  Hint ({currentHintIndex + 1}/{exercise.hints?.length || 0})
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={handleRunTests}
                  disabled={isRunning}
                >
                  {isRunning ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Running...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      Run Tests
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            <CodeEditor
              code={code}
              onChange={setCode}
              language="javascript"
              height="400px"
            />

            {/* Hints */}
            {showHints && exercise.hints && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
              >
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                      Hint {currentHintIndex + 1}
                    </p>
                    <p className="text-sm text-yellow-700 dark:text-yellow-300">
                      {exercise.hints[currentHintIndex]}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </div>

        {/* Test Cases & Results */}
        <div className="space-y-6">
          {/* Test Cases */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Test Cases
            </h2>
            <div className="space-y-3">
              {exercise.test_cases?.map((test, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-gray-900 dark:text-white">
                      Test {index + 1}
                    </span>
                    {testResults[index] && (
                      <Badge
                        variant={testResults[index].passed ? 'success' : 'danger'}
                        size="sm"
                      >
                        {testResults[index].passed ? 'Passed' : 'Failed'}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm">
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Input:</span>
                      <code className="text-gray-700 dark:text-gray-300">{test.input}</code>
                    </div>
                    <div className="flex gap-2">
                      <span className="text-gray-500 dark:text-gray-400">Expected:</span>
                      <code className="text-gray-700 dark:text-gray-300">{test.expected_output}</code>
                    </div>
                    {testResults[index] && !testResults[index].passed && (
                      <div className="flex gap-2 text-red-600 dark:text-red-400">
                        <span>Actual:</span>
                        <code>{testResults[index].actual}</code>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Test Results */}
          {testResults.length > 0 && (
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Test Results
              </h2>
              <div className="space-y-3">
                {testResults.map((result, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`p-3 rounded-lg border ${
                      result.passed
                        ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.passed ? (
                        <Check className="w-5 h-5 text-green-600" />
                      ) : (
                        <X className="w-5 h-5 text-red-600" />
                      )}
                      <span className="font-medium text-gray-900 dark:text-white">
                        {result.name}
                      </span>
                    </div>
                    {result.error && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1 ml-7">
                        {result.error}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {testResults.filter(r => r.passed).length} / {testResults.length} tests passed
                  </span>
                  {allTestsPassed && (
                    <Badge variant="success" icon={Trophy}>
                      All tests passed!
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          )}

          {/* Submit Button */}
          {allTestsPassed && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Button
                variant="primary"
                size="lg"
                onClick={handleSubmit}
                className="w-full"
              >
                <Check className="w-5 h-5 mr-2" />
                Submit Solution
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

// Add default export
export default ExerciseCard;