"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};

export const AbsoluteNoirMarqueeBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";

    return (
        <motion.div 
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={wireframeReveal} 
            className="w-full wire-border-b overflow-hidden bg-white text-black py-2 pt-8 @md:pt-2"
        >
            <div className="flex animate-ticker font-mono text-xs font-bold uppercase tracking-[0.2em] whitespace-nowrap w-max">
                {[...Array(8)].map((_, i) => (
                    <div key={i} className="flex items-center gap-8 px-4 pr-8">
                        <EditableText value={theme?.customTexts?.noir_ticker_title || 'PORTFO_BE V.2.0'} field="noir_ticker_title" entity="appearance" isEditor={isEditor} maxLength={25} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                        <EditableText value={theme?.customTexts?.noir_ticker_status || '[ STATUS: ACTIVE ]'} field="noir_ticker_status" entity="appearance" isEditor={isEditor} maxLength={25} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                        <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={20} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                        <EditableText value={theme?.customTexts?.noir_ticker_location || 'LOCATION: ID'} field="noir_ticker_location" entity="appearance" isEditor={isEditor} maxLength={20} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto" />
                    </div>
                ))}
            </div>
        </motion.div>
    );
};
