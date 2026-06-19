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
    <div id="about" className="w-full flex flex-col py-24 @md:py-32 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] shrink-0 @container relative overflow-hidden">
      {/* Background Scope Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      <div className="w-full flex flex-col gap-12 relative z-10">
        
        {/* Header Block */}
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col gap-2 select-none">
          <span className="font-mono text-[9px] text-[var(--primary)] uppercase tracking-[0.35em] font-bold">
            <EditableText value={theme?.customTexts?.vf_about_label || 'SEC_01 // INTRO'} field="vf_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
        </motion.div>

        {/* Narrative Title */}
        <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-cinema text-6xl @md:text-8xl @lg:text-9xl text-white leading-[0.85] uppercase tracking-wide">
          <EditableText value={theme?.customTexts?.vf_about_title || 'Framing stories.'} field="vf_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
        </motion.h2>

        {/* Details Grid */}
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-white/10 relative">
          
          {/* Vertical divider line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-white/10 hidden @md:block pointer-events-none"></div>

          {/* Left Column: Description */}
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col gap-4 select-none">
            <span className="font-mono text-[8px] text-slate-500 tracking-widest uppercase">
              [ NARRATIVE PROTOCOL ]
            </span>
            <p className="vf-body text-sm @md:text-base text-[#F3F3F1]/85 leading-relaxed text-justify font-medium">
              <EditableText value={theme?.customTexts?.vf_about_desc || "Operating at the intersection of raw emotion and technical perfection. We build visual systems that communicate narrative intent with absolute clarity."} field="vf_about_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
            </p>
          </motion.div>

          {/* Right Column: HUD Diagnostics stats */}
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col gap-6 vf-hud-text uppercase tracking-widest text-[#F3F3F1]/50 relative group">
            
            {/* Corner viewfinder visual brackets inside stats card */}
            <div className="absolute -inset-4 border border-white/0 group-hover:border-white/5 transition-colors pointer-events-none rounded">
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/20"></div>
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/20"></div>
              <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/20"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/20"></div>
            </div>

            <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group/item hover:border-[var(--primary)]/20 transition-colors duration-300">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest">
                <EditableText value={theme?.customTexts?.vf_lbl_status || '> STATUS_'} field="vf_lbl_status" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
              </span>
              <span className="text-[var(--primary)] font-bold text-xs @md:text-sm tracking-widest">
                <EditableText value={theme?.customTexts?.vf_about_status || 'AVAILABLE FOR DEPLOYMENT'} field="vf_about_status" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
              </span>
            </div>
            
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group/item hover:border-[var(--primary)]/20 transition-colors duration-300">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest">
                <EditableText value={theme?.customTexts?.vf_lbl_system || '> PRIMARY_SYSTEM_'} field="vf_lbl_system" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
              </span>
              <span className="text-white font-bold text-xs @md:text-sm tracking-widest">
                <EditableText value={theme?.customTexts?.vf_about_system || 'ARRI ALEXA MINI LF'} field="vf_about_system" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
              </span>
            </div>
            
            <div className="flex flex-col gap-1 border-b border-white/5 pb-4 group/item hover:border-[var(--primary)]/20 transition-colors duration-300">
              <span className="text-[9px] text-slate-500 font-mono tracking-widest">
                <EditableText value={theme?.customTexts?.vf_lbl_base || '> BASE_OF_OPS_'} field="vf_lbl_base" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
              </span>
              <span className="text-white font-bold text-xs @md:text-sm tracking-widest">
                <EditableText value={theme?.customTexts?.vf_about_base || 'GLOBAL'} field="vf_about_base" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
              </span>
            </div>

          </motion.div>
        </div>
      </div>
    </div>
  );
}
