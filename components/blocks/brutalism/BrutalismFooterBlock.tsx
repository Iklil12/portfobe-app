"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { hardShadow, hardShadowHover, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "JOHN DOE";
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="w-full flex flex-col">
            <div className={"p-12 @sm:p-20 flex flex-col items-center justify-center text-center border-b-[3px] border-black bg-[var(--hl)]"}>
                <h2 className={"custom-heading text-5xl @sm:text-7xl @md:text-[8cqi] font-black uppercase tracking-tighter leading-[0.8] mb-8"}>
                    <EditableText value={theme?.customTexts?.brutal_footer_title || 'END OF TRANSMISSION'} field="brutal_footer_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
                <button onClick={() => { if(!isEditor) window.scrollTo({ top: 0, behavior: 'smooth' }) }} className={`bg-black text-white font-mono font-bold uppercase px-8 py-4 text-xs @sm:text-sm border-[3px] border-black ${hardShadow} ${hardShadowHover} ${radiusClass}`}>
                    <EditableText value={theme?.customTexts?.brutal_footer_btn || 'RETURN TO TOP ^'} field="brutal_footer_btn" entity="appearance" isEditor={isEditor} as="span" />
                </button>
            </div>

            <div className={"p-6 bg-white font-mono text-[10px] @sm:text-xs font-bold uppercase flex flex-col @sm:flex-row justify-between items-center gap-4"}>
                <span>© {new Date().getFullYear()} {fullName}.SYS</span>
                <div className={"flex gap-4 @sm:gap-6 flex-wrap justify-center"}>
                    {links.length > 0 ? links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" onClick={(e) => { if(isEditor) e.preventDefault(); }} className="hover:bg-black hover:text-white px-2 py-1 transition-none">
                            [{l.platform}]
                        </a>
                    )) : <span>[NO_LINKS]</span>}
                </div>
            </div>
        </motion.footer>
    );
}
