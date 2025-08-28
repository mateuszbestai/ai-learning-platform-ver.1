import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Trophy } from 'lucide-react'; // Add Trophy import
import ExerciseCard from '../components/Exercise/ExerciseCard';
import Button from '../components/Common/Button';
import Modal from '../components/Common/Modal';
import { exerciseService } from '../services/exercise.service';
import { Exercise } from '../types/exercise';
import toast from 'react-hot-toast';

const ExercisePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchExercise(id);
    }
  }, [id]);

  const fetchExercise = async (exerciseId: string) => {
    try {
      setLoading(true);
      const data = await exerciseService.getById(exerciseId);
      setExercise(data);
    } catch (error) {
      console.error('Error fetching exercise:', error);
      // Use mock data as fallback
      setExercise(getMockExercise(exerciseId));
    } finally {
      setLoading(false);
    }
  };

  const getMockExercise = (exerciseId: string): Exercise => ({
    id: exerciseId,
    title: 'Deploy a Virtual Machine',
    description: 'Learn to deploy and configure a virtual machine in the cloud',
    type: 'hands-on',
    difficulty: 'beginner',
    estimated_time_minutes: 45,
    points: 100,
    instructions: [
      'Access the cloud portal',
      'Navigate to Virtual Machines section',
      'Click on "Create new VM"',
      'Configure the VM settings (size, region, OS)',
      'Set up networking and security',
      'Review and create the VM',
      'Verify the VM is running',
    ],
    starter_code: `// Deploy a VM using cloud SDK
function deployVM(config) {
  // TODO: Implement VM deployment logic
  
  // Step 1: Validate configuration
  
  // Step 2: Create resource group if needed
  
  // Step 3: Deploy VM with specified settings
  
  // Step 4: Configure networking
  
  // Step 5: Return deployment status
  
  return {
    success: false,
    message: 'Not implemented'
  };
}

// Test your implementation
const config = {
  name: 'my-vm',
  size: 'Standard_B2s',
  region: 'eastus',
  os: 'Ubuntu 20.04'
};

console.log(deployVM(config));`,
    test_cases: [
      {
        input: 'Valid config',
        expected_output: 'VM deployed successfully',
      },
      {
        input: 'Invalid region',
        expected_output: 'Error: Invalid region',
      },
      {
        input: 'Missing name',
        expected_output: 'Error: VM name is required',
      },
    ],
    hints: [
      'Start by validating all required configuration parameters',
      'Check if the resource group exists before creating the VM',
      'Use try-catch blocks to handle potential errors',
      'Remember to return a consistent response format',
    ],
    sandbox_url: 'https://portal.azure.com/sandbox',
  });

  const handleSubmit = async (submission: any) => {
    try {
      const result = await exerciseService.submit(id!, submission);
      setSubmissionResult(result);
      setShowSuccessModal(true);
      
      if (result.passed) {
        toast.success(`Congratulations! You earned ${result.points_earned} points!`);
      } else {
        toast.error('Some tests failed. Keep trying!');
      }
    } catch (error) {
      console.error('Error submitting exercise:', error);
      toast.error('Failed to submit exercise');
    }
  };

  const handleRunTests = async (code: string) => {
    try {
      const results = await exerciseService.runTests(id!, code);
      console.log('Test results:', results);
    } catch (error) {
      console.error('Error running tests:', error);
    }
  };

  const handleGetHint = async () => {
    // Hints are handled within the ExerciseCard component
    console.log('Getting hint...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Exercise Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            The exercise you're looking for doesn't exist
          </p>
          <Button onClick={() => navigate('/learning-path')}>
            Back to Learning Path
          </Button>
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
            onClick={() => navigate('/learning-path')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Learning Path
          </button>
        </div>
      </div>

      {/* Exercise Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <ExerciseCard
          exercise={exercise}
          onSubmit={handleSubmit}
          onRunTests={handleRunTests}
          onGetHint={handleGetHint}
        />
      </motion.div>

      {/* Success Modal */}
      <Modal
        isOpen={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false);
          navigate('/learning-path');
        }}
        title="Exercise Completed!"
      >
        {submissionResult && (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Great Job!
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {submissionResult.feedback}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 mb-2">Points Earned</p>
              <p className="text-3xl font-bold text-indigo-600">
                +{submissionResult.points_earned}
              </p>
            </div>
            <Button
              variant="primary"
              onClick={() => {
                setShowSuccessModal(false);
                navigate('/learning-path');
              }}
              className="w-full"
            >
              Continue Learning
            </Button>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ExercisePage;