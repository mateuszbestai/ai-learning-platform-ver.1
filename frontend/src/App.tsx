// frontend/src/App.tsx
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout/Layout';
import LoadingSpinner from './components/Common/LoadingSpinner';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const LearningPathPage = lazy(() => import('./pages/LearningPathPage'));
const ExercisePage = lazy(() => import('./pages/ExercisePage'));
const QuizPage = lazy(() => import('./pages/QuizPage'));

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AppProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                  success: {
                    duration: 3000,
                    iconTheme: {
                      primary: '#10b981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    duration: 4000,
                    iconTheme: {
                      primary: '#ef4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route element={<Layout />}>
                  <Route
                    path="/dashboard"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <DashboardPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/learning-path/:id?"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <LearningPathPage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/exercise/:id"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <ExercisePage />
                      </Suspense>
                    }
                  />
                  <Route
                    path="/quiz/:id"
                    element={
                      <Suspense fallback={<LoadingSpinner />}>
                        <QuizPage />
                      </Suspense>
                    }
                  />
                </Route>
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </ThemeProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;