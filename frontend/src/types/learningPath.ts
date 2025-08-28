export interface LearningPathData {
  id: string;
  title: string;
  description: string;
  total_duration_hours: number;
  nodes: PathNode[];
  progress?: LearningPathProgress;
  metadata?: any;
}

export interface PathNode {
  id: string;
  title: string;
  description: string;
  order: number;
  duration_hours: number;
  type: string;
  status: string;
  difficulty?: string; // Add difficulty field
  resources?: Resource[];
  exercises?: Exercise[];
  quiz?: Quiz;
  prerequisites?: string[];
  topics?: string[];
}

export interface Resource {
  title: string;
  type: string;
  url: string;
  duration_minutes: number;
}

export interface Exercise {
  id: string;
  title: string;
  description: string;
  type: string;
  difficulty: string;
  estimated_time_minutes: number;
  points: number;
  instructions: string[];
  sandbox_url?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: any[];
  passing_score: number;
  time_limit_minutes: number;
}

export interface LearningPathProgress {
  completed_nodes: string[];
  current_node_id: string | null;
  overall_progress: number;
  total_points_earned: number;
  badges_earned: string[];
  last_activity: string;
  time_spent_hours?: number;
}

// Add the missing LearningPathRequest interface
export interface LearningPathRequest {
  prompt: string;
  user_level: 'beginner' | 'intermediate' | 'advanced';
  time_commitment: string;
  preferences?: {
    learning_style?: string;
    include_labs?: boolean;
    include_quizzes?: boolean;
  };
}