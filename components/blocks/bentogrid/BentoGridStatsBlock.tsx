"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { highlightColor } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const githubLink = links.find((l: any) => l.platform.toLowerCase().includes('github'));
    const linkedinLink = links.find((l: any) => l.platform.toLowerCase().includes('linkedin'));

    // Theme Setup
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-4 w-full">
            {/* STATS BOX */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col items-start justify-center p-8 group @lg:col-span-1 @lg:row-span-1`}
            >
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-2">
                    <EditableText value={theme?.customTexts?.bento_stat_archive || 'Total Archive'} field="bento_stat_archive" entity="appearance" isEditor={isEditor} as="span" />
                </span>
                <h3 className="text-6xl font-black text-white group-hover:text-[var(--hl)] transition-colors">{archiveItems.length}</h3>
            </motion.div>

            {/* SOCIAL BOX */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-row p-3 gap-3 @lg:col-span-1 @lg:row-span-1`}
            >
                <a href={githubLink?.url || '#'} target="_blank" rel="noreferrer" className={`flex-1 ${cardRadiusClass} bg-[#1a1a1d] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors group cursor-pointer text-slate-400 min-h-[100px]`}>
                    <i className={`fab fa-github text-4xl group-hover:scale-110 transition-transform ${!githubLink && 'opacity-20'}`}></i>
                </a>
                <a href={linkedinLink?.url || '#'} target="_blank" rel="noreferrer" className={`flex-1 ${cardRadiusClass} bg-[#1a1a1d] border border-white/5 flex flex-col items-center justify-center gap-2 hover:bg-[#0a66c2] hover:text-white transition-colors group cursor-pointer text-slate-400 min-h-[100px]`}>
                    <i className={`fab fa-linkedin-in text-4xl group-hover:scale-110 transition-transform ${!linkedinLink && 'opacity-20'}`}></i>
                </a>
            </motion.div>

            {/* COLORED CTA BOX */}
            <Link href={`/${subdomain}/gallery`} scroll={false} className={`@lg:col-span-2 @lg:row-span-1`} onClick={(e) => { if(isEditor) e.preventDefault(); }}>
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className="bento-card bento-card-colored w-full h-full p-8 flex items-center justify-between group cursor-pointer"
                >
                    <div className="flex flex-col pointer-events-none">
                        <span className="text-[10px] font-bold uppercase tracking-widest mb-1 opacity-70">
                            <EditableText value={theme?.customTexts?.bento_cta_sub || 'Complete Portfolio'} field="bento_cta_sub" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                        </span>
                        <h3 className="text-2xl @md:text-3xl font-black tracking-tight pointer-events-auto">
                            <EditableText value={theme?.customTexts?.bento_cta_title || 'View All Works'} field="bento_cta_title" entity="appearance" isEditor={isEditor} as="span" />
                        </h3>
                    </div>
                    <div className="w-14 h-14 rounded-full bg-black/10 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all duration-300">
                        <i className="fas fa-arrow-right -rotate-45 text-xl group-hover:rotate-0 transition-transform duration-300"></i>
                    </div>
                </motion.div>
            </Link>
        </div>
    );
}
