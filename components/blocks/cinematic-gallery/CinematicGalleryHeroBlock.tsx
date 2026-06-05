"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryHeroBlock(props: any) {
    const { isEditor, data, theme } = useCinematicGallery();

    const profession = data?.profile?.profession || data?.profession || "Seni Berdiam";
    
    // We render Marquee internally here as requested by the user
    return (
        <section className="panel flex-col items-center text-center justify-center">
            <div className="reveal-mask pb-2">
                <h1 className="font-serif cg-text-huge italic panel-text">
                    <EditableText value={theme?.customTexts?.cg_hero_1 || 'Seni'} field="cg_hero_1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="inline-block !break-normal" />
                </h1>
            </div>
            <div className="reveal-mask mt-2 md:mt-0 pb-2">
                <h1 className="font-sans cg-text-huge font-bold uppercase panel-text">
                    <EditableText value={theme?.customTexts?.cg_hero_2 || 'Berdiam'} field="cg_hero_2" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="inline-block !break-normal" />
                </h1>
            </div>
            
            {/* Embedded Marquee functionality (profession ticker) */}
            <div className="absolute bottom-6 md:bottom-12 left-0 w-full overflow-hidden fade-text opacity-70">
                <div className="flex whitespace-nowrap animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] group font-sans text-[10px] md:text-sm tracking-[0.3em] uppercase text-[#8b8b8b]">
                    <div className="flex items-center space-x-6 px-4 shrink-0">
                        {[...Array(6)].map((_, i) => (
                            <React.Fragment key={i}>
                                <span className="!whitespace-nowrap !inline-block"><EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" className="pointer-events-auto !whitespace-nowrap !inline-block" /></span>
                                <span className="!inline-block">—</span>
                            </React.Fragment>
                        ))}
                    </div>
                    <div className="flex items-center space-x-6 px-4 pointer-events-none shrink-0" aria-hidden="true">
                        {[...Array(6)].map((_, i) => (
                            <React.Fragment key={i + 10}>
                                <span className="!whitespace-nowrap !inline-block">{profession}</span>
                                <span className="!inline-block">—</span>
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>

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
