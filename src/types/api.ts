import { z } from 'zod';

// API Response schemas
export const ApiErrorSchema = z.object({
  message: z.string(),
  code: z.string().optional(),
  details: z.record(z.unknown()).optional(),
});

export const ApiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(true),
      data: dataSchema,
    }),
    z.object({
      success: z.literal(false),
      error: ApiErrorSchema,
    }),
  ]);

// Image generation schemas
export const ImageStyleSchema = z.enum([
  'realistic',
  'artistic',
  'abstract',
  'cartoon',
  'anime',
  'digital-art',
  '3d-render',
  'oil-painting',
  'watercolor',
  'sketch',
  'pixel-art',
  'cyberpunk',
  'steampunk',
  'fantasy',
  'minimalist',
]);

export const ImageSizeSchema = z.enum([
  '256x256',
  '512x512',
  '1024x1024',
  '1024x1792',
  '1792x1024',
]);

export const ImageQualitySchema = z.enum(['standard', 'hd', 'ultra']);

export const GenerationParamsSchema = z.object({
  prompt: z.string().min(1).max(1000),
  negativePrompt: z.string().optional(),
  style: ImageStyleSchema,
  size: ImageSizeSchema,
  quality: ImageQualitySchema,
  seed: z.number().optional(),
  steps: z.number().min(10).max(150).default(50),
  guidance: z.number().min(1).max(20).default(7.5),
  model: z.string().default('stable-diffusion-xl'),
});

export const GeneratedImageSchema = z.object({
  id: z.string(),
  url: z.string().url(),
  prompt: z.string(),
  parameters: GenerationParamsSchema,
  userId: z.string(),
  createdAt: z.string().datetime(),
  metadata: z.object({
    width: z.number(),
    height: z.number(),
    fileSize: z.number(),
    format: z.string(),
  }).optional(),
  tags: z.array(z.string()).default([]),
  likes: z.number().default(0),
  views: z.number().default(0),
});

// User schemas
export const UserProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  displayName: z.string().optional(),
  photoURL: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  website: z.string().url().optional(),
  subscription: z.object({
    plan: z.enum(['free', 'pro', 'enterprise']),
    creditsRemaining: z.number(),
    creditsUsed: z.number(),
    resetDate: z.string().datetime(),
  }),
  preferences: z.object({
    defaultStyle: ImageStyleSchema.optional(),
    defaultQuality: ImageQualitySchema.optional(),
    emailNotifications: z.boolean().default(true),
  }),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

// Type exports
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type ApiResponse<T> = z.infer<ReturnType<typeof ApiResponseSchema<z.ZodType<T>>>>;
export type ImageStyle = z.infer<typeof ImageStyleSchema>;
export type ImageSize = z.infer<typeof ImageSizeSchema>;
export type ImageQuality = z.infer<typeof ImageQualitySchema>;
export type GenerationParams = z.infer<typeof GenerationParamsSchema>;
export type GeneratedImage = z.infer<typeof GeneratedImageSchema>;
export type UserProfile = z.infer<typeof UserProfileSchema>;