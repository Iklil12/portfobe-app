import React, { useState } from 'react';

export const LazyImage = ({ src, alt, className }: { src: string, alt: string, className?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-[-1] rounded-inherit"></div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`
          ${className || ''} 
          ${!className?.includes('absolute') && !className?.includes('fixed') ? 'relative' : ''} 
          ${!className?.includes('z-') ? 'z-0' : ''} 
          transition-all duration-700 ease-in-out
          ${isLoaded ? 'opacity-100 blur-0' : 'opacity-0 blur-sm scale-105'}
        `}
      />
    </>
  );
};
