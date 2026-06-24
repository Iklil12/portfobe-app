"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function CinematicStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;

    return (
        <section className="border-b border-[#1f1f1f]" id="about">
            <div className={`grid divide-[#1f1f1f] grid-cols-2 @md:grid-cols-4 divide-x divide-y @md:divide-y-0`}>
                <motion.div initial={{ opacity: 0 }} {...{ [animationTrigger]: { opacity: 1 } }} transition={{ duration: 0.5, delay: 0.1 }} className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 p-8 @md:p-16`}>
                    <span className={`font-black mb-1 tracking-tighter cine-heading text-4xl @md:text-7xl`}>{archiveItems.length}</span>
                    <EditableText value={theme?.customTexts?.cinematic_stat1_label || 'Projects'} field="cinematic_stat1_label" entity="appearance" isEditor={isEditor} as="span" className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body" />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} {...{ [animationTrigger]: { opacity: 1 } }} transition={{ duration: 0.5, delay: 0.2 }} className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 p-8 @md:p-16`}>
                    <span className={`font-black mb-1 tracking-tighter cine-heading text-4xl @md:text-7xl`}>{awardItems.length}</span>
                    <EditableText value={theme?.customTexts?.cinematic_stat2_label || 'Awards'} field="cinematic_stat2_label" entity="appearance" isEditor={isEditor} as="span" className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body" />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} {...{ [animationTrigger]: { opacity: 1 } }} transition={{ duration: 0.5, delay: 0.3 }} className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 p-8 @md:p-16`}>
                    <span className={`font-black mb-1 tracking-tighter cine-heading text-4xl @md:text-7xl`}>
                        <EditableText value={theme?.customTexts?.cinematic_stat3_value || String(links.length || '4')} field="cinematic_stat3_value" entity="appearance" isEditor={isEditor} as="span" maxLength={6} />
                    </span>
                    <EditableText value={theme?.customTexts?.cinematic_stat3_label || 'Links'} field="cinematic_stat3_label" entity="appearance" isEditor={isEditor} as="span" className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body" />
                </motion.div>
                <motion.div initial={{ opacity: 0 }} {...{ [animationTrigger]: { opacity: 1 } }} transition={{ duration: 0.5, delay: 0.4 }} className={`flex flex-col items-center justify-center text-center hover:bg-white hover:text-black transition duration-300 group cursor-pointer p-8 @md:p-16`} onClick={() => !isEditor && (window.location.href = `mailto:${userEmail}`)}>
                    <span className={`font-black mb-2 tracking-tighter cine-heading text-4xl @md:text-6xl`}><i className="fas fa-envelope group-hover:scale-110 transition-transform"></i></span>
                    <EditableText value={theme?.customTexts?.cinematic_stat4_label || 'Hire Me'} field="cinematic_stat4_label" entity="appearance" isEditor={isEditor} as="span" className="text-[9px] @md:text-xs uppercase tracking-widest font-bold cine-body mt-1" />
                </motion.div>
            </div>
        </section>
    );
}
