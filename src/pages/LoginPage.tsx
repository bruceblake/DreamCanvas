import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoMailOutline, IoLockClosedOutline, IoLogoGoogle, IoEyeOutline, IoEyeOffOutline, IoAlertCircleOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  
  const { login, loginWithGoogle, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      const { user, error: loginError } = await login(email, password);
      
      if (loginError) {
        console.error('Login error:', loginError);
        if (loginError.includes('invalid-credential') || loginError.includes('user-not-found') || loginError.includes('wrong-password')) {
          setError('Invalid email or password');
        } else if (loginError.includes('too-many-requests')) {
          setError('Too many failed login attempts. Try again later or reset your password.');
        } else {
          setError(loginError || 'Failed to log in. Please try again.');
        }
      } else if (user) {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Unexpected login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      console.log("Starting Google sign-in from login page");
      const { user, error: googleError } = await loginWithGoogle();
      
      if (googleError) {
        console.error('Google login error:', googleError);
        if (googleError.includes('popup-closed-by-user') || googleError.includes('closed')) {
          setError('Login window was closed. Please try again.');
        } else if (googleError.includes('popup-blocked') || googleError.includes('blocked')) {
          setError('Login popup was blocked. Please allow popups for this site.');
        } else if (googleError.includes("setting up your profile") || googleError.includes("couldn't load your data")) {
          // Special case: Authentication worked but profile setup failed
          // Navigate to home but show an error toast
          console.log("Auth successful but profile setup failed, redirecting anyway");
          setResetSent(true); // Reuse this state to show a success message
          
          // Navigate after a short delay
          setTimeout(() => {
            // Force page reload to ensure clean auth state
            window.location.href = '/';
          }, 2000);
          
          // Show a warning instead of an error
          setError(null);
          setLoading(false);
          return;
        } else {
          setError(googleError || 'Failed to log in with Google. Please try again.');
        }
      } else if (user) {
        console.log("Google sign-in successful, redirecting to home");
        setResetSent(true); // Reuse this state to show a success message
        
        // After redirect is a good time to reload the page to ensure all auth state is fresh
        setTimeout(() => {
          // Force page reload to ensure clean auth state
          window.location.href = '/';
        }, 1500);
      } else {
        console.error("No user or error returned from Google login");
        setError("Something went wrong with Google login. Please try again.");
      }
    } catch (err: any) {
      console.error('Unexpected Google login error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset your password');
      return;
    }
    
    setError(null);
    setLoading(true);
    
    try {
      const { error: resetError } = await resetPassword(email);
      
      if (resetError) {
        console.error('Password reset error:', resetError);
        if (resetError.includes('user-not-found')) {
          setError('No account found with this email address');
        } else {
          setError(resetError || 'Failed to send password reset email. Please try again.');
        }
      } else {
        setResetSent(true);
      }
    } catch (err: any) {
      console.error('Unexpected reset password error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      <div className="fixed inset-0 overflow-hidden opacity-30 dark:opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
        <div className="absolute top-20 right-1/3 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
      </div>
      
      <motion.div 
        className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Background gradient effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full"></div>
        
        {/* Login form */}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-300">Sign in to continue to DreamCanvas</p>
          </div>
          
          {error && (
            <motion.div 
              className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex">
                <IoAlertCircleOutline className="flex-shrink-0 w-5 h-5 mr-2" />
                <p>{error}</p>
              </div>
            </motion.div>
          )}
          
          {resetSent && (
            <motion.div 
              className="mb-6 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/50 text-green-700 dark:text-green-300 text-sm"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p>Password reset email sent. Please check your inbox.</p>
            </motion.div>
          )}
          
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoMailOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
            
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoLockClosedOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <IoEyeOffOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  ) : (
                    <IoEyeOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-end mb-6">
              <button 
                type="button" 
                onClick={handleResetPassword}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 focus:outline-none"
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
            
            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Sign In'
              )}
            </motion.button>
          </form>
          
          <div className="my-6 flex items-center">
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-500 dark:text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300 dark:border-gray-600"></div>
          </div>
          
          <motion.button
            type="button"
            onClick={handleGoogleLogin}
            className="w-full py-3 px-4 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 font-medium rounded-lg border border-gray-300 dark:border-gray-600 shadow hover:shadow-md transition-all flex justify-center items-center"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <IoLogoGoogle className="mr-2 text-red-500" />
            Sign in with Google
          </motion.button>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;