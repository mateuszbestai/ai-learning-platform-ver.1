import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  learningPath: any;
  setLearningPath: (path: any) => void;
  user: any;
  setUser: (user: any) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [learningPath, setLearningPath] = useState(null);
  const [user, setUser] = useState(null);

  return (
    <AppContext.Provider value={{ learningPath, setLearningPath, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};