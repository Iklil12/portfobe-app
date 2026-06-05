"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-2 border-zinc-800' : 'bg-[#09090b] border-2 border-zinc-800 hover:shadow-[8px_8px_0_0_var(--theme-color)]';

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };

    return (
        <section className="px-6 @md:px-12 py-16 @md:py-20">
            <motion.div 
                initial="hidden" 
                {...{ [animationTrigger]: "visible" }} 
                viewport={{ once: true, amount: 0 }} 
                variants={staggerContainer}
                className={`grid gap-4 @md:gap-8 grid-cols-2 @md:grid-cols-4`}
            >
                {[
                    { key: "acid_stat_projects", defaultLabel: "Projects", value: archiveItems.length },
                    { key: "acid_stat_awards", defaultLabel: "Awards", value: awardItems.length },
                    { key: "acid_stat_links", defaultLabel: "Links", value: links.length }
                ].map((stat, idx) => (
                    <motion.div key={idx} variants={fadeUp} className={`flex flex-col justify-between aspect-square hover:-translate-y-2 transition-all p-5 @md:p-8 ${cardStyleClassDark} ${cardRadiusClass}`}>
                        <span className="acid-text font-bold text-[9px] @md:text-xs uppercase tracking-widest acid-body">
                            <EditableText value={theme?.customTexts?.[stat.key] || stat.defaultLabel} field={stat.key} entity="appearance" isEditor={isEditor} as="span" />
                        </span>
                        <span className={`acid-heading font-extrabold text-4xl @md:text-5xl @lg:text-7xl`}>{stat.value}</span>
                    </motion.div>
                ))}
                
                <motion.div variants={fadeUp} className={`flex flex-col justify-between aspect-square hover:-translate-y-2 transition-all cursor-pointer p-5 @md:p-8 ${cardStyleClassDark} ${cardRadiusClass}`} onClick={() => { if (!isEditor) window.location.href = `mailto:${userEmail}`; }}>
                    <span className="acid-text font-bold text-[9px] @md:text-xs uppercase tracking-widest acid-body">
                        <EditableText value={theme?.customTexts?.acid_stat_hire || 'Hire Me'} field="acid_stat_hire" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                    <motion.span whileHover={{ scale: 1.1, rotate: 5 }} className={`acid-heading font-extrabold flex items-center text-4xl @md:text-5xl @lg:text-7xl`}>
                        <i className="fas fa-envelope"></i>
                    </motion.span>
                </motion.div>
            </motion.div>
        </section>
    );
}
