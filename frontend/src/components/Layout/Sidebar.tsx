import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home,
  BookOpen,
  Code,
  Trophy,
  BarChart,
  Settings,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
  Brain,
  Target,
  Zap,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar: React.FC = () => {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    {
      section: 'Main',
      items: [
        { icon: Home, label: 'Dashboard', path: '/dashboard' },
        { icon: BookOpen, label: 'Learning Paths', path: '/learning-path' },
        { icon: Code, label: 'Exercises', path: '/exercises' },
        { icon: Trophy, label: 'Quizzes', path: '/quizzes' },
      ],
    },
    {
      section: 'Progress',
      items: [
        { icon: BarChart, label: 'Analytics', path: '/analytics' },
        { icon: Award, label: 'Achievements', path: '/achievements' },
        { icon: Target, label: 'Goals', path: '/goals' },
      ],
    },
    {
      section: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help', path: '/help' },
        { icon: Settings, label: 'Settings', path: '/settings' },
      ],
    },
  ];

  const stats = {
    streak: 7,
    points: 1250,
    level: 'Intermediate',
  };

  return (
    <aside
      className={`${
        isCollapsed ? 'w-20' : 'w-64'
      } bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 flex flex-col`}
    >
      {/* Logo */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Brain className="w-8 h-8 text-indigo-600" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="font-bold text-xl text-gray-900 dark:text-white"
                >
                  AI Learn
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {isCollapsed ? (
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            ) : (
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            )}
          </button>
        </div>
      </div>

      {/* Stats Card */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm opacity-90">Your Progress</span>
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-75">Streak</span>
                  <span className="font-bold">{stats.streak} days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-75">Points</span>
                  <span className="font-bold">{stats.points}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs opacity-75">Level</span>
                  <span className="font-bold">{stats.level}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {menuItems.map((section) => (
          <div key={section.section} className="mb-6">
            <AnimatePresence>
              {!isCollapsed && (
                <motion.h3
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
                >
                  {section.section}
                </motion.h3>
              )}
            </AnimatePresence>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    <AnimatePresence>
                      {!isCollapsed && (
                        <motion.span
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          className="text-sm font-medium"
                        >
                          {item.label}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </NavLink>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Version 1.0.0
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                © 2024 AI Learning Platform
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default Sidebar;