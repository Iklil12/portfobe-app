"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function ViewfinderVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  // Dynamic Timecode
  const [timecode, setTimecode] = useState("00:00:00:00");
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      const s = String(now.getSeconds()).padStart(2, '0');
      const f = String(Math.floor(now.getMilliseconds() / 40)).padStart(2, '0');
      setTimecode(`${h}:${m}:${s}:${f}`);
    }, 40);
    return () => clearInterval(interval);
  }, []);

  if (!featuredVideo) return null;

  return (
    <section id="showcase" className="w-full py-24 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] relative @container overflow-hidden">
      {/* Background HUD Scope Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />
      <div className="vf-scanline"></div>

      <div className="w-full relative z-10">
        
        {/* Header Title - Lens Spec Hud */}
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16 select-none border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-[8px] text-slate-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
              <span>SHOWCASE MONITOR // SOURCE_01</span>
            </div>
            <h2 className="font-cinema text-5xl @md:text-7xl text-white uppercase tracking-widest leading-none mt-2">
              <EditableText value={theme?.customTexts?.showcase_title || 'FEATURED WORK'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
            </h2>
          </div>
          <div className="font-mono text-[8px] text-slate-500 uppercase tracking-[0.2em] flex flex-col gap-1 items-start md:items-end">
            <span>DISP // ANAMORPHIC_2.39:1</span>
            <span className="text-[var(--primary)] font-bold">GRID ACTIVE // 92%</span>
          </div>
        </div>

        {/* Video Frame */}
        <motion.div 
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
          className="w-full relative border border-white/10 p-2 bg-black/40 backdrop-blur-md rounded-sm"
        >
          {/* Viewfinder Crop Corners */}
          <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-[var(--primary)] pointer-events-none z-30" />
          <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-[var(--primary)] pointer-events-none z-30" />
          <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-[var(--primary)] pointer-events-none z-30" />
          <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-[var(--primary)] pointer-events-none z-30" />
          
          {/* REC indicator */}
          <div className="absolute top-6 left-12 flex items-center gap-2 pointer-events-none z-30 font-mono text-[9px] uppercase tracking-widest text-[#F3F3F1]/85">
            <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></span>
            <span className="font-bold text-red-500">REC</span>
            <span className="opacity-40">|</span>
            <span className="opacity-60">{timecode}</span>
          </div>

          {/* Lens focus/coordinate display */}
          <div className="absolute top-6 right-12 hidden @sm:flex items-center gap-4 pointer-events-none z-30 font-mono text-[8px] text-[#F3F3F1]/45 uppercase tracking-widest">
            <span>F/2.8</span>
            <span>ISO 800</span>
            <span>24FPS</span>
            <span className="text-[var(--primary)] font-bold">[ LOCKED ]</span>
          </div>

          <div className="w-full aspect-video bg-black relative z-20 pointer-events-auto overflow-hidden">
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
          </div>
        </motion.div>
        
      </div>
    </section>
  );
}
