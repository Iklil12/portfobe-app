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
    <section className="py-24 px-4 w-full bg-[#1a1a2e] relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#16213e] to-[#0f3460] opacity-50 mix-blend-multiply pointer-events-none" />
      <div className="w-full max-w-5xl mx-auto flex flex-col relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, filter: 'blur(10px)' }, visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1 } } }}
          className="mb-10 text-center"
        >
          <h2 className="text-4xl md:text-5xl font-serif italic text-[#e94560] mb-2">
            <EditableText value={theme?.customTexts?.showcase_title || 'Midnight Vision'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
          <span className="text-xs font-mono text-[#e94560]/70 tracking-widest uppercase">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Emulsion'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
        </motion.div>

        <div className="w-full aspect-video bg-black shadow-[0_20px_50px_rgba(233,69,96,0.2)] relative z-20 pointer-events-auto rounded-xl overflow-hidden border border-[#e94560]/30">
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
