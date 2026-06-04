"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ObsidianAwardsBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  if (awardItems.length === 0 && !isEditor) return null;
  const displayItems = awardItems.length > 0 ? awardItems : [{ title: 'Best Design Award', issuer: 'Awwwards', year: '2023' }];

  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                    <EditableText value={theme?.customTexts?.obs_awards_label || 'Recognition'} field="obs_awards_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-medium">
                    <EditableText value={theme?.customTexts?.obs_awards_title || 'Awards'} field="obs_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8">
                {displayItems.map((award: any, i: number) => (
                    <motion.div key={i} variants={revealVariants} className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[rgba(255,255,255,0.1)] py-6 group hover:pl-4 transition-all duration-300 cursor-default">
                        <h3 className="font-heading text-xl md:text-2xl font-medium mb-2 sm:mb-0 group-hover-accent transition-colors">{award.title}</h3>
                        <p className="font-body text-[#8a8a93]">{award.issuer} {award.year ? `(${award.year})` : ''}</p>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  );
}
