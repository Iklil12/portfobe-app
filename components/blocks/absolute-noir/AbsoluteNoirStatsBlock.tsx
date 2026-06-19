"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirStatsBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const awardItems = data?.certificates || data?.user?.certificates || [];

    const totalProjects = allProjects.length;
    const totalAwards = awardItems.length;

    return (
        <motion.section initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col @md:flex-row wire-border-b bg-[#050505]">
            <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col items-start justify-center group hover-invert transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">
                    <EditableText value={theme?.customTexts?.noir_stats_projects || '[ ARCHIVED_PROJECTS ]'} field="noir_stats_projects" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                </span>
                <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">{totalProjects < 10 ? `0${totalProjects}` : totalProjects}</h3>
            </motion.div>
            <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 wire-border-b @md:wire-border-b-0 @md:wire-border-r flex flex-col items-start justify-center group hover-invert transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">
                    <EditableText value={theme?.customTexts?.noir_stats_recognition || '[ RECOGNITIONS ]'} field="noir_stats_recognition" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                </span>
                <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">{totalAwards < 10 ? `0${totalAwards}` : totalAwards}</h3>
            </motion.div>
            <motion.div variants={wireframeReveal} className="flex-1 p-8 @md:p-12 flex flex-col items-start justify-center group hover-invert transition-colors">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 group-hover:text-black/50">
                    <EditableText value={theme?.customTexts?.noir_stats_uptime || '[ SYSTEM_UPTIME ]'} field="noir_stats_uptime" entity="appearance" isEditor={isEditor} maxLength={25} as="span" />
                </span>
                <h3 className="font-sans font-black text-6xl @md:text-8xl tracking-tighter leading-none">
                    <EditableText value={theme?.customTexts?.noir_stats_uptime_val || '99'} field="noir_stats_uptime_val" entity="appearance" isEditor={isEditor} as="span" maxLength={5} />
                </h3>
            </motion.div>
        </motion.section>
    );
};
