"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function MinimalistVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full bg-gray-50 flex items-center justify-center">
          <div className="text-center p-8 border border-dashed border-gray-300 rounded-xl">
            <h3 className="text-gray-500 font-semibold mb-2">Video Showcase</h3>
            <p className="text-xs text-gray-400">Select a video project in the properties panel</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 px-6 md:px-12 w-full bg-white text-black">
      <div className="w-full max-w-5xl mx-auto flex flex-col items-center">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="text-center mb-12"
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Featured Video'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-3xl md:text-5xl font-black tracking-tight">
            <EditableText value={theme?.customTexts?.showcase_title || 'Visual Presentation'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
          </h2>
        </motion.div>

        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.95 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.8, delay: 0.2 } }
          }}
          className="w-full relative rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.1)] bg-black border border-gray-100"
        >
          <div className="aspect-video w-full">
             {isAutoPlay ? (
               <div className="w-full h-full opacity-90">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
          </div>
        </motion.div>

        <motion.div 
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.6, delay: 0.4 } }
          }}
          className="mt-8 text-center max-w-2xl"
        >
          <h3 className="text-xl font-bold mb-2">{featuredVideo.title}</h3>
          {featuredVideo.description && (
            <p className="text-gray-500 leading-relaxed text-sm">{featuredVideo.description}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
