"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function BentoGridSkillsBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full mb-4 @lg:mb-6">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col p-6 @lg:p-10 w-full`}
            >
                <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-bolt text-[var(--hl)]"></i>
                    <EditableText entity="appearance" field="bentogrid_skills_title" value={getCustomText('bentogrid_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                </h3>
                
                <div className="grid gap-4 grid-cols-1 @md:grid-cols-2">
                    {[1, 2, 3, 4].map((num) => {
                        const defaultName = num === 1 ? 'Frontend Development' : num === 2 ? 'UI/UX Design' : num === 3 ? 'Backend Systems' : 'Creative Direction';
                        const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : num === 3 ? '85' : '90';
                        const val = parseInt(getCustomText(`bentogrid_skill_prof_${num}`, defaultProficiency) || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <div key={num} className={`${cardStyleClass} ${cardRadiusClass} p-5 hover:bg-white/5 transition-colors`}>
                                <div className="flex justify-between items-center mb-4 text-base @md:text-lg font-bold text-white">
                                    <span>
                                        <EditableText 
                                            entity="appearance" 
                                            field={`bentogrid_skill_name_${num}`} 
                                            value={getCustomText(`bentogrid_skill_name_${num}`, defaultName)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                    <span className="text-[var(--hl)]">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`bentogrid_skill_prof_${num}`} 
                                            value={getCustomText(`bentogrid_skill_prof_${num}`, defaultProficiency)} 
                                            isEditor={isEditor} 
                                            maxLength={3} 
                                            as="span" 
                                        />%
                                    </span>
                                </div>
                                <div className={`w-full h-2 ${isEditor ? '' : 'overflow-hidden'} bg-white/10 rounded-full`}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${safeVal}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                        className={`h-full bg-[var(--hl)] rounded-full`}
                                        style={isEditor ? { width: `${safeVal}%` } : undefined}
                                    ></motion.div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
