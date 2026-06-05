import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function LayeredMonolithHeroBlock({ data, theme, isEditor = false, blockId }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "Elevate Studio";
    const profession = data?.profile?.profession || data?.profession || "Digital Architecture";
    const bio = data?.profile?.bio || data?.bio || "Merging architectural precision with dynamic interaction to build flagship digital products for visionary brands.";
    
    // Fallback to custom font if needed
    const fontHeading = theme?.fontHeading || 'Space Grotesk';
    const getFontFamily = (f: string) => {
        if (f?.toLowerCase().includes('space grotesk')) return "'Space Grotesk', sans-serif";
        if (f?.toLowerCase().includes('manrope')) return "'Manrope', sans-serif";
        if (f?.toLowerCase().includes('mono')) return "'Space Mono', monospace";
        if (f?.toLowerCase().includes('serif')) return "'Playfair Display', serif";
        return "'Inter', sans-serif";
    };
    const customHeadingFont = getFontFamily(fontHeading);

    return (
        <section id="hero" className="stack-card bg-[#F5F5F0] flex flex-col justify-between overflow-hidden relative text-[#1A1A18]" >
            <div id="nav-hero" className="absolute -top-20 w-full h-0 pointer-events-none invisible"></div>
            <div className="noise mix-blend-multiply"></div>
            
            <div className="absolute top-8 right-8 md:top-12 md:right-12 z-20 w-24 h-24 md:w-32 md:h-32 opacity-60">
                <svg className="animate-spin-slow w-full h-full" viewBox="0 0 100 100">
                    <path id={`circlePath-${blockId}`} fill="none" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" />
                    <text fontFamily={customHeadingFont} fontSize="10" fontWeight="600" letterSpacing="2" fill="#1A1A18">
                        <textPath href={`#circlePath-${blockId}`}>
                            {isEditor ? (
                                <tspan>{theme?.customTexts?.lm_badge_text || 'EST. 2026 • INDEPENDENT STUDIO •'}</tspan>
                            ) : (
                                <EditableText value={theme?.customTexts?.lm_badge_text || 'EST. 2026 • INDEPENDENT STUDIO •'} field="lm_badge_text" entity="appearance" isEditor={isEditor} as="tspan" maxLength={45} />
                            )}
                        </textPath>
                    </text>
                </svg>
            </div>

            <header className="p-8 md:p-12 relative z-10 w-full">
                <h1 className="font-display font-bold text-xl md:text-2xl tracking-tight">
                    <EditableText value={fullName.split(' ')[0].toUpperCase()} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={15} />
                    <sup className="text-xs ml-1 opacity-50">TM</sup>
                </h1>
            </header>

            <div className="grow flex flex-col justify-center items-center text-center relative z-10 w-full px-4">
                <p className="font-body font-medium text-brand-accent tracking-[0.3em] uppercase text-xs md:text-sm mb-6">
                    <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
                </p>
                <h2 className="font-display text-6xl md:text-[8rem] lg:text-[10rem] font-bold uppercase leading-[0.85] tracking-tighter cursor-hover" data-cursor-text="SCROLL">
                    <EditableText value={theme?.customTexts?.lm_hero_h1 || 'Shaping'} field="lm_hero_h1" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /><br/>
                    <EditableText value={theme?.customTexts?.lm_hero_h2 || 'The'} field="lm_hero_h2" entity="appearance" isEditor={isEditor} as="span" maxLength={15} /><br/>
                    <span className="italic font-light">
                        <EditableText value={theme?.customTexts?.lm_hero_h3 || 'Unseen.'} field="lm_hero_h3" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                    </span>
                </h2>
                <div className="mt-8 md:mt-12 flex justify-center w-full">
                    <p className="font-body text-sm md:text-base max-w-md text-[#1A1A18]/60 leading-relaxed font-medium">
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={200} />
                    </p>
                </div>
            </div>

        </section>
    );
}
