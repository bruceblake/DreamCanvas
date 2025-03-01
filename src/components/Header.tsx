import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  IoMoonOutline, 
  IoSunnyOutline, 
  IoMenuOutline, 
  IoCloseOutline,
  IoSparklesOutline,
  IoImageOutline,
  IoHomeOutline,
  IoPersonOutline,
  IoTicketOutline,
  IoLogInOutline,
  IoLogOutOutline,
  IoChevronDownOutline
} from 'react-icons/io5';
import { useAuth } from '../contexts/AuthContext';
import { logoutUser } from '../services/firebase';

const Header: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  
  // Check for dark mode preference
  useEffect(() => {
    // Check browser preference first
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    // Then check local storage, which would override browser preference
    const savedMode = localStorage.getItem('darkMode');
    const isDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);
    
    setDarkMode(isDarkMode);
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  // Add scroll listener to add shadow when scrolled down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
    
    if (newMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };
  
  // Handle logout
  const handleLogout = async () => {
    try {
      console.log("Logging out user");
      const result = await logoutUser();
      
      if (!result.error) {
        setProfileMenuOpen(false);
        // Force reload to clear any cached auth state
        window.location.href = '/';
      } else {
        console.error("Logout error:", result.error);
      }
    } catch (err) {
      console.error("Unexpected error during logout:", err);
    }
  };

  return (
    <header 
      className={`fixed w-full bg-white/90 dark:bg-gray-900/90 text-gray-800 dark:text-white py-3 px-4 z-10 transition-all duration-200 backdrop-blur-sm ${
        scrolled ? 'shadow-md' : ''
      }`}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-md group-hover:shadow-lg transition-all">
            <IoSparklesOutline className="text-white text-xl" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DreamCanvas
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400 -mt-1">AI Image Studio</span>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:block">
          <ul className="flex space-x-1">
            <li>
              <Link 
                to="/" 
                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                  location.pathname === '/' 
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <IoHomeOutline className="mr-1.5" />
                Create
              </Link>
            </li>
            
            {currentUser && (
              <>
                <li>
                  <Link 
                    to="/history" 
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/history' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IoImageOutline className="mr-1.5" />
                    My Gallery
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/subscription" 
                    className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                      location.pathname === '/subscription' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <IoTicketOutline className="mr-1.5" />
                    Subscription
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="flex items-center space-x-1">
          {/* Auth controls for desktop */}
          {currentUser ? (
            <div className="hidden md:block relative mr-2">
              <motion.button
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex items-center space-x-1 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <IoPersonOutline className="text-blue-600 dark:text-blue-400" />
                </div>
                {userData && userData.tokensRemaining !== undefined && (
                  <div className="flex items-center px-2 py-0.5 rounded-full text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 ml-2">
                    <IoTicketOutline className="mr-1" />
                    {userData.tokensRemaining}
                  </div>
                )}
                <IoChevronDownOutline className={`transition-transform ${profileMenuOpen ? 'transform rotate-180' : ''}`} />
              </motion.button>
              
              {/* Profile dropdown */}
              <AnimatePresence>
                {profileMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-1 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-20"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="font-medium text-gray-900 dark:text-white truncate">
                        {userData?.displayName || currentUser.email?.split('@')[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {currentUser.email}
                      </p>
                    </div>
                    <div className="py-1">
                      <Link 
                        to="/profile" 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        onClick={() => setProfileMenuOpen(false)}
                      >
                        <IoPersonOutline className="mr-2" />
                        Profile
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        <IoLogOutOutline className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2 mr-2">
              <Link
                to="/login"
                className="px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="px-3 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm transition-colors"
              >
                Sign Up
              </Link>
            </div>
          )}
          
          {/* Dark mode toggle */}
          <motion.button 
            onClick={toggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle dark mode"
            whileTap={{ scale: 0.9 }}
          >
            {darkMode ? (
              <IoSunnyOutline className="text-xl text-yellow-400" />
            ) : (
              <IoMoonOutline className="text-xl text-blue-600" />
            )}
          </motion.button>
          
          {/* Mobile menu button */}
          <motion.button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors md:hidden"
            aria-label="Toggle menu"
            whileTap={{ scale: 0.9 }}
          >
            {mobileMenuOpen ? (
              <IoCloseOutline className="text-2xl" />
            ) : (
              <IoMenuOutline className="text-2xl" />
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            className="md:hidden absolute top-full left-0 right-0 bg-white/95 dark:bg-gray-900/95 shadow-lg backdrop-blur-sm"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <nav className="container mx-auto py-3 px-4">
              {/* User info for mobile */}
              {currentUser && userData && (
                <div className="py-3 px-4 mb-3 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <IoPersonOutline className="text-lg text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-3">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {userData.displayName || currentUser.email?.split('@')[0]}
                      </p>
                      <div className="flex items-center mt-1">
                        <IoTicketOutline className="text-blue-600 dark:text-blue-400 mr-1" />
                        <span className="text-xs text-blue-600 dark:text-blue-400">
                          {userData.tokensRemaining} tokens
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            
              <ul className="space-y-1">
                <li>
                  <Link 
                    to="/" 
                    className={`flex items-center px-4 py-3 rounded-lg ${
                      location.pathname === '/' 
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                        : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <IoHomeOutline className="mr-2 text-lg" />
                    <div>
                      <span className="block font-medium">Create</span>
                      <span className="block text-xs text-gray-500 dark:text-gray-400">Generate new images</span>
                    </div>
                  </Link>
                </li>
                
                {currentUser ? (
                  <>
                    <li>
                      <Link 
                        to="/history" 
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          location.pathname === '/history' 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IoImageOutline className="mr-2 text-lg" />
                        <div>
                          <span className="block font-medium">My Gallery</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">View your creations</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/profile" 
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          location.pathname === '/profile' 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IoPersonOutline className="mr-2 text-lg" />
                        <div>
                          <span className="block font-medium">Profile</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">Manage your account</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link 
                        to="/subscription" 
                        className={`flex items-center px-4 py-3 rounded-lg ${
                          location.pathname === '/subscription' 
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium' 
                            : 'hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IoTicketOutline className="mr-2 text-lg" />
                        <div>
                          <span className="block font-medium">Subscription</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">Manage your plan</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-3 rounded-lg text-left text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                      >
                        <IoLogOutOutline className="mr-2 text-lg" />
                        <div>
                          <span className="block font-medium">Sign Out</span>
                          <span className="block text-xs text-red-500 dark:text-red-300">Log out of your account</span>
                        </div>
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <Link
                        to="/login"
                        className="flex items-center px-4 py-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IoLogInOutline className="mr-2 text-lg text-blue-600 dark:text-blue-400" />
                        <div>
                          <span className="block font-medium">Log In</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400">Access your account</span>
                        </div>
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="flex items-center px-4 py-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <IoPersonOutline className="mr-2 text-lg" />
                        <div>
                          <span className="block font-medium">Sign Up</span>
                          <span className="block text-xs">Create a free account</span>
                        </div>
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;