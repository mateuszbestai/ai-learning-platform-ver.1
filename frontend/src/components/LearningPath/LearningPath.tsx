// frontend/src/components/LearningPath/LearningPath.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Clock,
  Trophy,
  ChevronRight,
  Play,
  CheckCircle,
  Lock,
  Zap,
  Target,
  Brain,
  Code,
  FileText,
  Video,
  ExternalLink,
  Award,
  TrendingUp,
  Sparkles,
  MessageSquare,
  Lightbulb,
  RefreshCw,
  Send,
  Loader2,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { LearningPathData, PathNode } from '../../types/learningPath';
import ProgressBar from './ProgressBar';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import Card from '../Common/Card';
import Modal from '../Common/Modal';
import CodeEditor from '../Exercise/CodeEditor';
import { learningPathService } from '../../services/learningPath.service';
import { exerciseService } from '../../services/exercise.service';
import toast from 'react-hot-toast';

interface LearningPathProps {
  data: LearningPathData;
  onNodeClick?: (nodeId: string) => void;
  onExerciseClick?: (exerciseId: string) => void;
  onQuizClick?: (quizId: string) => void;
}

const LearningPath: React.FC<LearningPathProps> = ({
  data,
  onNodeClick,
  onExerciseClick,
  onQuizClick,
}) => {
  const navigate = useNavigate();
  const [expandedNode, setExpandedNode] = useState<string | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodeContent, setNodeContent] = useState<Record<string, any>>({});
  const [loadingContent, setLoadingContent] = useState<string | null>(null);
  const [showExerciseModal, setShowExerciseModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<any>(null);
  const [exerciseCode, setExerciseCode] = useState('');
  const [exerciseEvaluation, setExerciseEvaluation] = useState<any>(null);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [exerciseHints, setExerciseHints] = useState<string[]>([]);
  const [hintLevel, setHintLevel] = useState(0);
  const [showConceptModal, setShowConceptModal] = useState(false);
  const [selectedConcept, setSelectedConcept] = useState<string>('');
  const [conceptExplanation, setConceptExplanation] = useState<any>(null);
  const [loadingConcept, setLoadingConcept] = useState(false);

  // Load AI-generated content for a node
  const loadNodeContent = async (nodeId: string) => {
    if (nodeContent[nodeId]) return; // Already loaded

    setLoadingContent(nodeId);
    try {
      const content = await learningPathService.getNodeContent(data.id, nodeId);
      setNodeContent(prev => ({ ...prev, [nodeId]: content }));
      toast.success('Content loaded successfully!');
    } catch (error) {
      console.error('Error loading node content:', error);
      toast.error('Failed to load content. Please try again.');
    } finally {
      setLoadingContent(null);
    }
  };

  // Get AI explanation for a concept
  const explainConcept = async (concept: string, nodeContext?: string) => {
    setSelectedConcept(concept);
    setShowConceptModal(true);
    setLoadingConcept(true);
    setConceptExplanation(null);

    try {
      const explanation = await learningPathService.explainConcept(
        data.id,
        concept,
        nodeContext
      );
      setConceptExplanation(explanation);
    } catch (error) {
      console.error('Error getting explanation:', error);
      toast.error('Failed to get explanation');
    } finally {
      setLoadingConcept(false);
    }
  };

  // Handle exercise submission with AI evaluation
  const handleExerciseSubmit = async () => {
    if (!selectedExercise || !exerciseCode.trim()) {
      toast.error('Please write some code before submitting');
      return;
    }

    setIsEvaluating(true);
    try {
      const evaluation = await exerciseService.evaluateSubmission(
        selectedExercise.id,
        {
          exercise_id: selectedExercise.id,
          solution: exerciseCode,
          language: 'javascript',
          time_spent: 0,
        }
      );

      setExerciseEvaluation(evaluation);
      
      if (evaluation.passed) {
        toast.success(`Excellent work! Score: ${evaluation.score}/100`);
        // Update progress
        const node = data.nodes.find(n => 
          n.exercises?.some(ex => ex.id === selectedExercise.id)
        );
        if (node) {
          // Update node progress
        }
      } else {
        toast.info('Keep trying! Check the feedback for improvements.');
      }
    } catch (error) {
      console.error('Error evaluating submission:', error);
      toast.error('Failed to evaluate submission');
    } finally {
      setIsEvaluating(false);
    }
  };

  // Get AI hint for exercise
  const getExerciseHint = async () => {
    if (!selectedExercise || hintLevel >= 3) return;

    try {
      const newLevel = hintLevel + 1;
      const hint = await exerciseService.getHint(
        selectedExercise.id,
        exerciseCode,
        newLevel
      );
      setExerciseHints([...exerciseHints, hint]);
      setHintLevel(newLevel);
      toast.success(`Hint ${newLevel} provided!`);
    } catch (error) {
      console.error('Error getting hint:', error);
      toast.error('Failed to get hint');
    }
  };

  // Handle exercise start
  const startExercise = (exercise: any) => {
    setSelectedExercise(exercise);
    setExerciseCode(exercise.starter_code || '// Write your solution here\n');
    setExerciseEvaluation(null);
    setExerciseHints([]);
    setHintLevel(0);
    setShowExerciseModal(true);
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case 'module':
        return BookOpen;
      case 'project':
        return Code;
      case 'assessment':
        return Trophy;
      default:
        return Target;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-500 bg-green-100 dark:bg-green-900/30';
      case 'in_progress':
        return 'text-blue-500 bg-blue-100 dark:bg-blue-900/30';
      case 'locked':
        return 'text-gray-400 bg-gray-100 dark:bg-gray-800';
      default:
        return 'text-gray-500 bg-gray-100 dark:bg-gray-800';
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (expandedNode === nodeId) {
      setExpandedNode(null);
    } else {
      setExpandedNode(nodeId);
      // Load content when node is expanded
      const node = data.nodes.find(n => n.id === nodeId);
      if (node && !nodeContent[nodeId]) {
        loadNodeContent(nodeId);
      }
    }
    onNodeClick?.(nodeId);
  };

  const calculateNodeProgress = (node: PathNode): number => {
    // This would be calculated based on completed exercises and quizzes
    return 0;
  };

  // Render AI-generated content
  const renderAIContent = (node: PathNode) => {
    const content = nodeContent[node.id]?.content;

    if (!content && loadingContent === node.id) {
      return (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            AI is generating content...
          </span>
        </div>
      );
    }

    if (!content) {
      return (
        <div className="text-center py-8 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg">
          <Brain className="w-12 h-12 text-indigo-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            AI-powered content for this module
          </p>
          <Button
            onClick={() => loadNodeContent(node.id)}
            disabled={loadingContent === node.id}
            variant="primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Generate AI Content
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        {/* Introduction */}
        {content.introduction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Introduction
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {content.introduction}
            </p>
          </motion.div>
        )}

        {/* Learning Objectives */}
        {node.learning_objectives && node.learning_objectives.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-500" />
              Learning Objectives
            </h3>
            <ul className="space-y-3">
              {node.learning_objectives.map((objective: string, idx: number) => (
                <li key={idx} className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center text-sm">
                    {idx + 1}
                  </span>
                  <span className="text-gray-700 dark:text-gray-300">{objective}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Content Sections */}
        {content.sections && content.sections.map((section: any, idx: number) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + idx * 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden"
          >
            <div className="p-6">
              <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-500" />
                {section.title}
              </h4>
              
              {/* Section Content */}
              <div className="prose prose-lg dark:prose-invert max-w-none mb-4">
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                  {section.content}
                </p>
              </div>

              {/* Key Points */}
              {section.key_points && section.key_points.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <h5 className="font-semibold mb-3 flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
                    <Lightbulb className="w-4 h-4" />
                    Key Points
                  </h5>
                  <ul className="space-y-2">
                    {section.key_points.map((point: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span className="text-gray-700 dark:text-gray-300">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Examples with Code */}
              {section.examples && section.examples.length > 0 && (
                <div className="mt-4">
                  <h5 className="font-semibold mb-3 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Examples
                  </h5>
                  {section.examples.map((example: string, i: number) => (
                    <pre key={i} className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto mb-3">
                      <code>{example}</code>
                    </pre>
                  ))}
                </div>
              )}

              {/* Interactive Elements */}
              <div className="mt-4 flex flex-wrap gap-2">
                {section.key_concepts && section.key_concepts.map((concept: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => explainConcept(concept, section.title)}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-sm hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-colors"
                  >
                    {concept}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ))}

        {/* Summary */}
        {content.summary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="p-6 bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/20 dark:to-teal-900/20 rounded-lg"
          >
            <h3 className="text-xl font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-500" />
              Summary
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {content.summary}
            </p>
          </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white shadow-xl"
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Brain className="w-8 h-8" />
              <Badge variant="success" className="bg-white/20 text-white">
                AI-Powered Curriculum
              </Badge>
            </div>
            <h1 className="text-4xl font-bold mb-3">{data.title}</h1>
            <p className="text-lg opacity-90 mb-6">{data.description}</p>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                <span>{data.total_duration_hours} hours total</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                <span>{data.nodes.length} modules</span>
              </div>
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5" />
                <span>{data.progress?.total_points_earned || 0} points earned</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5" />
                <span>Personalized for you</span>
              </div>
            </div>

            <ProgressBar
              progress={data.progress?.overall_progress || 0}
              className="mb-4"
              showPercentage
              size="lg"
              color="white"
            />

            {/* AI Features Badge */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="success" className="bg-white/20 backdrop-blur">
                <Brain className="w-3 h-3 mr-1" />
                AI Content Generation
              </Badge>
              <Badge variant="success" className="bg-white/20 backdrop-blur">
                <MessageSquare className="w-3 h-3 mr-1" />
                Real-time Evaluation
              </Badge>
              <Badge variant="success" className="bg-white/20 backdrop-blur">
                <Lightbulb className="w-3 h-3 mr-1" />
                Smart Hints
              </Badge>
            </div>
          </div>
          
          <div className="ml-8">
            <GraduationCap className="w-24 h-24 opacity-50" />
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            label: 'Current Module',
            value: data.nodes.find(n => n.id === data.progress?.current_node_id)?.title || 'Getting Started',
            icon: BookOpen,
            color: 'text-blue-500',
          },
          {
            label: 'Completion',
            value: `${data.progress?.overall_progress || 0}%`,
            icon: TrendingUp,
            color: 'text-green-500',
          },
          {
            label: 'Points',
            value: data.progress?.total_points_earned || 0,
            icon: Trophy,
            color: 'text-yellow-500',
          },
          {
            label: 'AI Support',
            value: 'Active',
            icon: Brain,
            color: 'text-purple-500',
          },
        ].map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Learning Path Nodes */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <BookOpen className="w-6 h-6" />
          Your AI-Generated Learning Journey
        </h2>
        
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-700" />
          
          {data.nodes.map((node, index) => {
            const Icon = getNodeIcon(node.type);
            const isExpanded = expandedNode === node.id;
            const isLocked = node.status === 'locked';
            const isCompleted = node.status === 'completed';
            const isInProgress = node.status === 'in_progress';
            const nodeProgress = calculateNodeProgress(node);
            const hasContent = !!nodeContent[node.id];
            
            return (
              <motion.div
                key={node.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="relative"
              >
                {/* Node Marker */}
                <div
                  className={`absolute left-4 w-8 h-8 rounded-full flex items-center justify-center z-10 transition-all ${
                    getStatusColor(node.status)
                  } ${hoveredNode === node.id ? 'scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle className="w-5 h-5" />
                  ) : isLocked ? (
                    <Lock className="w-4 h-4" />
                  ) : (
                    <div className="w-3 h-3 bg-current rounded-full" />
                  )}
                </div>

                {/* Node Content */}
                <Card
                  className={`ml-16 cursor-pointer transition-all ${
                    isLocked ? 'opacity-60' : ''
                  } ${hoveredNode === node.id ? 'shadow-lg transform -translate-y-1' : ''}`}
                  onClick={() => !isLocked && handleNodeClick(node.id)}
                >
                  <div className="p-6">
                    {/* Node Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="w-6 h-6 text-indigo-500" />
                          <Badge variant={node.type === 'project' ? 'warning' : 'default'}>
                            {node.type}
                          </Badge>
                          {node.difficulty && (
                            <Badge variant="secondary">{node.difficulty}</Badge>
                          )}
                          {hasContent && (
                            <Badge variant="success" icon={Brain}>
                              AI Content Loaded
                            </Badge>
                          )}
                        </div>
                        
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                          {node.title}
                        </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4">
                          {node.description}
                        </p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {node.duration_hours}h
                          </span>
                          {node.exercises && node.exercises.length > 0 && (
                            <span className="flex items-center gap-1">
                              <Code className="w-4 h-4" />
                              {node.exercises.length} AI exercises
                            </span>
                          )}
                          {node.quiz && (
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              AI Quiz available
                            </span>
                          )}
                        </div>
                        
                        {isInProgress && (
                          <div className="mt-4">
                            <ProgressBar
                              progress={nodeProgress}
                              size="sm"
                              showPercentage
                            />
                          </div>
                        )}
                      </div>
                      
                      <ChevronRight
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`}
                      />
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 space-y-6">
                            {/* AI-Generated Content */}
                            {renderAIContent(node)}

                            {/* Exercises */}
                            {node.exercises && node.exercises.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                  <Code className="w-5 h-5 text-purple-500" />
                                  AI-Powered Exercises
                                </h4>
                                <div className="space-y-3">
                                  {node.exercises.map((exercise) => (
                                    <div
                                      key={exercise.id}
                                      className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg"
                                    >
                                      <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                          <h5 className="font-semibold mb-1">{exercise.title}</h5>
                                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                            {exercise.description}
                                          </p>
                                          <div className="flex items-center gap-3 text-xs">
                                            <Badge variant="secondary">
                                              {exercise.difficulty}
                                            </Badge>
                                            <span className="text-gray-500">
                                              {exercise.estimated_time_minutes} min
                                            </span>
                                            <span className="text-gray-500">
                                              {exercise.points} pts
                                            </span>
                                            <Badge variant="success" size="sm">
                                              <Brain className="w-3 h-3 mr-1" />
                                              AI Evaluation
                                            </Badge>
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            startExercise(exercise);
                                          }}
                                        >
                                          <Play className="w-4 h-4 mr-1" />
                                          Start
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Quiz */}
                            {node.quiz && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                                  <Trophy className="w-5 h-5 text-yellow-500" />
                                  AI-Generated Assessment
                                </h4>
                                <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 rounded-lg">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h5 className="font-semibold mb-1">{node.quiz.title}</h5>
                                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        {node.quiz.description}
                                      </p>
                                      <div className="flex items-center gap-3 text-xs">
                                        <span className="text-gray-500">
                                          {node.quiz.questions.length} AI questions
                                        </span>
                                        <span className="text-gray-500">
                                          {node.quiz.time_limit_minutes} min
                                        </span>
                                        <span className="text-gray-500">
                                          Pass: {node.quiz.passing_score}%
                                        </span>
                                      </div>
                                    </div>
                                    <Button
                                      size="sm"
                                      variant="warning"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onQuizClick?.(node.quiz!.id);
                                        navigate(`/quiz/${node.quiz!.id}`);
                                      }}
                                    >
                                      <Zap className="w-4 h-4 mr-1" />
                                      Take Quiz
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex gap-3 pt-4">
                              {!hasContent && (
                                <Button
                                  variant="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    loadNodeContent(node.id);
                                  }}
                                  disabled={loadingContent === node.id}
                                  className="flex-1"
                                >
                                  {loadingContent === node.id ? (
                                    <>
                                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                      Generating AI Content...
                                    </>
                                  ) : (
                                    <>
                                      <Brain className="w-4 h-4 mr-2" />
                                      Generate AI Content
                                    </>
                                  )}
                                </Button>
                              )}
                              {!isCompleted && !isLocked && hasContent && (
                                <Button
                                  variant="primary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Start or continue module
                                  }}
                                  className="flex-1"
                                >
                                  {isInProgress ? 'Continue Learning' : 'Start Module'}
                                </Button>
                              )}
                              {isCompleted && (
                                <Button
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    // Review module
                                  }}
                                  className="flex-1"
                                >
                                  Review Module
                                </Button>
                              )}
                              {hasContent && (
                                <Button
                                  variant="secondary"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    loadNodeContent(node.id);
                                  }}
                                  disabled={loadingContent === node.id}
                                >
                                  <RefreshCw className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Exercise Modal */}
      <Modal
        isOpen={showExerciseModal}
        onClose={() => setShowExerciseModal(false)}
        title={selectedExercise?.title}
        size="xl"
      >
        {selectedExercise && (
          <div className="space-y-6">
            {/* Exercise Details */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <Badge variant="secondary">{selectedExercise.difficulty}</Badge>
                <span className="text-sm text-gray-500">
                  {selectedExercise.estimated_time_minutes} min
                </span>
                <span className="text-sm text-gray-500">
                  {selectedExercise.points} points
                </span>
              </div>
              
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p>{selectedExercise.problem_statement || selectedExercise.description}</p>
                
                {selectedExercise.requirements && (
                  <div className="mt-4">
                    <h4 className="font-semibold">Requirements:</h4>
                    <ul>
                      {selectedExercise.requirements.map((req: string, idx: number) => (
                        <li key={idx}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {selectedExercise.evaluation_criteria && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-semibold mb-2">Evaluation Criteria:</h4>
                    <ul className="space-y-1">
                      {selectedExercise.evaluation_criteria.map((criteria: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-blue-500">•</span>
                          {criteria}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* Code Editor */}
            <div>
              <h4 className="font-semibold mb-3">Your Solution:</h4>
              <CodeEditor
                code={exerciseCode}
                onChange={setExerciseCode}
                language="javascript"
                height="300px"
              />
            </div>

            {/* AI Hints */}
            {exerciseHints.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold">AI Hints:</h4>
                {exerciseHints.map((hint, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                  >
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm mb-1">Hint {idx + 1}</p>
                        <p className="text-sm text-gray-700 dark:text-gray-300">{hint}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* AI Evaluation Results */}
            {exerciseEvaluation && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-4 rounded-lg ${
                  exerciseEvaluation.passed
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : 'bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800'
                }`}
              >
                <h4 className="font-semibold mb-3">AI Evaluation:</h4>
                
                {/* Score */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="text-2xl font-bold">
                    {exerciseEvaluation.score}/100
                  </div>
                  <Badge variant={exerciseEvaluation.passed ? 'success' : 'warning'}>
                    {exerciseEvaluation.passed ? 'Passed' : 'Keep Trying'}
                  </Badge>
                </div>

                {/* Feedback */}
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  {exerciseEvaluation.overall_feedback}
                </p>

                {/* Code Quality */}
                {exerciseEvaluation.code_quality && (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="text-xs text-gray-500">Readability</p>
                      <p className="font-bold">{exerciseEvaluation.code_quality.readability}/10</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="text-xs text-gray-500">Efficiency</p>
                      <p className="font-bold">{exerciseEvaluation.code_quality.efficiency}/10</p>
                    </div>
                    <div className="text-center p-2 bg-white dark:bg-gray-800 rounded">
                      <p className="text-xs text-gray-500">Best Practices</p>
                      <p className="font-bold">{exerciseEvaluation.code_quality.best_practices}/10</p>
                    </div>
                  </div>
                )}

                {/* Improvements */}
                {exerciseEvaluation.improvements && exerciseEvaluation.improvements.length > 0 && (
                  <div className="mt-3">
                    <p className="font-medium text-sm mb-1">Suggestions:</p>
                    <ul className="space-y-1">
                      {exerciseEvaluation.improvements.map((improvement: string, idx: number) => (
                        <li key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                          → {improvement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button
                variant="secondary"
                onClick={getExerciseHint}
                disabled={hintLevel >= 3}
              >
                <Lightbulb className="w-4 h-4 mr-2" />
                Get Hint ({3 - hintLevel} left)
              </Button>
              
              <Button
                variant="primary"
                onClick={handleExerciseSubmit}
                disabled={isEvaluating || !exerciseCode.trim()}
                className="flex-1"
              >
                {isEvaluating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    AI is evaluating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit for AI Evaluation
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Concept Explanation Modal */}
      <Modal
        isOpen={showConceptModal}
        onClose={() => setShowConceptModal(false)}
        title={`AI Explains: ${selectedConcept}`}
        size="lg"
      >
        <div>
          {loadingConcept ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <span className="ml-3">AI is generating explanation...</span>
            </div>
          ) : conceptExplanation ? (
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p>{conceptExplanation.explanation}</p>
              <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Level: {conceptExplanation.user_level}
                </p>
              </div>
            </div>
          ) : null}
        </div>
      </Modal>
    </div>
  );
};

export default LearningPath;