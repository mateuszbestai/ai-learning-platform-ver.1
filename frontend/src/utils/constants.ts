export const API_ENDPOINTS = {
    LEARNING_PATH: {
      GENERATE: '/learning-path/generate',
      GET_MOCK: '/learning-path/mock',
      GET_BY_ID: '/learning-path/:id',
      UPDATE_PROGRESS: '/learning-path/:id/progress',
    },
    QUIZ: {
      GET_BY_ID: '/quiz/:id',
      SUBMIT: '/quiz/:id/submit',
      HISTORY: '/quiz/history',
    },
    EXERCISE: {
      GET_BY_ID: '/exercise/:id',
      SUBMIT: '/exercise/:id/submit',
      RUN_TESTS: '/exercise/:id/test',
    },
  };
  
  export const CERTIFICATIONS = [
    'Azure AI Engineer',
    'Azure Solutions Architect',
    'AWS Solutions Architect',
    'AWS Developer',
    'Google Cloud Professional',
    'Kubernetes Administrator',
    'DevOps Engineer',
  ];
  
  export const DIFFICULTY_LEVELS = {
    BEGINNER: 'beginner',
    INTERMEDIATE: 'intermediate',
    ADVANCED: 'advanced',
  };
  
  export const NODE_TYPES = {
    MODULE: 'module',
    PROJECT: 'project',
    ASSESSMENT: 'assessment',
    MILESTONE: 'milestone',
  };
  
  export const NODE_STATUS = {
    NOT_STARTED: 'not_started',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    LOCKED: 'locked',
  };