"use client";

import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function CinematicMarqueeBlock({ data, theme, isEditor }: any) {
    const profession = data?.profile?.profession || data?.profession || "Director & Editor";

    const MarqueeContent = ({ isDuplicate = false }) => (
        <div className="flex items-center space-x-6 px-4">
            {[...Array(4)].map((_, i) => (
                <React.Fragment key={isDuplicate ? i + 10 : i}>
                    <EditableText 
                        value={profession} 
                        field="profession" 
                        entity="profile" 
                        isEditor={isEditor} 
                        as="span"
                        className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                    />
                    <span>•</span>
                    <EditableText 
                        value={theme?.customTexts?.cinematic_marquee_1 || 'CINEMATIC VISION'} 
                        field="cinematic_marquee_1" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="span"
                        className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                    />
                    <span>•</span>
                    <EditableText 
                        value={theme?.customTexts?.cinematic_marquee_2 || 'VISUAL STORYTELLING'} 
                        field="cinematic_marquee_2" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="span"
                        className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                    />
                    <span>•</span>
                    <EditableText 
                        value={theme?.customTexts?.cinematic_marquee_3 || 'AVAILABLE WORLDWIDE'} 
                        field="cinematic_marquee_3" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="span"
                        className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                    />
                    <span>•</span>
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <div className={`w-full bg-white text-black py-3 overflow-hidden border-y border-white cine-heading`}>
            <div className={`flex whitespace-nowrap animate-marquee font-black uppercase tracking-tighter text-xl @md:text-3xl`}>
                <MarqueeContent />
                <MarqueeContent isDuplicate={true} />
            </div>
        </div>
    );
}
