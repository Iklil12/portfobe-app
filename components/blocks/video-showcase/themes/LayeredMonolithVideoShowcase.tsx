"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function LayeredMonolithVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 md:px-12 w-full bg-[#fafafa] relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
          className="text-center mb-16 relative z-30"
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-gray-400 mb-4 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Layered Media'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-4xl md:text-6xl font-serif text-[#222]">
            <EditableText value={theme?.customTexts?.showcase_title || 'Visual Layers'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </motion.div>

        {/* Layered Effect */}
        <div className="relative w-full aspect-video z-20">
          <div className="absolute -inset-4 bg-gray-200/50 transform rotate-1 scale-105 rounded-xl -z-10" />
          <div className="absolute -inset-2 bg-gray-300/50 transform -rotate-1 scale-105 rounded-xl -z-10" />
          <div className="w-full h-full bg-black shadow-2xl relative z-20 pointer-events-auto rounded-lg overflow-hidden border border-black/10">
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
