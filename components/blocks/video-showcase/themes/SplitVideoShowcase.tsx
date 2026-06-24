"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function SplitVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full flex items-center justify-center bg-neutral-900 border-y border-white/5">
          <div className="w-full text-center pb-8">
            <h3 className="text-white font-medium mb-2">Split Video Layout</h3>
            <p className="text-xs text-white/50">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="w-full flex flex-col bg-[#050505] border-y border-white/5 relative overflow-hidden">
      {/* Top Section: Text Content */}
      <div className="w-full flex flex-col justify-center p-8 md:p-12 lg:p-16 border-b border-white/5 relative z-10">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          <div className="flex items-center gap-4 mb-8">
            <span className="w-12 h-[1px] bg-white/20"></span>
            <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-white/40">
              <EditableText value={theme?.customTexts?.showcase_subtitle || 'Visual Archive'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
            </span>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-[0.9] -ml-1">
            <EditableText value={theme?.customTexts?.showcase_title || 'Showcase'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
          </h2>
          
          <div className="mt-8 flex flex-col gap-2">
            <h3 className="text-xl font-medium tracking-wide text-white/90">{featuredVideo.title}</h3>
            {featuredVideo.description && (
              <p className="text-white/50 leading-relaxed text-sm max-w-xl">{featuredVideo.description}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Video Player */}
      <div className="w-full bg-[#0a0a0a] flex items-center justify-center p-4 md:p-12 relative overflow-hidden group">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.98 },
            visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2, ease: "easeOut" } }
          }}
          className="w-full aspect-video shadow-2xl relative pointer-events-auto border border-white/5 bg-black"
        >
           {isAutoPlay ? (
             <div className="w-full h-full flex items-center justify-center opacity-80 hover:opacity-100 transition-opacity duration-700 pointer-events-auto">
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
             </div>
           ) : (
             <div className="w-full h-full flex items-center justify-center">
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             </div>
           )}
        </motion.div>
      </div>
    </section>
  );
}
