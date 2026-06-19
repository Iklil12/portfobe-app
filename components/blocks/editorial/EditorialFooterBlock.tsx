import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const [isCopied, setIsCopied] = useState(false);

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const links = data?.links?.filter((l: any) => l.isActive) || data?.user?.links?.filter((l: any) => l.isActive) || [];

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    return (
        <footer className={`w-full bg-[#fdfdfc] flex flex-col items-center justify-center pt-12 @md:pt-32 pb-12 px-6 @md:px-12 @lg:px-20`}>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="flex flex-col items-center text-center w-full max-w-4xl mx-auto mb-24 @md:mb-40">
                <span className="font-sans text-[10px] @md:text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-8">
                    <EditableText value={theme?.customTexts?.editorial_footer_top || "What's Next?"} field="editorial_footer_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </span>

                <div onClick={handleCopyEmail} className="cursor-pointer group relative w-full">
                    <h2 className={`font-sans font-bold tracking-tighter text-[#111] leading-[0.9] transition-colors duration-500 text-[15cqw] @md:text-[10cqw]`}>
                        <EditableText value={theme?.customTexts?.editorial_footer_t1 || "LET'S"} field="editorial_footer_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.editorial_footer_t2 || 'TALK'} field="editorial_footer_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-300 group-hover:text-[var(--hl)] transition-colors" maxLength={20} />
                    </h2>

                    {/* Hover Popup Message */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#111] text-white px-6 py-3 rounded-full font-sans text-sm font-medium opacity-0 group-hover:opacity-100 transform scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none shadow-xl flex items-center gap-2">
                        {isCopied ? 'Email Copied!' : <EditableText value={theme?.customTexts?.editorial_footer_copy || 'Click to Copy Email'} field="editorial_footer_copy" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />} <i className={isCopied ? 'fas fa-check text-green-400' : 'far fa-copy text-slate-400'}></i>
                    </div>
                </div>
            </motion.div>

            {/* Bottom Links */}
            <div className="w-full max-w-[1600px] mx-auto flex flex-col @md:flex-row justify-between items-center gap-6 pt-8 border-t border-subtle font-sans text-xs font-medium text-slate-500">
                <div className="flex items-center gap-2">
                    <span>© {new Date().getFullYear()} <EditableText value={fullName} field="fullName" entity="profile" isEditor={isEditor} as="span" maxLength={30} />.</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full mx-2"></span>
                    <span><EditableText value={theme?.customTexts?.editorial_footer_rights || 'All rights reserved.'} field="editorial_footer_rights" entity="appearance" isEditor={isEditor} as="span" maxLength={40} /></span>
                </div>

                <div className="flex items-center gap-6">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-[var(--hl)] hover:underline transition-colors uppercase tracking-widest font-bold text-[10px]">
                            {l.platform}
                        </a>
                    ))}
                </div>

                <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors font-bold uppercase tracking-widest text-[10px]">
                    PORTFO.BE/{subdomain.toUpperCase()}
                </Link>
            </div>

        </footer>
    );
}
