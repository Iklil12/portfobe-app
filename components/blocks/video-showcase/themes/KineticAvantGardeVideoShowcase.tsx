"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function KineticAvantGardeVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 w-full bg-[#f4f4f4] text-black relative overflow-hidden flex flex-col md:flex-row items-center justify-center border-b-8 border-black">
      <div className="w-full md:w-1/4 px-8 mb-12 md:mb-0">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, x: -50 }, visible: { opacity: 1, x: 0, transition: { duration: 0.6 } } }}
        >
          <h2 className="text-6xl md:text-8xl font-black uppercase tracking-tighter leading-none break-words">
            <EditableText value={theme?.customTexts?.showcase_title || 'KINETIC PLAY'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </motion.div>
      </div>

      <div className="w-full md:w-3/4 px-4 md:px-12 relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, scale: 0.9, rotate: -3 }, visible: { opacity: 1, scale: 1, rotate: 0, transition: { type: "spring" } } }}
          className="w-full aspect-video bg-black relative z-20 pointer-events-auto border-[12px] border-black shadow-[20px_20px_0px_0px_#ff0055]"
        >
           {isAutoPlay ? (
             <div className="w-full h-full pointer-events-auto">
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
