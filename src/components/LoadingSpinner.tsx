import React from 'react';
import { motion } from 'framer-motion';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  type?: 'spinner' | 'dots' | 'pulse';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  size = 'medium', 
  color = 'currentColor',
  text,
  type = 'spinner'
}) => {
  const sizeMap = {
    small: {
      spinner: 'w-5 h-5',
      container: 'gap-1',
      dot: 'w-2 h-2',
      text: 'text-xs'
    },
    medium: {
      spinner: 'w-8 h-8',
      container: 'gap-2',
      dot: 'w-3 h-3',
      text: 'text-sm'
    },
    large: {
      spinner: 'w-12 h-12',
      container: 'gap-3',
      dot: 'w-4 h-4',
      text: 'text-base'
    }
  };
  
  const sizeClass = sizeMap[size];

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1.2,
        ease: "linear",
        repeat: Infinity
      }
    }
  };
  
  const dotVariants = {
    animate: (i: number) => ({
      y: [0, -10, 0],
      transition: {
        duration: 0.8,
        ease: "easeInOut",
        repeat: Infinity,
        delay: i * 0.15
      }
    })
  };
  
  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.6, 1, 0.6],
      transition: {
        duration: 1.5,
        ease: "easeInOut",
        repeat: Infinity
      }
    }
  };

  const renderLoader = () => {
    switch (type) {
      case 'dots':
        return (
          <div className={`flex ${sizeClass.container}`}>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                custom={i}
                variants={dotVariants}
                animate="animate"
                className={`${sizeClass.dot} rounded-full`}
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        );
        
      case 'pulse':
        return (
          <motion.div
            variants={pulseVariants}
            animate="animate"
            className={`${sizeClass.spinner} rounded-full`}
            style={{ backgroundColor: color, opacity: 0.6 }}
          />
        );
        
      case 'spinner':
      default:
        return (
          <motion.svg 
            className={sizeClass.spinner}
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24"
            variants={spinnerVariants}
            animate="animate"
          >
            <circle 
              className="opacity-25" 
              cx="12" 
              cy="12" 
              r="10" 
              stroke={color} 
              strokeWidth="4"
            ></circle>
            <path 
              className="opacity-75" 
              fill={color} 
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </motion.svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center">
      {renderLoader()}
      {text && <p className={`mt-2 text-gray-600 dark:text-gray-300 ${sizeClass.text}`}>{text}</p>}
    </div>
  );
};

export default LoadingSpinner;