"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function HorizontalFlowVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-0 w-full bg-[#fcfcfc] overflow-hidden">
      <div className="w-full flex flex-col md:flex-row items-center gap-12">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
          className="md:w-1/3 px-8 md:px-16"
        >
          <h2 className="text-4xl md:text-5xl font-light text-black mb-4">
            <EditableText value={theme?.customTexts?.showcase_title || 'Flow State'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
          <div className="w-12 h-px bg-black mb-4" />
          <p className="text-gray-500 font-light text-sm leading-relaxed">{featuredVideo.title}</p>
        </motion.div>

        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, x: 50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8 } } }}
          className="md:w-2/3 w-[110%] -mr-[10%] pr-4 md:pr-0"
        >
          <div className="w-full aspect-video bg-black shadow-2xl relative z-20 pointer-events-auto rounded-l-3xl overflow-hidden border-y border-l border-black/10">
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
