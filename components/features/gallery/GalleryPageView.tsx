"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { LazyImage } from '@/components/ui/LazyImage';
import { getVideoThumbnail } from '@/lib/videoUtils';

interface GalleryPageViewProps {
  projects: any[];
  subdomain: string;
  galleryTemplate?: string;
}

const premiumEase = [0.16, 1, 0.3, 1] as const;

// Asymmetrical Grid Pattern Generator (Editorial)
const getEditorialClass = (index: number) => {
  const pattern = index % 7;
  switch (pattern) {
    case 0: return 'md:col-span-12 aspect-[16/9] md:aspect-[21/9]';
    case 1: return 'md:col-span-5 aspect-[4/5]';
    case 2: return 'md:col-span-7 aspect-[16/9] md:aspect-auto';
    case 3: return 'md:col-span-4 aspect-square';
    case 4: return 'md:col-span-4 aspect-square';
    case 5: return 'md:col-span-4 aspect-square';
    case 6: return 'md:col-span-8 md:col-start-3 aspect-[16/9]';
    default: return 'md:col-span-6 aspect-video';
  }
};

// Standard Grid Pattern Generator
const getGridClass = (index: number) => {
  return 'md:col-span-4 aspect-square'; // 3 columns square
};

// Masonry Pattern Generator
const getMasonryClass = (index: number) => {
  const heights = ['aspect-[3/4]', 'aspect-[4/3]', 'aspect-[3/5]', 'aspect-square'];
  return `md:col-span-4 ${heights[index % heights.length]}`; 
};

export default function GalleryPageView({ projects, subdomain, galleryTemplate = 'editorial' }: GalleryPageViewProps) {
  const router = useRouter();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    if (window.history.length > 2) {
      router.back();
    } else {
      router.push(`/${subdomain}`);
    }
  };

  const getLayoutClass = (index: number) => {
    if (galleryTemplate === 'masonry') return getMasonryClass(index);
    if (galleryTemplate === 'grid') return getGridClass(index);
    return getEditorialClass(index);
  };

  return (
    <main className="min-h-screen bg-[#030303] text-[#F3F3F3] selection:bg-[#F3F3F3] selection:text-[#030303] overflow-x-hidden">
      
      {/* NOISE OVERLAY - Subtler for premium feel */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-[0.25] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" style={{ mixBlendMode: 'overlay' }}></div>

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-8 md:px-12 flex items-center justify-between mix-blend-difference pointer-events-none">
        <button 
          onClick={handleBack}
          className="group flex items-center gap-4 text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.2em] hover:text-white/70 transition-colors cursor-pointer appearance-none bg-transparent border-none p-0 outline-none pointer-events-auto"
        >
          <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="hidden md:inline-block">Back to Portfolio</span>
        </button>
        <div className="text-[10px] md:text-xs font-sans font-bold uppercase tracking-[0.4em] text-white/50 pointer-events-auto">
          EXHIBITION.SYS
        </div>
      </nav>

      {/* HERO SECTION - Editorial Style */}
      <section className="pt-48 pb-24 px-6 md:px-12 lg:px-24 relative z-10 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: premiumEase }}
          className="max-w-4xl w-full flex flex-col items-center"
        >
          <span className="text-[10px] md:text-xs font-mono text-white/50 uppercase tracking-[0.3em] mb-8 block">
            [ 01 ] Selected Works
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif italic font-light tracking-tight leading-[1.1] mb-12">
            Curated Visual <br/>
            <span className="font-sans font-black not-italic uppercase tracking-tighter text-6xl md:text-8xl lg:text-9xl">Narratives.</span>
          </h1>
          
          <div className="flex items-center gap-12 text-left">
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Creator</p>
              <p className="text-sm md:text-base font-medium">{subdomain}</p>
            </div>
            <div className="w-px h-8 bg-white/20"></div>
            <div>
              <p className="text-[10px] font-mono text-white/40 uppercase tracking-widest mb-1">Total Assets</p>
              <p className="text-sm md:text-base font-medium">{projects.length} Masterpieces</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* GRID */}
      <section className="px-6 md:px-12 lg:px-24 pb-40 relative z-10">
        {projects.length === 0 ? (
          <div className="w-full py-40 flex flex-col items-center justify-center text-center border border-white/5 rounded-none bg-white/[0.01]">
            <p className="text-white/30 font-mono uppercase tracking-[0.3em] text-xs animate-pulse">The exhibition is currently empty.</p>
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, ease: premiumEase, delay: 0.2 }}
            className={`grid grid-cols-1 md:grid-cols-12 ${galleryTemplate === 'masonry' ? 'gap-4 md:gap-6' : 'gap-4 md:gap-8'} auto-rows-min items-start`}
          >
            {projects.map((project, index) => {
              const isVideo = project.projectType === 'video';
              const thumbnailUrl = isVideo ? getVideoThumbnail(project.mediaUrl) : project.mediaUrl;
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ 
                    duration: 0.8, 
                    ease: premiumEase,
                    delay: (index % 3) * 0.1 
                  }}
                  onClick={() => router.push(`/${subdomain}/project/${project.id}`)}
                  className={`group relative flex flex-col cursor-pointer ${getLayoutClass(index)}`}
                >
                  <div className="w-full h-full relative overflow-hidden bg-[#111] rounded-sm group-hover:rounded-xl transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
                    <LazyImage 
                      src={thumbnailUrl} 
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-[1.5s] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
                    />
                    
                    {/* Glassmorphism Hover Overlay */}
                    <div className="absolute inset-0 bg-black/20 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col justify-between p-6 md:p-8">
                      <div className="flex justify-between items-start w-full transform -translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                        <span className="text-[9px] md:text-[10px] font-mono uppercase tracking-[0.2em] px-3 py-1.5 border border-white/20 rounded-full bg-black/40 backdrop-blur-md">
                          {isVideo ? 'Video' : 'Static'}
                        </span>
                        <div className="w-12 h-12 rounded-full bg-[#F3F3F3] text-black flex items-center justify-center shadow-2xl">
                          {isVideo ? <i className="fas fa-play text-sm ml-1" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                      </div>
                      
                      <div className="w-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700 delay-75">
                        <h3 className="text-2xl md:text-4xl font-serif italic tracking-tight mb-2">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-white/70 text-xs md:text-sm font-sans font-medium line-clamp-2 max-w-md">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </section>
    </main>
  );
}