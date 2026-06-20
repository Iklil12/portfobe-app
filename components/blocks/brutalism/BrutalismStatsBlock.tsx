"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function BrutalismStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d').slice(0, 4);
    const awardItems = data?.certificates || data?.user?.certificates || [];

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
            className="w-full grid grid-cols-2 @md:grid-cols-4 border-b-[3px] border-black font-mono uppercase bg-black"
        >
            {/* Stat 1: Projects */}
            <div className="p-4 @sm:p-8 flex flex-col justify-between items-center bg-white text-black border-r-[3px] border-b-[3px] @md:border-b-0 border-black hover:bg-[var(--hl)] transition-all duration-200 cursor-pointer text-center gap-4 group">
                <span className="text-[9px] font-black text-slate-400 group-hover:text-black transition-colors duration-150">
                    [ STAT_01 ]
                </span>
                <span className="text-2xl @xs:text-3xl @sm:text-5xl font-black custom-heading tracking-tighter group-hover:scale-110 transition-transform duration-200">
                    {archiveItems.length}
                </span>
                <span className="text-[10px] @sm:text-xs font-black tracking-wider">
                    <EditableText value={theme?.customTexts?.brutal_stat_1_label || 'PROJECTS'} field="brutal_stat_1_label" entity="appearance" isEditor={isEditor} as="span" />
                </span>
            </div>

            {/* Stat 2: Awards */}
            <div className="p-4 @sm:p-8 flex flex-col justify-between items-center bg-[var(--hl)] text-black border-b-[3px] @md:border-b-0 border-black @md:border-r-[3px] hover:bg-black hover:text-white transition-all duration-200 cursor-pointer text-center gap-4 group">
                <span className="text-[9px] font-black text-black/40 group-hover:text-white/40 transition-colors duration-150">
                    [ STAT_02 ]
                </span>
                <span className="text-2xl @xs:text-3xl @sm:text-5xl font-black custom-heading tracking-tighter group-hover:scale-110 transition-transform duration-200">
                    {awardItems.length}
                </span>
                <span className="text-[10px] @sm:text-xs font-black tracking-wider">
                    <EditableText value={theme?.customTexts?.brutal_stat_2_label || 'AWARDS'} field="brutal_stat_2_label" entity="appearance" isEditor={isEditor} as="span" />
                </span>
            </div>

            {/* Stat 3: Clients */}
            <div className="p-4 @sm:p-8 flex flex-col justify-between items-center bg-white text-black border-r-[3px] border-black hover:bg-[var(--hl)] transition-all duration-200 cursor-pointer text-center gap-4 group">
                <span className="text-[9px] font-black text-slate-400 group-hover:text-black transition-colors duration-150">
                    [ STAT_03 ]
                </span>
                <span className="text-2xl @xs:text-3xl @sm:text-5xl font-black custom-heading tracking-tighter group-hover:scale-110 transition-transform duration-200">
                    <EditableText value={theme?.customTexts?.brutal_stat_3_val || '50+'} field="brutal_stat_3_val" entity="appearance" isEditor={isEditor} as="span" />
                </span>
                <span className="text-[10px] @sm:text-xs font-black tracking-wider">
                    <EditableText value={theme?.customTexts?.brutal_stat_3_label || 'CLIENTS'} field="brutal_stat_3_label" entity="appearance" isEditor={isEditor} as="span" />
                </span>
            </div>

            {/* Stat 4: Experience */}
            <div className="p-4 @sm:p-8 flex flex-col justify-between items-center bg-black text-white hover:bg-[var(--hl)] hover:text-black transition-all duration-200 cursor-pointer text-center gap-4 group">
                <span className="text-[9px] font-black text-white/40 group-hover:text-black/40 transition-colors duration-150">
                    [ STAT_04 ]
                </span>
                <span className="text-2xl @xs:text-3xl @sm:text-5xl font-black custom-heading tracking-tighter group-hover:scale-110 transition-transform duration-200">
                    <EditableText value={theme?.customTexts?.brutal_stat_4_val || '10 YRS'} field="brutal_stat_4_val" entity="appearance" isEditor={isEditor} as="span" />
                </span>
                <span className="text-[10px] @sm:text-xs font-black tracking-wider">
                    <EditableText value={theme?.customTexts?.brutal_stat_4_label || 'EXPERIENCE'} field="brutal_stat_4_label" entity="appearance" isEditor={isEditor} as="span" />
                </span>
            </div>
        </motion.div>
    );
}
