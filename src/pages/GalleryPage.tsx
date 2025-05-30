import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, TrendingUp, Clock, Grid, ChevronLeft, ChevronRight, Heart, Download, Eye } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Card, CardContent } from '@/components/ui/Card';
import { fetchAIArtGallery, getAvailableStyles, getAvailableModels, AIArtImage, GalleryFilters } from '@/services/aiArtGallery';

const GalleryPage: React.FC = () => {
  const [images, setImages] = useState<AIArtImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<GalleryFilters>({
    sortBy: 'newest',
    style: 'all',
    model: 'all'
  });

  const availableStyles = getAvailableStyles();
  const availableModels = getAvailableModels();

  const loadImages = async (page: number = 1, newFilters: GalleryFilters = filters) => {
    setLoading(true);
    try {
      const response = await fetchAIArtGallery(page, 20, newFilters);
      setImages(response.data);
      setCurrentPage(response.pagination.page);
      setTotalPages(response.pagination.totalPages);
      setHasNext(response.pagination.hasNext);
      setHasPrev(response.pagination.hasPrev);
    } catch (error) {
      console.error('Failed to load images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadImages(1, filters);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const newFilters = { ...filters, search: searchTerm };
    setFilters(newFilters);
    loadImages(1, newFilters);
  };

  const handleFilterChange = (key: keyof GalleryFilters, value: string) => {
    const newFilters = { ...filters, [key]: value === 'all' ? undefined : value };
    setFilters({ ...filters, [key]: value });
    loadImages(1, newFilters);
  };

  const handlePageChange = (page: number) => {
    loadImages(page, filters);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                AI Art Gallery
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Explore a curated collection of AI-generated artwork from various models and styles
            </p>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                {/* Search */}
                <form onSubmit={handleSearch} className="flex-1 min-w-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Search artworks, styles, or prompts..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4"
                    />
                  </div>
                </form>

                {/* Filters */}
                <div className="flex gap-4 items-center">
                  <Select
                    value={filters.sortBy || 'newest'}
                    onValueChange={(value) => handleFilterChange('sortBy', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Newest
                        </div>
                      </SelectItem>
                      <SelectItem value="oldest">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Oldest
                        </div>
                      </SelectItem>
                      <SelectItem value="popular">
                        <div className="flex items-center gap-2">
                          <Heart className="h-4 w-4" />
                          Most Liked
                        </div>
                      </SelectItem>
                      <SelectItem value="trending">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4" />
                          Trending
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.style || 'all'}
                    onValueChange={(value) => handleFilterChange('style', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Styles</SelectItem>
                      {availableStyles.map(style => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={filters.model || 'all'}
                    onValueChange={(value) => handleFilterChange('model', value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="AI Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Models</SelectItem>
                      {availableModels.map(model => (
                        <SelectItem key={model} value={model}>
                          {model}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          )}

          {/* Gallery Grid */}
          {!loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8"
            >
              {images.map((image, index) => (
                <motion.div
                  key={image.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={image.imageUrl}
                        alt={image.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                      
                      {/* Overlay Info */}
                      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-3 text-white">
                          <h3 className="font-semibold text-sm mb-1 truncate">{image.title}</h3>
                          <p className="text-xs text-gray-300 mb-2 line-clamp-2">{image.prompt}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="px-2 py-1 bg-blue-600 rounded-full">{image.model}</span>
                            <span className="px-2 py-1 bg-purple-600 rounded-full">{image.style}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Card Info */}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm truncate">{image.title}</h3>
                        <span className="text-xs text-gray-500">{formatDate(image.createdAt)}</span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Heart className="h-3 w-3" />
                            {image.likes}
                          </span>
                          <span className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {image.downloads}
                          </span>
                        </div>
                        <span className="text-blue-600 dark:text-blue-400 font-medium">
                          {image.author}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && images.length === 0 && (
            <div className="text-center py-20">
              <Grid className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">
                No artworks found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms or filters
              </p>
            </div>
          )}

          {/* Pagination */}
          {!loading && images.length > 0 && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex items-center justify-center gap-2"
            >
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrev}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2 mx-4">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = Math.max(1, currentPage - 2) + i;
                  if (pageNum > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className="w-10 h-10"
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNext}
                className="flex items-center gap-2"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default GalleryPage;