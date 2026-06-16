"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function SpatialVideoShowcase({ data, theme, isEditor }: any) {
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
          <div className="w-full max-w-5xl rounded-3xl bg-white/5 backdrop-blur-xl p-12 text-center border border-white/10">
            <h3 className="text-white/50 font-bold mb-2">Spatial Video Showcase</h3>
            <p className="text-xs text-white/30">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-12 w-full relative z-10">
      {/* Floating Orbs */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-6xl mx-auto">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 40 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="bg-white/5 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-12 border border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative overflow-hidden"
        >
          {/* Glass Reflection */}
          <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          <div className="text-center mb-10">
            <span className="inline-block px-4 py-1.5 bg-white/10 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] mb-4">
              <EditableText value={theme?.customTexts?.showcase_subtitle || 'Spatial Showcase'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
            </span>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-4">
              <EditableText value={theme?.customTexts?.showcase_title || 'Immersive Video'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
            </h2>
            <h3 className="text-lg text-white/80">{featuredVideo.title}</h3>
          </div>

          <div className="w-full rounded-3xl overflow-hidden bg-black/50 border border-white/10 shadow-2xl relative">
            <div className="aspect-video w-full">
               {isAutoPlay ? (
                 <div className="w-full h-full opacity-90">
                   <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
                 </div>
               ) : (
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
               )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
