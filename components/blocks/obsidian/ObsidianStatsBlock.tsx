"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ObsidianStatsBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

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
    <section id="stats" className="py-16 px-6 bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto border-t border-[rgba(255,255,255,0.1)] pt-16">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
                <motion.div variants={revealVariants}>
                    <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                        <EditableText value={theme?.customTexts?.obs_stat_1_val || '14'} field="obs_stat_1_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                    </h3>
                    <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                        <EditableText value={theme?.customTexts?.obs_stat_1_label || 'Years of experience'} field="obs_stat_1_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                </motion.div>
                
                <motion.div variants={revealVariants}>
                    <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                        <EditableText value={theme?.customTexts?.obs_stat_2_val || '80+'} field="obs_stat_2_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                    </h3>
                    <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                        <EditableText value={theme?.customTexts?.obs_stat_2_label || 'Projects done'} field="obs_stat_2_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                </motion.div>
                
                <motion.div variants={revealVariants}>
                    <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                        <EditableText value={theme?.customTexts?.obs_stat_3_val || '280+'} field="obs_stat_3_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                    </h3>
                    <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                        <EditableText value={theme?.customTexts?.obs_stat_3_label || 'Satisfied clients'} field="obs_stat_3_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                </motion.div>
                
                <motion.div variants={revealVariants}>
                    <h3 className="font-heading text-5xl md:text-6xl font-medium mb-3">
                        {awardItems.length}
                    </h3>
                    <p className="font-body text-sm text-[#8a8a93] uppercase tracking-widest">
                        <EditableText value={theme?.customTexts?.obs_awards_title || 'Awards'} field="obs_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                </motion.div>
            </motion.div>
        </div>
    </section>
  );
}
