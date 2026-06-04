"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { useMidnightEmulsion } from './MidnightEmulsionContext';

export function MidnightEmulsionAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const { setSelectedMedia } = useMidnightEmulsion();
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const awardItems = data?.certificates || data?.user?.certificates || [];

  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  if (!awardItems.length) return null;

  return (
    <div id="awards" className="w-full p-8 @md:p-12 @lg:p-20 flex flex-col border-b border-white/5 bg-[#030508]/80 shrink-0">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4 block">
            <EditableText value={theme?.customTexts?.midnight_awards_top || 'Accolades'} field="midnight_awards_top" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_awards_title || 'Recognitions'} field="midnight_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </motion.div>
        
        <div className="flex flex-col border-t border-white/10">
          {awardItems.map((award: any, i: number) => (
            <motion.div
              key={i}
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
              onClick={() => award.mediaUrl && setSelectedMedia({ url: award.mediaUrl, title: award.title, type: 'certificate' })}
              className="group flex flex-col @md:flex-row @md:items-center justify-between border-b border-white/10 py-8 @md:py-10 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--hl)] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left z-0"></div>
              
              <div className="relative z-10 flex flex-col @md:flex-row @md:items-center gap-4 @md:gap-12 w-full @md:w-3/4 mb-6 @md:mb-0">
                <span className="font-serif text-slate-500 italic text-xl @md:text-2xl w-20 shrink-0">{award.year || new Date(award.createdAt).getFullYear()}</span>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-2xl @md:text-3xl text-white group-hover:text-[var(--hl)] transition-colors">{award.title}</h3>
                  <span className="font-sans text-xs font-medium text-slate-500 uppercase tracking-widest">{award.issuer}</span>
                </div>
              </div>
              
              <div className="relative z-10 flex justify-between items-center w-full @md:w-auto gap-8">
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--hl)] px-4 py-2 rounded-full border border-[var(--hl)]/20 bg-[var(--hl)]/5">
                  {award.status || 'Verified'}
                </span>
                <i className="fas fa-arrow-right -rotate-45 text-slate-500 group-hover:text-[var(--hl)] group-hover:translate-x-2 group-hover:-translate-y-2 transition-all duration-300 text-xl"></i>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
