"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/shared/ui/EditableText';
import { BentoGridContext } from './BentoGridShell';

export function BentoGridStatsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { highlightColor } = useContext(BentoGridContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType !== '3d');
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const githubLink = links.find((l: any) => l.platform.toLowerCase().includes('github'));
    const linkedinLink = links.find((l: any) => l.platform.toLowerCase().includes('linkedin'));

    // Theme Setup
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid gap-3 @lg:gap-6 grid-cols-3 lg:grid-cols-4 w-full">
            
            {/* STATS BOX 1 */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col justify-between p-3 @md:p-6 @lg:p-8 min-h-[100px] @md:min-h-[140px] group`}
            >
                <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase tracking-widest truncate">
                    <EditableText value={theme?.customTexts?.bento_stat_archive || 'Total Archive'} field="bento_stat_archive" entity="appearance" isEditor={isEditor} as="span" />
                </span>
                <div className="flex flex-col @xs:flex-row items-baseline justify-between mt-2 @md:mt-4 gap-1">
                    <h3 className="text-xl @xs:text-2xl @md:text-4xl @lg:text-5xl font-black text-white group-hover:text-[var(--hl)] transition-colors leading-none">{archiveItems.length}</h3>
                    <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase">
                        <EditableText value={theme?.customTexts?.bento_stat_unit_1 || 'items'} field="bento_stat_unit_1" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                </div>
            </motion.div>

            {/* STATS BOX 2 */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col justify-between p-3 @md:p-6 @lg:p-8 min-h-[100px] @md:min-h-[140px] group`}
            >
                <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase tracking-widest truncate">
                    <EditableText value={theme?.customTexts?.bento_stat_label_2 || 'Happy Clients'} field="bento_stat_label_2" entity="appearance" isEditor={isEditor} as="span" />
                </span>
                <div className="flex flex-col @xs:flex-row items-baseline justify-between mt-2 @md:mt-4 gap-1">
                    <h3 className="text-xl @xs:text-2xl @md:text-4xl @lg:text-5xl font-black text-white group-hover:text-[var(--hl)] transition-colors leading-none">
                        <EditableText value={theme?.customTexts?.bento_stat_val_2 || '12'} field="bento_stat_val_2" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase">
                        <EditableText value={theme?.customTexts?.bento_stat_unit_2 || 'clients'} field="bento_stat_unit_2" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                </div>
            </motion.div>

            {/* STATS BOX 3 */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col justify-between p-3 @md:p-6 @lg:p-8 min-h-[100px] @md:min-h-[140px] group`}
            >
                <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase tracking-widest truncate">
                    <EditableText value={theme?.customTexts?.bento_stat_label_3 || 'Experience'} field="bento_stat_label_3" entity="appearance" isEditor={isEditor} as="span" />
                </span>
                <div className="flex flex-col @xs:flex-row items-baseline justify-between mt-2 @md:mt-4 gap-1">
                    <h3 className="text-xl @xs:text-2xl @md:text-4xl @lg:text-5xl font-black text-white group-hover:text-[var(--hl)] transition-colors leading-none">
                        <EditableText value={theme?.customTexts?.bento_stat_val_3 || '5+'} field="bento_stat_val_3" entity="appearance" isEditor={isEditor} as="span" />
                    </h3>
                    <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase">
                        <EditableText value={theme?.customTexts?.bento_stat_unit_3 || 'years'} field="bento_stat_unit_3" entity="appearance" isEditor={isEditor} as="span" />
                    </span>
                </div>
            </motion.div>

            {/* COLORED CTA BOX */}
            <Link 
                href={`/${subdomain}/gallery`} 
                className="col-span-3 lg:col-span-1 h-full"
                onClick={(e) => { if(isEditor) e.preventDefault(); }}
            >
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className="bento-card bento-card-colored w-full h-full p-3 @md:p-6 @lg:p-8 flex flex-col justify-between min-h-[100px] @md:min-h-[140px] group cursor-pointer"
                >
                    <div className="flex justify-between items-center opacity-70 group-hover:opacity-100 font-mono text-[7px] @md:text-[9px] uppercase tracking-widest text-black">
                        <span className="truncate mr-1">
                            <EditableText value={theme?.customTexts?.bento_cta_sub || 'Complete Portfolio'} field="bento_cta_sub" entity="appearance" isEditor={isEditor} as="span" className="pointer-events-auto" />
                        </span>
                        <i className="fas fa-arrow-right -rotate-45 group-hover:rotate-0 transition-transform duration-300 text-[10px] @md:text-xs shrink-0"></i>
                    </div>
                    <div className="mt-2 @md:mt-4 text-black">
                        <h3 className="text-[10px] @xs:text-xs @md:text-lg @lg:text-xl font-sans font-black tracking-tight leading-tight uppercase line-clamp-2">
                            <EditableText value={theme?.customTexts?.bento_cta_title || 'View All Works'} field="bento_cta_title" entity="appearance" isEditor={isEditor} as="span" />
                        </h3>
                    </div>
                </motion.div>
            </Link>

        </div>
    );
}
