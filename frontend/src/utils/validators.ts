export const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };
  
  export const validatePassword = (password: string): {
    isValid: boolean;
    errors: string[];
  } => {
    const errors: string[] = [];
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    };
  };
  
  export const validatePrompt = (prompt: string): {
    isValid: boolean;
    error?: string;
  } => {
    if (!prompt || prompt.trim().length === 0) {
      return { isValid: false, error: 'Please enter a learning goal' };
    }
    if (prompt.length < 10) {
      return { isValid: false, error: 'Please provide more details about your learning goal' };
    }
    if (prompt.length > 500) {
      return { isValid: false, error: 'Learning goal is too long (max 500 characters)' };
    }
    return { isValid: true };
  };