import React, { useEffect, useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '@/store';
import { fetchImages, setSelectedImage } from '@/store/slices/imagesSlice';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Heart, Eye, Share2, Trash2, Edit2 } from 'lucide-react';
import { cn, formatDate, formatFileSize } from '@/lib/utils';
import { useInView } from 'react-intersection-observer';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { GeneratedImage } from '@/types/api';

interface ImageGalleryProps {
  userId?: string;
  showActions?: boolean;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ userId, showActions = true }) => {
  const dispatch = useAppDispatch();
  const { images, isLoading, hasMore, page, filters } = useAppSelector((state) => state.images);
  const { user } = useAppSelector((state) => state.auth);
  const [selectedForDeletion, setSelectedForDeletion] = React.useState<GeneratedImage | null>(null);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '100px',
  });

  // Load more images when scrolling to bottom
  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      dispatch(fetchImages({ page, filters }));
    }
  }, [inView, hasMore, isLoading, page, filters, dispatch]);

  // Initial load
  useEffect(() => {
    if (images.length === 0) {
      dispatch(fetchImages({ page: 1, filters }));
    }
  }, []);

  const handleImageClick = (image: GeneratedImage) => {
    dispatch(setSelectedImage(image));
  };

  const handleDownload = async (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      const response = await fetch(image.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dreamcanvas-${image.id}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  const handleShare = async (image: GeneratedImage, e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Check out my AI-generated image!',
          text: image.prompt,
          url: window.location.origin + `/image/${image.id}`,
        });
      } catch (error) {
        console.error('Share failed:', error);
      }
    }
  };

  if (images.length === 0 && !isLoading) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          No images yet
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          Start creating amazing images with AI!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {images.map((image, index) => (
            <motion.div
              key={image.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              onClick={() => handleImageClick(image)}
              className="cursor-pointer"
            >
              <Card variant="elevated" className="overflow-hidden group p-0">
                <div className="relative aspect-square">
                  <img
                    src={image.url}
                    alt={image.prompt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <p className="text-white text-sm font-medium line-clamp-2">
                        {image.prompt}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-white/80 text-xs">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {image.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="h-3 w-3" />
                          {image.likes}
                        </span>
                        <span>{formatDate(image.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  {showActions && (
                    <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={(e) => handleDownload(image, e)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        title="Download"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleShare(image, e)}
                        className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        title="Share"
                      >
                        <Share2 className="h-4 w-4" />
                      </button>
                      {user?.uid === image.userId && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedForDeletion(image);
                          }}
                          className="p-2 bg-white/90 dark:bg-gray-800/90 rounded-lg shadow-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </button>
                      )}
                    </div>
                  )}
                </div>

                {/* Style badge */}
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-1 bg-white/90 dark:bg-gray-800/90 rounded-lg text-xs font-medium shadow-lg">
                    {image.parameters.style}
                  </span>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Load more trigger */}
      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center mt-8">
          {isLoading && <Spinner size="lg" label="Loading more images..." />}
        </div>
      )}

      {/* Delete confirmation dialog */}
      <Dialog open={!!selectedForDeletion} onOpenChange={() => setSelectedForDeletion(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Image</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this image? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedForDeletion && (
            <div className="my-4">
              <img
                src={selectedForDeletion.url}
                alt={selectedForDeletion.prompt}
                className="w-full max-h-48 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
                {selectedForDeletion.prompt}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setSelectedForDeletion(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                // Handle deletion
                setSelectedForDeletion(null);
              }}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};