"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function AbsoluteNoirVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-8 w-full bg-[#050505] text-white font-mono flex flex-col items-center justify-center border-t border-b border-white/10">
          <div className="w-full max-w-4xl border border-dashed border-white/20 p-12 text-center">
            <h3 className="text-xl font-bold uppercase tracking-[0.2em] mb-4">[ VIDEO SHOWCASE ]</h3>
            <p className="text-xs text-white/50 tracking-widest uppercase">AWAITING VIDEO SELECTION IN PROPERTIES PANEL</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 px-4 @md:px-12 w-full bg-[#050505] text-white relative border-t border-white/5">
      <div className="w-full max-w-7xl mx-auto flex flex-col">
        
        {/* Absolute Noir Header Style */}
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="flex flex-col @md:flex-row justify-between items-start @md:items-end mb-12 gap-6"
        >
          <div className="flex flex-col">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.3em] text-white/40 mb-3">
              <EditableText value={theme?.customTexts?.showcase_subtitle || 'FEATURED'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={20} className="font-mono" />
            </span>
            <h2 className="text-4xl @md:text-6xl font-black uppercase tracking-tighter leading-none">
              <EditableText value={theme?.customTexts?.showcase_title || 'CINEMATICS'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
            </h2>
          </div>
          
          <div className="text-[10px] font-mono uppercase tracking-widest text-white/30 hidden @md:block text-right">
            [ ID: {featuredVideo.id.split('-')[0]} ]
            <br />
            [ STATUS: ACTIVE ]
          </div>
        </motion.div>

        {/* Absolute Noir Video Player Style (Sharp edges, high contrast) */}
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, filter: 'grayscale(100%) blur(10px)' },
            visible: { opacity: 1, filter: 'grayscale(100%) blur(0px)', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } }
          }}
          whileHover={{ filter: 'grayscale(0%) blur(0px)' }}
          className="relative w-full aspect-video bg-black overflow-hidden group border border-white/10"
        >
          {isAutoPlay ? (
            <div className="w-full h-full opacity-60 group-hover:opacity-100 transition-all duration-700">
              <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
            </div>
          ) : (
            <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
          )}

          {isAutoPlay && (
            <div className="absolute top-4 left-4 font-mono text-[10px] tracking-widest uppercase bg-black/80 px-3 py-1 text-white border border-white/20 pointer-events-none">
              AUTO-PLAY
            </div>
          )}
        </motion.div>

        {/* Video Info Footer */}
        <motion.div 
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { duration: 0.8, delay: 0.4 } }
          }}
          className="mt-6 flex flex-col @md:flex-row justify-between items-start @md:items-center gap-4 pt-6 border-t border-white/10"
        >
          <div>
            <h3 className="text-white text-lg font-bold uppercase tracking-tight">{featuredVideo.title}</h3>
            {featuredVideo.description && (
              <p className="text-white/50 text-xs font-mono uppercase tracking-wider mt-1 line-clamp-1">{featuredVideo.description}</p>
            )}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
