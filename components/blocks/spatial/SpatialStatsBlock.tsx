"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const projectCount = (data?.projects || data?.user?.projects || []).length;
  const awardCount = (data?.certificates || data?.user?.certificates || []).length;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';

  const auraAnim = isCardPreview
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

  const stats = [
    { label: theme?.customTexts?.spatial_stats_label1 || 'Projects', value: projectCount, suffix: theme?.customTexts?.spatial_stats_suffix1 || 'Total' },
    { label: theme?.customTexts?.spatial_stats_label2 || 'Recognition', value: awardCount, suffix: theme?.customTexts?.spatial_stats_suffix2 || 'Awards' },
  ];

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      className="w-full px-8 py-16 max-w-screen-xl mx-auto"
    >
      <div className="grid grid-cols-2 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            variants={auraAnim}
            className={`glass-panel ${radiusClass} p-8 @md:p-12 border border-white/5 text-center`}
          >
            <p className="text-xs font-medium text-slate-500 tracking-widest uppercase mb-3">
              <EditableText value={stat.label} field={`spatial_stats_label${i + 1}`} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
            </p>
            <p className="text-4xl @md:text-5xl font-semibold text-gradient tracking-tight">
              {stat.value} <span className="text-2xl @md:text-3xl font-normal text-slate-400">
                <EditableText value={stat.suffix} field={`spatial_stats_suffix${i + 1}`} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
              </span>
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
}
