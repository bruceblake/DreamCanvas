import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoHeartOutline, 
  IoHeart, 
  IoTrashOutline, 
  IoInformationCircleOutline, 
  IoDownloadOutline,
  IoShareSocialOutline
} from 'react-icons/io5';
import { ImageData } from '../types';

interface ImageCardProps {
  image: ImageData;
  onDelete?: (id: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({ image, onDelete }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  const truncatePrompt = (prompt: string, maxLength = 100) => {
    if (prompt.length <= maxLength) return prompt;
    return prompt.substring(0, maxLength) + '...';
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };
  
  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!image.url) return;
    
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `dreamcanvas-${image.id}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Failed to download image. Please try again.');
    }
  };
  
  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  
  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would open a share dialog
    alert('Share functionality will be available in the next update!');
  };
  
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onDelete) {
      onDelete(image.id);
    }
  };
  
  // Get model badge color based on model type
  const getModelBadgeClass = () => {
    switch(image.params.modelId) {
      case 'realistic': return 'bg-emerald-500 text-white';
      case 'portrait': return 'bg-blue-500 text-white';
      case 'artistic': return 'bg-purple-500 text-white';
      case 'anime': return 'bg-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <motion.div 
      className="rounded-xl shadow-lg overflow-hidden h-full flex flex-col bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700"
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}
      transition={{ duration: 0.2 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Link to={`/image/${image.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-gray-100 dark:bg-gray-700">
          {image.status === 'processing' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600">
              <span className="text-gray-600 dark:text-gray-300">Processing...</span>
            </div>
          ) : image.status === 'failed' ? (
            <div className="absolute inset-0 flex items-center justify-center bg-red-100 dark:bg-red-900/30">
              <span className="text-red-600 dark:text-red-300">Generation failed</span>
            </div>
          ) : (
            <>
              <img 
                src={image.url} 
                alt={image.prompt} 
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                loading="lazy"
              />
              
              {/* Overlay with actions on hover */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent flex flex-col justify-end p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: isHovered ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex justify-between items-center">
                  <div className="flex space-x-1">
                    <motion.button
                      onClick={handleDownload}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-900 transition-colors shadow-lg"
                      aria-label="Download image"
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoDownloadOutline size={18} />
                    </motion.button>
                    <motion.button
                      onClick={handleShare}
                      className="p-2 bg-white/80 backdrop-blur-sm rounded-full hover:bg-white text-gray-900 transition-colors shadow-lg"
                      aria-label="Share image"
                      whileTap={{ scale: 0.9 }}
                    >
                      <IoShareSocialOutline size={18} />
                    </motion.button>
                  </div>
                  
                  <motion.button
                    onClick={toggleFavorite}
                    className={`p-2 rounded-full transition-colors shadow-lg backdrop-blur-sm ${
                      isFavorite 
                        ? 'bg-pink-500 text-white' 
                        : 'bg-white/80 text-gray-900 hover:bg-white'
                    }`}
                    aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isFavorite ? <IoHeart size={18} /> : <IoHeartOutline size={18} />}
                  </motion.button>
                </div>
              </motion.div>
              
              {/* Model badge */}
              {image.params.modelId && (
                <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${getModelBadgeClass()}`}>
                  {image.params.modelId.charAt(0).toUpperCase() + image.params.modelId.slice(1)}
                </div>
              )}
              
              {/* Size badge */}
              {image.params.width && image.params.height && (
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
                  {image.params.width}×{image.params.height}
                </div>
              )}
            </>
          )}
        </div>
      </Link>
      
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs text-gray-500 dark:text-gray-400">{formatDate(image.createdAt)}</p>
          {isFavorite && (
            <IoHeart className="text-pink-500 dark:text-pink-400" size={16} />
          )}
        </div>
        
        <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-2 flex-grow">
          {truncatePrompt(image.prompt, 80)}
        </p>
        
        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100 dark:border-gray-700">
          <Link 
            to={`/image/${image.id}`} 
            className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm font-medium flex items-center"
          >
            <IoInformationCircleOutline className="mr-1" size={16} />
            Details
          </Link>
          
          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label="Delete image"
            >
              <IoTrashOutline size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ImageCard;