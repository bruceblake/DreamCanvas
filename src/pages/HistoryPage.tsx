import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ImageGrid from '../components/ImageGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  IoSearchOutline, 
  IoFilterOutline, 
  IoRefreshOutline,
  IoCloseOutline,
  IoImageOutline,
  IoCheckmarkCircleOutline
} from 'react-icons/io5';
import { ImageData, HistoryFilters } from '../types';
import { getImageHistory } from '../services/api';

const HistoryPage: React.FC = () => {
  const [images, setImages] = useState<ImageData[]>([]);
  const [filteredImages, setFilteredImages] = useState<ImageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<HistoryFilters>({
    searchTerm: '',
    sortBy: 'newest',
    modelId: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [images, filters]);

  const fetchImages = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getImageHistory();
      
      if (response.error) {
        setError(response.error);
      } else {
        setImages(response.data);
      }
    } catch (err) {
      setError('Failed to fetch image history. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...images];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(img => 
        img.prompt.toLowerCase().includes(term)
      );
    }
    
    // Apply model filter
    if (filters.modelId) {
      filtered = filtered.filter(img => 
        img.params.modelId === filters.modelId
      );
    }
    
    // Apply sorting
    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      
      if (filters.sortBy === 'newest') {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });
    
    setFilteredImages(filtered);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: e.target.value
    }));
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilters(prev => ({
      ...prev,
      sortBy: e.target.value as 'newest' | 'oldest'
    }));
  };

  const handleModelChange = (modelId: string) => {
    setFilters(prev => ({
      ...prev,
      modelId: prev.modelId === modelId ? '' : modelId
    }));
  };

  const handleDeleteImage = (id: string) => {
    // In a real app, this would call an API to delete the image
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchImages();
    setIsRefreshing(false);
  };
  
  const handleClearFilters = () => {
    setFilters({
      searchTerm: '',
      sortBy: 'newest',
      modelId: ''
    });
    setShowFilters(false);
  };
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Your Image Gallery</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">Browse and manage your AI-generated creations</p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`p-2 rounded-lg transition-colors flex items-center ${
                showFilters || filters.modelId 
                  ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              aria-label="Filter images"
            >
              <IoFilterOutline className="mr-1" />
              Filters {filters.modelId && <span className="ml-1 text-xs bg-blue-600 text-white rounded-full w-5 h-5 inline-flex items-center justify-center">1</span>}
            </button>
            
            <button
              onClick={handleRefresh}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center"
              disabled={isRefreshing}
              aria-label="Refresh images"
            >
              <IoRefreshOutline className={`${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="sr-only">Refresh</span>
            </button>
          </div>
        </motion.div>
        
        <motion.div variants={itemVariants}>
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <IoSearchOutline className="h-5 w-5 text-gray-500 dark:text-gray-400" />
            </div>
            <input
              id="search"
              type="text"
              value={filters.searchTerm}
              onChange={handleSearchChange}
              placeholder="Search by prompt..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm"
            />
            {filters.searchTerm && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, searchTerm: '' }))}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <IoCloseOutline className="h-5 w-5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </motion.div>
        
        {showFilters && (
          <motion.div 
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-6 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-medium text-gray-900 dark:text-gray-100">Filter Images</h2>
              <button 
                onClick={handleClearFilters}
                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                Clear all filters
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="sortBy" className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Sort By
                </label>
                <select
                  id="sortBy"
                  value={filters.sortBy}
                  onChange={handleSortChange}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                  Filter by Model
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { id: 'default', name: 'Default', color: 'bg-gray-500' },
                    { id: 'realistic', name: 'Realistic', color: 'bg-emerald-500' },
                    { id: 'portrait', name: 'Portrait', color: 'bg-blue-500' },
                    { id: 'artistic', name: 'Artistic', color: 'bg-purple-500' },
                    { id: 'anime', name: 'Anime', color: 'bg-pink-500' }
                  ].map(model => (
                    <button
                      key={model.id}
                      onClick={() => handleModelChange(model.id)}
                      className={`flex items-center justify-center py-2 px-3 rounded-lg border transition-colors ${
                        filters.modelId === model.id
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                      }`}
                    >
                      <div className={`w-2 h-2 rounded-full ${model.color} mr-2`}></div>
                      {model.name}
                      {filters.modelId === model.id && (
                        <IoCheckmarkCircleOutline className="ml-1 text-blue-600 dark:text-blue-400" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          variants={itemVariants}
          className="min-h-[300px]"
        >
          {error ? (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6">
              <div className="flex items-center">
                <IoImageOutline className="w-5 h-5 mr-2 flex-shrink-0" />
                <span>{error}</span>
              </div>
            </div>
          ) : (
            <ImageGrid 
              images={filteredImages} 
              loading={loading} 
              onDeleteImage={handleDeleteImage}
            />
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default HistoryPage;