"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function AcidTechFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fullName = data?.profile?.fullName || data?.fullName || "Jamal Arifin";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.co`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    return (
        <motion.footer 
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
            className="pt-24 pb-12 px-6 @md:px-12 bg-black font-mono text-white border-t border-[var(--tc)]/20"
            style={{ '--tc': themeColor } as React.CSSProperties}
        >
            <div className="max-w-5xl mx-auto flex flex-col items-center">
                {/* Clean, Bold, Minimal CLI Dispatcher Box */}
                <motion.div variants={fadeUp} className="w-full mb-16">
                    <a 
                        href={isEditor ? '#' : `mailto:${userEmail}`} 
                        className="group relative block w-full bg-zinc-950 border border-[var(--tc)]/20 p-8 md:p-12 text-center hover:border-[var(--tc)] transition-all duration-300 shadow-[0_0_20px_rgba(0,255,0,0.01)]"
                    >
                        <span className="text-[var(--tc)] text-[10px] font-bold uppercase tracking-[0.3em] mb-3 block">
                            [ <EditableText value={theme?.customTexts?.acid_footer_subtitle || 'SYSTEM DISPATCHER'} field="acid_footer_subtitle" entity="appearance" isEditor={isEditor} as="span" /> ]
                        </span>
                        
                        <h3 className="text-3xl md:text-5xl lg:text-6xl font-extrabold text-white uppercase tracking-tight group-hover:text-[var(--tc)] transition-colors duration-300">
                            INITIALIZE_MAILTO_
                        </h3>
                    </a>
                </motion.div>

                {/* Footer Copyright and Legal bar */}
                <motion.div variants={fadeUp} className="w-full flex justify-between items-center border-t border-zinc-900 pt-8 font-bold uppercase tracking-widest text-zinc-500 flex-col gap-4 text-[8px] @md:flex-row @md:text-xs">
                    <p>© {new Date().getFullYear()} {fullName}</p>
                    <div className="flex gap-4 my-2 @md:gap-6 @md:my-0">
                        {links.map((l: any, i: number) => (
                            <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors duration-300 text-zinc-500" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
                                {l.platform.substring(0, 3).toUpperCase()}
                            </a>
                        ))}
                    </div>
                    <a href={isEditor ? '#' : `/${subdomain}`} className="transition-colors duration-300 flex items-center gap-2 text-zinc-500" style={{ transition: 'color 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.color = themeColor} onMouseLeave={(e) => e.currentTarget.style.color = '#71717a'}>
                        PORTFO.BE/{subdomain?.toUpperCase()} <i className="fas fa-arrow-right -rotate-45 text-[8px] ml-1"></i>
                    </a>
                </motion.div>
            </div>
        </motion.footer>
    );
}
