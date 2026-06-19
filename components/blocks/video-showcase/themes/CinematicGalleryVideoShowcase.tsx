"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { UniversalPlayer } from '@/components/ui/UniversalPlayer';

export default function CinematicGalleryVideoShowcase({ data, theme, isEditor }: any) {
  const selectedVideoId = theme?.customTexts?.showcase_video_id;
  const isAutoPlay = theme?.customTexts?.showcase_autoplay === 'true';
  const allProjects = data?.projects || data?.user?.projects || [];
  const videoProjects = allProjects.filter((p: any) => p.projectType === 'video');
  const featuredVideo = videoProjects.find((p: any) => p.id === selectedVideoId) || (videoProjects.length > 0 ? videoProjects[0] : null);
  const animationTrigger = isEditor ? "animate" : "whileInView";

  if (!featuredVideo) return null;

  return (
    <section className="py-0 px-0 w-full h-[80vh] bg-black relative overflow-hidden flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none scale-110 blur-xl">
         {/* Background blurred video effect */}
         <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title="bg" autoPlayMode={true} />
      </div>

      <div className="w-full max-w-7xl mx-auto flex flex-col items-center relative z-10 px-8">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
          variants={{ hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { duration: 1.2 } } }}
          className="w-full aspect-video bg-black shadow-2xl relative z-20 pointer-events-auto overflow-hidden border border-white/10"
        >
           {isAutoPlay ? (
             <div className="w-full h-full opacity-90 hover:opacity-100 transition-all pointer-events-auto">
               <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} autoPlayMode={true} />
             </div>
           ) : (
             <UniversalPlayer mediaUrl={featuredVideo.mediaUrl} title={featuredVideo.title} />
           )}
        </motion.div>
        
        <div className="absolute bottom-12 left-12 z-30 pointer-events-none">
          <h2 className="text-4xl font-light text-white tracking-widest drop-shadow-lg">
            <EditableText value={theme?.customTexts?.showcase_title || 'CINEMATIC GALLERY'} field="showcase_title" entity="appearance" isEditor={isEditor} maxLength={40} />
          </h2>
        </div>
      </div>
    </section>
  );
}
