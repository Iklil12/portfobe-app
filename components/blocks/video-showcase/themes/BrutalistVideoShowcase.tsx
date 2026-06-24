"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function BrutalistVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';

  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);

  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) {
    if (isEditor) {
      return (
        <section className="py-20 px-4 w-full flex items-center justify-center bg-[var(--hl)]">
          <div className="w-full max-w-5xl bg-white p-12 text-center border-4 border-black border-dashed shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h3 className="text-black font-black uppercase text-2xl mb-2">Video Area</h3>
            <p className="text-xs font-bold uppercase tracking-widest text-black/50">Select a video project</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-24 px-4 md:px-12 w-full border-t-4 border-b-4 border-black relative bg-[#fff]">
      <div className="absolute top-0 right-0 p-4 font-black uppercase text-[10px] tracking-[0.3em] bg-black text-white">
        A/V MODULE
      </div>

      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, x: -20 },
            visible: { opacity: 1, x: 0, transition: { duration: 0.4 } }
          }}
          className="mb-12 flex flex-col items-start"
        >
          <span className="inline-block px-4 py-2 bg-black text-white font-black text-xs uppercase tracking-widest border-2 border-black mb-4">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'MEDIA'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={20} />
          </span>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-black leading-none bg-[var(--hl)] px-4 py-2 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] -rotate-1">
            <EditableText value={theme?.customTexts?.showcase_title || 'RAW FOOTAGE'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.2 } }
            }}
            className="w-full lg:w-3/4 border-4 border-black bg-black p-2 shadow-[12px_12px_0px_0px_var(--hl)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[16px_16px_0px_0px_var(--hl)] transition-all duration-200 relative z-10 cursor-pointer"
          >
            <div className="aspect-video w-full border-2 border-white/20">
               {isAutoPlay ? (
                 <div className="w-full h-full">
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
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0, transition: { duration: 0.5, delay: 0.4 } }
            }}
            className="lg:w-1/4 flex flex-col justify-end"
          >
            <div className="border-4 border-black p-6 bg-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 cursor-pointer">
              <h3 className="text-xl font-black uppercase mb-4 text-black underline decoration-4 decoration-[var(--hl)] underline-offset-4">{featuredVideo.title}</h3>
              {featuredVideo.description && (
                <p className="text-black font-medium leading-relaxed">{featuredVideo.description}</p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
