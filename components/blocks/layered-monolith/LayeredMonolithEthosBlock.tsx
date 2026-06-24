import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function LayeredMonolithEthosBlock({ data, theme, isEditor = false }: any) {
    return (
        <section id="philosophy" className="stack-card bg-[#1A1A18] text-[#F5F5F0] py-10 md:py-16 px-8 md:px-16 flex flex-col justify-center relative" >
            <div id="nav-philosophy" className="absolute -top-20 w-full h-0 pointer-events-none invisible"></div>
            <div className="noise mix-blend-overlay opacity-20"></div>
            
            <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col gap-6 md:gap-8">
                <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4">
                    <EditableText value={theme?.customTexts?.lm_ethos_label || '00 — The Ethos'} field="lm_ethos_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </p>
                
                <h2 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold uppercase tracking-tighter leading-[1.1] max-w-4xl cursor-hover" data-cursor-text="READ">
                    <EditableText value={theme?.customTexts?.lm_ethos_h1 || "We don't just design interfaces. We engineer"} field="lm_ethos_h1" entity="appearance" isEditor={isEditor} as="span" maxLength={100} />{' '}
                    <span className="italic font-light text-brand-accent">
                        <EditableText value={theme?.customTexts?.lm_ethos_h2 || "digital legacies"} field="lm_ethos_h2" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </span>{' '}
                    <EditableText value={theme?.customTexts?.lm_ethos_h3 || "that command attention."} field="lm_ethos_h3" entity="appearance" isEditor={isEditor} as="span" maxLength={50} />
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-16 mt-4 pt-4 md:mt-6 md:pt-6 border-t border-white/10">
                    <div className="font-body text-xs md:text-sm text-white/60 leading-relaxed">
                        <EditableText value={theme?.customTexts?.lm_ethos_desc || 'In a sea of templates and standard grids, we choose rebellion guided by discipline. Every pixel, motion, and interaction is calculated to evoke emotion and establish authority for our partners.'} field="lm_ethos_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
                    </div>
                    <div className="flex gap-4 items-start">
                        <div className="w-2 h-2 rounded-full bg-brand-accent mt-2"></div>
                        <p className="font-display text-[10px] md:text-xs uppercase tracking-widest leading-loose">
                            <EditableText value={theme?.customTexts?.lm_location || 'Based in Sampang, IDN.'} field="lm_location" entity="appearance" isEditor={isEditor} as="span" maxLength={30} /><br/>
                            Operating Globally.<br/>
                            Est. MMXVI
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
