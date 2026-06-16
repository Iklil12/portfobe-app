"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function NexusNoirVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 w-full bg-[#050505] relative overflow-hidden">
      {/* Cyberpunk Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />
      
      <div className="w-full max-w-6xl mx-auto flex flex-col items-center relative z-10">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}
          className="w-full"
        >
          <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-4">
            <h2 className="text-3xl font-mono uppercase tracking-widest text-white">
              <EditableText value={theme?.customTexts?.showcase_title || 'NEXUS.CORE'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
            </h2>
            <span className="text-xs font-mono text-white/40 bg-white/5 px-3 py-1">SYS.ONLINE</span>
          </div>

          <div className="w-full aspect-video bg-black relative z-20 pointer-events-auto border border-white/20 shadow-[0_0_30px_rgba(255,255,255,0.05)]">
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto grayscale hover:grayscale-0 transition-all duration-700">
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
