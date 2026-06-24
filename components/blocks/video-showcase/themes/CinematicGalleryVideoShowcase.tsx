"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function CinematicGalleryVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
      {/* Vignette Shadow Theater Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
      
      {/* Ambient Lens Flare Glow */}
      <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
      <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

      {/* Cinematic Header Area */}
      <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
          [ SECTION 03 // VISUAL SHOWCASE ]
        </div>
        <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
          <EditableText 
            value={theme?.customTexts?.showcase_title || 'Sorotan Karya'} 
            field="showcase_title" 
            entity="appearance" 
            isEditor={isEditor} 
            maxLength={40} 
            as="span"
          />
        </h2>
      </div>

      {/* Video Container Wrapper */}
      <div className="w-full max-w-5xl mx-auto z-10 mt-[16vh] md:mt-[20vh] pointer-events-auto flex items-center justify-center px-4 md:px-0">
        <div className="relative w-full aspect-video border border-white/10 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">
          {/* Corner Viewfinder brackets on Hover */}
          <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500 ease-out z-20">
            <div className="absolute top-4 left-4 w-4 h-4 border-t border-l border-white/50"></div>
            <div className="absolute top-4 right-4 w-4 h-4 border-t border-r border-white/50"></div>
            <div className="absolute bottom-4 left-4 w-4 h-4 border-b border-l border-white/50"></div>
            <div className="absolute bottom-4 right-4 w-4 h-4 border-b border-r border-white/50"></div>
          </div>

          {/* Background blurred video effect */}
          <div className="absolute inset-0 w-full h-full opacity-10 scale-105 blur-lg pointer-events-none z-0">
            <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title="bg" autoPlayMode={true} />
          </div>

          {/* Main Player */}
          <div className="relative w-full h-full z-10">
            {isAutoPlay ? (
              <div className="w-full h-full opacity-90 hover:opacity-100 transition-all pointer-events-auto">
                <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
              </div>
            ) : (
              <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
