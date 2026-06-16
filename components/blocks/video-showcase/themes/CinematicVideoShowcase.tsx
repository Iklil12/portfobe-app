"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function CinematicVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full bg-[#0a0a0a] flex items-center justify-center">
          <div className="text-center p-8 border border-dashed border-white/20 rounded-xl">
            <h3 className="text-white/50 font-serif mb-2">Cinematic Showcase</h3>
            <p className="text-xs text-white/30">Select a video project in the properties panel</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 md:py-32 w-full bg-[#050505] text-white relative overflow-hidden">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-5xl opacity-30 blur-[100px] pointer-events-none">
        <div className="w-full h-full bg-gradient-to-tr from-black via-white/20 to-black rounded-full" />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col relative z-10 px-4 md:px-12">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="mb-12"
        >
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-white/50 mb-4 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Premiere'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-serif italic tracking-tight font-light text-white">
            <EditableText value={theme?.customTexts?.showcase_title || 'Cinematic Vision'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={50} />
          </h2>
        </motion.div>

        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, filter: 'blur(20px)' },
            visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
          }}
          className="w-full relative overflow-hidden shadow-2xl bg-black rounded-sm border border-white/5 group"
        >
          <div className="aspect-video w-full">
            {isAutoPlay ? (
              <div className="w-full h-full opacity-80 group-hover:opacity-100 transition-all duration-700">
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
            visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } }
          }}
          className="mt-8 flex flex-col md:flex-row justify-between items-start gap-6 border-t border-white/10 pt-8"
        >
          <h3 className="text-2xl font-serif italic text-white/90">{featuredVideo.title}</h3>
          {featuredVideo.description && (
            <p className="text-white/50 leading-relaxed text-sm max-w-xl font-light">{featuredVideo.description}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
