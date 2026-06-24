"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeFooterBlock({ data, theme, isEditor }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "VISUAL REBEL";
    const subdomain = data?.profile?.subdomain || data?.subdomain || "username";
    const userEmail = data?.email || data?.user?.email || `halo@${subdomain}.art`;
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <footer className="kag-bg-bone kag-text-void py-20 px-10 relative overflow-hidden z-10">
            <div className="max-w-7xl mx-auto flex flex-col items-center">
                <div className="font-kag-mono uppercase tracking-widest text-sm kag-text-blood font-bold mb-4 text-center">
                    <EditableText as="p" entity="appearance" field="kag_footer_subtitle" value={getCustomText('kag_footer_subtitle', 'Jangan Ragu.')} isEditor={isEditor} />
                </div>
                <a href={`mailto:${userEmail}`} className="font-kag-brutal text-[12vw] leading-none hover:kag-text-blood transition-colors duration-300 hover-trigger text-center w-full block">
                    <EditableText entity="appearance" field="kag_footer_title" value={getCustomText('kag_footer_title', 'SAPA KAMI')} isEditor={isEditor} />
                </a>
                
                <div className="w-full flex flex-col md:flex-row justify-between items-center mt-20 font-kag-mono text-xs uppercase tracking-widest border-t border-black/20 pt-8 gap-6 md:gap-0">
                    <p>© {new Date().getFullYear()} {fullName.toUpperCase()}</p>
                    <div className="flex gap-8">
                        {data?.links?.map((link: any, i: number) => (
                            <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="hover-trigger hover:kag-text-blood transition-colors">{link.title}</a>
                        ))}
                        {!data?.links?.length && (
                            <>
                                <a href="#" className="hover-trigger hover:kag-text-blood transition-colors">Instagram</a>
                                <a href="#" className="hover-trigger hover:kag-text-blood transition-colors">Behance</a>
                            </>
                        )}
                    </div>
                    <p>JAKARTA — SELURUH DUNIA</p>
                </div>
            </div>
        </footer>
    );
}
