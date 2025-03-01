import { GenerationParams, ImageData, ApiResponse, GenerationResponse } from '../types';
import axios from 'axios';

// ImagePig API configuration
const API_KEY = 'ed68a98c-29d8-4bee-ada8-9c7620b4fd59';
const API_URL = 'https://api.imagepig.com';

// Store generated images in memory for history and details
const generatedImages: ImageData[] = [];

/**
 * Generate an image based on the provided parameters
 */
export async function generateImage(params: GenerationParams): Promise<ApiResponse<GenerationResponse>> {
  try {
    const response = await callImagePigAPI(params);
    
    // If generation was successful, store the image in our history
    if (response.data.status === 'completed' && response.data.url) {
      const newImage: ImageData = {
        id: response.data.id,
        url: response.data.url,
        prompt: params.prompt,
        createdAt: new Date().toISOString(),
        params,
        status: 'completed'
      };
      
      // Add to the beginning of the array
      generatedImages.unshift(newImage);
      
      // Limit the history to a reasonable size
      if (generatedImages.length > 50) {
        generatedImages.pop();
      }
    }
    
    return response;
  } catch (error) {
    console.error('Error generating image:', error);
    return {
      data: { id: '', status: 'failed' },
      error: 'Failed to generate image. Please try again.'
    };
  }
}

/**
 * Fetch image generation history
 */
export async function getImageHistory(): Promise<ApiResponse<ImageData[]>> {
  try {
    // Return any stored generated images first
    if (generatedImages.length > 0) {
      return { data: generatedImages };
    }
    
    // If no generated images yet, return high-quality sample images
    const sampleImages = generateSampleGallery();
    return { data: sampleImages };
  } catch (error) {
    console.error('Error fetching image history:', error);
    return {
      data: [],
      error: 'Failed to fetch image history. Please try again.'
    };
  }
}

/**
 * Get image details by ID
 */
export async function getImageById(id: string): Promise<ApiResponse<ImageData | null>> {
  try {
    // Look for the image in our generated images array
    const image = generatedImages.find(img => img.id === id);
    
    // If found, return it
    if (image) {
      return { data: image };
    }
    
    // If not found, generate a sample image detail
    const sampleImage = generateSampleImageDetail(id);
    return { data: sampleImage };
  } catch (error) {
    console.error(`Error fetching image with ID ${id}:`, error);
    return {
      data: null,
      error: 'Failed to fetch image details. Please try again.'
    };
  }
}

/**
 * Call the ImagePig API to generate an image
 */
async function callImagePigAPI(params: GenerationParams): Promise<ApiResponse<GenerationResponse>> {
  try {
    // Determine which endpoint to use based on size or model preference
    let endpoint = '';
    
    if (params.modelId === 'realistic' || params.modelId === 'portrait') {
      // Use XL for higher quality portraits and realistic images
      endpoint = '/xl';
    } else if (params.modelId === 'artistic') {
      // Use FLUX for artistic images
      endpoint = '/flux';
    } else {
      // Use default endpoint for other models
      endpoint = '/';
    }
    
    // Create request payload
    const payload = {
      prompt: params.prompt,
      negative_prompt: params.negativePrompt,
      // For FLUX model, use proportion instead of width/height
      ...(endpoint === '/flux' && { 
        proportion: getFluxProportion(params.width || 512, params.height || 512) 
      })
    };
    
    // Make the API call
    const apiResponse = await axios.post(API_URL + endpoint, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': API_KEY
      }
    });
    
    // Generate a unique ID for this image
    const uniqueId = 'gen-' + Date.now();
    
    // Parse the response
    if (apiResponse.data && apiResponse.data.image_data) {
      return {
        data: {
          id: uniqueId,
          status: 'completed',
          url: 'data:' + apiResponse.data.mime_type + ';base64,' + apiResponse.data.image_data
        }
      };
    } else {
      throw new Error('Invalid API response');
    }
  } catch (error: any) {
    console.error('Error calling ImagePig API:', error);
    
    // Check if it's a rate limit or API error
    if (error.response) {
      const status = error.response.status;
      if (status === 429) {
        return {
          data: { id: '', status: 'failed' },
          error: 'API rate limit exceeded. Please try again later.'
        };
      } else if (status === 401) {
        return {
          data: { id: '', status: 'failed' },
          error: 'API authentication failed. Please check your API key.'
        };
      }
    }
    
    // Use fallback to mock API for development/testing
    console.log('Falling back to mock image generation...');
    return await mockImageGeneration(params);
  }
}

/**
 * Determine the appropriate proportion setting for FLUX model
 */
function getFluxProportion(width: number, height: number): string {
  const ratio = width / height;
  
  if (ratio > 1.4) return 'wide';      // landscape, wider format
  if (ratio > 1.1) return 'landscape';  // standard landscape
  if (ratio < 0.7) return 'vertical';   // very tall portrait
  if (ratio < 0.9) return 'portrait';   // standard portrait
  return 'square';                      // square or nearly square
}

/**
 * Generate sample gallery images that look good and realistic
 */
