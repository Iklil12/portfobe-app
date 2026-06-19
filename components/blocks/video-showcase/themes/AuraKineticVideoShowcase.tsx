"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function AuraKineticVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 w-full bg-transparent relative overflow-hidden">
      {/* Animated Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--hl)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.8 } } }}
          className="w-full aspect-video bg-white/[0.03] backdrop-blur-3xl shadow-[0_30px_60px_rgba(0,0,0,0.4)] relative z-20 pointer-events-auto rounded-[2rem] overflow-hidden border border-white/10 p-4"
        >
           <div className="w-full h-full rounded-[1.5rem] overflow-hidden bg-black relative">
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
           </div>
        </motion.div>
        
        <div className="mt-8 text-center">
          <h2 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 tracking-tighter">
            <EditableText value={theme?.customTexts?.showcase_title || 'AURA KINETIC'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </div>
      </div>
    </section>
  );
}
