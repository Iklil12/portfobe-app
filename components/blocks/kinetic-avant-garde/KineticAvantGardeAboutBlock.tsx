"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export function KineticAvantGardeAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const containerRef = useRef<HTMLDivElement>(null);
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    useGSAP(() => {
        if (isCardPreview) return;
        
        gsap.to('.clip-mask', {
            clipPath: 'inset(0 0% 0 0)',
            ease: 'none',
            scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: 'bottom bottom', 
                scrub: 1,
                pin: false
            }
        });

        gsap.to('.spin-slow', {
            rotation: 360,
            duration: 20,
            repeat: -1,
            ease: 'linear'
        });
    }, { scope: containerRef, dependencies: [isEditor, isCardPreview] });

    return (
        <section ref={containerRef} className="h-[200vh] relative kag-bg-bone" id="statement-trigger">
            <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-20 overflow-hidden">
                
                {/* Brutalist Grid Background */}
                <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: 'clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)' }}></div>
                
                {/* Corner Crosshairs */}
                <div className="absolute top-10 left-10 w-8 h-8 border-t-2 border-l-2 border-black/20 pointer-events-none"></div>
                <div className="absolute top-10 right-10 w-8 h-8 border-t-2 border-r-2 border-black/20 pointer-events-none"></div>
                <div className="absolute bottom-10 left-10 w-8 h-8 border-b-2 border-l-2 border-black/20 pointer-events-none"></div>
                <div className="absolute bottom-10 right-10 w-8 h-8 border-b-2 border-r-2 border-black/20 pointer-events-none"></div>

                {/* Spinning Asterisk */}
                <div className="absolute -top-[10vh] -right-[5vw] text-[40vw] leading-none kag-text-void opacity-[0.03] spin-slow pointer-events-none select-none font-sans">*</div>

                {/* Info Badge */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-20 flex items-center gap-3">
                    <div className="w-2 h-2 bg-black animate-pulse"></div>
                    <span className="font-kag-mono text-[10px] uppercase tracking-widest kag-text-void font-bold">MANIFESTO_SYS_ACTIVE</span>
                </div>

                <div className="relative w-full max-w-7xl mx-auto flex flex-col justify-center h-full z-10">
                    {/* Ghost Text Layer */}
                    <h2 className="font-kag-serif text-[clamp(2.5rem,6vw,7rem)] leading-[1.05] kag-text-void opacity-15 select-none break-words">
                        <EditableText as="span" className="!whitespace-normal inline" entity="appearance" field="kag_statement" value={getCustomText('kag_statement', 'Desain sejati tidak pernah meminta izin. Ia datang, ia menata ulang ruang, dan ia meninggalkan')} isEditor={isEditor} /> 
                        <span className="font-kag-brutal uppercase kag-text-void opacity-20 tracking-wider ml-2 lg:ml-4 inline-block">
                            <EditableText as="span" className="!whitespace-normal" entity="appearance" field="kag_statement_highlight" value={getCustomText('kag_statement_highlight', 'jejak abadi')} isEditor={isEditor} />
                        </span>.
                    </h2>
                    
                    {/* Fill Text Layer */}
                    <h2 className="absolute top-1/2 -translate-y-1/2 left-0 w-full font-kag-serif text-[clamp(2.5rem,6vw,7rem)] leading-[1.05] kag-text-blood select-none clip-mask pointer-events-none break-words" style={{ clipPath: 'inset(0 100% 0 0)' }}>
                        {getCustomText('kag_statement', 'Desain sejati tidak pernah meminta izin. Ia datang, ia menata ulang ruang, dan ia meninggalkan')} 
                        <span className="font-kag-brutal uppercase kag-text-void tracking-wider ml-2 lg:ml-4 inline-block relative">
                            {/* Underline accent on highlighted word */}
                            <span className="absolute -bottom-1 left-0 w-full h-[0.1em] kag-bg-void"></span>
                            {getCustomText('kag_statement_highlight', 'jejak abadi')}
                        </span>.
                    </h2>
                </div>

                {/* Bottom Stats Line */}
                <div className="absolute bottom-10 left-20 right-20 hidden md:flex justify-between items-center border-t border-black/10 pt-4 pointer-events-none">
                    <span className="font-kag-mono text-[10px] uppercase tracking-widest kag-text-void opacity-50">SCROLL TO REVEAL</span>
                    <span className="font-kag-mono text-[10px] uppercase tracking-widest kag-text-void opacity-50">VOL.01</span>
                </div>
            </div>
        </section>
    );
}
