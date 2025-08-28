import React from 'react';
import { CheckCircle, Lock } from 'lucide-react'; // Add missing imports
import { PathNode as PathNodeType } from '../../types/learningPath';
import Card from '../Common/Card';
import Badge from '../Common/Badge';

interface PathNodeProps {
  node: PathNodeType;
  isActive?: boolean;
  isCompleted?: boolean;
  isLocked?: boolean;
  onClick?: () => void;
}

const PathNode: React.FC<PathNodeProps> = ({
  node,
  isActive,
  isCompleted,
  isLocked,
  onClick,
}) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isActive ? 'ring-2 ring-indigo-500' : ''
      } ${isLocked ? 'opacity-50' : ''}`}
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-semibold text-gray-900 dark:text-white">
            {node.title}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {node.description}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant="secondary" size="sm">
              {node.type}
            </Badge>
            <span className="text-xs text-gray-500">
              {node.duration_hours}h
            </span>
          </div>
        </div>
        {isCompleted && (
          <CheckCircle className="w-5 h-5 text-green-500" />
        )}
        {isLocked && (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>
    </Card>
  );
};

export default PathNode;