"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ObsidianStatsBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  const revealVariants: any = {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  const statsData = [
    {
      id: 1,
      valKey: "obs_stat_1_val",
      labelKey: "obs_stat_1_label",
      defaultVal: "14",
      defaultLabel: "Years of experience",
      tag: "EXP_TIME // RUNNING"
    },
    {
      id: 2,
      valKey: "obs_stat_2_val",
      labelKey: "obs_stat_2_label",
      defaultVal: "80+",
      defaultLabel: "Projects done",
      tag: "COMPLETED // SHOT_LIST"
    },
    {
      id: 3,
      valKey: "obs_stat_3_val",
      labelKey: "obs_stat_3_label",
      defaultVal: "280+",
      defaultLabel: "Satisfied clients",
      tag: "CLIENT_BASE // OKR"
    }
  ];

  return (
    <section id="stats" className="py-16 md:py-24 px-4 md:px-8 bg-zinc-950 border-t border-white/5 relative overflow-hidden">
        {/* Decorative Grid Line Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none"></div>

        <div className="max-w-screen-2xl mx-auto relative z-10">
            <motion.div 
              initial="hidden" 
              {...{ [animationTrigger]: "visible" }} 
              variants={staggerReveal} 
              viewport={{ once: true, amount: 0.1 }} 
              className="grid grid-cols-2 lg:grid-cols-4 gap-6"
            >
                {statsData.map((stat) => (
                    <motion.div 
                      key={stat.id}
                      variants={revealVariants}
                      className="group border border-white/5 bg-zinc-900/10 p-6 rounded-2xl relative hover:border-white/15 hover:bg-zinc-900/20 transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden"
                    >
                        {/* Corner Crosshairs */}
                        <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-white/40 transition-colors"></div>
                        <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-white/40 transition-colors"></div>
                        <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-white/40 transition-colors"></div>
                        <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-white/40 transition-colors"></div>

                        {/* Top Tag spec */}
                        <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
                            <span>{stat.tag}</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                        </div>

                        {/* Big Stat Value */}
                        <div className="mb-2">
                            <h3 className="font-heading text-4xl @sm:text-5xl md:text-6xl font-medium tracking-tight text-white group-hover:text-red-500 transition-colors duration-300 leading-none">
                                <EditableText value={theme?.customTexts?.[stat.valKey] || stat.defaultVal} field={stat.valKey} entity="appearance" isEditor={isEditor} as="span" maxLength={10} />
                            </h3>
                        </div>

                        {/* Muted label */}
                        <p className="font-body text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mt-2">
                            <EditableText value={theme?.customTexts?.[stat.labelKey] || stat.defaultLabel} field={stat.labelKey} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                        </p>

                        {/* Animated decorative visual equalizer bar in background */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                            <div className="h-full bg-white/10 w-2/3 group-hover:w-full transition-all duration-700 ease-out"></div>
                        </div>
                    </motion.div>
                ))}

                {/* Awards Stat Card */}
                <motion.div 
                  variants={revealVariants}
                  className="group border border-white/5 bg-zinc-900/10 p-6 rounded-2xl relative hover:border-white/15 hover:bg-zinc-900/20 transition-all duration-300 flex flex-col justify-between min-h-[160px] overflow-hidden"
                >
                    {/* Corner Crosshairs */}
                    <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20 group-hover:border-white/40 transition-colors"></div>
                    <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20 group-hover:border-white/40 transition-colors"></div>

                    {/* Top Tag spec */}
                    <div className="flex justify-between items-center text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-4">
                        <span>AWARDS // ARCHIVED</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                    </div>

                    {/* Big Stat Value */}
                    <div className="mb-2">
                        <h3 className="font-heading text-4xl @sm:text-5xl md:text-6xl font-medium tracking-tight text-white group-hover:text-red-500 transition-colors duration-300 leading-none">
                            {awardItems.length}
                        </h3>
                    </div>

                    {/* Muted label */}
                    <p className="font-body text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mt-2">
                        <EditableText value={theme?.customTexts?.obs_awards_title || 'Awards'} field="obs_awards_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>

                    {/* Animated decorative visual equalizer bar in background */}
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5 overflow-hidden">
                        <div className="h-full bg-white/10 w-2/3 group-hover:w-full transition-all duration-700 ease-out"></div>
                    </div>
                </motion.div>
            </motion.div>
        </div>
    </section>
  );
}
