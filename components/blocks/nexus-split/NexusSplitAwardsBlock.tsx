"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function NexusSplitAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const awardItems = data?.certificates || data?.user?.certificates || [];

  if (awardItems.length === 0) return null;

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: nexusEase } }
  };
  const rowVariants = {
      hidden: { opacity: 0, x: -20, filter: 'blur(5px)' },
      visible: { opacity: 1, x: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: nexusEase } }
  };

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        id="awards" className="flex flex-col pt-16 @lg:pt-24 pb-16 border-b nexus-border"
    >
        <motion.div variants={itemFadeUp} className={`mb-10 px-6 @md:px-12`}>
            <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_awards_title || 'Recognition'} field="nexus_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
        </motion.div>

        <div className="flex flex-col w-full">
            {awardItems.map((award: any, i: number) => (
                <motion.a 
                    href={award.mediaUrl || '#'} target="_blank" rel="noreferrer" key={i}
                    variants={rowVariants}
                    className={`w-full border-t nexus-border flex flex-col @md:flex-row @md:items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors px-6 py-6 gap-4 @md:px-12 @md:py-8`}
                >
                    <div className={`flex flex-col gap-1 @md:items-center @md:gap-10 @md:w-1/2`}>
                        <span className="font-sans font-medium text-slate-500 group-hover:text-white transition-colors w-12">
                            {award.year || new Date(award.createdAt).getFullYear()}
                        </span>
                        <h3 className="font-display font-bold text-xl @lg:text-2xl text-white group-hover:text-[var(--hl)] transition-colors">
                            {award.title}
                        </h3>
                    </div>
                    
                    <div className={`flex justify-between items-center w-full mt-2 @md:w-1/2 @md:justify-end @md:gap-12`}>
                        <div className="flex flex-col">
                            <span className="font-sans text-[10px] font-bold uppercase tracking-widest text-slate-500">
                                <EditableText value={theme?.customTexts?.nexus_awards_issuer || 'Issuer'} field="nexus_awards_issuer" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                            </span>
                            <span className="font-sans text-sm font-medium text-slate-300">{award.issuer}</span>
                        </div>
                        <i className="fas fa-external-link-alt text-slate-600 group-hover:text-white transition-colors"></i>
                    </div>
                </motion.a>
            ))}
        </div>
    </motion.section>
  );
}
