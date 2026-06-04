"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  const defaultStats = [
    { label: "Scenes Directed", value: "142" },
    { label: "Awards Won", value: "18" },
    { label: "Years Active", value: "12" },
    { label: "Global Clients", value: "50+" }
  ];

  const stats = data?.stats?.length ? data.stats : defaultStats;

  return (
    <div className="w-full flex flex-col py-16 @md:py-24 px-8 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508]">
      <div className="max-w-7xl mx-auto w-full grid grid-cols-2 @md:grid-cols-4 gap-8 @md:gap-12 divide-x divide-white/5">
        {stats.map((stat: any, index: number) => (
          <motion.div 
            key={index}
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
            className={`flex flex-col items-center justify-center text-center ${index === 0 ? '' : 'pl-8 @md:pl-12'}`}
          >
            <span className="font-serif text-5xl @md:text-7xl text-white mb-4 hover:text-[var(--hl)] transition-colors duration-500">
              <EditableText value={theme?.customTexts?.[`midnight_stat_val_${index}`] || stat.value} field={`midnight_stat_val_${index}`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
            </span>
            <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
              <EditableText value={theme?.customTexts?.[`midnight_stat_lbl_${index}`] || stat.label} field={`midnight_stat_lbl_${index}`} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
