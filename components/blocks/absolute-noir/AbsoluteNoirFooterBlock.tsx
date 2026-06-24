"use client";

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirFooterBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const [isCopied, setIsCopied] = useState(false);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        if (isEditor) return;
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <motion.footer initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerGrid} className="w-full flex flex-col bg-[#050505] text-white">
            <motion.div variants={wireframeReveal} onClick={handleCopyEmail} className="w-full p-12 @md:p-32 flex flex-col items-center justify-center text-center wire-border-b hover:bg-white hover:text-black transition-colors cursor-pointer group">
                <span className="font-mono text-xs uppercase tracking-[0.3em] mb-6 text-white/50 group-hover:text-black/50">
                    <EditableText value={theme?.customTexts?.noir_footer_status || '[ SYSTEM ALIGNMENT READY ]'} field="noir_footer_status" entity="appearance" isEditor={isEditor} maxLength={30} as="span" />
                </span>
                <h2 className="font-sans font-black text-[12cqw] @md:text-6xl @lg:text-[8cqw] leading-[1] uppercase tracking-tighter break-words">
                    {isCopied ? 'DATA COPIED' : <EditableText value={theme?.customTexts?.noir_footer_connect || 'CONNECT'} field="noir_footer_connect" entity="appearance" isEditor={isEditor} maxLength={20} as="span" />}
                </h2>
            </motion.div>

            <motion.div variants={wireframeReveal} className="w-full flex flex-col @md:flex-row justify-between items-center p-6 gap-6 font-mono text-[10px] uppercase text-white/50">
                <span>
                    <EditableText value={theme?.customTexts?.noir_footer_eof || 'END_OF_FILE'} field="noir_footer_eof" entity="appearance" isEditor={isEditor} maxLength={20} as="span" /> © {new Date().getFullYear()}
                </span>
                <div className="flex gap-4">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                            // {l.platform}
                        </a>
                    ))}
                </div>
            </motion.div>
        </motion.footer>
    );
};
