"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function KineticAvantGardeVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 md:py-32 w-full kag-bg-void relative overflow-hidden flex flex-col md:flex-row items-center justify-center border-b-[12px] kag-border-bone">
      
      {/* Brutalist Grid Background (Light grid for dark background) */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)', backgroundSize: 'clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)' }}></div>

      {/* Crosshairs & Borders */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 kag-border-bone opacity-30 pointer-events-none"></div>
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 kag-border-bone opacity-30 pointer-events-none"></div>

      {/* Background Marquee Text */}
      <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[200vw] -rotate-3 z-0 pointer-events-none select-none opacity-5">
        <div className="kag-marquee">
          <div className="kag-marquee-item font-kag-brutal text-[30vw] leading-none kag-text-bone uppercase whitespace-nowrap">
            SHOWCASE RECORDING SYS SHOWCASE RECORDING SYS
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col xl:flex-row items-center gap-16 relative z-10">
        
        {/* Title Section */}
        <div className="w-full xl:w-1/3 flex flex-col relative z-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 kag-bg-blood rounded-full animate-pulse"></div>
            <span className="font-kag-mono text-xs uppercase tracking-widest kag-text-bone opacity-70">[REC] MEDIA_STREAM</span>
          </div>
          
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
            variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
          >
            <h2 className="font-kag-brutal text-[clamp(4rem,10vw,8rem)] uppercase leading-[0.85] break-words kag-text-bone mix-blend-difference">
              <EditableText value={theme?.customTexts?.showcase_title || 'KINETIC\nPLAY'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
            </h2>
          </motion.div>
          
          <div className="mt-8 pt-8 border-t border-white/20 hidden xl:block">
            <p className="font-kag-mono text-sm kag-text-bone opacity-50 max-w-xs leading-relaxed uppercase">
              System active. Direct video feed pipeline initiated.
            </p>
          </div>
        </div>

        {/* Video Player Section */}
        <div className="w-full xl:w-2/3 relative z-10 group perspective-1000">
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
            variants={{ hidden: { opacity: 0, scale: 0.9, rotateX: 10, rotateY: -10 }, visible: { opacity: 1, scale: 1, rotateX: 0, rotateY: 0, transition: { type: "spring", bounce: 0.4, duration: 1 } } }}
            className="w-full relative pointer-events-auto"
          >
            {/* The Solid Brutalist Shadow Block */}
            <div className="absolute top-4 md:top-8 left-4 md:left-8 w-full h-full kag-bg-blood -z-10 border-2 border-transparent transition-transform duration-500 group-hover:translate-x-2 group-hover:translate-y-2"></div>
            
            {/* The Video Container */}
            <div className="w-full aspect-video bg-[#0a0a0a] border-[4px] md:border-[8px] kag-border-bone relative overflow-hidden transform transition-transform duration-500 group-hover:-translate-x-2 group-hover:-translate-y-2">
              {/* Corner Screws/Dots */}
              <div className="absolute top-2 left-2 w-2 h-2 rounded-full kag-bg-bone opacity-50 pointer-events-none z-30"></div>
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full kag-bg-bone opacity-50 pointer-events-none z-30"></div>
              <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full kag-bg-bone opacity-50 pointer-events-none z-30"></div>
              <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full kag-bg-bone opacity-50 pointer-events-none z-30"></div>

              {isAutoPlay ? (
                <div className="w-full h-full pointer-events-auto relative z-20">
                  <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
                </div>
              ) : (
                <div className="w-full h-full relative z-20">
                  <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
                </div>
              )}
            </div>
          </motion.div>
          
          {/* Aesthetic Video Caption */}
          <div className="absolute -bottom-8 right-0 font-kag-mono text-xs kag-text-bone opacity-50 uppercase tracking-widest hidden md:block mix-blend-difference z-20">
            FRAME: {featuredVideo.id.substring(0,8)} // 1080P_HD
          </div>
        </div>
      </div>
    </section>
  );
}
