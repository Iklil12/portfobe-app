"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const profession = data?.profile?.profession || data?.profession || "Creative Director";

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
            className="w-full overflow-hidden py-10 -my-10"
        >
            <div className={`acid-bg text-[#09090b] py-3 overflow-hidden border-y-4 border-[#09090b] -rotate-2 scale-105 relative z-20 shadow-[0_0_50px_rgba(223,255,0,0.2)] my-10 group`}>
                <div className={`w-[200%] flex animate-marquee group-hover:[animation-play-state:paused] acid-heading font-bold text-2xl @md:text-4xl uppercase tracking-tighter`}>
                    <MarqueeContent />
                    <MarqueeContent isDuplicate={true} />
                </div>
            </div>
        </motion.div>
    );
}
