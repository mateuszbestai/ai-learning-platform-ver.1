export interface Exercise {
    id: string;
    title: string;
    description: string;
    type: 'hands-on' | 'project' | 'code' | 'capstone';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimated_time_minutes: number;
    points: number;
    instructions: string[];
    starter_code?: string;
    test_cases?: TestCase[];
    hints?: string[];
    sandbox_url?: string;
  }
  
  export interface TestCase {
    input: string;
    expected_output: string;
  }
  
  export interface ExerciseSubmission {
    exercise_id: string;
    solution: string;
    language?: string;
    time_spent: number;
  }
  
  export interface ExerciseResult {
    exercise_id: string;
    passed: boolean;
    test_results: TestResult[];
    feedback: string;
    points_earned: number;
  }
  
  export interface TestResult {
    name: string;
    passed: boolean;
    input?: string;
    expected?: string;
    actual?: string;
    error?: string;
  }