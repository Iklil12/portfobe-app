"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

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
        <section className="py-20 px-4 w-full flex items-center justify-center">
          <div className="w-full max-w-5xl text-center border-b border-black pb-8">
            <h3 className="text-black font-medium mb-2">Split Video Layout</h3>
            <p className="text-xs text-black/50">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-0 w-full min-h-[80vh] flex flex-col md:flex-row bg-white">
      {/* Left side text */}
      <div className="w-full md:w-1/2 flex flex-col justify-center p-12 md:p-24 border-r border-black/10">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, x: -30 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-black/40 mb-6 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Case Study'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-black mb-8 leading-[1.1]">
            <EditableText value={theme?.customTexts?.showcase_title || 'Visual Focus'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
          </h2>
          
          <div className="mt-8 pt-8 border-t border-black/10">
            <h3 className="text-xl font-bold mb-4">{featuredVideo.title}</h3>
            {featuredVideo.description && (
              <p className="text-black/60 leading-relaxed text-sm max-w-md">{featuredVideo.description}</p>
            )}
          </div>
        </motion.div>
      </div>

      {/* Right side video */}
      <div className="w-full md:w-1/2 relative bg-black min-h-[50vh] md:min-h-full flex items-center justify-center p-4 md:p-12">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.9 },
            visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2, ease: "circOut" } }
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
