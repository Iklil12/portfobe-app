import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export const LazyImage = ({ src, alt, className, sizes, fallbackSrc }: { src: string, alt: string, className?: string, sizes?: string, fallbackSrc?: string }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState(src);

  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <>
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-200 animate-pulse z-[-1] rounded-inherit"></div>
      )}
      <Image
        src={imgSrc}
        alt={alt}
        width={0}
        height={0}
        sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
        unoptimized={
          imgSrc.includes('b-cdn.net') || 
          imgSrc.includes('bunnycdn') || 
          imgSrc.includes('mediadelivery.net') || 
          imgSrc.includes('cloudinary.com') || 
          imgSrc.includes('unsplash.com')
        }
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          setImgSrc(fallbackSrc || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop");
          setIsLoaded(true);
        }}
        className={`
          ${className || ''} 
          ${!className?.includes('absolute') && !className?.includes('fixed') ? 'relative' : ''} 
          ${!className?.includes('z-') ? 'z-0' : ''} 
          transition-opacity duration-500 ease-in-out
          ${isLoaded ? 'opacity-100' : 'opacity-0'}
        `}
        style={{ 
          objectFit: className?.includes('object-cover') ? 'cover' : className?.includes('object-contain') ? 'contain' : 'inherit',
          width: className?.match(/\bw-\d+/) || className?.includes('w-full') || className?.includes('w-screen') ? undefined : '100%',
          height: className?.match(/\bh-\d+/) || className?.includes('h-full') || className?.includes('h-screen') ? undefined : 'auto',
        }}
      />
    </>
  );
};
