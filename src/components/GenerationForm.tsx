import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  IoChevronDownOutline, 
  IoChevronUpOutline, 
  IoSparklesOutline, 
  IoColorPaletteOutline, 
  IoExtensionPuzzleOutline,
  IoImageOutline,
  IoSettingsOutline,
  IoTicketOutline,
  IoAlertCircleOutline,
  IoInformationCircleOutline
} from 'react-icons/io5';
import { GenerationParams } from '../types';
import LoadingSpinner from './LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';
import { TOKEN_COSTS } from '../services/firebase';
import { Link } from 'react-router-dom';

interface GenerationFormProps {
  onSubmit: (params: GenerationParams) => void;
  isGenerating: boolean;
}

const GenerationForm: React.FC<GenerationFormProps> = ({ 
  onSubmit, 
  isGenerating 
}) => {
  const { currentUser, userData } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(7.5);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [modelId, setModelId] = useState('default');
  const [selectedAspectRatio, setSelectedAspectRatio] = useState<string>('1:1');
  const [tokenCost, setTokenCost] = useState(TOKEN_COSTS.STANDARD_GENERATION);
  const [showTokenWarning, setShowTokenWarning] = useState(false);

  // Predefined prompts for inspiration
  const promptSuggestions = [
    "A golden retriever puppy playing in a field of wildflowers",
    "A futuristic city skyline with flying vehicles and neon lights",
    "A serene mountain landscape with a crystal clear lake at sunset",
    "An enchanted forest with glowing mushrooms and fairy lights",
    "A majestic dragon soaring through storm clouds",
    "A cozy coffee shop scene with vintage decor and steaming mugs"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) return;
    
    const params: GenerationParams = {
      prompt: prompt.trim(),
      negativePrompt: negativePrompt.trim() || undefined,
      steps,
      guidanceScale,
      width,
      height,
      modelId
    };
    
    onSubmit(params);
  };

  // Calculate token cost based on the current settings
  const calculateTokenCost = (width: number, height: number, modelType: string) => {
    // Base on image size and model type
    if (width > 1024 || height > 1024) {
      return TOKEN_COSTS.ULTRA_HD_GENERATION;
    } else if (width > 512 || height > 512 || modelId === 'realistic' || modelId === 'portrait') {
      return TOKEN_COSTS.HD_GENERATION;
    } else if (modelId === 'artistic') {
      return TOKEN_COSTS.CUSTOM_GENERATION;
    } else {
      return TOKEN_COSTS.STANDARD_GENERATION;
    }
  };

  // Update token cost whenever relevant parameters change
  React.useEffect(() => {
    const newTokenCost = calculateTokenCost(width, height, modelId);
    setTokenCost(newTokenCost);
    
    // Show warning if user doesn't have enough tokens
    if (userData && userData.tokensRemaining < newTokenCost) {
      setShowTokenWarning(true);
    } else {
      setShowTokenWarning(false);
    }
  }, [width, height, modelId, userData]);

  const handleAspectRatioChange = (ratio: string) => {
    setSelectedAspectRatio(ratio);
    
    let newWidth, newHeight;
    
    switch(ratio) {
      case '1:1':
        newWidth = 512;
        newHeight = 512;
        break;
      case '4:3':
        newWidth = 640;
        newHeight = 480;
        break;
      case '3:4':
        newWidth = 480;
        newHeight = 640;
        break;
      case '16:9':
        newWidth = 768;
        newHeight = 432;
        break;
      case '9:16':
        newWidth = 432;
        newHeight = 768;
        break;
      default:
        newWidth = 512;
        newHeight = 512;
    }
    
    setWidth(newWidth);
    setHeight(newHeight);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(suggestion);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
        <div className="mb-6">
          <label htmlFor="prompt" className="block text-gray-800 dark:text-gray-200 font-semibold mb-2 text-lg">
            <div className="flex items-center">
              <IoSparklesOutline className="mr-2 text-blue-500 dark:text-blue-400" />
              What would you like to create?
            </div>
          </label>
          <textarea
            id="prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want to generate in detail..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-inner"
            rows={5}
            required
            disabled={isGenerating}
          />
          
          {/* Prompt suggestions */}
          <div className="mt-4">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 flex items-center">
              <IoSparklesOutline className="mr-1" /> Need inspiration? Try one of these:
            </p>
            <div className="flex flex-wrap gap-2">
              {promptSuggestions.map((suggestion, index) => (
                <motion.button
                  key={index}
                  type="button"
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="text-xs bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded-full px-3 py-1.5 hover:bg-blue-100 dark:hover:bg-blue-800/40 transition-colors border border-blue-100 dark:border-blue-800/50"
                  disabled={isGenerating}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="negativePrompt" className="block text-gray-800 dark:text-gray-200 font-semibold mb-2">
            <div className="flex items-center">
              <IoColorPaletteOutline className="mr-2 text-red-500 dark:text-red-400" />
              Negative Prompt (what to avoid)
            </div>
          </label>
          <textarea
            id="negativePrompt"
            value={negativePrompt}
            onChange={(e) => setNegativePrompt(e.target.value)}
            placeholder="Describe elements you want to avoid in the image..."
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 resize-none shadow-inner"
            rows={2}
            disabled={isGenerating}
          />
        </div>
        
        <div className="mb-6">
          <button 
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium transition-colors"
          >
            <IoSettingsOutline className="mr-2" />
            {showAdvanced ? (
              <>
                <IoChevronUpOutline className="mr-1" /> Hide advanced options
              </>
            ) : (
              <>
                <IoChevronDownOutline className="mr-1" /> Show advanced options
              </>
            )}
          </button>
          
          <motion.div 
            className="mt-5 space-y-6 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-100 dark:border-gray-700"
            initial={false}
            animate={showAdvanced ? { height: 'auto', opacity: 1 } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{ overflow: showAdvanced ? 'visible' : 'hidden' }}
          >
            <div>
              <label htmlFor="modelId" className="block text-gray-800 dark:text-gray-200 font-semibold mb-3">
                <div className="flex items-center">
                  <IoExtensionPuzzleOutline className="mr-2 text-purple-500 dark:text-purple-400" />
                  AI Model
                </div>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { id: 'default', name: 'Balanced' },
                  { id: 'realistic', name: 'Photorealistic' },
                  { id: 'anime', name: 'Anime' },
                  { id: 'portrait', name: 'Portrait' },
                  { id: 'artistic', name: 'Artistic' }
                ].map((model) => (
                  <button
                    key={model.id}
                    type="button"
                    onClick={() => setModelId(model.id)}
                    className={`py-3 px-4 rounded-lg text-center transition-colors ${
                      modelId === model.id 
                        ? 'bg-purple-600 text-white ring-2 ring-purple-300 dark:ring-purple-800 ring-offset-2 dark:ring-offset-gray-800' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                    disabled={isGenerating}
                  >
                    {model.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-gray-800 dark:text-gray-200 font-semibold mb-3">
                <div className="flex items-center">
                  <IoImageOutline className="mr-2 text-blue-500 dark:text-blue-400" />
                  Aspect Ratio
                </div>
              </label>
              <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                {[
                  { ratio: '1:1', label: 'Square' },
                  { ratio: '4:3', label: 'Landscape' },
                  { ratio: '3:4', label: 'Portrait' },
                  { ratio: '16:9', label: 'Widescreen' },
                  { ratio: '9:16', label: 'Mobile' }
                ].map((item) => (
                  <button
                    key={item.ratio}
                    type="button"
                    onClick={() => handleAspectRatioChange(item.ratio)}
                    className={`py-3 px-4 rounded-lg transition-colors ${
                      selectedAspectRatio === item.ratio 
                        ? 'bg-blue-600 text-white ring-2 ring-blue-300 dark:ring-blue-800 ring-offset-2 dark:ring-offset-gray-800' 
                        : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                    }`}
                    disabled={isGenerating}
                  >
                    <div className="text-center">
                      <span className="block text-sm">{item.ratio}</span>
                      <span className="block text-xs mt-1 opacity-80">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex items-center mt-3 text-sm text-gray-600 dark:text-gray-400">
                <span>Dimensions: {width} × {height}px</span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="steps" className="block text-gray-800 dark:text-gray-200 font-semibold mb-3">
                  Generation Steps: {steps}
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">10</span>
                  <input
                    id="steps"
                    type="range"
                    min="10"
                    max="50"
                    value={steps}
                    onChange={(e) => setSteps(Number(e.target.value))}
                    className="w-full h-2 mx-2 rounded-lg appearance-none bg-gray-300 dark:bg-gray-600"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">50</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Higher values produce more detailed images but take longer to generate
                </p>
              </div>
              
              <div>
                <label htmlFor="guidanceScale" className="block text-gray-800 dark:text-gray-200 font-semibold mb-3">
                  Guidance Scale: {guidanceScale}
                </label>
                <div className="flex items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">1</span>
                  <input
                    id="guidanceScale"
                    type="range"
                    min="1"
                    max="20"
                    step="0.5"
                    value={guidanceScale}
                    onChange={(e) => setGuidanceScale(Number(e.target.value))}
                    className="w-full h-2 mx-2 rounded-lg appearance-none bg-gray-300 dark:bg-gray-600"
                    disabled={isGenerating}
                  />
                  <span className="text-sm text-gray-500 dark:text-gray-400 w-8">20</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  Controls how closely the image follows your prompt (higher = more faithful to prompt)
                </p>
              </div>
            </div>
          </motion.div>
        </div>
        
        {currentUser && userData && (
          <div className="mb-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-300 text-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <IoTicketOutline className="flex-shrink-0 w-5 h-5 mr-2" />
                <span>
                  Tokens: <span className="font-semibold">{userData.tokensRemaining}</span> available
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">Cost: <span className="font-semibold">{tokenCost}</span> tokens</span>
                <div className="relative group">
                  <IoInformationCircleOutline className="w-5 h-5 cursor-pointer text-blue-500" />
                  <div className="absolute z-10 right-0 bottom-full mb-2 w-48 p-2 bg-white dark:bg-gray-800 rounded shadow-lg text-xs text-gray-600 dark:text-gray-300 hidden group-hover:block border border-gray-200 dark:border-gray-700">
                    Token costs increase with higher resolutions and advanced models. 
                    Tokens replenish monthly based on your subscription plan.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {showTokenWarning && (
          <div className="mb-6 p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 text-amber-800 dark:text-amber-300 text-sm">
            <div className="flex items-start">
              <IoAlertCircleOutline className="flex-shrink-0 w-5 h-5 mr-2 mt-0.5" />
              <div>
                <p className="font-medium">Not enough tokens</p>
                <p className="mt-1">You need {tokenCost} tokens for this generation, but you only have {userData?.tokensRemaining || 0} remaining.</p>
                <div className="mt-2">
                  <Link 
                    to="/subscription" 
                    className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-semibold"
                  >
                    Upgrade your plan →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <motion.button
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed flex justify-center items-center"
          disabled={isGenerating || !prompt.trim() || (currentUser && userData && (userData.tokensRemaining < tokenCost))}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isGenerating ? (
            <>
              <LoadingSpinner size="small" color="white" />
              <span className="ml-3">Creating Your Image...</span>
            </>
          ) : showTokenWarning ? (
            <>
              <IoTicketOutline className="mr-2" />
              Need More Tokens
            </>
          ) : (
            <>
              <IoSparklesOutline className="mr-2" />
              Generate Image
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default GenerationForm;
