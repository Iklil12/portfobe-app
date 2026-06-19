"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const MinimalistStatsBlock = ({ data, theme, isEditor }: any) => {
  const animationTrigger = isEditor ? "animate" : "whileInView";
  const awardItems = data?.certificates || data?.user?.certificates || [];
  const projectCount = (data?.projects || data?.user?.projects || []).length;

  return (
    <motion.section
      initial="hidden" 
      {...{ [animationTrigger]: "visible" }} 
      viewport={{ once: true, amount: 0 }}
      variants={getStaggerContainer(0.8, 0.2)} 
      className="border-b border-gray-200 @container"
    >
      <div className="grid grid-cols-3 border-b border-gray-200">
        
        {/* Box 1: Projects */}
        <motion.div variants={cinematicBlurUp} className="px-2 py-6 @md:p-8 border-r border-gray-200 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] @md:text-[10px] font-bold uppercase tracking-wider @md:tracking-widest text-gray-400 mb-1 @md:mb-2 min-heading">
            <EditableText value={theme?.customTexts?.min_stats_projects || 'Projects'} field="min_stats_projects" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
          </p>
          <motion.p className="text-lg @md:text-4xl font-black tracking-tighter min-heading flex items-baseline justify-center gap-1 @md:gap-2">
            <span className="min-heading">{projectCount}</span>
            <EditableText value={theme?.customTexts?.min_stats_total || 'Total'} field="min_stats_total" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading text-[9px] @md:text-base font-normal text-gray-500 uppercase tracking-wide" />
          </motion.p>
        </motion.div>
 
        {/* Box 2: Awards */}
        <motion.div variants={cinematicBlurUp} className="px-2 py-6 @md:p-8 border-r border-gray-200 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] @md:text-[10px] font-bold uppercase tracking-wider @md:tracking-widest text-gray-400 mb-1 @md:mb-2 min-heading">
            <EditableText value={theme?.customTexts?.min_stats_recognition || 'Recognition'} field="min_stats_recognition" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
          </p>
          <motion.p className="text-lg @md:text-4xl font-black tracking-tighter min-heading flex items-baseline justify-center gap-1 @md:gap-2">
            <span className="min-heading">{awardItems.length}</span>
            <EditableText value={theme?.customTexts?.min_stats_awards || 'Awards'} field="min_stats_awards" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading text-[9px] @md:text-base font-normal text-gray-500 uppercase tracking-wide" />
          </motion.p>
        </motion.div>
 
        {/* Box 3: Experience */}
        <motion.div variants={cinematicBlurUp} className="px-2 py-6 @md:p-8 flex flex-col items-center justify-center text-center">
          <p className="text-[9px] @md:text-[10px] font-bold uppercase tracking-wider @md:tracking-widest text-gray-400 mb-1 @md:mb-2 min-heading">
            <EditableText value={theme?.customTexts?.min_stats_label3 || 'Experience'} field="min_stats_label3" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading" />
          </p>
          <motion.p className="text-lg @md:text-4xl font-black tracking-tighter min-heading flex items-baseline justify-center gap-1 @md:gap-2">
            <EditableText value={theme?.customTexts?.min_stats_val3 || '5+'} field="min_stats_val3" entity="appearance" isEditor={isEditor} maxLength={5} className="min-heading" />
            <EditableText value={theme?.customTexts?.min_stats_suffix3 || 'Years'} field="min_stats_suffix3" entity="appearance" isEditor={isEditor} maxLength={15} className="min-heading text-[9px] @md:text-base font-normal text-gray-500 uppercase tracking-wide" />
          </motion.p>
        </motion.div>
 
      </div>
    </motion.section>
  );
};
