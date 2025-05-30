import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { z } from 'zod';
import { ApiError, ApiErrorSchema } from '@/types/api';
import { getErrorMessage } from '@/lib/utils';

interface ApiClientConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ApiClient {
  private client: AxiosInstance;

  constructor(config: ApiClientConfig) {
    this.client = axios.create({
      baseURL: config.baseURL,
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        // Add auth token if available
        const token = localStorage.getItem('auth_token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Log request in development
        if (import.meta.env.DEV) {
          console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, config.data);
        }

        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        if (import.meta.env.DEV) {
          console.log(`[API] Response:`, response.data);
        }
        return response;
      },
      async (error: AxiosError) => {
        const apiError = this.handleError(error);

        // Retry logic for specific errors
        if (error.response?.status === 429) {
          // Rate limited - implement exponential backoff
          const retryAfter = error.response.headers['retry-after'];
          const delay = retryAfter ? parseInt(retryAfter) * 1000 : 1000;
          
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.client.request(error.config!);
        }

        // Refresh token logic
        if (error.response?.status === 401) {
          // Token expired - try to refresh
          try {
            await this.refreshToken();
            return this.client.request(error.config!);
          } catch {
            // Refresh failed - redirect to login
            window.location.href = '/login';
          }
        }

        return Promise.reject(apiError);
      }
    );
  }

  private handleError(error: AxiosError): ApiError {
    if (error.response?.data) {
      try {
        return ApiErrorSchema.parse(error.response.data);
      } catch {
        // Response doesn't match our error schema
      }
    }

    return {
      message: getErrorMessage(error),
      code: error.code || 'UNKNOWN_ERROR',
      details: {
        status: error.response?.status,
        statusText: error.response?.statusText,
      },
    };
  }

  private async refreshToken(): Promise<void> {
    // Implement token refresh logic
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token');

    const response = await this.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken });
    localStorage.setItem('auth_token', response.accessToken);
    localStorage.setItem('refresh_token', response.refreshToken);
  }

  async get<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config);
    return response.data;
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await this.client.delete<T>(url, config);
    return response.data;
  }

  async request<T>(config: AxiosRequestConfig) {
    const response = await this.client.request<T>(config);
    return response.data;
  }

  // Type-safe request with Zod validation
  async requestWithValidation<T>(
    config: AxiosRequestConfig,
    schema: z.ZodType<T>
  ): Promise<T> {
    const response = await this.request(config);
    return schema.parse(response);
  }
}

// Create a singleton instance
export const apiClient = new ApiClient({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.dreamcanvas.ai',
});