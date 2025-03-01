import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import ImageDetailPage from './pages/ImageDetailPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-tl from-gray-50 to-blue-50 dark:from-gray-950 dark:to-blue-950 text-gray-900 dark:text-gray-100">
          <Header />
          
          <main className="pt-16 pb-12">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/image/:id" element={<ImageDetailPage />} />
              
              {/* Protected Routes */}
              <Route path="/history" element={
                <PrivateRoute>
                  <HistoryPage />
                </PrivateRoute>
              } />
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/subscription" element={
                <PrivateRoute>
                  <SubscriptionPage />
                </PrivateRoute>
              } />
              
              {/* Fallback route for unmatched paths */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          
          <footer className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm py-6 border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 text-center">
              <div className="flex justify-center items-center mb-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <p className="text-gray-700 dark:text-gray-300 ml-2 font-semibold">
                  DreamCanvas
                </p>
              </div>
              <p className="text-gray-500 dark:text-gray-400 text-sm">
                © {new Date().getFullYear()} DreamCanvas AI Image Generator. All rights reserved.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
                Powered by advanced machine learning models and creative imagination
              </p>
            </div>
          </footer>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;