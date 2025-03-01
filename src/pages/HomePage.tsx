import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  IoDownloadOutline, 
  IoShareOutline, 
  IoInformationCircleOutline, 
  IoSparklesOutline,
  IoTicketOutline, 
  IoRocketOutline
} from 'react-icons/io5';
import GenerationForm from '../components/GenerationForm';
import LoadingSpinner from '../components/LoadingSpinner';
import { GenerationParams, ImageData } from '../types';
import { generateImage } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { TOKEN_COSTS, consumeTokens, saveGeneratedImage } from '../services/firebase';

const HomePage: React.FC = () => {
  const { currentUser, userData } = useAuth();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<ImageData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  
  const navigate = useNavigate();

  // Calculate token cost for generation
  const calculateTokenCost = (params: GenerationParams): number => {
    // Base cost on image size and model type
    if (params.width && params.height) {
      if (params.width > 1024 || params.height > 1024) {
        return TOKEN_COSTS.ULTRA_HD_GENERATION;
      } else if (params.width > 512 || params.height > 512 || params.modelId === 'realistic' || params.modelId === 'portrait') {
        return TOKEN_COSTS.HD_GENERATION;
      } else if (params.modelId === 'artistic') {
        return TOKEN_COSTS.CUSTOM_GENERATION;
      }
    }
    
    return TOKEN_COSTS.STANDARD_GENERATION;
  };

  const handleGenerate = async (params: GenerationParams) => {
    setIsGenerating(true);
    setError(null);
    
    // If user is logged in, check tokens and consume them
    if (currentUser && userData) {
      const tokenCost = calculateTokenCost(params);
      
      if (userData.tokensRemaining < tokenCost) {
        setError(`You need ${tokenCost} tokens to create this image but only have ${userData.tokensRemaining} tokens remaining.`);
        setIsGenerating(false);
        setShowUpgradeModal(true);
        return;
      }
      
      // Consume tokens
      const consumeResult = await consumeTokens(currentUser.uid, tokenCost);
      
      if (!consumeResult.success) {
        setError(consumeResult.error || 'Failed to consume tokens');
        setIsGenerating(false);
        return;
      }
    }
    
    try {
      const response = await generateImage(params);
      
      if (response.error) {
        setError(response.error);
        return;
      }
      
      if (response.data.status === 'completed' && response.data.url) {
        // Create an ImageData object from the response
        const newImage: ImageData = {
          id: response.data.id,
          url: response.data.url,
          prompt: params.prompt,
          createdAt: new Date().toISOString(),
          params,
          status: 'completed'
        };
        
        setGeneratedImage(newImage);
        
        // Save to user's collection if logged in
        if (currentUser) {
          await saveGeneratedImage(currentUser.uid, newImage);
        }
      } else {
        // Handle processing status
        navigate(`/image/${response.data.id}`);
      }
    } catch (err) {
      setError('Failed to generate image. Please try again.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleViewDetails = () => {
    if (generatedImage) {
      navigate(`/image/${generatedImage.id}`);
    }
  };

  const handleDownload = async () => {
    if (!generatedImage?.url) return;
    
    try {
      const response = await fetch(generatedImage.url);
      const blob = await response.blob();
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `dreamcanvas-${generatedImage.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Failed to download image:', err);
      alert('Failed to download image. Please try again.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden opacity-20 dark:opacity-10 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply blur-3xl animate-blob"></div>
          <div className="absolute top-20 right-1/3 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/3 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply blur-3xl animate-blob animation-delay-4000"></div>
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-600 text-transparent bg-clip-text">
              Transform Your Ideas Into Art
            </h1>
            <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to create stunning, unique visuals from your descriptions. 
              Perfect for artists, designers, and creative thinkers.
            </p>
          </div>
        </motion.div>
      </div>
      
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 relative">
        <div className="lg:col-span-3">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <GenerationForm onSubmit={handleGenerate} isGenerating={isGenerating} />
            
            {error && (
              <motion.div 
                className="mt-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center">
                  <IoInformationCircleOutline className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
        
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="h-full"
          >
            {isGenerating ? (
              <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <LoadingSpinner size="large" type="dots" />
                <p className="text-gray-600 dark:text-gray-300 mt-6 text-center font-medium">
                  Creating your masterpiece...
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2 text-center max-w-xs">
                  Our AI is carefully crafting your image based on your description
                </p>
              </div>
            ) : generatedImage ? (
              <motion.div 
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="p-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                  <h3 className="font-medium">Your Creation</h3>
                </div>
                
                <div className="relative group flex-grow flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-6">
                  <img 
                    src={generatedImage.url} 
                    alt={generatedImage.prompt} 
                    className="max-w-full max-h-[400px] object-contain rounded-lg shadow-lg"
                  />
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
                    <div className="flex space-x-3">
                      <button
                        onClick={handleDownload}
                        className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="Download image"
                      >
                        <IoDownloadOutline className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={handleViewDetails}
                        className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="View details"
                      >
                        <IoInformationCircleOutline className="w-6 h-6 text-gray-900" />
                      </button>
                      <button
                        onClick={() => alert('Sharing feature coming soon!')}
                        className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors shadow-lg"
                        aria-label="Share image"
                      >
                        <IoShareOutline className="w-6 h-6 text-gray-900" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-5 border-t border-gray-100 dark:border-gray-700">
                  <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 mb-3">
                    {generatedImage.prompt}
                  </p>
                  <button
                    onClick={handleViewDetails}
                    className="text-blue-600 dark:text-blue-400 text-sm font-medium hover:text-blue-800 dark:hover:text-blue-300 transition-colors flex items-center"
                  >
                    View full details
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-8">
                <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-6 mb-6">
                  <IoSparklesOutline className="w-10 h-10 text-blue-500 dark:text-blue-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Your Image Preview</h3>
                <p className="text-gray-500 dark:text-gray-400 text-center max-w-xs">
                  Fill out the form and click "Generate Image" to see your creation appear here
                </p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
      
      <motion.div
        className="mt-20 max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-10 text-gray-900 dark:text-gray-100">
          How It Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800/50 transition-colors">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
              <span className="text-3xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Describe Your Vision</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Enter a detailed description of the image you want to create. The more specific you are, the better your results!
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-purple-200 dark:hover:border-purple-800/50 transition-colors">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6 text-purple-600 dark:text-purple-400">
              <span className="text-3xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Customize Settings</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Fine-tune your image with advanced parameters like aspect ratio, guidance, and model selection to perfect the result.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-800/50 transition-colors">
            <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-2xl flex items-center justify-center mb-6 text-indigo-600 dark:text-indigo-400">
              <span className="text-3xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-gray-100">Download & Share</h3>
            <p className="text-gray-600 dark:text-gray-300">
              Save your creation, view details about how it was made, and share it with others in just a few clicks.
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        className="mt-20 mb-10 max-w-4xl mx-auto text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900 dark:text-gray-100">
          Ready to create something amazing?
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
          Start with a simple description and watch as AI transforms your words into stunning visuals.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={() => document.querySelector('#prompt')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
          >
            Start Creating Now
          </button>
          
          {!currentUser && (
            <button
              onClick={() => navigate('/register')}
              className="px-8 py-4 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center"
            >
              <IoRocketOutline className="mr-2" />
              Sign Up Free
            </button>
          )}
        </div>
        
        {!currentUser && (
          <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
            Create a free account to save your images and get 50 free tokens!
          </p>
        )}
      </motion.div>
      
      {/* Upgrade Modal - displayed when user needs tokens */}
      {showUpgradeModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/50">
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="text-center mb-4">
              <div className="bg-indigo-100 dark:bg-indigo-900/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <IoTicketOutline className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">Need More Tokens</h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                You don't have enough tokens to generate this image.
              </p>
            </div>
            
            <div className="bg-gray-50 dark:bg-gray-700/30 p-4 rounded-lg mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600 dark:text-gray-300">Current balance:</span>
                <span className="font-semibold text-gray-900 dark:text-white">{userData?.tokensRemaining || 0} tokens</span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-600 my-2 pt-2">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-300">Your plan:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userData?.tier === 'FREE' && 'Free'}
                    {userData?.tier === 'BASIC' && 'Basic'}
                    {userData?.tier === 'PRO' && 'Professional'}
                    {userData?.tier === 'UNLIMITED' && 'Enterprise'}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => navigate('/subscription')}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg"
              >
                Upgrade My Plan
              </button>
              <button
                onClick={() => setShowUpgradeModal(false)}
                className="w-full py-3 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 font-medium rounded-lg"
              >
                Maybe Later
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Add this to your index.css */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default HomePage;