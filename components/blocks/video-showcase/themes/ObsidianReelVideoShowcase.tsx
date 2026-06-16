"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function ObsidianReelVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-24 px-4 w-full bg-[#0a0a0a] border-t border-b border-white/10 relative overflow-hidden">
      {/* Film Reel Border Effect */}
      <div className="absolute top-0 left-0 w-full h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-full h-8 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIGZpbGw9IiMzMzMiLz48L3N2Zz4=')] opacity-50"></div>

      <div className="w-full max-w-5xl mx-auto flex flex-col items-center mt-6 mb-6">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8 } } }}
          className="text-center mb-12"
        >
          <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.3em] mb-4 block">
            <EditableText value={theme?.customTexts?.showcase_subtitle || 'Obsidian Reel'} field="showcase_subtitle" entity="appearance" isEditor={isEditor} maxLength={30} />
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter">
            <EditableText value={theme?.customTexts?.showcase_title || 'Dark Matter'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </motion.div>

        <div className="w-full aspect-video bg-black shadow-2xl relative z-20 pointer-events-auto rounded-md overflow-hidden border border-white/20 ring-4 ring-black">
           {isAutoPlay ? (
             <div className="w-full h-full opacity-70 hover:opacity-100 transition-all pointer-events-auto">
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
             </div>
           ) : (
             <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
           )}
        </div>
      </div>
    </section>
  );
}
