"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function MidnightEmulsionVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-8 @md:px-12 @lg:px-20 w-full bg-[#030508] border-b border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-60">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[var(--hl)] opacity-5 rounded-full blur-[100px]" />
      </div>
      <div className="w-full max-w-5xl mx-auto flex flex-col relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, filter: 'blur(10px)' }, visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1 } } }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif italic text-white mb-2 uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.showcase_title || 'Midnight Vision'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)]">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Emulsion'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
        </motion.div>
 
        <div className="w-full aspect-video bg-black shadow-2xl relative z-20 pointer-events-auto rounded-xl overflow-hidden border border-white/10 hover:border-[var(--hl)]/50 transition-colors duration-500">
           {isAutoPlay ? (
             <div className="w-full h-full opacity-80 hover:opacity-100 transition-all pointer-events-auto mix-blend-screen">
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
             </div>
           ) : (
             <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
           )}
        </div>
      </div>
    </section>
  );
}
