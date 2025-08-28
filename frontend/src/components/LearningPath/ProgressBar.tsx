import React from 'react';
import { clsx } from 'clsx';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  progress: number;
  className?: string;
  showPercentage?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'white';
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  className,
  showPercentage = false,
  size = 'md',
  color = 'primary',
}) => {
  const sizeStyles = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  };

  const colorStyles = {
    primary: 'bg-indigo-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
    white: 'bg-white',
  };

  const bgColorStyles = {
    primary: 'bg-gray-200 dark:bg-gray-700',
    success: 'bg-gray-200 dark:bg-gray-700',
    warning: 'bg-gray-200 dark:bg-gray-700',
    danger: 'bg-gray-200 dark:bg-gray-700',
    white: 'bg-white/20',
  };

  return (
    <div className={clsx('relative', className)}>
      <div className={clsx('w-full rounded-full overflow-hidden', sizeStyles[size], bgColorStyles[color])}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(progress, 100)}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={clsx('h-full rounded-full relative', colorStyles[color])}
        >
          <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
        </motion.div>
      </div>
      {showPercentage && (
        <span className={clsx(
          'mt-1 text-xs font-medium',
          color === 'white' ? 'text-white' : 'text-gray-600 dark:text-gray-400'
        )}>
          {Math.round(progress)}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar;