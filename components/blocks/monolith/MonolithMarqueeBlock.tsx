"use client";

import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function MonolithMarqueeBlock({ theme, isEditor }: any) {
    return (
        <section className={`w-full overflow-hidden bg-white text-black py-8 @md:py-12 border-b border-black/10`}>
            <div className={`w-[200%] flex animate-marquee font-serif italic text-outline-black whitespace-nowrap text-5xl @md:text-8xl`}>
                <div className={`flex items-center gap-12 px-6`}>
                    {[...Array(5)].map((_, i) => (
                        <React.Fragment key={i}>
                            <EditableText 
                                value={theme?.customTexts?.monolith_marquee_text || 'Aesthetics'} 
                                field="monolith_marquee_text" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                                maxLength={30} 
                                className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                            />
                            <span>&bull;</span>
                            <EditableText 
                                value={theme?.customTexts?.monolith_marquee_text2 || 'Engineering'} 
                                field="monolith_marquee_text2" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                                maxLength={30} 
                                className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                            />
                            <span>&bull;</span>
                        </React.Fragment>
                    ))}
                </div>
                <div className={`flex items-center gap-12 px-6`}>
                    {[...Array(5)].map((_, i) => (
                        <React.Fragment key={i + 10}>
                            <span>{theme?.customTexts?.monolith_marquee_text || 'Aesthetics'}</span>
                            <span>&bull;</span>
                            <span>{theme?.customTexts?.monolith_marquee_text2 || 'Engineering'}</span>
                            <span>&bull;</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
