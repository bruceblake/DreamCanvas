// AI Art Gallery Service - Curated collection of AI-generated art
// This simulates an API response with high-quality AI art from various models

export interface AIArtImage {
  id: string;
  title: string;
  prompt: string;
  imageUrl: string;
  model: string;
  style: string;
  author: string;
  createdAt: string;
  tags: string[];
  likes: number;
  downloads: number;
}

// Curated collection of high-quality AI art (using royalty-free images)
const AI_ART_COLLECTION: AIArtImage[] = [
  {
    id: '1',
    title: 'Cyberpunk Cityscape',
    prompt: 'futuristic cyberpunk city at night, neon lights, rain reflections, dramatic lighting',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=800&fit=crop',
    model: 'Stable Diffusion XL',
    style: 'Cyberpunk',
    author: 'AI Artist',
    createdAt: '2024-01-15T10:30:00Z',
    tags: ['cyberpunk', 'city', 'neon', 'futuristic'],
    likes: 1247,
    downloads: 89
  },
  {
    id: '2',
    title: 'Abstract Neural Network',
    prompt: 'abstract visualization of neural networks, flowing data streams, digital art',
    imageUrl: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=800&fit=crop',
    model: 'Midjourney',
    style: 'Abstract',
    author: 'Neural_Dreams',
    createdAt: '2024-01-14T15:45:00Z',
    tags: ['abstract', 'neural', 'digital', 'technology'],
    likes: 892,
    downloads: 156
  },
  {
    id: '3',
    title: 'Ethereal Portrait',
    prompt: 'ethereal portrait of a person with flowing hair, soft lighting, dreamy atmosphere',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&h=800&fit=crop',
    model: 'DALL-E 3',
    style: 'Portrait',
    author: 'DreamWeaver',
    createdAt: '2024-01-13T20:15:00Z',
    tags: ['portrait', 'ethereal', 'dreamy', 'artistic'],
    likes: 2103,
    downloads: 234
  },
  {
    id: '4',
    title: 'Cosmic Nebula',
    prompt: 'colorful cosmic nebula with stars, deep space, vibrant colors, astronomical art',
    imageUrl: 'https://images.unsplash.com/photo-1446776653964-20c1d3a81b06?w=800&h=800&fit=crop',
    model: 'Stable Diffusion',
    style: 'Space',
    author: 'CosmicAI',
    createdAt: '2024-01-12T08:20:00Z',
    tags: ['space', 'nebula', 'cosmic', 'astronomy'],
    likes: 1456,
    downloads: 178
  },
  {
    id: '5',
    title: 'Digital Landscape',
    prompt: 'surreal digital landscape with geometric shapes, vivid colors, modern art style',
    imageUrl: 'https://images.unsplash.com/photo-1561736778-92e52a7769ef?w=800&h=800&fit=crop',
    model: 'Midjourney',
    style: 'Landscape',
    author: 'PixelMaster',
    createdAt: '2024-01-11T14:00:00Z',
    tags: ['landscape', 'digital', 'geometric', 'surreal'],
    likes: 756,
    downloads: 92
  },
  {
    id: '6',
    title: 'Watercolor Nature',
    prompt: 'watercolor painting of a forest scene, soft brushstrokes, natural colors',
    imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=800&fit=crop',
    model: 'Stable Diffusion XL',
    style: 'Watercolor',
    author: 'NatureBot',
    createdAt: '2024-01-10T11:30:00Z',
    tags: ['nature', 'watercolor', 'forest', 'painting'],
    likes: 1689,
    downloads: 267
  },
  {
    id: '7',
    title: 'Architectural Marvel',
    prompt: 'modern architectural structure with clean lines, glass and steel, minimalist design',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=800&fit=crop',
    model: 'DALL-E 3',
    style: 'Architecture',
    author: 'ArchitectAI',
    createdAt: '2024-01-09T16:45:00Z',
    tags: ['architecture', 'modern', 'minimalist', 'design'],
    likes: 934,
    downloads: 143
  },
  {
    id: '8',
    title: 'Fantasy Creature',
    prompt: 'mythical dragon in a magical forest, detailed scales, fantasy art style',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=800&fit=crop',
    model: 'Midjourney',
    style: 'Fantasy',
    author: 'MythMaker',
    createdAt: '2024-01-08T13:20:00Z',
    tags: ['fantasy', 'dragon', 'magical', 'creature'],
    likes: 2567,
    downloads: 345
  },
  {
    id: '9',
    title: 'Ocean Depths',
    prompt: 'underwater scene with bioluminescent creatures, deep ocean, mysterious lighting',
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=800&fit=crop',
    model: 'Stable Diffusion',
    style: 'Underwater',
    author: 'OceanDreams',
    createdAt: '2024-01-07T09:15:00Z',
    tags: ['ocean', 'underwater', 'bioluminescent', 'mysterious'],
    likes: 1234,
    downloads: 198
  },
  {
    id: '10',
    title: 'Retro Synthwave',
    prompt: 'retro synthwave aesthetic, neon grids, 80s style, vaporwave colors',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=800&fit=crop',
    model: 'DALL-E 3',
    style: 'Synthwave',
    author: 'RetroBot',
    createdAt: '2024-01-06T18:30:00Z',
    tags: ['synthwave', 'retro', '80s', 'vaporwave'],
    likes: 1890,
    downloads: 276
  },
  // Add more images to simulate a large collection
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `${i + 11}`,
    title: `AI Artwork ${i + 11}`,
    prompt: `creative ai generated artwork ${i + 11}, unique style, artistic vision`,
    imageUrl: `https://picsum.photos/800/800?random=${i + 11}`,
    model: ['Stable Diffusion', 'Midjourney', 'DALL-E 3'][i % 3],
    style: ['Abstract', 'Portrait', 'Landscape', 'Fantasy', 'Digital'][i % 5],
    author: `AIArtist${i + 11}`,
    createdAt: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000).toISOString(),
    tags: ['ai', 'generated', 'art', 'creative'],
    likes: Math.floor(Math.random() * 3000) + 100,
    downloads: Math.floor(Math.random() * 500) + 10
  }))
];

