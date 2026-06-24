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
    <section className="py-0 w-full flex flex-col bg-black border-y border-white/5">
      {/* Top Section: Title & Description (Full Width - Dark Theme) */}
      <div className="w-full flex flex-col justify-center p-12 @md:p-16 border-b border-white/5">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/40 mb-3 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Case Study'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-4xl @md:text-6xl font-black tracking-tighter text-white mb-6 leading-none">
            <EditableText value={theme?.customTexts?.showcase_title || 'Visual Focus'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
          </h2>
          
          <div className="mt-6 pt-6 border-t border-white/10 flex flex-col gap-2">
            <h3 className="text-lg font-bold text-white">{featuredVideo.title}</h3>
            {featuredVideo.description && (
              <p className="text-white/60 leading-relaxed text-sm max-w-2xl">{featuredVideo.description}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Bottom Section: Video Player Container (Full Width, Centered, Large Aspect) */}
      <div className="w-full bg-black flex items-center justify-center p-6 @md:p-12">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.1, ease: "circOut" } }
          }}
          className="w-full aspect-video shadow-2xl relative pointer-events-auto"
        >
           {isAutoPlay ? (
             <div className="w-full h-full opacity-90 hover:opacity-100 transition-opacity duration-500 pointer-events-auto">
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
             </div>
           ) : (
             <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
           )}
        </motion.div>
      </div>
    </section>
  );
}
