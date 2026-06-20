"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryHeroBlock(props: any) {
    const { isEditor, data, theme, isCardPreview, isMobileView } = useCinematicGallery();

    const profession = data?.profile?.profession || data?.profession || "Seni Berdiam";

    // We render Marquee internally here as requested by the user
    return (
        <section 
            className="panel flex-col items-center text-center justify-center relative overflow-hidden bg-[#050505]"
            style={!isCardPreview ? { width: '100vw' } : undefined}
        >
            {/* Curated Cinematic Background Image */}
            <div className="absolute inset-0 z-0 opacity-10 select-none pointer-events-none transition-all duration-1000 scale-105 group-hover:scale-100">
                <img 
                    src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2000&auto=format&fit=crop" 
                    alt="Cinematic Background" 
                    className="w-full h-full object-cover grayscale"
                />
            </div>
            
            {/* Cinematic Gradient overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#050505_100%)] z-[1] pointer-events-none" />

            {/* Corner Bracket / Crosshair Markers */}
            <div className="absolute inset-[6vh] md:inset-[10vh] border border-white/5 pointer-events-none z-10 rounded-sm">
                <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/20"></div>
                <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/20"></div>
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/20"></div>
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/20"></div>
            </div>

            {/* Elegant Focus Target Reticle in Center */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-white/10 rounded-full flex items-center justify-center pointer-events-none z-10">
                <div className="w-1.5 h-1.5 rounded-full bg-white/30 animate-pulse"></div>
            </div>

            {/* Main Title Content */}
            <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl px-4">
                <div className="reveal-mask pb-1">
                    <h1 className="font-serif cg-text-huge italic panel-text leading-[0.9] text-white">
                        <EditableText value={(theme?.customTexts?.cg_hero_1 && theme.customTexts.cg_hero_1.trim() !== '') ? theme.customTexts.cg_hero_1 : 'Seni'} field="cg_hero_1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="inline-block !break-normal" />
                    </h1>
                </div>
                <div className="reveal-mask mt-1 md:mt-2 pb-2">
                    <h1 className="font-sans cg-text-huge font-bold uppercase panel-text leading-[0.9] text-white tracking-wider">
                        <EditableText value={(theme?.customTexts?.cg_hero_2 && theme.customTexts.cg_hero_2.trim() !== '') ? theme.customTexts.cg_hero_2 : 'Berdiam'} field="cg_hero_2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="inline-block !break-normal" />
                    </h1>
                </div>
            </div>

            {/* Embedded Marquee functionality (profession ticker) */}
            {(() => {
                const marqueeItems = [
                    { key: 'cg_marq_1', default: 'DIREKSI KREATIF' },
                    { key: 'cg_marq_2', default: 'FOTOGRAFI' },
                    { key: 'cg_marq_3', default: 'EKSPLORASI DIGITAL' },
                    { key: 'cg_marq_4', default: 'SENI VISUAL' },
                    { key: 'cg_marq_5', default: 'DESAIN CINEMATIC' },
                    { key: 'cg_marq_6', default: 'ARAS DIGITAL' },
                ];

                const getMarqueeVal = (key: string, def: string) => {
                    const val = theme?.customTexts?.[key];
                    return (val && val.trim() !== '') ? val : def;
                };

                return (
                    <div className="absolute bottom-[7vh] md:bottom-[10vh] left-0 w-full overflow-hidden fade-text opacity-70">
                        <div className="flex whitespace-nowrap animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] group font-sans text-[10px] md:text-sm tracking-[0.3em] uppercase text-[#8b8b8b]">
                            {/* Interactive, editable first set */}
                            <div className="flex items-center space-x-6 px-4 shrink-0">
                                {marqueeItems.map((item) => (
                                    <React.Fragment key={item.key}>
                                        <span className="!whitespace-nowrap !inline-block">
                                            <EditableText 
                                                value={getMarqueeVal(item.key, item.default)} 
                                                field={item.key} 
                                                entity="appearance" 
                                                isEditor={isEditor} 
                                                as="span" 
                                                maxLength={30}
                                                className="pointer-events-auto !whitespace-nowrap !inline-block" 
                                            />
                                        </span>
                                        <span className="!inline-block">—</span>
                                    </React.Fragment>
                                ))}
                            </div>
                            {/* Static duplicate set for seamless infinite scroll */}
                            <div className="flex items-center space-x-6 px-4 pointer-events-none shrink-0" aria-hidden="true">
                                {marqueeItems.map((item) => (
                                    <React.Fragment key={`${item.key}-dup`}>
                                        <span className="!whitespace-nowrap !inline-block">
                                            {getMarqueeVal(item.key, item.default)}
                                        </span>
                                        <span className="!inline-block">—</span>
                                    </React.Fragment>
                                ))}
                            </div>
                        </div>
                    </div>
                );
            })()}

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                `
            }} />
        </section>
    );
}
