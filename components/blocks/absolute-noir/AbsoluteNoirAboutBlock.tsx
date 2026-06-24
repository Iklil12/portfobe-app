"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export const AbsoluteNoirAboutBlock = ({ data, theme, isEditor, isCardPreview }: any) => {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const authorName = data?.profile?.fullName || data?.fullName || "SYSTEM_OPERATOR";

    return (
        <motion.section 
            initial="hidden" 
            {...{ [animationTrigger]: "visible" }} 
            viewport={{ once: true, amount: 0 }} 
            variants={staggerGrid} 
            className="w-full py-16 md:py-24 px-8 md:pl-24 md:pr-16 wire-border-b bg-[#050505] text-white relative"
        >
            {/* Left side: Vertical rotated label - positioned absolutely to prevent layout stretching */}
            <div className="hidden md:block absolute left-8 top-24 font-mono text-[9px] uppercase tracking-[0.3em] text-white/30 select-none [writing-mode:vertical-lr] rotate-180">
                <EditableText 
                    value={theme?.customTexts?.noir_about_vertical || 'SYS_REF_DOSSIER // 01'} 
                    field="noir_about_vertical" 
                    entity="appearance" 
                    isEditor={isEditor} 
                    maxLength={30} 
                    as="span" 
                />
            </div>

            {/* Right side: Main content */}
            <div className="w-full flex flex-col">
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-4 text-white/50 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-white"></span>
                    <EditableText 
                        value={theme?.customTexts?.noir_about_label || '[ IDENTIFICATION_DATA ]'} 
                        field="noir_about_label" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={30} 
                        as="span" 
                    />
                </span>
                
                <h2 className="font-sans font-black text-4xl md:text-6xl tracking-tighter uppercase mb-8 leading-none">
                    <EditableText 
                        value={theme?.customTexts?.noir_about_title || 'OPERATIVE BACKGROUND'} 
                        field="noir_about_title" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={40} 
                        as="span" 
                    />
                </h2>

                {/* Subtitle/Mission Callout in Large Font */}
                <div className="font-sans font-bold text-lg md:text-2xl uppercase tracking-tight text-white mb-8 border-b border-white/10 pb-8 leading-snug">
                    <EditableText 
                        value={theme?.customTexts?.noir_about_subtitle || 'ARCHITECTING CLEAN DIGITAL SYSTEMS WITH MINIMAL COGNITIVE OVERHEAD.'} 
                        field="noir_about_subtitle" 
                        entity="appearance" 
                        isEditor={isEditor} 
                        maxLength={120} 
                        as="h3" 
                    />
                </div>

                {/* Body text split into columns like a high-end magazine page */}
                <div className="font-mono text-xs md:text-sm text-white/70 leading-relaxed grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    <div>
                        <EditableText 
                            value={theme?.customTexts?.noir_about_desc || 'Detailed system logs indicate a history of high-performance output, meticulous attention to structural integrity, and an uncompromising approach to aesthetic minimalism.'} 
                            field="noir_about_desc" 
                            entity="appearance" 
                            isEditor={isEditor} 
                            as="p" 
                            maxLength={400} 
                        />
                    </div>
                    <div className="flex flex-col justify-between h-full pt-0">
                        <div>
                            <EditableText 
                                value={theme?.customTexts?.noir_about_desc2 || 'Every interface is engineered as a functional blueprint, eliminating unnecessary visual decors to focus purely on core utility, performance speed, and responsive grid alignment.'} 
                                field="noir_about_desc2" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="p" 
                                maxLength={400} 
                            />
                        </div>
                        
                        {/* Minimalist Signature Metadata */}
                        <div className="mt-8 pt-4 border-t border-dashed border-white/10 flex justify-between font-mono text-[9px] text-white/40">
                            <span>VERIFIED BY // {authorName.toUpperCase()}</span>
                            <span>STATUS: NOMINAL</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.section>
    );
};
