import React from 'react';
import { motion } from 'framer-motion';
import { ImageData } from '../types';
import ImageCard from './ImageCard';
import LoadingSpinner from './LoadingSpinner';
import { IoImageOutline, IoAddCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';

interface ImageGridProps {
  images: ImageData[];
  loading?: boolean;
  onDeleteImage?: (id: string) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ 
  images, 
  loading = false,
  onDeleteImage 
}) => {
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <LoadingSpinner size="large" type="dots" text="Loading your gallery..." />
      </div>
    );
  }

  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
        <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-full mb-4">
          <IoImageOutline className="w-14 h-14 text-gray-400 dark:text-gray-500" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">No images found</h3>
        <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
          Your gallery is empty. Start by generating new images with AI!
        </p>
        <Link 
          to="/" 
          className="px-5 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md hover:shadow-lg transition-all flex items-center"
        >
          <IoAddCircleOutline className="mr-2" size={20} />
          Create New Image
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {images.map(image => (
        <motion.div key={image.id} variants={itemVariants}>
          <ImageCard 
            image={image}
            onDelete={onDeleteImage}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default ImageGrid;