import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GeneratedImage } from '@/types/api';
// import { apiClient } from '@/lib/api-client'; // Temporarily disabled

interface ImagesState {
  images: GeneratedImage[];
  selectedImage: GeneratedImage | null;
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
  filters: {
    style?: string;
    timeRange?: 'today' | 'week' | 'month' | 'all';
    sortBy: 'newest' | 'oldest' | 'popular';
  };
}

const initialState: ImagesState = {
  images: [],
  selectedImage: null,
  isLoading: false,
  error: null,
  hasMore: true,
  page: 1,
  filters: {
    sortBy: 'newest',
  },
};

// Async thunks
export const fetchImages = createAsyncThunk(
  'images/fetchImages',
  async ({ page, filters }: { page: number; filters?: ImagesState['filters'] }) => {
    // Mock data for development - replace with actual API call when backend is ready
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
    
    return {
      images: [],
      hasMore: false
    };
  }
);

export const fetchImageById = createAsyncThunk(
  'images/fetchImageById',
  async (imageId: string): Promise<GeneratedImage | null> => {
    // Mock data for development
    await new Promise(resolve => setTimeout(resolve, 300));
    return null; // Return null when image not found
  }
);

export const deleteImage = createAsyncThunk(
  'images/deleteImage',
  async (imageId: string) => {
    // Mock deletion for development
    await new Promise(resolve => setTimeout(resolve, 300));
    return imageId;
  }
);

export const updateImage = createAsyncThunk(
  'images/updateImage',
  async ({ imageId, updates }: { imageId: string; updates: Partial<GeneratedImage> }): Promise<GeneratedImage | null> => {
    // Mock update for development
    await new Promise(resolve => setTimeout(resolve, 300));
    return null; // Return null as mock response
  }
);

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    setSelectedImage: (state, action: PayloadAction<GeneratedImage | null>) => {
      state.selectedImage = action.payload;
    },
    addImage: (state, action: PayloadAction<GeneratedImage>) => {
      state.images.unshift(action.payload);
    },
    setFilters: (state, action: PayloadAction<Partial<ImagesState['filters']>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.page = 1;
      state.images = [];
      state.hasMore = true;
    },
    clearImages: (state) => {
      state.images = [];
      state.page = 1;
      state.hasMore = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch images
      .addCase(fetchImages.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchImages.fulfilled, (state, action) => {
        if (state.page === 1) {
          state.images = action.payload.images;
        } else {
          state.images.push(...action.payload.images);
        }
        state.hasMore = action.payload.hasMore;
        state.page += 1;
        state.isLoading = false;
      })
      .addCase(fetchImages.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch images';
      })
      // Fetch single image
      .addCase(fetchImageById.fulfilled, (state, action) => {
        if (action.payload) {
          state.selectedImage = action.payload;
          // Update in list if exists
          const index = state.images.findIndex(img => img.id === action.payload!.id);
          if (index !== -1) {
            state.images[index] = action.payload;
          }
        }
      })
      // Delete image
      .addCase(deleteImage.fulfilled, (state, action) => {
        state.images = state.images.filter(img => img.id !== action.payload);
        if (state.selectedImage?.id === action.payload) {
          state.selectedImage = null;
        }
      })
      // Update image
      .addCase(updateImage.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.images.findIndex(img => img.id === action.payload!.id);
          if (index !== -1) {
            state.images[index] = action.payload;
          }
          if (state.selectedImage?.id === action.payload.id) {
            state.selectedImage = action.payload;
          }
        }
      });
  },
});

export const { setSelectedImage, addImage, setFilters, clearImages } = imagesSlice.actions;
export default imagesSlice.reducer;