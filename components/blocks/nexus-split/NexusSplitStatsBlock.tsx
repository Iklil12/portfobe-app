"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function NexusSplitStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const [currentTime, setCurrentTime] = useState("");

  const allProjects = data?.projects || data?.user?.projects || [];
  const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
  const awardItems = data?.certificates || data?.user?.certificates || [];

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: nexusEase } }
  };
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };

  useEffect(() => {
      if (isCardPreview || isEditor) return;
      const updateTime = () => {
          const now = new Date();
          setCurrentTime(now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }));
      };
      updateTime();
      const interval = setInterval(updateTime, 1000);
      return () => clearInterval(interval);
  }, [isCardPreview, isEditor]);

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
        className="grid grid-cols-2 @lg:grid-cols-4 border-b nexus-border"
    >
        {[
            { 
              labelKey: 'nexus_stat_1', 
              defaultLabel: 'Projects', 
              val: archiveItems.length 
            },
            { 
              labelKey: 'nexus_stat_2', 
              defaultLabel: 'Awards', 
              val: awardItems.length 
            },
            { 
              labelKey: 'nexus_stat_3', 
              defaultLabel: 'Experience', 
              val: <EditableText value={theme?.customTexts?.nexus_stat_3_val || 'Pro'} field="nexus_stat_3_val" entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
            },
            { 
              labelKey: 'nexus_stat_4', 
              defaultLabel: 'Time', 
              val: currentTime || "00:00" 
            }
        ].map((stat, idx) => (
            <motion.div key={idx} variants={fadeUp} className="flex flex-col items-center justify-center py-8 @lg:py-12 border-r nexus-border last:border-r-0 hover:bg-white/5 transition-colors">
                <span className="font-display font-bold text-3xl @lg:text-4xl text-white mb-1">{stat.val}</span>
                <span className="font-sans text-[9px] font-bold uppercase tracking-widest text-slate-500">
                    <EditableText value={theme?.customTexts?.[stat.labelKey] || stat.defaultLabel} field={stat.labelKey} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                </span>
            </motion.div>
        ))}
    </motion.section>
  );
}
