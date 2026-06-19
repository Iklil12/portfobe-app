"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const profession = data?.profile?.profession || data?.profession || "Creative Director";

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const MarqueeContent = ({ isDuplicate = false }) => (
        <div className="flex items-center gap-8 px-4">
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
                    <span>///</span>
                    <EditableText 
                        value={theme?.customTexts?.acid_marquee_1 || 'ACID TECH VISION'} 
                        field="acid_marquee_1" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="span"
                        className="!break-normal !whitespace-nowrap inline-block pointer-events-auto"
                    />
                    <span>///</span>
                </React.Fragment>
            ))}
        </div>
    );

    return (
        <motion.div 
            initial={{ opacity: 0 }} 
            {...{ [animationTrigger]: { opacity: 1 } }} 
            viewport={{ once: true, amount: 0 }} 
            transition={{ duration: 1 }}
            className="w-full overflow-hidden bg-black font-mono"
            style={{ '--tc': themeColor } as React.CSSProperties}
        >
            <div className="w-full bg-black text-[var(--tc)] py-4 overflow-hidden border-y border-[var(--tc)]/20 relative z-20 shadow-[0_0_15px_rgba(0,255,0,0.05)] group">
                <div className="w-[200%] flex animate-marquee group-hover:[animation-play-state:paused] font-bold text-lg @md:text-xl uppercase tracking-[0.15em]">
                    <MarqueeContent />
                    <MarqueeContent isDuplicate={true} />
                </div>
            </div>
        </motion.div>
    );
}
