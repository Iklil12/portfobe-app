"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function AcidVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  const rawThemeColor = theme?.themeColor || "#00ff00";
  const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full bg-black flex items-center justify-center border border-[var(--tc)]/30 border-dashed text-[var(--tc)] font-mono" style={{ '--tc': themeColor } as React.CSSProperties}>
          <div className="text-center p-8 bg-zinc-950 border border-[var(--tc)]/20">
            <h3 className="font-bold uppercase text-lg mb-2">[ VIDEO_SHOWCASE_MODULE ]</h3>
            <p className="text-[10px] uppercase tracking-widest text-[var(--tc)]/50">Select a video project in the editor</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 w-full bg-[#000000] text-white border-y border-[var(--tc)]/20 relative overflow-hidden z-10 font-mono" style={{ '--tc': themeColor } as React.CSSProperties}>
      {/* Subtle Cyber Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, ${themeColor} 1px, transparent 1px),
            linear-gradient(to bottom, ${themeColor} 1px, transparent 1px)
          `,
          backgroundSize: '32px 32px'
        }}
      />
      
      <div className="w-full max-w-[90rem] mx-auto px-6 md:px-16 flex flex-col relative z-20">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
          }}
          className="mb-12 flex flex-col items-center text-center"
        >
          <span className="inline-block px-3 py-1 border border-[var(--tc)] bg-[var(--tc)]/5 text-[var(--tc)] font-bold text-[10px] uppercase tracking-widest mb-4">
            [ <EditableText value={theme?.customTexts?.showcase_subtitle || 'ACID.VISION'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={20} /> ]
          </span>
          <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-none">
            <EditableText value={theme?.customTexts?.showcase_title || 'CYBER REEL'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </motion.div>

        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, scale: 0.98 },
            visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } }
          }}
          className="w-full border border-[var(--tc)] bg-zinc-950 p-2 md:p-3 relative z-30 pointer-events-auto shadow-[0_0_25px_rgba(0,255,0,0.02)]"
        >
          {/* Simulated monitor frame header */}
          <div className="bg-black border border-zinc-900 px-3 py-2 flex justify-between items-center text-[9px] text-[var(--tc)] mb-2 uppercase tracking-wider font-mono">
            <span>[ SYSTEM_STREAM // CH: 01 ]</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-red-600 rounded-full animate-pulse"></span>
              <span>PLAYING_RAW</span>
            </div>
          </div>

          <div className="aspect-video w-full border border-zinc-900 bg-black pointer-events-auto relative z-40">
             {isAutoPlay ? (
               <div className="w-full h-full pointer-events-auto mix-blend-luminosity hover:mix-blend-normal transition-all duration-300">
                 <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
               </div>
             ) : (
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
             )}
          </div>

          <div className="mt-2 bg-black text-[var(--tc)] p-4 font-mono uppercase tracking-widest text-xs flex justify-between items-center border border-zinc-900">
            <span className="font-bold truncate max-w-[75%]">&gt; SOURCE: {featuredVideo.title}</span>
            <span className="text-[9px] border border-[var(--tc)]/50 bg-[var(--tc)]/5 px-2 py-0.5 font-bold uppercase tracking-wider shrink-0">[ SYS.OK ]</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
