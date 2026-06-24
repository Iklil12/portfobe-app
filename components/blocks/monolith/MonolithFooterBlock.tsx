"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { EditableText } from '@/shared/ui/EditableText';

export function MonolithFooterBlock({ data, theme, isEditor, isCardPreview }: any) {
    const [isCopied, setIsCopied] = useState(false);

    const fullName = data?.profile?.fullName || data?.fullName || "Budi Arsitek";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `hello@${subdomain}.com`;
    const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

    const handleCopyEmail = (e: React.MouseEvent) => {
        e.preventDefault();
        navigator.clipboard.writeText(userEmail);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <footer className={`relative z-[110] w-full bg-[#050505] flex flex-col pt-24 pb-8 px-6 @md:pt-32 @md:pb-12 @md:px-12`}>
            <div className={`flex flex-col items-center text-center mb-32`}>
                <span className={`font-sans font-bold uppercase tracking-[0.3em] text-[var(--hl)] text-xs mb-8`}>
                    <EditableText value={theme?.customTexts?.monolith_footer_project || 'Got a project in mind?'} field="monolith_footer_project" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </span>
                
                <div onClick={handleCopyEmail} className="cursor-pointer group relative">
                    <h2 className={`font-serif leading-[0.8] text-white transition-colors duration-500 text-5xl @md:text-7xl @lg:text-[10cqi]`}>
                        <EditableText value={theme?.customTexts?.monolith_footer_title || "Let's"} field="monolith_footer_title" entity="appearance" isEditor={isEditor} as="span" maxLength={10} /> <span className="italic text-outline group-hover:text-[var(--hl)] group-hover:-webkit-text-stroke-0 transition-all duration-500"><EditableText value={theme?.customTexts?.monolith_footer_create || 'Create'} field="monolith_footer_create" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /></span>
                    </h2>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--hl)] text-black rounded-full font-sans font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transform scale-50 group-hover:scale-100 transition-all duration-300 shadow-2xl pointer-events-none px-4 py-2 text-[9px] @md:px-6 @md:py-3 @md:text-sm`}>
                        {isCopied ? 'Email Copied!' : 'Copy Email'}
                    </div>
                </div>
            </div>

            <div className={`w-full flex justify-between items-center border-t border-white/10 font-sans font-medium uppercase tracking-widest text-slate-500 flex-col gap-4 pt-6 text-[9px] @md:flex-row @md:gap-6 @md:pt-8 @md:text-xs`}>
                <div className="flex items-center gap-6">
                    {links.map((l: any, i: number) => (
                        <a key={i} href={l.url} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">
                            {l.platform}
                        </a>
                    ))}
                </div>
                <div className="flex items-center gap-4">
                    <span>© {new Date().getFullYear()} {fullName}.</span>
                    <Link href={`/${subdomain}`} className="hover:text-[var(--hl)] transition-colors">PORTFO.BE</Link>
                </div>
            </div>
        </footer>
    );
}
