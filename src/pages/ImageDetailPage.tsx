import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoArrowBack, 
  IoDownloadOutline, 
  IoShareSocialOutline, 
  IoTrashOutline,
  IoWarningOutline,
  IoInformationCircleOutline,
  IoHeart,
  IoHeartOutline,
  IoCalendarOutline,
  IoRocketOutline,
  IoSparklesOutline,
  IoImageOutline,
  IoCreateOutline
} from 'react-icons/io5';
import LoadingSpinner from '../components/LoadingSpinner';
import { ImageData } from '../types';
import { getImageById } from '../services/api';

const ImageDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [image, setImage] = useState<ImageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'parameters'>('details');

  useEffect(() => {
    if (id) {
      fetchImageDetails(id);
    }
  }, [id]);

  const fetchImageDetails = async (imageId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getImageById(imageId);
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setImage(response.data);
      } else {
        setError('Image not found');
      }
    } catch (err) {
      setError('Failed to fetch image details. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!image?.url) return;
    
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
  
  const handleShare = () => {
    alert('Sharing will be enabled in the next update!');
  };

  const handleDelete = () => {
    // In a real app, this would call an API endpoint to delete the image
    alert('Image deleted successfully');
    navigate('/history');
  };
  
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Get model badge color based on model type
  const getModelBadgeClass = () => {
    if (!image?.params.modelId) return 'bg-gray-500 text-white';
    
    switch(image.params.modelId) {
      case 'realistic': return 'bg-emerald-500 text-white';
      case 'portrait': return 'bg-blue-500 text-white';
      case 'artistic': return 'bg-purple-500 text-white';
      case 'anime': return 'bg-pink-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-12rem)]">
        <div className="text-center">
          <LoadingSpinner size="large" type="dots" text="Loading image details..." />
        </div>
      </div>
    );
  }

  if (error || !image) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center text-red-600 dark:text-red-400 mb-4">
            <IoWarningOutline className="w-6 h-6 mr-2" />
            <h2 className="text-xl font-bold">Error</h2>
          </div>
          <p className="text-gray-700 dark:text-gray-300 mb-6">{error || 'Failed to load image'}</p>
          <Link 
            to="/history" 
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
          >
            <IoArrowBack className="mr-2" /> 
            Back to Gallery
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-6 flex flex-wrap justify-between items-center">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            <IoArrowBack className="mr-2" /> 
            Back
          </button>
          
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={handleDownload}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md"
            >
              <IoDownloadOutline className="mr-2" /> Download
            </button>
            
            <button
              onClick={handleShare}
              className="flex items-center px-3 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors shadow-md"
            >
              <IoShareSocialOutline className="mr-2" /> Share
            </button>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
            {/* Image Section - 7 columns on large screens */}
            <div className="lg:col-span-7 bg-gray-50 dark:bg-gray-900 p-4 flex items-center justify-center">
              {image.status === 'processing' ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <LoadingSpinner size="large" type="dots" text="Processing image..." />
                </div>
              ) : image.status === 'failed' ? (
                <div className="flex flex-col items-center justify-center py-12 text-red-600 dark:text-red-400">
                  <IoWarningOutline className="w-16 h-16 mb-4" />
                  <p>Generation failed</p>
                </div>
              ) : (
                <div className="relative group w-full">
                  <div className="relative aspect-auto rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-lg">
                    <img 
                      src={image.url} 
                      alt={image.prompt} 
                      className="max-w-full max-h-[70vh] object-contain mx-auto"
                    />
                    
                    {/* Favorite button */}
                    <button
                      onClick={toggleFavorite}
                      className={`absolute top-4 right-4 p-2 rounded-full shadow-lg transition-colors ${
                        isFavorite 
                          ? 'bg-pink-500 text-white' 
                          : 'bg-white/80 text-gray-900 hover:bg-white backdrop-blur-sm'
                      }`}
                      aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                      {isFavorite ? <IoHeart size={20} /> : <IoHeartOutline size={20} />}
                    </button>
                    
                    {/* Size badge */}
                    {image.params.width && image.params.height && (
                      <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium">
                        {image.params.width} × {image.params.height}px
                      </div>
                    )}
                    
                    {/* Model badge */}
                    {image.params.modelId && (
                      <div className={`absolute bottom-4 right-4 px-3 py-1.5 rounded-full text-xs font-medium ${getModelBadgeClass()}`}>
                        {image.params.modelId.charAt(0).toUpperCase() + image.params.modelId.slice(1)}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* Details Section - 5 columns on large screens */}
            <div className="lg:col-span-5 p-6 flex flex-col">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">Image Details</h1>
              
              {/* Tabs */}
              <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6">
                <button
                  onClick={() => setActiveTab('details')}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'details'
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <IoInformationCircleOutline className="mr-2" size={18} />
                  Details
                </button>
                <button
                  onClick={() => setActiveTab('parameters')}
                  className={`flex items-center py-3 px-4 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === 'parameters'
                      ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <IoRocketOutline className="mr-2" size={18} />
                  Parameters
                </button>
              </div>
              
              {/* Details Tab Content */}
              {activeTab === 'details' && (
                <div className="space-y-6">
                  <div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <IoCreateOutline className="mr-2 text-gray-500 dark:text-gray-400" />
                      Prompt
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                        {image.prompt}
                      </p>
                    </div>
                  </div>
                  
                  {image.params.negativePrompt && (
                    <div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                        <IoWarningOutline className="mr-2 text-gray-500 dark:text-gray-400" />
                        Negative Prompt
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                          {image.params.negativePrompt}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  <div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      <IoCalendarOutline className="mr-2 text-gray-500 dark:text-gray-400" />
                      Created On
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700">
                      <p className="text-gray-800 dark:text-gray-200">
                        {formatDate(image.createdAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Parameters Tab Content */}
              {activeTab === 'parameters' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                        <IoSparklesOutline className="mr-2 text-gray-500 dark:text-gray-400" />
                        AI Model
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <div className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getModelBadgeClass()}`}>
                          {image.params?.modelId ? (image.params.modelId.charAt(0).toUpperCase() + image.params.modelId.slice(1)) : 'Default'}
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                        <IoImageOutline className="mr-2 text-gray-500 dark:text-gray-400" />
                        Dimensions
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-200 font-mono">
                          {image.params.width} × {image.params.height}px
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Steps
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-200 font-mono">
                          {image.params.steps || 30}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                        Guidance Scale
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                        <p className="text-gray-800 dark:text-gray-200 font-mono">
                          {image.params.guidanceScale || 7.5}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center text-gray-700 dark:text-gray-300 font-medium mb-2">
                      Image ID
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg border border-gray-200 dark:border-gray-700 overflow-x-auto">
                      <p className="text-gray-600 dark:text-gray-400 font-mono text-sm">
                        {image.id}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                {showDeleteConfirm ? (
                  <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg border border-red-200 dark:border-red-800/50">
                    <p className="text-red-700 dark:text-red-300 mb-3">
                      Are you sure you want to delete this image? This action cannot be undone.
                    </p>
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-md"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setShowDeleteConfirm(false)}
                        className="px-4 py-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors shadow-md"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors"
                  >
                    <IoTrashOutline className="mr-1" /> 
                    Delete Image
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Related Images Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">More Like This</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array(4).fill(0).map((_, i) => (
              <Link to={`/history`} key={i} className="block group">
                <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800">
                  <div className="w-full h-full bg-gray-200 dark:bg-gray-700 animate-pulse-slow"></div>
                </div>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Explore more images</p>
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ImageDetailPage;