export interface GalleryFilters {
  style?: string;
  model?: string;
  sortBy?: 'newest' | 'oldest' | 'popular' | 'trending';
  search?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const fetchAIArtGallery = async (
  page: number = 1,
  limit: number = 20,
  filters: GalleryFilters = {}
): Promise<PaginatedResponse<AIArtImage>> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 300));

  let filteredImages = [...AI_ART_COLLECTION];

  // Apply filters
  if (filters.style) {
    filteredImages = filteredImages.filter(img => 
      img.style.toLowerCase().includes(filters.style!.toLowerCase())
    );
  }

  if (filters.model) {
    filteredImages = filteredImages.filter(img => 
      img.model.toLowerCase().includes(filters.model!.toLowerCase())
    );
  }

  if (filters.search) {
    const searchTerm = filters.search.toLowerCase();
    filteredImages = filteredImages.filter(img => 
      img.title.toLowerCase().includes(searchTerm) ||
      img.prompt.toLowerCase().includes(searchTerm) ||
      img.tags.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  // Apply sorting
  switch (filters.sortBy) {
    case 'oldest':
      filteredImages.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
      break;
    case 'popular':
      filteredImages.sort((a, b) => b.likes - a.likes);
      break;
    case 'trending':
      filteredImages.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'newest':
    default:
      filteredImages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // Calculate pagination
  const total = filteredImages.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedImages = filteredImages.slice(startIndex, endIndex);

  return {
    data: paginatedImages,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1
    }
  };
};

export const getAIArtById = async (id: string): Promise<AIArtImage | null> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return AI_ART_COLLECTION.find(img => img.id === id) || null;
};

export const getAvailableStyles = (): string[] => {
  return [...new Set(AI_ART_COLLECTION.map(img => img.style))];
};

export const getAvailableModels = (): string[] => {
  return [...new Set(AI_ART_COLLECTION.map(img => img.model))];
};