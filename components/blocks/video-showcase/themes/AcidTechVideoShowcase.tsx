"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function AcidTechVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 w-full bg-[#00ffcc] relative overflow-hidden text-black font-mono border-y-8 border-black">
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#000_2px,transparent_2px)] [background-size:16px_16px] pointer-events-none" />
      <div className="w-full max-w-6xl mx-auto flex flex-col relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } } }}
          className="w-full bg-white border-4 border-black p-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
        >
          <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-4">
            <h2 className="text-3xl font-black uppercase tracking-widest bg-black text-[#00ffcc] px-4 py-1">
              <EditableText value={theme?.customTexts?.showcase_title || 'TECH.AV'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
            </h2>
            <div className="flex gap-2">
              <div className="w-4 h-4 bg-black rounded-full" />
              <div className="w-4 h-4 border-2 border-black rounded-full" />
            </div>
          </div>

          <div className="w-full aspect-video bg-black relative z-20 pointer-events-auto border-4 border-black">
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
