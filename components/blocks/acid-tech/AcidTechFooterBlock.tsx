"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#ff9e00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    return (
        <motion.footer 
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
            className="pt-24 @md:pt-32 pb-12 px-6 @md:px-12 text-center bg-[#09090b]"
        >
            <motion.p variants={fadeUp} className="acid-text font-bold uppercase tracking-[0.3em] mb-6 acid-body text-[10px] @md:text-xs">
                <EditableText value={theme?.customTexts?.acid_footer_subtitle || 'Drop a Line'} field="acid_footer_subtitle" entity="appearance" isEditor={isEditor} as="span" />
            </motion.p>
            <motion.a 
                variants={fadeUp} 
                href={isEditor ? '#' : `mailto:${userEmail}`} 
                className={`block acid-heading font-extrabold uppercase tracking-tighter leading-[0.8] transition-colors duration-300 mb-16 @md:mb-20 hover:text-[var(--theme-color)]`} 
                style={{ '--theme-color': themeColor } as any}
            >
                <span className={`block w-full break-words text-5xl @md:text-[clamp(5rem,15cqi,10rem)]`}>
                    <EditableText value={theme?.customTexts?.acid_footer_title || 'CONTACT'} field="acid_footer_title" entity="appearance" isEditor={isEditor} as="span" />
                </span>
            </motion.a>

            <motion.div variants={fadeUp} className={`flex justify-between items-center border-t border-zinc-800 pt-8 font-bold uppercase tracking-widest text-zinc-500 acid-body flex-col gap-4 text-[9px] @md:flex-row @md:text-xs`}>
                <p>© {new Date().getFullYear()} {fullName}</p>
                <div className={`flex gap-4 my-2 @md:gap-6 @md:my-0`}>
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>{l.platform.substring(0, 2)}</a>
                    ))}
                </div>
                <a href={isEditor ? '#' : `/${subdomain}`} className="transition flex items-center gap-2" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
                    PORTFO.BE/{subdomain?.toUpperCase()} <motion.i whileHover={{ x: 5 }} className="fas fa-arrow-right -rotate-45"></motion.i>
                </a>
            </motion.div>
        </motion.footer>
    );
}
