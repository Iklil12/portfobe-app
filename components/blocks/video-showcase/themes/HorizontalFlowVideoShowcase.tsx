"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function HorizontalFlowVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 md:py-32 w-full bg-transparent overflow-hidden relative border-t border-white/5">
      <div className="w-full max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-12 md:gap-20 px-6 md:px-12">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } } }}
          className="md:w-1/3 flex flex-col items-start"
        >
          <div className="w-12 h-1 bg-accent mb-8" />
          <h2 className="font-display text-5xl md:text-[5.5rem] font-bold uppercase tracking-tight text-white mb-6 leading-[0.85]">
            <EditableText 
              value={theme?.customTexts?.showcase_title || 'Director\'s\nCut'} 
              field="showcase_title" 
              entity="appearance" 
              isEditor={isEditor} 
              maxLength={40} 
              as="div" 
              className="whitespace-pre-line" 
            />
          </h2>
          <p className="text-textMuted font-mono text-xs leading-relaxed uppercase tracking-[0.2em]">{featuredVideo.title}</p>
        </motion.div>

        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.2 } } }}
          className="md:w-2/3 w-full"
        >
          <div className="w-full aspect-video bg-[#050505] relative z-20 pointer-events-auto overflow-hidden border border-white/10 group">
             <div className="absolute inset-0 border border-white/5 pointer-events-none z-30 transition-colors duration-500 group-hover:border-accent/50"></div>
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto relative z-20">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <div className="w-full h-full pointer-events-auto relative z-20">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
               </div>
             )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
