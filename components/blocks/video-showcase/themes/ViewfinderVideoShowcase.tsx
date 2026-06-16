"use client";
import React from 'react';
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

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 w-full bg-[#e5e5e5] relative">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
          className="w-full relative"
        >
          {/* Viewfinder UI Elements */}
          <div className="absolute -top-6 -left-6 w-12 h-12 border-t-4 border-l-4 border-black pointer-events-none" />
          <div className="absolute -top-6 -right-6 w-12 h-12 border-t-4 border-r-4 border-black pointer-events-none" />
          <div className="absolute -bottom-6 -left-6 w-12 h-12 border-b-4 border-l-4 border-black pointer-events-none" />
          <div className="absolute -bottom-6 -right-6 w-12 h-12 border-b-4 border-r-4 border-black pointer-events-none" />
          
          <div className="absolute top-4 left-0 w-full flex justify-center pointer-events-none z-30">
            <div className="bg-red-500 w-3 h-3 rounded-full animate-pulse" />
            <span className="ml-2 text-[10px] font-mono text-white font-bold">REC</span>
          </div>

          <div className="w-full aspect-video bg-black shadow-xl relative z-20 pointer-events-auto border-2 border-black">
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
          </div>
        </motion.div>
        
        <div className="mt-12 text-center">
          <h2 className="text-3xl font-black uppercase tracking-widest text-black">
            <EditableText value={theme?.customTexts?.showcase_title || 'VIEWFINDER'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </div>
      </div>
    </section>
  );
}
