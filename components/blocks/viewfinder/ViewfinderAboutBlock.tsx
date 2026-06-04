"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderAboutBlock({ theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  return (
    <div className="w-full flex flex-col py-24 @md:py-32 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] shrink-0">
      <div className="max-w-4xl w-full mx-auto flex flex-col gap-12">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col gap-4 mb-4">
          <span className="vf-hud-text uppercase tracking-[0.3em] text-[var(--primary)] font-bold">
            <EditableText value={theme?.customTexts?.vf_about_label || '[ DIRECTOR\'S BRIEF ]'} field="vf_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <div className="h-px w-full bg-[linear-gradient(90deg,var(--primary),transparent)]"></div>
        </motion.div>
        
        <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-cinema text-5xl @md:text-7xl @lg:text-8xl text-white leading-[0.9] uppercase tracking-wide">
          <EditableText value={theme?.customTexts?.vf_about_title || 'Executing vision through precise framing.'} field="vf_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
        </motion.h2>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-white/10 relative">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/10 hidden @md:block"></div>
          
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}>
             <p className="vf-body text-sm @md:text-base text-[#F3F3F1]/70 leading-relaxed text-justify">
              <EditableText value={theme?.customTexts?.vf_about_desc || "Operating at the intersection of raw emotion and technical perfection. We build visual systems that communicate narrative intent with absolute clarity."} field="vf_about_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
             </p>
          </motion.div>
          
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col gap-6 vf-hud-text uppercase tracking-widest text-[#F3F3F1]/50">
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span><EditableText value={theme?.customTexts?.vf_lbl_status || '> STATUS_'} field="vf_lbl_status" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></span>
              <span className="text-[var(--primary)]"><EditableText value={theme?.customTexts?.vf_about_status || 'AVAILABLE FOR DEPLOYMENT'} field="vf_about_status" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span><EditableText value={theme?.customTexts?.vf_lbl_system || '> PRIMARY_SYSTEM_'} field="vf_lbl_system" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
              <span className="text-white"><EditableText value={theme?.customTexts?.vf_about_system || 'ARRI ALEXA MINI LF'} field="vf_about_system" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
            </div>
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
              <span><EditableText value={theme?.customTexts?.vf_lbl_base || '> BASE_OF_OPS_'} field="vf_lbl_base" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
              <span className="text-white"><EditableText value={theme?.customTexts?.vf_about_base || 'GLOBAL'} field="vf_about_base" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
