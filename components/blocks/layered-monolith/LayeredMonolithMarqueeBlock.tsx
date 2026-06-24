"use client";

import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function LayeredMonolithMarqueeBlock({ theme, isEditor }: any) {
    return (
        <section className="w-full relative z-10 overflow-hidden bg-[#F5F5F0] text-[#1A1A18] py-4 border-b border-black/10">
            <div className="w-[200%] flex animate-marquee font-display text-xs uppercase tracking-widest opacity-70 whitespace-nowrap">
                <div className={`flex items-center px-6`}>
                    {[...Array(6)].map((_, i) => (
                        <React.Fragment key={i}>
                            <EditableText 
                                value={theme?.customTexts?.lm_marquee_1 || 'CREATIVE DIRECTION'} 
                                field="lm_marquee_1" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                                maxLength={30} 
                                className="mx-8 !break-normal !whitespace-nowrap inline-block pointer-events-auto"
                            />
                            <span>&bull;</span>
                            <EditableText 
                                value={theme?.customTexts?.lm_marquee_2 || 'WEBGL DEVELOPMENT'} 
                                field="lm_marquee_2" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                                maxLength={30} 
                                className="mx-8 !break-normal !whitespace-nowrap inline-block pointer-events-auto"
                            />
                            <span>&bull;</span>
                            <EditableText 
                                value={theme?.customTexts?.lm_marquee_3 || 'SPATIAL UI/UX'} 
                                field="lm_marquee_3" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                                maxLength={30} 
                                className="mx-8 !break-normal !whitespace-nowrap inline-block pointer-events-auto"
                            />
                            <span>&bull;</span>
                        </React.Fragment>
                    ))}
                </div>
                <div className={`flex items-center px-6`}>
                    {[...Array(6)].map((_, i) => (
                        <React.Fragment key={i + 10}>
                            <span className="mx-8">{theme?.customTexts?.lm_marquee_1 || 'CREATIVE DIRECTION'}</span>
                            <span>&bull;</span>
                            <span className="mx-8">{theme?.customTexts?.lm_marquee_2 || 'WEBGL DEVELOPMENT'}</span>
                            <span>&bull;</span>
                            <span className="mx-8">{theme?.customTexts?.lm_marquee_3 || 'SPATIAL UI/UX'}</span>
                            <span>&bull;</span>
                        </React.Fragment>
                    ))}
                </div>
            </div>
        </section>
    );
}
