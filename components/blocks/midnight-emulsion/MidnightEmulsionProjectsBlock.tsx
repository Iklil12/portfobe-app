"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';
import { getVideoThumbnail } from '@/lib/videoUtils';
import { useMidnightEmulsion } from './MidnightEmulsionContext';

export function MidnightEmulsionProjectsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const { setSelectedMedia } = useMidnightEmulsion();
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
  const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  if (!archiveItems.length) return null;

  return (
    <div className="w-full bg-[#05070a] flex flex-col border-b border-white/5">
      <div className="hidden @lg:flex h-32 items-center justify-center border-b border-white/5 shrink-0">
        <span className="font-serif italic text-slate-600 text-sm tracking-widest">
          <EditableText value={theme?.customTexts?.midnight_scroll || 'Scroll to explore'} field="midnight_scroll" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
        </span>
      </div>

      <div className="max-w-7xl mx-auto w-full p-8 @md:p-12 @lg:p-20 flex flex-col gap-24 @lg:gap-40 shrink-0">
        {archiveItems.map((p: any, i: number) => {
          const isVideo = p.projectType === 'video';
          const sceneNumber = (i + 1).toString().padStart(2, '0');
          return (
            <motion.div
              key={i}
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
              onClick={() => {
                if (isVideo || p.projectType === 'photo') {
                  setSelectedMedia({ url: p.mediaUrl, title: p.title, type: p.projectType });
                } else if (p.mediaUrl) {
                  window.open(p.mediaUrl, '_blank');
                }
              }}
              className="group flex flex-col w-full relative cursor-pointer"
            >
              <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-6">
                <div className="flex flex-col">
                  <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2">
                    <EditableText value={theme?.customTexts?.midnight_scene_label || 'Scene'} field="midnight_scene_label" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /> {sceneNumber}
                  </span>
                  <h2 className="font-serif text-3xl @md:text-5xl text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h2>
                </div>
                <span className="font-sans text-xs font-medium text-slate-500 hidden @md:block uppercase tracking-widest">{p.projectType}</span>
              </div>
              <div className={`w-full aspect-video @md:aspect-[21/9] bg-[#0a0f1e] overflow-hidden relative shadow-2xl ${radiusClass}`}>
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.03)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] z-10 pointer-events-none opacity-20"></div>
                <LazyImage src={isVideo ? getVideoThumbnail(p.mediaUrl) : p.mediaUrl} alt={p.title} className="w-full h-full object-cover grayscale-[80%] opacity-60 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-1000 ease-out" />
                {isVideo && (
                  <div className="absolute inset-0 flex items-center justify-center z-20">
                    <div className="w-24 h-24 rounded-full border border-white/20 bg-black/40 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:border-[var(--hl)] group-hover:bg-[var(--hl)]/20 transition-all duration-700">
                      <i className="fas fa-play text-white text-2xl ml-1"></i>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-8 ml-auto w-full @md:w-3/4 @lg:w-2/3">
                <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed text-right">{p.description || 'Visual exploration and structural design implementation.'}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
