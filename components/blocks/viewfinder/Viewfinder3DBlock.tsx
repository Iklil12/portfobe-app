"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function Viewfinder3DBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');

  if (!items3D.length) return null;

  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-2xl' : 'rounded-md';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111] shadow-[0_30px_60px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#050505] border border-[#222] hover:border-[#444]';

  return (
    <section className="relative z-20 py-24 bg-[#050505] border-y border-white/10 overflow-hidden shrink-0">
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={fadeUpVariants}
            className="flex flex-col gap-6 justify-between items-start mb-16 px-6 @md:px-12 pointer-events-auto"
        >
            <h2 className="font-cinema tracking-wide text-[#F3F3F1] text-6xl @md:text-7xl uppercase">
                <EditableText value={theme?.customTexts?.vf_3d_title || '3D MODELS'} field="vf_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /> <span style={{ color: 'var(--primary)' }}>.</span>
            </h2>
        </motion.div>
        
        <div className="flex flex-col gap-24 @md:gap-32 px-6 @md:px-12">
            {items3D.map((p: any, idx: number) => (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, filter: "blur(5px)" }}
                    whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 1.2, delay: (idx % 3) * 0.1, ease: cinematicEase }}
                    key={idx}
                    className="relative block w-full group max-w-7xl mx-auto"
                >
                    <div className={`w-full aspect-video overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative shadow-[0_0_100px_rgba(0,0,0,0.5)]`}>
                        <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                        {/* HUD Overlay for Cinematic Feel */}
                        <div className="absolute top-6 left-6 @md:top-8 @md:left-8 flex flex-col gap-2 pointer-events-none z-20">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                                <span className="font-cinema text-[10px] @md:text-sm tracking-[0.4em] text-white opacity-40 uppercase">
                                    <EditableText value={theme?.customTexts?.vf_3d_rendering || 'Rendering Asset_'} field="vf_3d_rendering" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />{idx+1}
                                </span>
                            </div>
                        </div>
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/10 transition-colors duration-700 pointer-events-none"></div>
                    </div>
                    <div className="mt-8 flex flex-col @md:flex-row justify-between items-start @md:items-end gap-6">
                        <div className="flex flex-col gap-2 flex-1">
                            <h3 className="font-cinema tracking-wide text-[#F3F3F1] text-5xl @md:text-8xl group-hover:text-[var(--primary)] transition-colors duration-500 leading-none">
                                {p.title}
                            </h3>
                            {p.description && <p className="vf-hud-text text-xs @md:text-sm opacity-40 max-w-xl mt-4 leading-relaxed uppercase tracking-widest">{p.description}</p>}
                        </div>
                        <div className="flex flex-col items-start @md:items-end gap-2 shrink-0">
                            <p className="uppercase tracking-[0.5em] vf-hud-text text-[10px] opacity-60 font-bold" style={{ color: 'var(--primary)' }}>
                                <EditableText value={theme?.customTexts?.vf_3d_metadata || 'Cine_Asset_Metadata'} field="vf_3d_metadata" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </p>
                            <div className="h-px w-24 bg-[var(--primary)] opacity-20 mt-1"></div>
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </section>
  );
}
