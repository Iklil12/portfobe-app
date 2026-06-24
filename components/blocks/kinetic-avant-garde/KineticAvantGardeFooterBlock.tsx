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
        <footer className="kag-bg-void kag-text-bone relative z-10 min-h-[90vh] flex flex-col justify-between overflow-hidden" id="contact" style={{ '--accent': theme?.themeColor || '#c92a2a' } as any}>
            
            {/* Ultra-stark top border */}
            <div className="w-full h-[1px] bg-white/10"></div>

            <div className="flex-grow flex flex-col justify-center items-center px-4 w-full h-full relative group">
                <a href={isEditor ? undefined : `mailto:${userEmail}`} className={`absolute inset-0 z-20 cursor-pointer ${isEditor ? 'pointer-events-none' : ''}`}></a>
                
                {/* Elegant Subtitle */}
                <div className="font-kag-serif italic tracking-[0.2em] md:tracking-[0.4em] text-xs md:text-lg text-[#e6e4dc]/70 mb-12 md:mb-16 relative z-10 transition-transform duration-700 group-hover:-translate-y-4 max-w-full px-4 text-center break-words">
                    <EditableText as="span" entity="appearance" field="kag_footer_subtitle" value={getCustomText('kag_footer_subtitle', 'SEPAKAT UNTUK MENCIPTA')} isEditor={isEditor} />
                </div>

                {/* Massive Typography Interaction */}
                <div className="w-full flex justify-center items-center relative py-12 px-4 max-w-[100vw] min-h-[50vh]">
                    {/* Invisible Spacer to maintain layout height based on text size */}
                    <span className="font-kag-serif italic text-[clamp(4rem,20vw,24rem)] leading-[0.8] tracking-tighter opacity-0 pointer-events-none break-words text-center w-full max-w-[90rem]">
                        <EditableText entity="appearance" field="kag_footer_title" value={getCustomText('kag_footer_title', 'SAPA KAMI')} isEditor={false} as="span" />
                    </span>

                    {/* Beautiful Mixed Typography Group */}
                    <div className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] ${isEditor ? '' : 'group-hover:-translate-y-[80%] group-hover:opacity-0 group-hover:scale-95'} text-center w-full max-w-[90rem] px-4 flex justify-center items-center`}>
                        
                        <div className="relative inline-block w-full">
                            {/* Massive Brutalist Background Ghost Outline */}
                            <span className="absolute inset-0 w-full h-full flex items-center justify-center font-kag-brutal text-[clamp(4rem,20vw,24rem)] leading-[0.8] tracking-tighter text-transparent opacity-20 select-none pointer-events-none break-words scale-105 md:scale-[1.15]" style={{ WebkitTextStroke: '2px rgba(230,228,220,0.2)' }}>
                                <EditableText entity="appearance" field="kag_footer_title" value={getCustomText('kag_footer_title', 'SAPA KAMI')} isEditor={false} as="span" />
                            </span>

                            {/* Elegant Solid Serif Foreground */}
                            <span className={`relative flex items-center justify-center w-full font-kag-serif italic text-[clamp(4rem,20vw,24rem)] leading-[0.8] tracking-tighter text-[#e6e4dc] break-words drop-shadow-2xl ${isEditor ? 'z-30' : 'z-10'}`}>
                                <EditableText entity="appearance" field="kag_footer_title" value={getCustomText('kag_footer_title', 'SAPA KAMI')} isEditor={isEditor} as="span" className={isEditor ? "cursor-text" : ""} />
                            </span>

                            {/* Avant-Garde Spinning Accent */}
                            <span className="absolute -top-[10%] right-0 md:-right-[5%] text-[var(--accent)] font-kag-mono text-2xl md:text-6xl animate-[spin_10s_linear_infinite] opacity-60 pointer-events-none z-20">
                                ✺
                            </span>
                        </div>
                    </div>
                    
                    {/* Highly Structured Hover Reveal Email */}
                    <div className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.87,0,0.13,1)] translate-y-[80%] opacity-0 scale-105 ${isEditor ? '' : 'group-hover:translate-y-0 group-hover:opacity-100 group-hover:scale-100'} text-center w-full px-4 max-w-[90rem] flex flex-col items-center justify-center pointer-events-none`}>
                        <span className="font-kag-mono text-[8px] md:text-sm text-[var(--accent)] font-bold tracking-[0.5em] md:tracking-[1em] mb-4 md:mb-8 uppercase">
                            M E N G I R I M &nbsp; P E S A N &nbsp; K E :
                        </span>
                        <span className="font-kag-brutal text-[clamp(1.5rem,6vw,8rem)] uppercase tracking-tight text-[#e6e4dc] border-b-4 md:border-b-8 border-[var(--accent)] pb-2 md:pb-4 break-all leading-[0.9]">
                            {userEmail}
                        </span>
                    </div>
                </div>

                {/* Mobile Email Permanent Indicator */}
                <div className="md:hidden mt-12 font-kag-mono text-[9px] tracking-[0.2em] text-[#e6e4dc]/40 border-b border-[#e6e4dc]/20 pb-2 uppercase pointer-events-none">
                    Ketuk area ini untuk mengirim pesan &rarr;
                </div>
            </div>

            {/* Beautiful Stark Layout for Links */}
            <div className="w-full px-6 md:px-12 py-10 md:py-16 flex flex-col lg:flex-row justify-between items-center border-t border-white/10 gap-10 lg:gap-0">
                
                <p className="order-3 lg:order-1 font-kag-mono text-[9px] md:text-[11px] uppercase tracking-widest text-white/40">
                    © {new Date().getFullYear()} {fullName}.
                </p>

                <div className="flex flex-wrap justify-center gap-8 md:gap-16 order-1 lg:order-2">
                    {data?.links?.map((link: any, i: number) => (
                        <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="font-kag-brutal text-xs md:text-base uppercase tracking-[0.2em] text-[#e6e4dc] hover:text-[var(--accent)] transition-all duration-500 relative z-30 group flex items-center justify-center overflow-hidden py-2">
                            <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">{link.title}</span>
                            <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                        </a>
                    ))}
                    {!data?.links?.length && (
                        <>
                            <a href="#" className="font-kag-brutal text-xs md:text-base uppercase tracking-[0.2em] text-[#e6e4dc] hover:text-[var(--accent)] transition-all duration-500 relative z-30 group flex items-center justify-center overflow-hidden py-2">
                                <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">INSTAGRAM</span>
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                            </a>
                            <a href="#" className="font-kag-brutal text-xs md:text-base uppercase tracking-[0.2em] text-[#e6e4dc] hover:text-[var(--accent)] transition-all duration-500 relative z-30 group flex items-center justify-center overflow-hidden py-2">
                                <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">BEHANCE</span>
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                            </a>
                            <a href="#" className="font-kag-brutal text-xs md:text-base uppercase tracking-[0.2em] text-[#e6e4dc] hover:text-[var(--accent)] transition-all duration-500 relative z-30 group flex items-center justify-center overflow-hidden py-2">
                                <span className="relative z-10 transition-transform duration-500 group-hover:-translate-y-1">LINKEDIN</span>
                                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[var(--accent)] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-out"></span>
                            </a>
                        </>
                    )}
                </div>

                <p className="flex items-center gap-3 order-2 lg:order-3 font-kag-serif italic text-[11px] md:text-sm text-[#e6e4dc]/50">
                    <span className="w-1.5 h-1.5 bg-[var(--accent)] rotate-45 opacity-80"></span>
                    Hak Cipta Dilindungi
                </p>
            </div>
        </footer>
    );
}
