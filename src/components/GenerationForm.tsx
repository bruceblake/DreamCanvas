import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  IoInformationCircleOutline,
  IoCheckmarkCircleOutline,
  IoWarningOutline
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

interface FormErrors {
  prompt?: string;
  negativePrompt?: string;
  general?: string;
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
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Predefined prompts for inspiration
  const promptSuggestions = [
    "A golden retriever puppy playing in a field of wildflowers",
    "A futuristic city skyline with flying vehicles and neon lights",
    "A serene mountain landscape with a crystal clear lake at sunset",
    "An enchanted forest with glowing mushrooms and fairy lights",
    "A majestic dragon soaring through storm clouds",
    "A cozy coffee shop scene with vintage decor and steaming mugs"
  ];

  // Model options with descriptions
  const modelOptions = [
    { id: 'default', name: 'Balanced', description: 'Best for general use' },
    { id: 'realistic', name: 'Photorealistic', description: 'Life-like images' },
    { id: 'anime', name: 'Anime', description: 'Japanese animation style' },
    { id: 'portrait', name: 'Portrait', description: 'Optimized for faces' },
    { id: 'artistic', name: 'Artistic', description: 'Creative & stylized' }
  ];

  // Aspect ratio options
  const aspectRatioOptions = [
    { ratio: '1:1', label: 'Square', icon: '□' },
    { ratio: '4:3', label: 'Landscape', icon: '▭' },
    { ratio: '3:4', label: 'Portrait', icon: '▯' },
    { ratio: '16:9', label: 'Widescreen', icon: '━' },
    { ratio: '9:16', label: 'Mobile', icon: '┃' }
  ];

