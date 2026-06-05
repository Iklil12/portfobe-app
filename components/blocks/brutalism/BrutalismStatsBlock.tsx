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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <motion.div
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal}
            className={`w-full grid grid-cols-2 @md:grid-cols-4 border-b-[3px] border-black font-mono uppercase bg-black text-white divide-x-[3px] divide-black`}
        >
            <div className={"p-3 @sm:p-6 flex flex-col justify-between items-center bg-white text-black brutal-hover-invert transition-none text-center gap-2"}>
                <span className={"text-[10px] @sm:text-xs font-bold pointer-events-none"}>
                    <EditableText value={theme?.customTexts?.brutal_stat_1_label || 'PROJECTS'} field="brutal_stat_1_label" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                </span>
                <span className={"text-2xl @sm:text-4xl font-black custom-heading"}>
                    {archiveItems.length}
                </span>
            </div>
            <div className={"p-3 @sm:p-6 flex flex-col justify-between items-center bg-[var(--hl)] text-black brutal-hover-invert transition-none text-center gap-2"}>
                <span className={"text-[10px] @sm:text-xs font-bold pointer-events-none"}>
                    <EditableText value={theme?.customTexts?.brutal_stat_2_label || 'AWARDS'} field="brutal_stat_2_label" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                </span>
                <span className={"text-2xl @sm:text-4xl font-black custom-heading"}>
                    {awardItems.length}
                </span>
            </div>
            <div className={"p-3 @sm:p-6 flex flex-col justify-between items-center bg-white text-black brutal-hover-invert transition-none text-center gap-2"}>
                <span className={"text-[10px] @sm:text-xs font-bold pointer-events-none"}>
                    <EditableText value={theme?.customTexts?.brutal_stat_3_label || 'CLIENTS'} field="brutal_stat_3_label" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                </span>
                <span className={"text-2xl @sm:text-4xl font-black custom-heading pointer-events-none"}>
                    <EditableText value={theme?.customTexts?.brutal_stat_3_val || '50+'} field="brutal_stat_3_val" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                </span>
            </div>
            <div className={"p-3 @sm:p-6 flex flex-col justify-between items-center bg-black text-white brutal-hover-invert transition-none text-center gap-2"}>
                <span className={"text-[10px] @sm:text-xs font-bold pointer-events-none"}>
                    <EditableText value={theme?.customTexts?.brutal_stat_4_label || 'EXPERIENCE'} field="brutal_stat_4_label" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                </span>
                <span className={"text-2xl @sm:text-4xl font-black custom-heading pointer-events-none"}>
                    <EditableText value={theme?.customTexts?.brutal_stat_4_val || '10 YRS'} field="brutal_stat_4_val" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                </span>
            </div>
        </motion.div>
    );
}
