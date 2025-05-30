import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { generateImage, updateParams } from '@/store/slices/generationSlice';
import { addToast } from '@/store/slices/uiSlice';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { Sparkles, Settings, Wand2, Palette, Image, Sliders } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const styles = [
  { value: 'realistic', label: 'Realistic', icon: '📷' },
  { value: 'artistic', label: 'Artistic', icon: '🎨' },
  { value: 'abstract', label: 'Abstract', icon: '🌀' },
  { value: 'cartoon', label: 'Cartoon', icon: '🎭' },
  { value: 'anime', label: 'Anime', icon: '🎌' },
  { value: 'digital-art', label: 'Digital Art', icon: '💻' },
  { value: '3d-render', label: '3D Render', icon: '🎮' },
  { value: 'oil-painting', label: 'Oil Painting', icon: '🖼️' },
  { value: 'watercolor', label: 'Watercolor', icon: '🎨' },
  { value: 'sketch', label: 'Sketch', icon: '✏️' },
  { value: 'pixel-art', label: 'Pixel Art', icon: '👾' },
  { value: 'cyberpunk', label: 'Cyberpunk', icon: '🤖' },
  { value: 'steampunk', label: 'Steampunk', icon: '⚙️' },
  { value: 'fantasy', label: 'Fantasy', icon: '🐉' },
  { value: 'minimalist', label: 'Minimalist', icon: '⚪' },
];

const sizes = [
  { value: '256x256', label: '256×256', description: 'Small, fast generation' },
  { value: '512x512', label: '512×512', description: 'Medium quality' },
  { value: '1024x1024', label: '1024×1024', description: 'High quality, square' },
  { value: '1024x1792', label: '1024×1792', description: 'Portrait orientation' },
  { value: '1792x1024', label: '1792×1024', description: 'Landscape orientation' },
];

const qualities = [
  { value: 'standard', label: 'Standard', description: 'Faster generation' },
  { value: 'hd', label: 'HD', description: 'Higher quality' },
  { value: 'ultra', label: 'Ultra', description: 'Maximum quality' },
];

export const GenerationForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentParams, isGenerating, progress } = useAppSelector((state) => state.generation);
  const { user, profile } = useAppSelector((state) => state.auth);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      dispatch(addToast({
        type: 'error',
        title: 'Authentication required',
        description: 'Please sign in to generate images',
      }));
      return;
    }

    if (!currentParams.prompt.trim()) {
      dispatch(addToast({
        type: 'warning',
        title: 'Prompt required',
        description: 'Please enter a description for your image',
      }));
      return;
    }


    try {
      await dispatch(generateImage(currentParams)).unwrap();
      dispatch(addToast({
        type: 'success',
        title: 'Image generated!',
        description: 'Your image has been created successfully',
      }));
    } catch (error) {
      dispatch(addToast({
        type: 'error',
        title: 'Generation failed',
        description: 'Please try again later',
      }));
    }
  };

  return (
    <Card variant="glass" className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-purple-600" />
          Create Your Dream Image
        </CardTitle>
        <CardDescription>
          Describe what you want to create and let AI bring it to life
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main Prompt */}
          <div className="space-y-2">
            <Input
              label="What do you want to create?"
              placeholder="A serene mountain landscape at sunset with vibrant colors..."
              value={currentParams.prompt}
              onChange={(e) => dispatch(updateParams({ prompt: e.target.value }))}
              leftIcon={<Wand2 className="h-4 w-4" />}
              disabled={isGenerating}
            />
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Be descriptive! Include details about style, mood, colors, and composition.
            </p>
          </div>

          {/* Quick Style Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Art Style
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {styles.slice(0, 5).map((style) => (
                <button
                  key={style.value}
                  type="button"
                  onClick={() => dispatch(updateParams({ style: style.value as any }))}
                  className={cn(
                    'p-3 rounded-lg border-2 transition-all text-center',
                    currentParams.style === style.value
                      ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  )}
                  disabled={isGenerating}
                >
                  <div className="text-2xl mb-1">{style.icon}</div>
                  <div className="text-xs font-medium">{style.label}</div>
                </button>
              ))}
            </div>
            {!showAdvanced && (
              <button
                type="button"
                onClick={() => setShowAdvanced(true)}
                className="text-sm text-purple-600 hover:text-purple-700 dark:text-purple-400"
              >
                Show all styles →
              </button>
            )}
          </div>

          {/* Advanced Options */}
          <AnimatePresence>
            {showAdvanced && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-4 overflow-hidden"
              >
                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Settings className="h-4 w-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Advanced Settings
                    </span>
                  </div>

                  {/* All Styles */}
                  <Select
                    value={currentParams.style}
                    onValueChange={(value) => dispatch(updateParams({ style: value as any }))}
                    disabled={isGenerating}
                  >
                    <SelectTrigger label="Art Style" className="mb-4">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style.value} value={style.value}>
                          <span className="flex items-center gap-2">
                            <span>{style.icon}</span>
                            <span>{style.label}</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {/* Size Selection */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Select
                      value={currentParams.size}
                      onValueChange={(value) => dispatch(updateParams({ size: value as any }))}
                      disabled={isGenerating}
                    >
                      <SelectTrigger label="Image Size">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {sizes.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            <div>
                              <div className="font-medium">{size.label}</div>
                              <div className="text-xs text-gray-500">{size.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={currentParams.quality}
                      onValueChange={(value) => dispatch(updateParams({ quality: value as any }))}
                      disabled={isGenerating}
                    >
                      <SelectTrigger label="Quality">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {qualities.map((quality) => (
                          <SelectItem key={quality.value} value={quality.value}>
                            <div>
                              <div className="font-medium">{quality.label}</div>
                              <div className="text-xs text-gray-500">{quality.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Negative Prompt */}
                  <Input
                    label="Negative Prompt (Optional)"
                    placeholder="Things to avoid: blurry, low quality, distorted..."
                    value={currentParams.negativePrompt || ''}
                    onChange={(e) => dispatch(updateParams({ negativePrompt: e.target.value }))}
                    disabled={isGenerating}
                    hint="Describe what you don't want in the image"
                  />

                  {/* Fine-tuning */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Steps: {currentParams.steps}
                      </label>
                      <input
                        type="range"
                        min="10"
                        max="150"
                        value={currentParams.steps}
                        onChange={(e) => dispatch(updateParams({ steps: parseInt(e.target.value) }))}
                        className="w-full mt-2"
                        disabled={isGenerating}
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher = better quality, slower</p>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                        <Sliders className="h-4 w-4" />
                        Guidance: {currentParams.guidance}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="20"
                        step="0.5"
                        value={currentParams.guidance}
                        onChange={(e) => dispatch(updateParams({ guidance: parseFloat(e.target.value) }))}
                        className="w-full mt-2"
                        disabled={isGenerating}
                      />
                      <p className="text-xs text-gray-500 mt-1">Higher = follows prompt more closely</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4">
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <span>Ready to generate your image</span>
            </div>
            <div className="flex gap-2">
              {showAdvanced && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdvanced(false)}
                >
                  Hide Advanced
                </Button>
              )}
              <Button
                type="submit"
                disabled={isGenerating || !currentParams.prompt.trim()}
                isLoading={isGenerating}
                leftIcon={<Image className="h-4 w-4" />}
              >
                Generate Image
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          {isGenerating && (
            <div className="space-y-2">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                Creating your masterpiece... {Math.round(progress)}%
              </p>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};