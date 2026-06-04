"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
  const fullName = data?.profile?.fullName || data?.fullName || "Director Name";
  
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-24 @md:py-32 px-8 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508]">
      <div className="max-w-4xl w-full flex flex-col gap-8">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex items-center gap-4 mb-4">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)]">
            <EditableText value={theme?.customTexts?.midnight_about_label || 'Director\'s Note'} field="midnight_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
          <div className="h-px w-20 bg-white/10"></div>
        </motion.div>
        
        <motion.h2 initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="font-serif text-3xl @md:text-5xl @lg:text-6xl text-white leading-[1.2] uppercase tracking-wide">
          <EditableText value={theme?.customTexts?.midnight_about_title || 'Crafting structural narratives in a digital void.'} field="midnight_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />
        </motion.h2>

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-12 mt-12 pt-12 border-t border-white/10">
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}>
             <p className="font-sans text-sm @md:text-base text-slate-400 leading-relaxed">
              <EditableText value={theme?.customTexts?.midnight_about_desc || "A creative director focused on pushing the boundaries of visual storytelling. We blend narrative depth with structural design."} field="midnight_about_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
             </p>
          </motion.div>
          <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col gap-6 font-sans text-xs uppercase tracking-widest text-slate-500">
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span><EditableText value={theme?.customTexts?.midnight_lbl_origin || 'Origin'} field="midnight_lbl_origin" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></span>
              <span className="text-white"><EditableText value={theme?.customTexts?.midnight_about_loc || 'Jakarta, ID'} field="midnight_about_loc" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span><EditableText value={theme?.customTexts?.midnight_lbl_est || 'Est.'} field="midnight_lbl_est" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></span>
              <span className="text-white"><EditableText value={theme?.customTexts?.midnight_about_est || '2015'} field="midnight_about_est" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /></span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-4">
              <span><EditableText value={theme?.customTexts?.midnight_lbl_principal || 'Principal'} field="midnight_lbl_principal" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></span>
              <span className="text-[var(--hl)]"><EditableText value={fullName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={20} /></span>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
