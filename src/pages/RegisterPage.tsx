import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '@/store';
import { registerWithEmail, loginWithGoogle, clearError } from '@/store/slices/authSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { User, Mail, Lock, Eye, EyeOff, Chrome } from 'lucide-react';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);
  
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);

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

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!displayName || !email || !password || !confirmPassword) {
      dispatch(addToast({
        type: 'error',
        title: 'Missing information',
        description: 'Please fill in all fields',
      }));
      return;
    }

    if (password !== confirmPassword) {
      dispatch(addToast({
        type: 'error',
        title: 'Password mismatch',
        description: 'Passwords do not match',
      }));
      return;
    }

    if (passwordCheck.strength === 'weak' && password.length >= 6) {
      if (!window.confirm('Your password is weak. Are you sure you want to continue?')) {
        return;
      }
    }

    if (!acceptTerms) {
      dispatch(addToast({
        type: 'error',
        title: 'Terms required',
        description: 'Please accept the terms and conditions',
      }));
      return;
    }

    try {
      await dispatch(registerWithEmail({ email, password, displayName })).unwrap();
      dispatch(addToast({
        type: 'success',
        title: 'Welcome!',
        description: 'Your account has been created successfully',
      }));
      navigate('/');
    } catch (error: any) {
      dispatch(addToast({
        type: 'error',
        title: 'Registration failed',
        description: error,
      }));
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await dispatch(loginWithGoogle()).unwrap();
      dispatch(addToast({
        type: 'success',
        title: 'Welcome!',
        description: 'Your account has been created successfully with Google',
      }));
      navigate('/');
    } catch (error: any) {
      dispatch(addToast({
        type: 'error',
        title: 'Google registration failed',
        description: error,
      }));
    }
  };

  React.useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <Card variant="glass" className="p-8">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold gradient-text">Create Account</CardTitle>
            <CardDescription className="text-lg">
              Create your account and start generating images
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleEmailRegister} className="space-y-4">
              <Input
                type="text"
                label="Full Name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                leftIcon={<User className="h-4 w-4" />}
                placeholder="Enter your full name"
                required
              />

              <Input
                type="email"
                label="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                leftIcon={<Mail className="h-4 w-4" />}
                placeholder="Enter your email"
                required
              />
              
              <Input
                type={showPassword ? 'text' : 'password'}
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                }
                placeholder="Create a password"
                hint={password ? passwordCheck.message : 'At least 6 characters'}
                success={password && passwordCheck.strength === 'strong' ? passwordCheck.message : undefined}
                error={password && passwordCheck.strength === 'weak' ? passwordCheck.message : undefined}
                required
              />

              <Input
                type={showPassword ? 'text' : 'password'}
                label="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                leftIcon={<Lock className="h-4 w-4" />}
                placeholder="Confirm your password"
                success={confirmPassword && password === confirmPassword ? 'Passwords match' : undefined}
                error={confirmPassword && password !== confirmPassword ? 'Passwords do not match' : undefined}
                required
              />
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  I agree to the{' '}
                  <Link to="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                    Privacy Policy
                  </Link>
                </label>
              </div>
              
              <Button
                type="submit"
                variant="gradient"
                size="lg"
                className="w-full"
                isLoading={isLoading}
                disabled={isLoading || !acceptTerms}
              >
                Create Account
              </Button>
            </form>
            
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300 dark:border-gray-600" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>
            
            <Button
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogleRegister}
              leftIcon={<Chrome className="h-5 w-5" />}
              disabled={isLoading}
            >
              Sign up with Google
            </Button>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link
                to="/login"
                className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Sign in here
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;