  // Validation function
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!prompt.trim()) {
      newErrors.prompt = 'Please describe what you want to create';
    } else if (prompt.trim().length < 10) {
      newErrors.prompt = 'Please provide a more detailed description (at least 10 characters)';
    } else if (prompt.trim().length > 1000) {
      newErrors.prompt = 'Description is too long (maximum 1000 characters)';
    }
    
    if (negativePrompt.trim().length > 500) {
      newErrors.negativePrompt = 'Negative prompt is too long (maximum 500 characters)';
    }
    
    if (userData && userData.tokensRemaining < tokenCost) {
      newErrors.general = 'Insufficient tokens for this generation';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    validateForm();
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
      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Card Header */}
        <div className="px-8 py-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-750 border-b border-gray-100 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 flex items-center">
            <IoSparklesOutline className="mr-3 text-blue-500 dark:text-blue-400" />
            Create Your Dream Image
          </h2>
          <p className="mt-1 text-gray-600 dark:text-gray-400">
            Describe what you want to see and let AI bring it to life
          </p>
        </div>

        {/* Card Body */}
        <div className="p-8 space-y-6">
          {/* Main Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Image Description <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <textarea
                id="prompt"
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                  if (touched.prompt) validateForm();
                }}
                onBlur={() => handleBlur('prompt')}
                placeholder="Describe the image you want to generate in detail..."
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none
                  ${errors.prompt && touched.prompt 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:border-transparent
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500`}
                rows={4}
                disabled={isGenerating}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                {prompt.length}/1000
              </div>
            </div>
            {errors.prompt && touched.prompt && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1"
              >
                <IoWarningOutline className="mr-1" />
                {errors.prompt}
              </motion.p>
            )}
            
            {/* Prompt suggestions */}
            <div className="mt-3">
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 flex items-center">
                <IoSparklesOutline className="mr-1" /> Need inspiration? Try one of these:
              </p>
              <div className="flex flex-wrap gap-2">
                {promptSuggestions.map((suggestion, index) => (
                  <motion.button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 
                      text-blue-700 dark:text-blue-300 rounded-full px-3 py-1.5 
                      hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 
                      transition-all duration-200 border border-blue-200 dark:border-blue-700/50"
                    disabled={isGenerating}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {suggestion.length > 30 ? suggestion.substring(0, 30) + '...' : suggestion}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
          
          {/* Negative Prompt Input */}
          <div className="space-y-2">
            <label htmlFor="negativePrompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Negative Prompt
              <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">(Optional - what to avoid)</span>
            </label>
            <div className="relative">
              <textarea
                id="negativePrompt"
                value={negativePrompt}
                onChange={(e) => {
                  setNegativePrompt(e.target.value);
                  if (touched.negativePrompt) validateForm();
                }}
                onBlur={() => handleBlur('negativePrompt')}
                placeholder="Describe elements you want to avoid in the image..."
                className={`w-full px-4 py-3 border rounded-xl transition-all duration-200 resize-none
                  ${errors.negativePrompt && touched.negativePrompt 
                    ? 'border-red-300 dark:border-red-600 focus:ring-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:ring-blue-500'
                  }
                  focus:outline-none focus:ring-2 focus:border-transparent
                  bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 
                  placeholder-gray-400 dark:placeholder-gray-500`}
                rows={2}
                disabled={isGenerating}
              />
              <div className="absolute bottom-2 right-2 text-xs text-gray-400 dark:text-gray-500">
                {negativePrompt.length}/500
              </div>
            </div>
            {errors.negativePrompt && touched.negativePrompt && (
              <motion.p 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-sm text-red-600 dark:text-red-400 flex items-center mt-1"
              >
                <IoWarningOutline className="mr-1" />
                {errors.negativePrompt}
              </motion.p>
            )}
          </div>

          {/* Style Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Art Style
            </label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {modelOptions.map((model) => (
                <motion.button
                  key={model.id}
                  type="button"
                  onClick={() => setModelId(model.id)}
                  className={`relative p-4 rounded-xl text-center transition-all duration-200 ${
                    modelId === model.id 
                      ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-lg transform scale-105' 
                      : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                  }`}
                  disabled={isGenerating}
                  whileHover={{ scale: modelId === model.id ? 1.05 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="font-medium">{model.name}</div>
                  <div className="text-xs mt-1 opacity-80">{model.description}</div>
                  {modelId === model.id && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1"
                    >
                      <IoCheckmarkCircleOutline className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.button>
              ))}
            </div>
          </div>
          
          {/* Advanced Settings Toggle */}
          <div className="pt-2">
            <button 
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              <IoSettingsOutline className="mr-2" />
              {showAdvanced ? (
                <>
                  <span>Hide Advanced Settings</span>
                  <IoChevronUpOutline className="ml-1" />
                </>
              ) : (
                <>
                  <span>Show Advanced Settings</span>
                  <IoChevronDownOutline className="ml-1" />
                </>
              )}
            </button>
          </div>
          
          {/* Advanced Settings Content */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div 
                className="space-y-6 p-6 bg-gray-50 dark:bg-gray-700/30 rounded-xl border border-gray-200 dark:border-gray-700"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {/* Aspect Ratio Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Aspect Ratio
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {aspectRatioOptions.map((item) => (
                      <motion.button
                        key={item.ratio}
                        type="button"
                        onClick={() => handleAspectRatioChange(item.ratio)}
                        className={`relative p-3 rounded-lg transition-all duration-200 ${
                          selectedAspectRatio === item.ratio 
                            ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md' 
                            : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 border border-gray-200 dark:border-gray-600'
                        }`}
                        disabled={isGenerating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="text-center">
                          <div className="text-xl mb-1">{item.icon}</div>
                          <div className="text-xs font-medium">{item.ratio}</div>
                          <div className="text-xs opacity-80">{item.label}</div>
                        </div>
                        {selectedAspectRatio === item.ratio && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5"
                          >
                            <IoCheckmarkCircleOutline className="w-3 h-3" />
                          </motion.div>
                        )}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <IoInformationCircleOutline className="mr-1" />
                    <span>Output dimensions: {width} × {height}px</span>
                  </div>
                </div>
                
                {/* Parameter Sliders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="steps" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Generation Steps
                      </label>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{steps}</span>
                    </div>
                    <div className="relative">
                      <input
                        id="steps"
                        type="range"
                        min="10"
                        max="50"
                        value={steps}
                        onChange={(e) => setSteps(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 
                          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-110"
                        disabled={isGenerating}
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>10</span>
                        <span>30</span>
                        <span>50</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      More steps = higher quality, longer generation time
                    </p>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label htmlFor="guidanceScale" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Guidance Scale
                      </label>
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{guidanceScale}</span>
                    </div>
                    <div className="relative">
                      <input
                        id="guidanceScale"
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={guidanceScale}
                        onChange={(e) => setGuidanceScale(Number(e.target.value))}
                        className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-gray-200 dark:bg-gray-600 
                          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 
                          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 
                          [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:transition-all
                          [&::-webkit-slider-thumb]:hover:scale-110"
                        disabled={isGenerating}
                      />
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                        <span>1</span>
                        <span>7.5</span>
                        <span>20</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Higher = stronger prompt adherence
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Card Footer */}
        <div className="px-8 py-6 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700 space-y-4">
          {/* Token Information */}
          {currentUser && userData && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600"
            >
              <div className="flex items-center space-x-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
                  <IoTicketOutline className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Available Tokens</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{userData.tokensRemaining}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">Generation Cost</p>
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{tokenCost} tokens</p>
                <div className="relative group inline-block">
                  <IoInformationCircleOutline className="w-4 h-4 text-gray-400 dark:text-gray-500 cursor-help" />
                  <div className="absolute z-10 right-0 bottom-full mb-2 w-64 p-3 bg-white dark:bg-gray-800 rounded-lg shadow-xl text-xs text-gray-600 dark:text-gray-300 invisible group-hover:visible border border-gray-200 dark:border-gray-700">
                    <p className="font-medium mb-1">Token costs vary by:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Image resolution (higher = more tokens)</li>
                      <li>Model type (specialized = more tokens)</li>
                      <li>Generation steps (minimal impact)</li>
                    </ul>
                    <p className="mt-2">Tokens replenish monthly based on your subscription.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          
          {/* Error Messages */}
          {showTokenWarning && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700"
            >
              <div className="flex items-start">
                <IoAlertCircleOutline className="flex-shrink-0 w-5 h-5 mt-0.5 text-amber-600 dark:text-amber-400" />
                <div className="ml-3">
                  <p className="font-medium text-amber-800 dark:text-amber-200">Insufficient tokens</p>
                  <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                    You need {tokenCost} tokens, but only have {userData?.tokensRemaining || 0} available.
                  </p>
                  <Link 
                    to="/subscription" 
                    className="inline-flex items-center mt-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Upgrade your plan
                    <IoChevronDownOutline className="ml-1 rotate-[-90deg]" />
                  </Link>
                </div>
              </div>
            </motion.div>
          )}

          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700"
            >
              <div className="flex items-center">
                <IoWarningOutline className="w-5 h-5 text-red-600 dark:text-red-400" />
                <p className="ml-2 text-sm font-medium text-red-800 dark:text-red-200">{errors.general}</p>
              </div>
            </motion.div>
          )}
          
          {/* Submit Button */}
          <motion.button
            type="submit"
            className={`w-full relative overflow-hidden rounded-xl font-semibold py-4 px-6 transition-all duration-300
              ${isGenerating || !prompt.trim() || showTokenWarning
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl'
              }`}
            disabled={isGenerating || !prompt.trim() || showTokenWarning}
            whileHover={!isGenerating && prompt.trim() && !showTokenWarning ? { scale: 1.01 } : {}}
            whileTap={!isGenerating && prompt.trim() && !showTokenWarning ? { scale: 0.99 } : {}}
          >
            <span className="relative z-10 flex items-center justify-center">
              {isGenerating ? (
                <>
                  <LoadingSpinner size="small" color="white" />
                  <span className="ml-3">Creating Your Masterpiece...</span>
                </>
              ) : showTokenWarning ? (
                <>
                  <IoTicketOutline className="mr-2 text-xl" />
                  <span>Insufficient Tokens</span>
                </>
              ) : (
                <>
                  <IoSparklesOutline className="mr-2 text-xl" />
                  <span>Generate Image</span>
                </>
              )}
            </span>
            {!isGenerating && prompt.trim() && !showTokenWarning && (
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-blue-600"
                initial={{ x: '100%' }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>
        </div>
      </form>
    </motion.div>
  );
};

export default GenerationForm;
