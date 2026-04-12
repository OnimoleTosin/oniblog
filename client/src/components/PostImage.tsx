import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { getPlaceholderImageUrl } from '@/utils/imageUtils';

interface PostImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function PostImage({ src, alt, className = '', containerClassName = '' }: PostImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(src);

  const handleImageError = () => {
    setIsLoading(false);
    // Try placeholder service as fallback
    if (imageUrl === src) {
      const placeholderUrl = getPlaceholderImageUrl(alt);
      setImageUrl(placeholderUrl);
    } else {
      // If placeholder also fails, show error state
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`${containerClassName} bg-gradient-to-br from-black/80 via-purple-900/40 to-black/80 flex items-center justify-center border border-neon-cyan/30`}>
        <div className="flex flex-col items-center gap-2 text-neon-magenta">
          <AlertCircle className="w-8 h-8" />
          <span className="font-space-mono text-xs text-center">IMAGE UNAVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${containerClassName} relative bg-black/50`}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-10">
          <div className="w-4 h-4 border-2 border-neon-cyan border-t-neon-magenta rounded-full animate-spin" />
        </div>
      )}
      <img
        src={imageUrl || ''}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={handleImageError}
      />
    </div>
  );
}
