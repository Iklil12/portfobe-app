"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { UniversalPlayer } from '@/shared/ui/UniversalPlayer';

export default function BentogridVideoShowcase({ data, theme, isEditor }: any) {
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
          <div className="w-full max-w-5xl rounded-3xl bg-zinc-100 p-12 text-center border-2 border-dashed border-zinc-300">
            <h3 className="text-zinc-500 font-bold mb-2">Video Showcase Module</h3>
            <p className="text-xs text-zinc-400">Select a video project in the properties panel</p>
          </div>
        </section>
      );
    }
    return null;
  }

  return (
    <section className="py-12 px-4 w-full relative">
      <div className="w-full max-w-7xl mx-auto">
        <motion.div
          initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
          }}
          className="bg-[#121214] rounded-[2rem] md:rounded-[3rem] p-6 md:p-10 shadow-2xl border border-white/5"
        >
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/3 flex flex-col justify-center">
              <span className="inline-block px-4 py-2 bg-white/5 text-white border border-white/10 rounded-full text-xs font-bold uppercase tracking-widest w-max mb-6">
                <EditableText value={theme?.customTexts?.showcase_subtitle || 'Featured'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={20} />
              </span>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight mb-4 text-white">
                <EditableText value={theme?.customTexts?.showcase_title || 'Video Showcase'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
              </h2>
              {featuredVideo.description && (
                <p className="text-slate-400 font-medium leading-relaxed mb-6">{featuredVideo.description}</p>
              )}
              <h3 className="text-lg font-bold text-white">{featuredVideo.title}</h3>
            </div>
 
            <div className="lg:w-2/3">
              <div className="w-full rounded-[1.5rem] overflow-hidden shadow-xl bg-black border border-white/10">
                <div className="aspect-video w-full">
                  {isAutoPlay ? (
                    <div className="w-full h-full">
                      <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
                    </div>
                  ) : (
                    <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
