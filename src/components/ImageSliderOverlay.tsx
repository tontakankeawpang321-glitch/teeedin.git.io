import React, { useEffect, useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageSliderOverlayProps {
  isOpen: boolean;
  images: string[];
  initialIndex?: number;
  onClose: () => void;
}

export const ImageSliderOverlay: React.FC<ImageSliderOverlayProps> = ({
  isOpen,
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex, isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, images.length]);

  if (!isOpen || images.length === 0) return null;

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center animate-in fade-in duration-200 select-none">
      
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white/80 hover:text-white w-12 h-12 flex items-center justify-center bg-white/10 rounded-full backdrop-blur-md z-50 transition-all hover:bg-white/20"
        aria-label="ปิดภาพเต็มจอ"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Main Image Viewer */}
      <div className="relative w-full h-full flex items-center justify-center p-4">
        
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 text-white bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full hidden sm:flex items-center justify-center transition-all backdrop-blur-md z-40"
          >
            <ChevronLeft className="w-7 h-7" />
          </button>
        )}

        <img
          src={images[currentIndex]}
          alt={`ภาพที่ดิน ${currentIndex + 1}`}
          className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl transition-transform duration-300"
        />

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 text-white bg-white/10 hover:bg-white/20 w-12 h-12 rounded-full hidden sm:flex items-center justify-center transition-all backdrop-blur-md z-40"
          >
            <ChevronRight className="w-7 h-7" />
          </button>
        )}
      </div>

      {/* Bottom Counter & Navigation (Mobile) */}
      <div className="absolute bottom-6 flex gap-4 items-center z-40">
        {images.length > 1 && (
          <button
            onClick={handlePrev}
            className="text-white w-10 h-10 flex items-center justify-center sm:hidden bg-white/20 rounded-full active:bg-white/30 backdrop-blur"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        <span className="text-white text-xs sm:text-sm bg-black/60 px-4 py-1.5 rounded-full font-mono border border-white/20 backdrop-blur">
          {currentIndex + 1} / {images.length}
        </span>

        {images.length > 1 && (
          <button
            onClick={handleNext}
            className="text-white w-10 h-10 flex items-center justify-center sm:hidden bg-white/20 rounded-full active:bg-white/30 backdrop-blur"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

    </div>
  );
};
