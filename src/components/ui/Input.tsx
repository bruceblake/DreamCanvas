import React from 'react';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  success?: string;
  hint?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, success, hint, leftIcon, rightIcon, ...props }, ref) => {
    const inputId = React.useId();

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            type={type}
            className={cn(
              'w-full px-4 py-3 border-2 rounded-lg transition-all duration-200 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-offset-2',
              'bg-white dark:bg-gray-800 text-gray-900 dark:text-white',
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              error && 'border-red-500 focus:border-red-500 focus:ring-red-100 dark:focus:ring-red-900/50',
              success && 'border-green-500 focus:border-green-500 focus:ring-green-100 dark:focus:ring-green-900/50',
              !error && !success && 'border-gray-200 dark:border-gray-700 focus:border-primary-500 focus:ring-primary-100 dark:focus:ring-primary-900/50',
              'disabled:cursor-not-allowed disabled:opacity-50',
              className
            )}
            ref={ref}
            {...props}
          />
          {rightIcon && !error && !success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400">
              {rightIcon}
            </div>
          )}
          {error && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
              <AlertCircle className="h-5 w-5" />
            </div>
          )}
          {success && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-green-500">
              <CheckCircle className="h-5 w-5" />
            </div>
          )}
        </div>
        {(error || success || hint) && (
          <p
            className={cn(
              'mt-1.5 text-sm',
              error && 'text-red-500',
              success && 'text-green-500',
              hint && 'text-gray-600 dark:text-gray-400'
            )}
          >
            {error || success || hint}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };