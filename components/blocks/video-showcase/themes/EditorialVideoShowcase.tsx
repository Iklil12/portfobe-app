"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function EditorialVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full bg-[#f4f4f0] flex items-center justify-center border-y border-black">
          <div className="text-center p-8">
            <h3 className="text-black font-serif italic text-2xl mb-2">Editorial Video</h3>
            <p className="text-xs font-mono uppercase tracking-widest text-black/50">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-12 w-full bg-[#f4f4f0] text-black border-y border-black">
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-12 items-start">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.8 } }
          }}
          className="md:w-1/3 pt-4 border-t-2 border-black"
        >
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-black/50 mb-6 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'The Daily Feature'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-5xl md:text-7xl font-serif italic tracking-tight text-black mb-6 leading-[0.9]">
            <EditableText value={theme?.customTexts?.showcase_title || 'Visual Essay'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
          </h2>
          {featuredVideo.description && (
            <p className="text-black/70 leading-relaxed font-serif text-lg first-letter:text-5xl first-letter:font-bold first-letter:mr-1 first-letter:float-left">{featuredVideo.description}</p>
          )}
          <div className="mt-8 pt-8 border-t border-black/20">
            <h3 className="font-bold text-sm uppercase tracking-widest">{featuredVideo.title}</h3>
          </div>
        </motion.div>

        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.98 },
            visible: { opacity: 1, scale: 1, transition: { duration: 1, delay: 0.2 } }
          }}
          className="md:w-2/3 w-full bg-black p-2 border border-black shadow-2xl relative z-20 pointer-events-auto"
        >
          <div className="aspect-video w-full relative pointer-events-auto">
             {isAutoPlay ? (
               <div className="w-full h-full opacity-90 hover:opacity-100 transition-all pointer-events-auto">
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
