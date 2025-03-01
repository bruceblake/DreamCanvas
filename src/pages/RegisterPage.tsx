import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoPersonOutline, IoMailOutline, IoLockClosedOutline, IoEyeOutline, IoEyeOffOutline, IoLogoGoogle, IoAlertCircleOutline, IoCheckmarkCircleOutline } from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  // Password strength check
  const checkPasswordStrength = (password: string): { strength: 'weak' | 'medium' | 'strong'; message: string } => {
    if (password.length < 6) {
      return { strength: 'weak', message: 'Password is too short (minimum 6 characters)' };
    }
    
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (hasLetter && hasNumber && hasSpecial && password.length >= 8) {
      return { strength: 'strong', message: 'Strong password' };
    } else if ((hasLetter && hasNumber) || (hasLetter && hasSpecial) || (hasNumber && hasSpecial)) {
      return { strength: 'medium', message: 'Good password, but could be stronger' };
    } else {
      return { strength: 'weak', message: 'Weak password - add numbers or special characters' };
    }
  };
  
  const passwordCheck = checkPasswordStrength(password);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Validate form
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    if (passwordCheck.strength === 'weak' && password.length >= 6) {
      if (!window.confirm('Your password is weak. Are you sure you want to continue?')) {
        return;
      }
    }
    
    setLoading(true);
    
    try {
      const { user, error: registerError } = await register(email, password, name);
      
      if (registerError) {
        console.error('Registration error:', registerError);
        if (registerError.includes('email-already-in-use')) {
          setError('Email is already in use');
        } else if (registerError.includes('invalid-email')) {
          setError('Invalid email address');
        } else if (registerError.includes('weak-password')) {
          setError('Password is too weak');
        } else {
          setError(registerError || 'Failed to register. Please try again.');
        }
      } else if (user) {
        navigate('/');
      }
    } catch (err: any) {
      console.error('Unexpected registration error:', err);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError(null);
    setLoading(true);
    
    try {
      console.log("Starting Google sign-in from register page");
      const { user, error: googleError } = await loginWithGoogle();
      
      if (googleError) {
        console.error('Google login error:', googleError);
        if (googleError.includes('popup-closed-by-user') || googleError.includes('closed')) {
          setError('Login window was closed. Please try again.');
        } else if (googleError.includes('popup-blocked') || googleError.includes('blocked')) {
          setError('Login popup was blocked. Please allow popups for this site.');
        } else if (googleError.includes("setting up your profile") || googleError.includes("couldn't load your data")) {
          // This is a partial success - authentication worked but Firestore failed
          // We'll redirect anyway with a warning as a toast message
          
          // Set the UI to indicate success
          setError(null);
          
          // Show success state but with a warning
          setPasswordCheck({
            strength: 'strong',
            message: 'Sign-in successful! Redirecting you now...'
          });
          
          // Navigate after a short delay
          setTimeout(() => {
            window.location.href = '/';
          }, 2000);
          
          setLoading(false);
          return;
        } else {
          setError(googleError || 'Failed to log in with Google. Please try again.');
        }
      } else if (user) {
        console.log("Google sign-in successful, redirecting to home");
        
        // Show success state
        setError(null);
        setPasswordCheck({
          strength: 'strong',
          message: 'Sign-in successful! Redirecting you now...'
        });
        
        // Force page reload on navigation to clear any cached state
        setTimeout(() => {
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
  
  // Get the password strength color
  const getPasswordStrengthColor = () => {
    switch (passwordCheck.strength) {
      case 'weak': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'strong': return 'bg-green-500';
      default: return 'bg-gray-300';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-indigo-950 dark:to-purple-950">
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
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-full"></div>
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full"></div>
        
        {/* Register form */}
        <div className="relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-300">Join DreamCanvas and start creating</p>
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
          
          <form onSubmit={handleRegister}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoPersonOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>
            
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
                  minLength={6}
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
              
              {password && (
                <div className="mt-2">
                  <div className="flex items-center">
                    <div className={`h-2 flex-grow rounded-full ${getPasswordStrengthColor()}`}></div>
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {passwordCheck.strength === 'strong' && <IoCheckmarkCircleOutline className="inline-block text-green-500 text-base mb-0.5 mr-1" />}
                      {passwordCheck.message}
                    </span>
                  </div>
                </div>
              )}
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <IoLockClosedOutline className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>
                <input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`w-full pl-10 pr-3 py-3 border ${
                    confirmPassword && password !== confirmPassword 
                      ? 'border-red-500 dark:border-red-500' 
                      : 'border-gray-300 dark:border-gray-600'
                  } rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
                  placeholder="••••••••"
                  required
                />
                {confirmPassword && password !== confirmPassword && (
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 pr-3">
                    <IoAlertCircleOutline className="h-5 w-5 text-red-500" />
                  </div>
                )}
              </div>
              {confirmPassword && password !== confirmPassword && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">Passwords don't match</p>
              )}
            </div>
            
            <motion.button
              type="submit"
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg hover:shadow-xl transition-all flex justify-center items-center"
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
                'Create Account'
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
            Sign up with Google
          </motion.button>
          
          <div className="mt-8 text-center">
            <p className="text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterPage;