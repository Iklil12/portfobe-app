"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function AcidVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full bg-[#f0f] flex items-center justify-center border-4 border-black border-dashed">
          <div className="text-center p-8 bg-black text-[#0f0]">
            <h3 className="font-black uppercase text-2xl mb-2">ACID VIDEO</h3>
            <p className="text-xs uppercase tracking-widest text-[#0f0]/50">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-12 w-full bg-[#fff] text-black border-4 border-black relative overflow-hidden z-10">
      <div className="absolute top-0 left-0 w-full h-full bg-[#0ff] mix-blend-difference pointer-events-none" />
      
      <div className="w-full max-w-7xl mx-auto flex flex-col relative z-20">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, rotate: -2 },
            visible: { opacity: 1, rotate: 0, transition: { type: 'spring', bounce: 0.6 } }
          }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <span className="inline-block px-4 py-2 bg-[#f0f] text-white font-black text-xs uppercase tracking-widest border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-6 transform -rotate-2">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'ACID.VISION'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={20} />
          </span>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-[#0f0] leading-none bg-black px-6 py-4 shadow-[8px_8px_0px_0px_rgba(255,0,255,1)] transform rotate-1">
            <EditableText value={theme?.customTexts?.showcase_title || 'CYBER REEL'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </motion.div>

        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.9, rotate: 2 },
            visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: 'spring', bounce: 0.5 } }
          }}
          className="w-full border-8 border-black bg-[#f0f] p-4 shadow-[16px_16px_0px_0px_rgba(0,255,255,1)] relative z-30 pointer-events-auto"
        >
          <div className="aspect-video w-full border-4 border-black bg-black pointer-events-auto relative z-40">
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto mix-blend-luminosity hover:mix-blend-normal transition-all duration-300">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
          </div>
          <div className="mt-4 bg-black text-[#0f0] p-4 font-mono uppercase tracking-widest text-sm flex justify-between items-center">
            <span className="font-bold truncate max-w-[70%]">{featuredVideo.title}</span>
            <span className="text-[10px] bg-[#f0f] text-white px-2 py-1">SYS.PLAY</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
