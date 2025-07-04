export interface GenerationParams {
  prompt: string;
  negativePrompt?: string;
  steps?: number;
  guidanceScale?: number;
  width?: number;
  height?: number;
  modelId?: string;
}

export interface ImageData {
  id: string;
  url: string;
  prompt: string;
  createdAt: string;
  params: GenerationParams;
  status: 'completed' | 'processing' | 'failed';
}
  
export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export interface GenerationResponse {
  id: string;
  status: 'completed' | 'processing' | 'failed';
  url?: string;
}

export interface HistoryFilters {
  searchTerm?: string;
  sortBy?: 'newest' | 'oldest';
  modelId?: string;
}