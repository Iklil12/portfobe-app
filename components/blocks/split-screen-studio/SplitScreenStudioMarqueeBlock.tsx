"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function SplitScreenStudioMarqueeBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <div className="w-full overflow-hidden py-4 border-y border-white/10 bg-[#020202]">
            <div className="flex whitespace-nowrap animate-marquee text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-white/50">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 mx-4 shrink-0">
                        <EditableText 
                            entity="appearance" 
                            field="marquee_text" 
                            value={getCustomText('marquee_text', 'INNOVATION • DESIGN • TECHNOLOGY')} 
                            isEditor={isEditor} 
                            maxLength={100} 
                            as="span"
                            className="!break-normal !whitespace-nowrap inline-block pointer-events-auto hover:text-white transition-colors"
                        />
                        <span className="text-[var(--hl)]">●</span>
                    </div>
                ))}
            </div>
        </div>
    );
}

