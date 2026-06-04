"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const defaultStats = [
    { label: "ACTIVE YEARS", val: "08+" },
    { label: "PROJECTS WRAPPED", val: "42" },
    { label: "HONORS", val: "18" },
    { label: "BASE OF OPS", val: "IDN" }
  ];

  const statsData = data?.stats?.length ? data.stats.slice(0,4) : defaultStats;

  // In the original ViewfinderTheme, it used totalProjects and totalHonors dynamically.
  // Here we just use the stats array, either default or user provided.
  // But we let the user inline edit via customTexts to override it.
  
  return (
    <div id="stats" className="w-full flex flex-col py-24 px-6 @md:px-12 @lg:px-20 border-b border-[#050505] bg-[#F3F3F1] text-[#050505] shrink-0">
      <div className="max-w-4xl mx-auto w-full">
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={fadeUp}
            className="border-b-2 border-[#050505] pb-3 mb-10 flex justify-between items-end"
        >
            <h2 className="font-cinema text-5xl @md:text-6xl tracking-wide uppercase"><EditableText value={theme?.customTexts?.vf_log_title || 'PRODUCTION LOG'} field="vf_log_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></h2>
            <span className="font-bold uppercase tracking-widest vf-hud-text text-right"><EditableText value={theme?.customTexts?.vf_log_file || 'FILE_NO: 0042'} field="vf_log_file" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /></span>
        </motion.div>

        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
            variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-2 gap-8 @md:gap-12"
        >
            {statsData.map((stat: any, idx: number) => (
                <motion.div key={idx} variants={fadeUp} className="flex flex-col border-l-4 border-[var(--primary)] pl-6 py-2">
                    <p className="font-bold uppercase tracking-widest mb-2 text-gray-500 vf-hud-text">
                        <EditableText value={theme?.customTexts?.[`vf_stat_lbl_${idx}`] || stat.label} field={`vf_stat_lbl_${idx}`} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                    <p className="font-cinema text-6xl @md:text-8xl leading-none text-[#050505]">
                        <EditableText value={theme?.customTexts?.[`vf_stat_val_${idx}`] || stat.val || stat.value} field={`vf_stat_val_${idx}`} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                    </p>
                </motion.div>
            ))}
        </motion.div>
      </div>
    </div>
  );
}
