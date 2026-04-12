import { useState } from 'react';
import { AlertCircle } from 'lucide-react';

interface PostImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  containerClassName?: string;
}

export default function PostImage({ src, alt, className = '', containerClassName = '' }: PostImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (!src || hasError) {
    return (
      <div className={`${containerClassName} bg-black/50 flex items-center justify-center`}>
        <div className="flex flex-col items-center gap-2 text-neon-magenta">
          <AlertCircle className="w-8 h-8" />
          <span className="font-space-mono text-xs text-center">IMAGE UNAVAILABLE</span>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      {isLoading && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <div className="w-4 h-4 border-2 border-neon-cyan border-t-neon-magenta rounded-full animate-spin" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </div>
  );
}
