import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from '@/store';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ErrorBoundary } from 'react-error-boundary';
import { ToastSystem } from '@/components/ui/ToastSystem';
import { Header } from '@/components/layout/Header';
import { FullPageSpinner } from '@/components/ui/Spinner';
import { auth } from '@/firebase/config';
import { onAuthStateChanged } from 'firebase/auth';
import { useAppDispatch, useAppSelector } from '@/store';
import { setUser, setProfile, setLoading } from '@/store/slices/authSlice';
import { UserProfile } from '@/types/api';

// Lazy load pages for better performance
const HomePage = React.lazy(() => import('@/pages/HomePage'));
const CreatePage = React.lazy(() => import('@/pages/CreatePage'));
const GalleryPage = React.lazy(() => import('@/pages/GalleryPage'));
const HistoryPage = React.lazy(() => import('@/pages/HistoryPage'));
const ProfilePage = React.lazy(() => import('@/pages/ProfilePage'));
const SettingsPage = React.lazy(() => import('@/pages/SettingsPage'));
const LoginPage = React.lazy(() => import('@/pages/LoginPage'));
const RegisterPage = React.lazy(() => import('@/pages/RegisterPage'));
const ImageDetailPage = React.lazy(() => import('@/pages/ImageDetailPage'));

// Create a query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (replaced cacheTime)
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Error fallback component
const ErrorFallback: React.FC<{ error: Error; resetErrorBoundary: () => void }> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Oops! Something went wrong
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {error.message || 'An unexpected error occurred'}
        </p>
        <button
          onClick={resetErrorBoundary}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

// Protected route wrapper
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return <FullPageSpinner label="Loading..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Auth wrapper component
const AuthWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      dispatch(setUser(user));
      
      if (user) {
        // Fetch user profile from Firestore
        try {
          const { doc, getDoc } = await import('firebase/firestore');
          const { db } = await import('@/firebase/config');
          
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);
          
          if (userDoc.exists()) {
            const profileData = userDoc.data();
            // Convert Firestore Timestamps to serializable format
            const convertedProfile = { ...profileData };
            
            // List of all possible timestamp fields that need conversion
            const timestampFields = [
              'createdAt',
              'updatedAt', 
              'lastLogin',
              'lastImageCreated',
              'lastTokenReset',
              'subscriptionUpdatedAt'
            ];
            
            // Convert all Firestore Timestamps to ISO strings
            timestampFields.forEach(field => {
              if (convertedProfile[field]?.toDate) {
                convertedProfile[field] = convertedProfile[field].toDate().toISOString();
              }
            });
            
            dispatch(setProfile(convertedProfile as UserProfile));
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
        }
      } else {
        dispatch(setProfile(null));
      }
      
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <>{children}</>;
};

// Main App component
const AppContent: React.FC = () => {
  const { theme } = useAppSelector((state) => state.ui);

  // Apply theme on mount and when it changes
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header />
        <main className="flex-1 pt-18">
          <React.Suspense fallback={<FullPageSpinner label="Loading page..." />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/gallery" element={<GalleryPage />} />
              <Route path="/image/:id" element={<ImageDetailPage />} />

              {/* Protected routes */}
              <Route
                path="/create"
                element={
                  <ProtectedRoute>
                    <CreatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/history"
                element={
                  <ProtectedRoute>
                    <HistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <SettingsPage />
                  </ProtectedRoute>
                }
              />

              {/* Catch all - 404 */}
              <Route
                path="*"
                element={
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                      <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
                        404
                      </h1>
                      <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                        Page not found
                      </p>
                      <a
                        href="/"
                        className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Go back home
                      </a>
                    </div>
                  </div>
                }
              />
            </Routes>
          </React.Suspense>
        </main>
        <ToastSystem />
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthWrapper>
            <AppContent />
          </AuthWrapper>
          {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
        </QueryClientProvider>
      </Provider>
    </ErrorBoundary>
  );
};

export default App;