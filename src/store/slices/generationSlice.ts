import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GenerationParams, GeneratedImage } from '@/types/api';
// import { apiClient } from '@/lib/api-client'; // Temporarily disabled
import { generateImage as generateImageAPI } from '@/services/api';

interface GenerationState {
  currentParams: GenerationParams;
  isGenerating: boolean;
  progress: number;
  generatedImages: GeneratedImage[];
  error: string | null;
  history: GenerationParams[];
}

const initialState: GenerationState = {
  currentParams: {
    prompt: '',
    style: 'realistic',
    size: '1024x1024',
    quality: 'standard',
    steps: 50,
    guidance: 7.5,
    model: 'stable-diffusion-xl',
  },
  isGenerating: false,
  progress: 0,
  generatedImages: [],
  error: null,
  history: [],
};

// Async thunks
export const generateImage = createAsyncThunk(
  'generation/generateImage',
  async (params: GenerationParams, { dispatch }) => {
    // Simulate progress updates
    const progressInterval = setInterval(() => {
      dispatch(updateProgress(Math.min(90, Math.random() * 100)));
    }, 500);

    try {
      // Convert the params to match the existing API
      const apiParams = {
        prompt: params.prompt,
        negativePrompt: params.negativePrompt,
        steps: params.steps,
        guidanceScale: params.guidance,
        width: parseInt(params.size.split('x')[0]),
        height: parseInt(params.size.split('x')[1]),
        modelId: params.model,
      };
      
      const response = await generateImageAPI(apiParams);
      clearInterval(progressInterval);
      dispatch(updateProgress(100));
      
      if (response.error) {
        throw new Error(response.error);
      }
      
      // Convert response to GeneratedImage format
      const generatedImage: GeneratedImage = {
        id: response.data.id,
        url: response.data.url || '',
        prompt: params.prompt,
        parameters: params,
        userId: 'current-user', // This should come from auth state
        createdAt: new Date().toISOString(),
        tags: [],
        likes: 0,
        views: 0,
      };
      
      // Save to history
      dispatch(addToHistory(params));
      
      return generatedImage;
    } catch (error) {
      clearInterval(progressInterval);
      throw error;
    }
  }
);

const generationSlice = createSlice({
  name: 'generation',
  initialState,
  reducers: {
    updateParams: (state, action: PayloadAction<Partial<GenerationParams>>) => {
      state.currentParams = { ...state.currentParams, ...action.payload };
    },
    resetParams: (state) => {
      state.currentParams = initialState.currentParams;
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      state.progress = action.payload;
    },
    addToHistory: (state, action: PayloadAction<GenerationParams>) => {
      // Keep only last 10 items
      state.history = [action.payload, ...state.history.slice(0, 9)];
    },
    loadFromHistory: (state, action: PayloadAction<GenerationParams>) => {
      state.currentParams = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateImage.pending, (state) => {
        state.isGenerating = true;
        state.error = null;
        state.progress = 0;
      })
      .addCase(generateImage.fulfilled, (state, action) => {
        state.isGenerating = false;
        state.generatedImages.unshift(action.payload);
        state.progress = 0;
      })
      .addCase(generateImage.rejected, (state, action) => {
        state.isGenerating = false;
        state.error = action.error.message || 'Generation failed';
        state.progress = 0;
      });
  },
});

export const {
  updateParams,
  resetParams,
  updateProgress,
  addToHistory,
  loadFromHistory,
  clearError,
} = generationSlice.actions;

export default generationSlice.reducer;