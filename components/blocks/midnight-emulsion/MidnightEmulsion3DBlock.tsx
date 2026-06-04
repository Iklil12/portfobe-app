"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsion3DBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');
  const radiusClass = theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-xl';

  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  if (!items3D.length) return null;

  return (
    <div className="w-full p-8 @md:p-12 @lg:p-20 flex flex-col gap-16 @lg:gap-24 border-b border-white/5 bg-[#030508]/50 shrink-0">
      <div className="max-w-7xl mx-auto w-full">
        <div className="flex flex-col mb-12">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4">
            <EditableText value={theme?.customTexts?.midnight_3d_top || 'Spatial Division'} field="midnight_3d_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_3d_title || '3D Models'} field="midnight_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </div>
        
        <div className="flex flex-col gap-16 @md:gap-32">
          {items3D.map((p: any, i: number) => {
            const sceneNumber = (i + 1).toString().padStart(2, '0');
            return (
              <motion.div
                key={i}
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className="group flex flex-col w-full relative"
              >
                <div className="flex justify-between items-end mb-8 border-b border-white/10 pb-8">
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-6">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
                        <EditableText value={theme?.customTexts?.midnight_3d_layer || 'Spatial Layer'} field="midnight_3d_layer" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> {sceneNumber}
                      </span>
                      <div className="h-px w-12 bg-white/10"></div>
                    </div>
                    <h2 className="font-serif text-5xl @md:text-8xl text-white group-hover:text-[var(--hl)] transition-colors leading-none tracking-tight">{p.title}</h2>
                  </div>
                  <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-white/10 px-6 py-3 rounded-full hidden @md:block">3D Asset</span>
                </div>
                <div className={`w-full aspect-[4/3] @md:aspect-[21/9] bg-[#0a0f1e] overflow-hidden relative shadow-2xl ${radiusClass} border border-white/5 group-hover:border-[var(--hl)]/30 transition-all duration-700`}>
                  <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0.03)_50%,rgba(255,255,255,0))] bg-[length:100%_4px] z-10 pointer-events-none opacity-20"></div>
                  <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#05070a" />
                  {p.description && (
                    <div className="absolute bottom-8 left-8 right-8 z-20 pointer-events-none">
                      <p className="font-sans text-sm @md:text-base text-slate-400 max-w-xl bg-black/80 backdrop-blur-md p-6 @md:p-8 rounded-2xl border border-white/10 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-700 shadow-2xl">{p.description}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
