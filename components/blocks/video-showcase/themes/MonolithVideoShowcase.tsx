"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function MonolithVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full bg-[#111] flex items-center justify-center">
          <div className="w-full max-w-5xl rounded-sm bg-[#222] p-12 text-center border-t-4 border-[#ff9e00]">
            <h3 className="text-white/50 font-bold mb-2 uppercase tracking-widest">Monolith Video</h3>
            <p className="text-xs text-white/30">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 md:py-32 w-full bg-[#0d0d0d] relative overflow-hidden">
      <div className="w-full max-w-6xl mx-auto px-4 md:px-8">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
          }}
          className="flex flex-col items-center"
        >
          {/* Top text block */}
          <div className="text-center mb-16 max-w-3xl">
            <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tight text-white mb-6 leading-none">
              <EditableText value={theme?.customTexts?.showcase_title || 'THE MONOLITH'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
            </h2>
            <div className="w-24 h-1 bg-[#ff9e00] mx-auto mb-6" />
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-white/50 block">
              <EditableText value={theme?.customTexts?.showcase_subtitle || 'A/V PRESENTATION'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
            </span>
          </div>

          {/* Video Container (The Monolith) */}
          <div className="w-full aspect-[21/9] md:aspect-video bg-black shadow-[0_30px_60px_rgba(0,0,0,0.8)] border border-white/5 relative z-20 pointer-events-auto overflow-hidden">
             {isAutoPlay ? (
               <div className="w-full h-full opacity-80 hover:opacity-100 transition-all duration-700 pointer-events-auto">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
          </div>

          {/* Bottom text block */}
          <div className="mt-12 text-center max-w-2xl">
            <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">{featuredVideo.title}</h3>
            {featuredVideo.description && (
              <p className="text-white/40 leading-relaxed text-sm font-light">{featuredVideo.description}</p>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