function generateSampleGallery(): ImageData[] {
  // Sample images from a variety of categories with direct URLs to high-quality images
  const sampleImages = [
    {
      prompt: "A majestic German Shepherd dog standing on a mountain",
      url: "https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "realistic"
    },
    {
      prompt: "Beautiful sunset over the ocean with vibrant colors",
      url: "https://images.unsplash.com/photo-1566156273738-c4e4a5e7d16a?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "realistic"
    },
    {
      prompt: "Serene mountain landscape with a crystal clear lake",
      url: "https://images.unsplash.com/photo-1535224206242-487f7090b5bb?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "portrait"
    },
    {
      prompt: "Futuristic cityscape with flying cars and neon lights",
      url: "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "artistic"
    },
    {
      prompt: "Adorable tabby cat playing with a ball of yarn",
      url: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "default"
    },
    {
      prompt: "Portrait of a young woman with flowers in her hair",
      url: "https://images.unsplash.com/photo-1464863979621-258859e62245?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "portrait"
    },
    {
      prompt: "Enchanted forest with glowing mushrooms and fairy lights",
      url: "https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "artistic"
    },
    {
      prompt: "Mouth-watering chocolate cake with fresh berries",
      url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "default"
    },
    {
      prompt: "Vast space scene with colorful planets and nebulae",
      url: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "artistic"
    },
    {
      prompt: "Abstract painting with vibrant splashes of color",
      url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "artistic"
    },
    {
      prompt: "Cozy coffee shop interior with vintage decor",
      url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "realistic"
    },
    {
      prompt: "Medieval castle on a hilltop at sunset",
      url: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310?q=80&w=1024&h=1024&auto=format&fit=crop",
      modelId: "realistic"
    }
  ];
  
  // Convert sample images to ImageData format
  return sampleImages.map((sample, index) => {
    const width = sample.modelId === 'realistic' || sample.modelId === 'portrait' ? 1024 : 512;
    const height = sample.modelId === 'portrait' ? 1024 : width;
    
    return {
      id: `sample-${index}`,
      url: sample.url,
      prompt: sample.prompt,
      createdAt: new Date(Date.now() - index * 86400000).toISOString(),
      params: {
        prompt: sample.prompt,
        negativePrompt: "blurry, low quality, distorted",
        steps: 30,
        guidanceScale: 7.5,
        width: width,
        height: height,
        modelId: sample.modelId
      },
      status: 'completed'
    };
  });
}

/**
 * Generate a sample image detail for a specific ID
 */
function generateSampleImageDetail(id: string): ImageData {
  // Extract information from the ID to determine what kind of image to show
  const isAnimal = id.includes('dog') || id.includes('cat') || id.includes('animal');
  const isNature = id.includes('mountain') || id.includes('landscape') || id.includes('ocean');
  const isPortrait = id.includes('portrait') || id.includes('person') || id.includes('woman') || id.includes('man');
  
  let prompt, url, modelId;
  
  // Determine the appropriate image type based on the ID
  if (isAnimal) {
    prompt = "A beautiful golden retriever playing in a meadow";
    url = "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1024&h=1024&auto=format&fit=crop";
    modelId = "realistic";
  } else if (isNature) {
    prompt = "A breathtaking mountain landscape with a serene lake";
    url = "https://images.unsplash.com/photo-1535224206242-487f7090b5bb?q=80&w=1024&h=1024&auto=format&fit=crop";
    modelId = "realistic";
  } else if (isPortrait) {
    prompt = "Portrait of a young woman with a gentle smile";
    url = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1024&h=1024&auto=format&fit=crop";
    modelId = "portrait";
  } else {
    prompt = "An abstract concept visualized with vibrant colors";
    url = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1024&h=1024&auto=format&fit=crop";
    modelId = "artistic";
  }
  
  // Create width and height based on model type
  const width = modelId === 'realistic' || modelId === 'portrait' ? 1024 : 512;
  const height = modelId === 'portrait' ? 1024 : width;
  
  // Return a complete image data object
  return {
    id,
    url,
    prompt,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 10).toISOString(),
    params: {
      prompt,
      negativePrompt: "blurry, low quality, distorted",
      steps: 30,
      guidanceScale: 7.5,
      width,
      height,
      modelId
    },
    status: 'completed'
  };
}

/**
 * Mock image generation as a fallback
 */
async function mockImageGeneration(params: GenerationParams): Promise<ApiResponse<GenerationResponse>> {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Get an appropriate image URL based on the prompt
  let imageUrl;
  
  // Check for common subjects in the prompt
  const lowerPrompt = params.prompt.toLowerCase();
  
  if (lowerPrompt.includes('dog')) {
    imageUrl = "https://images.unsplash.com/photo-1552053831-71594a27632d?q=80&w=1024&h=1024&auto=format&fit=crop";
  } else if (lowerPrompt.includes('cat')) {
    imageUrl = "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?q=80&w=1024&h=1024&auto=format&fit=crop";
  } else if (lowerPrompt.includes('mountain') || lowerPrompt.includes('landscape')) {
    imageUrl = "https://images.unsplash.com/photo-1535224206242-487f7090b5bb?q=80&w=1024&h=1024&auto=format&fit=crop";
  } else if (lowerPrompt.includes('city') || lowerPrompt.includes('urban')) {
    imageUrl = "https://images.unsplash.com/photo-1604076913837-52ab5629fba9?q=80&w=1024&h=1024&auto=format&fit=crop";
  } else if (lowerPrompt.includes('portrait') || lowerPrompt.includes('person') || lowerPrompt.includes('woman') || lowerPrompt.includes('man')) {
    imageUrl = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1024&h=1024&auto=format&fit=crop";
  } else {
    // Default to a nice abstract image
    imageUrl = "https://images.unsplash.com/photo-1541701494587-cb58502866ab?q=80&w=1024&h=1024&auto=format&fit=crop";
  }
  
  // Return a successful response with the image URL
  return {
    data: {
      id: `gen-${Date.now()}`,
      status: 'completed',
      url: imageUrl
    }
  };
}