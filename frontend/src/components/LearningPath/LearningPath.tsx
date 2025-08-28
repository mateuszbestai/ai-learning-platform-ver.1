// frontend/src/components/LearningPath/LearningPath.tsx - Clean imports
import React, { useState } from 'react';
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
} from 'lucide-react';
import { LearningPathData, PathNode } from '../../types/learningPath';
import ProgressBar from './ProgressBar';
import Badge from '../Common/Badge';
import Button from '../Common/Button';
import Card from '../Common/Card';

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

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return Video;
      case 'article':
      case 'documentation':
        return FileText;
      case 'pdf':
        return FileText;
      default:
        return ExternalLink;
    }
  };

  const handleNodeClick = (nodeId: string) => {
    if (expandedNode === nodeId) {
      setExpandedNode(null);
    } else {
      setExpandedNode(nodeId);
    }
    onNodeClick?.(nodeId);
  };

  const calculateNodeProgress = (node: PathNode): number => {
    // Calculate based on completed exercises and quizzes
    let total = 0;
    let completed = 0;
    
    if (node.exercises) {
      total += node.exercises.length;
      // In production, track completed exercises
    }
    
    if (node.quiz) {
      total += 1;
      // In production, track completed quizzes
    }
    
    return total > 0 ? (completed / total) * 100 : 0;
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
            </div>

            <ProgressBar
              progress={data.progress?.overall_progress || 0}
              className="mb-4"
              showPercentage
              size="lg"
              color="white"
            />

            {/* Badges */}
            {data.progress?.badges_earned && data.progress.badges_earned.length > 0 && (
              <div className="flex gap-2 mt-4">
                {data.progress.badges_earned.map((badge: string, index: number) => (
                  <Badge
                    key={index}
                    variant="success"
                    icon={Award}
                    className="bg-white/20 backdrop-blur"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>
            )}
          </div>
          
          <div className="ml-8">
            <Brain className="w-24 h-24 opacity-50" />
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
            label: 'Time Invested',
            value: '0h',
            icon: Clock,
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
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Your Learning Journey</h2>
        
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
                              {node.exercises.length} exercises
                            </span>
                          )}
                          {node.quiz && (
                            <span className="flex items-center gap-1">
                              <Trophy className="w-4 h-4" />
                              Quiz available
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
                            {/* Resources */}
                            {node.resources && node.resources.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                  Learning Resources
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  {node.resources.map((resource, idx) => {
                                    const ResourceIcon = getResourceIcon(resource.type);
                                    return (
                                      <a
                                        key={idx}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                      >
                                        <ResourceIcon className="w-5 h-5 text-gray-500" />
                                        <div className="flex-1">
                                          <p className="font-medium text-sm">{resource.title}</p>
                                          <p className="text-xs text-gray-500">
                                            {resource.duration_minutes} min
                                          </p>
                                        </div>
                                        <ExternalLink className="w-4 h-4 text-gray-400" />
                                      </a>
                                    );
                                  })}
                                </div>
                              </div>
                            )}

                            {/* Exercises */}
                            {node.exercises && node.exercises.length > 0 && (
                              <div>
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                  Practical Exercises
                                </h4>
                                <div className="space-y-3">
                                  {node.exercises.map((exercise) => (
                                    <div
                                      key={exercise.id}
                                      className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 rounded-lg"
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
                                          </div>
                                        </div>
                                        <Button
                                          size="sm"
                                          variant="primary"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            onExerciseClick?.(exercise.id);
                                            navigate(`/exercise/${exercise.id}`);
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
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                  Knowledge Assessment
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
                                          {node.quiz.questions.length} questions
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
                              {!isCompleted && !isLocked && (
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
    </div>
  );
};

export default LearningPath;