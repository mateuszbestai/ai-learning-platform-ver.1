import React from 'react';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className, onClick }) => {
  return (
    <div
      className={clsx(
        'bg-white dark:bg-gray-800 rounded-lg shadow-md',
        onClick && 'cursor-pointer hover:shadow-lg transition-shadow',
        className
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;