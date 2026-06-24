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
    }, { scope: containerRef, dependencies: [isEditor, isCardPreview] });

    return (
        <section ref={containerRef} className="h-[200vh] relative kag-bg-bone" id="statement-trigger">
            <div className="sticky top-0 h-screen flex flex-col justify-center px-6 md:px-20 overflow-hidden">
                <div className="relative w-full max-w-6xl mx-auto">
                    <h2 className="font-kag-serif text-4xl md:text-7xl lg:text-8xl leading-tight kag-text-void opacity-20 select-none">
                        <EditableText as="span" className="!break-normal !whitespace-normal" entity="appearance" field="kag_statement" value={getCustomText('kag_statement', 'Desain sejati tidak pernah meminta izin. Ia datang, ia menata ulang ruang, dan ia meninggalkan')} isEditor={isEditor} /> 
                        <span className="font-kag-brutal uppercase kag-text-void opacity-20 tracking-wider ml-2">
                            <EditableText as="span" className="!break-normal !whitespace-normal" entity="appearance" field="kag_statement_highlight" value={getCustomText('kag_statement_highlight', 'jejak abadi')} isEditor={isEditor} />
                        </span>.
                    </h2>
                    
                    <h2 className="absolute top-0 left-0 font-kag-serif text-4xl md:text-7xl lg:text-8xl leading-tight kag-text-blood select-none clip-mask pointer-events-none" style={{ clipPath: 'inset(0 100% 0 0)' }}>
                        {getCustomText('kag_statement', 'Desain sejati tidak pernah meminta izin. Ia datang, ia menata ulang ruang, dan ia meninggalkan')} 
                        <span className="font-kag-brutal uppercase kag-text-void tracking-wider ml-2">
                            {getCustomText('kag_statement_highlight', 'jejak abadi')}
                        </span>.
                    </h2>
                </div>
            </div>
        </section>
    );
}
