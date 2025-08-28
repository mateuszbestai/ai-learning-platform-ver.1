import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Clock,
  Trophy,
  BookOpen,
  Zap,
  Calendar,
  Award,
  ChevronRight,
  Brain,
  Code, // Add missing import
} from 'lucide-react';
import StatsCard from './StatsCard';
import Card from '../Common/Card';
import Badge from '../Common/Badge';
import ProgressBar from '../LearningPath/ProgressBar';
import { useLearningPath } from '../../hooks/useLearningPath';
import { useProgress } from '../../hooks/useProgress';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { learningPath, isLoading } = useLearningPath();
  const { progress } = useProgress(learningPath?.id);
  
  const [recentActivity] = useState([
    { id: 1, type: 'module', title: 'Completed Cloud Fundamentals', time: '2 hours ago', points: 100 },
    { id: 2, type: 'quiz', title: 'Scored 92% on Azure Services Quiz', time: '5 hours ago', points: 50 },
    { id: 3, type: 'exercise', title: 'Deployed First VM', time: '1 day ago', points: 75 },
  ]);

  const [upcomingTasks] = useState([
    { id: 1, title: 'Azure AI Services Module', type: 'module', deadline: '2 days', difficulty: 'intermediate' },
    { id: 2, title: 'Machine Learning Exercise', type: 'exercise', deadline: '3 days', difficulty: 'advanced' },
    { id: 3, title: 'Certification Practice Exam', type: 'quiz', deadline: '1 week', difficulty: 'advanced' },
  ]);

  const stats = {
    totalHours: progress.timeSpentHours || 24,
    completionRate: progress.overallProgress || 35,
    currentStreak: 7,
    totalPoints: progress.totalPointsEarned || 450,
    modulesCompleted: progress.completedNodes.length || 3,
    totalModules: learningPath?.nodes.length || 12,
    rank: 'Intermediate',
    nextMilestone: 'Azure Expert',
  };

  const weeklyProgress = [
    { day: 'Mon', hours: 2 },
    { day: 'Tue', hours: 1.5 },
    { day: 'Wed', hours: 3 },
    { day: 'Thu', hours: 2.5 },
    { day: 'Fri', hours: 1 },
    { day: 'Sat', hours: 4 },
    { day: 'Sun', hours: 2 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back, Learner! 👋</h1>
            <p className="text-lg opacity-90">
              You're making great progress on your {learningPath?.title || 'learning journey'}
            </p>
            <div className="flex items-center gap-4 mt-4">
              <Badge variant="success" icon={Zap} className="bg-white/20 text-white">
                {stats.currentStreak} day streak
              </Badge>
              <Badge variant="warning" icon={Trophy} className="bg-white/20 text-white">
                {stats.rank}
              </Badge>
            </div>
          </div>
          <Brain className="w-24 h-24 opacity-30" />
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Learning Time"
          value={`${stats.totalHours}h`}
          icon={Clock}
          trend={12}
          color="blue"
        />
        <StatsCard
          title="Completion Rate"
          value={`${stats.completionRate}%`}
          icon={TrendingUp}
          trend={8}
          color="green"
        />
        <StatsCard
          title="Total Points"
          value={stats.totalPoints}
          icon={Trophy}
          trend={15}
          color="yellow"
        />
        <StatsCard
          title="Modules"
          value={`${stats.modulesCompleted}/${stats.totalModules}`}
          icon={BookOpen}
          color="purple"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Learning Path Progress */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Current Learning Path
              </h2>
              <button
                onClick={() => navigate('/learning-path')}
                className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm flex items-center gap-1"
              >
                View Details
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            {learningPath && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {learningPath.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {learningPath.description}
                  </p>
                  <ProgressBar
                    progress={stats.completionRate}
                    showPercentage
                    size="lg"
                  />
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Next: {learningPath.nodes.find(n => n.id === progress.currentNodeId)?.title || 'Getting Started'}
                  </span>
                  <span className="text-gray-500">
                    {stats.totalHours}h / {learningPath.total_duration_hours}h
                  </span>
                </div>
              </div>
            )}
          </Card>

          {/* Weekly Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Weekly Activity
            </h2>
            <div className="flex items-end gap-2 h-32">
              {weeklyProgress.map((day, index) => (
                <div key={index} className="flex-1 flex flex-col items-center gap-2">
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.hours / 4) * 100}%` }}
                    transition={{ delay: index * 0.1 }}
                    className="w-full bg-gradient-to-t from-indigo-600 to-purple-600 rounded-t"
                  />
                  <span className="text-xs text-gray-500">{day.day}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Total this week</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {weeklyProgress.reduce((sum, day) => sum + day.hours, 0)} hours
                </span>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'module' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'quiz' ? 'bg-green-100 text-green-600' :
                      'bg-purple-100 text-purple-600'
                    }`}>
                      {activity.type === 'module' ? <BookOpen className="w-5 h-5" /> :
                       activity.type === 'quiz' ? <Trophy className="w-5 h-5" /> :
                       <Code className="w-5 h-5" />}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {activity.title}
                      </p>
                      <p className="text-sm text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant="success" size="sm">
                    +{activity.points} pts
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Tasks */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Upcoming Tasks
            </h2>
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                  onClick={() => navigate(`/${task.type}/${task.id}`)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 dark:text-white">
                      {task.title}
                    </h3>
                    <Badge variant="secondary" size="sm">
                      {task.difficulty}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="w-4 h-4" />
                    <span>Due in {task.deadline}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Achievements */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Recent Achievements
            </h2>
            <div className="grid grid-cols-3 gap-3">
              {progress.badgesEarned.slice(0, 6).map((badge: string, index: number) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className="aspect-square bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center shadow-lg"
                  title={badge}
                >
                  <Award className="w-6 h-6 text-white" />
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => navigate('/achievements')}
              className="w-full mt-4 text-center text-sm text-indigo-600 dark:text-indigo-400 hover:underline"
            >
              View All Achievements
            </button>
          </Card>

          {/* Leaderboard Preview */}
          <Card className="p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Leaderboard
            </h2>
            <div className="space-y-3">
              {[
                { rank: 1, name: 'Alex Chen', points: 2450, avatar: 'AC' },
                { rank: 2, name: 'Sarah Johnson', points: 2320, avatar: 'SJ' },
                { rank: 3, name: 'You', points: stats.totalPoints, avatar: 'ME', isUser: true },
              ].map((user) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-3 p-2 rounded-lg ${
                    user.isUser ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''
                  }`}
                >
                  <span className="font-bold text-gray-500 w-6">#{user.rank}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                    user.isUser ? 'bg-indigo-600 text-white' : 'bg-gray-300 text-gray-700'
                  }`}>
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm text-gray-900 dark:text-white">
                      {user.name}
                    </p>
                  </div>
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {user.points}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;