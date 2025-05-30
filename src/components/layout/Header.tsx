import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { logout } from '@/store/slices/authSlice';
import { setTheme } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { cn } from '@/lib/utils';
import {
  User,
  LogOut,
  Settings,
  History,
  Sun,
  Moon,
  Monitor,
  Menu,
  X,
  Sparkles,
  Home,
  Image,
  Plus,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { user, profile } = useAppSelector((state) => state.auth);
  const { theme } = useAppSelector((state) => state.ui);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Create', href: '/create', icon: Plus },
    { name: 'Gallery', href: '/gallery', icon: Image },
    { name: 'History', href: '/history', icon: History },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-18 glass border-b border-gray-200/50 dark:border-gray-700/50">
      <nav className="h-full mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-full items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 gradient-primary rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity" />
                <div className="relative gradient-primary text-white p-2.5 rounded-xl shadow-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
              </div>
              <span className="text-xl font-bold">
                <span className="gradient-text">AI Image Generator</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:ml-10 md:flex md:items-center md:space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      'group relative px-4 py-2 text-sm font-medium rounded-lg transition-smooth',
                      isActive(item.href)
                        ? 'text-primary-600 dark:text-primary-400'
                        : 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                    )}
                  >
                    <div className="flex items-center space-x-2">
                      <Icon className="h-4 w-4" />
                      <span>{item.name}</span>
                    </div>
                    {isActive(item.href) && (
                      <motion.div
                        layoutId="navbar-indicator"
                        className="absolute bottom-0 left-0 right-0 h-0.5 gradient-primary rounded-full"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-3">
            {/* Theme Toggle */}
            <DropdownMenu.Root>
              <DropdownMenu.Trigger asChild>
                <button 
                  className="p-2.5 text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' && <Sun className="h-5 w-5" />}
                  {theme === 'dark' && <Moon className="h-5 w-5" />}
                  {theme === 'system' && <Monitor className="h-5 w-5" />}
                </button>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content
                  className="min-w-[140px] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-1.5 animate-fade-in"
                  sideOffset={8}
                  align="end"
                >
                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
                    onClick={() => dispatch(setTheme('light'))}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    Light
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
                    onClick={() => dispatch(setTheme('dark'))}
                  >
                    <Moon className="h-4 w-4 mr-2" />
                    Dark
                  </DropdownMenu.Item>
                  <DropdownMenu.Item
                    className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
                    onClick={() => dispatch(setTheme('system'))}
                  >
                    <Monitor className="h-4 w-4 mr-2" />
                    System
                  </DropdownMenu.Item>
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>

            {/* User Menu */}
            {user ? (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth">
                    <div className="h-9 w-9 rounded-xl gradient-primary flex items-center justify-center text-white font-medium shadow-md">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="hidden md:block text-left">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.displayName || user.email?.split('@')[0]}
                      </p>
                    </div>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="min-w-[220px] bg-white dark:bg-gray-900 rounded-xl shadow-xl border border-gray-200 dark:border-gray-800 p-1.5 animate-fade-in"
                    sideOffset={8}
                    align="end"
                  >
                    <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 mb-1">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">
                        {user.email}
                      </p>
                    </div>
                    <DropdownMenu.Item
                      className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
                      onClick={() => navigate('/profile')}
                    >
                      <User className="h-4 w-4 mr-2" />
                      Profile
                    </DropdownMenu.Item>
                    <DropdownMenu.Item
                      className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
                      onClick={() => navigate('/settings')}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-gray-200 dark:bg-gray-800 my-1.5" />
                    <DropdownMenu.Item
                      className="flex items-center px-3 py-2 text-sm cursor-pointer rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-smooth"
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/login')}
                >
                  Sign In
                </Button>
                <Button
                  size="sm"
                  variant="gradient"
                  onClick={() => navigate('/register')}
                  className="hidden sm:inline-flex"
                >
                  Get Started
                </Button>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-smooth"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden overflow-hidden absolute top-full left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-lg"
            >
              <div className="px-4 py-3 space-y-1">
                {navigation.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        'flex items-center space-x-3 px-4 py-3 text-base font-medium rounded-xl transition-smooth',
                        isActive(item.href)
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
};