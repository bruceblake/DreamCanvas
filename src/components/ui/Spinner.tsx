import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const spinnerVariants = cva('animate-spin', {
  variants: {
    size: {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    color: {
      primary: 'text-blue-600',
      secondary: 'text-gray-600',
      success: 'text-green-600',
      error: 'text-red-600',
      warning: 'text-yellow-600',
      white: 'text-white',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'primary',
  },
});

export interface SpinnerProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'>,
    VariantProps<typeof spinnerVariants> {
  label?: string;
}

export const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, color, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('inline-flex flex-col items-center justify-center', className)}
        {...props}
      >
        <svg
          className={cn(spinnerVariants({ size, color }))}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        {label && (
          <span className="mt-2 text-sm text-gray-600 dark:text-gray-400">{label}</span>
        )}
      </div>
    );
  }
);

Spinner.displayName = 'Spinner';

export const FullPageSpinner: React.FC<SpinnerProps> = (props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm dark:bg-gray-900/80">
      <Spinner size="xl" {...props} />
    </div>
  );
};