"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function NexusSplitAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.15, delayChildren: 0.1 }
      }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: nexusEase } }
  };
  const textReveal = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: nexusEase } }
  };

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
        className="flex flex-col pt-16 @lg:pt-24 pb-16 border-b nexus-border"
    >
        <motion.div variants={itemFadeUp} className="mb-10 px-6 @md:px-12">
            <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_about_title || 'System Core'} field="nexus_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
        </motion.div>

        <motion.div variants={textReveal} className="px-6 @md:px-12 max-w-3xl">
            <div className="font-sans text-base @lg:text-xl text-slate-300 leading-relaxed font-medium">
                <EditableText value={data?.profile?.about || data?.about || "I am a multi-disciplinary creator with a deep focus on building scalable systems and immersive experiences. Let's engineer the future together."} field="about" entity="profile" isEditor={isEditor} as="div" maxLength={1000} />
            </div>
            
            <div className="mt-8 flex gap-6 text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)]">
                <motion.div variants={textReveal} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--hl)] block"></span>
                    <span>Init_Sequence</span>
                </motion.div>
                <motion.div variants={textReveal} className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[var(--hl)] block"></span>
                    <span>Ready</span>
                </motion.div>
            </div>
        </motion.div>
    </motion.section>
  );
}
