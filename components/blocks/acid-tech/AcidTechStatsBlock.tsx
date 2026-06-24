"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function AcidTechStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'flat' ? 'bg-black border border-zinc-800' : 'bg-black border border-zinc-800 hover:shadow-[6px_6px_0_0_var(--tc)]';

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    return (
        <section className="px-6 @md:px-12 py-16 @md:py-24 bg-black font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <motion.div 
                initial="hidden" 
                {...{ [animationTrigger]: "visible" }} 
                viewport={{ once: true, amount: 0 }} 
                variants={staggerContainer}
                className="grid gap-4 @md:gap-8 grid-cols-2 @md:grid-cols-4 max-w-7xl mx-auto"
            >
                {[
                    { key: "acid_stat_projects", defaultLabel: "Projects", value: archiveItems.length, nodeName: "PROJ_DB" },
                    { key: "acid_stat_awards", defaultLabel: "Awards", value: awardItems.length, nodeName: "CERT_DB" },
                    { key: "acid_stat_links", defaultLabel: "Links", value: links.length, nodeName: "LNK_DB" }
                ].map((stat, idx) => (
                    <motion.div key={idx} variants={fadeUp} className={`flex flex-col justify-between aspect-square p-5 @md:p-8 relative ${cardStyleClassDark} ${cardRadiusClass}`}>
                        {/* Tab header simulated */}
                        <div className="absolute top-0 left-0 right-0 h-4 bg-zinc-950 px-2 py-0.5 flex justify-between items-center text-[7px] text-zinc-600 border-b border-zinc-900">
                            <span>NODE: {stat.nodeName}</span>
                            <span>OK</span>
                        </div>

                        <span className="text-[var(--tc)] font-bold text-[9px] uppercase tracking-widest mt-2">
                            <EditableText value={theme?.customTexts?.[stat.key] || stat.defaultLabel} field={stat.key} entity="appearance" isEditor={isEditor} as="span" />
                        </span>
                        <span className="font-extrabold text-4xl @md:text-5xl @lg:text-7xl text-white">{stat.value}</span>
                    </motion.div>
                ))}
                
                <motion.div variants={fadeUp} className={`flex flex-col justify-between aspect-square cursor-pointer p-5 @md:p-8 relative ${cardStyleClassDark} ${cardRadiusClass}`} onClick={() => { if (!isEditor) window.location.href = `mailto:${userEmail}`; }}>
                    {/* Tab header simulated */}
                    <div className="absolute top-0 left-0 right-0 h-4 bg-zinc-950 px-2 py-0.5 flex justify-between items-center text-[7px] text-zinc-600 border-b border-zinc-900">
                        <span>NODE: MAIL_SRV</span>
                        <span>SEND</span>
                    </div>

                    <span className="text-[var(--tc)] font-bold text-[9px] uppercase tracking-widest mt-2">
                        <EditableText value={theme?.customTexts?.acid_stat_hire || 'Hire Me'} field="acid_stat_hire" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                    <motion.span whileHover={{ scale: 1.05 }} className="font-extrabold flex items-center text-3xl @md:text-4xl @lg:text-6xl text-[var(--tc)]">
                        <i className="fas fa-envelope"></i>
                    </motion.span>
                </motion.div>
            </motion.div>
        </section>
    );
}
