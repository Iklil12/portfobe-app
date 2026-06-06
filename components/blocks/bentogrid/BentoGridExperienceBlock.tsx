"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function BentoGridExperienceBlock({ theme, isEditor, isCardPreview }: any) {
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
                    <i className="fas fa-history text-[var(--hl)]"></i>
                    <EditableText entity="appearance" field="bentogrid_exp_title" value={getCustomText('bentogrid_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                </h3>
                
                <div className="grid gap-4 grid-cols-1 @md:grid-cols-2">
                    {[1, 2, 3, 4].map((num) => {
                        const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : num === 3 ? 'UI Designer' : 'Freelance Developer';
                        const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : num === 3 ? 'Creative Agency' : 'Self Employed';
                        const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : num === 3 ? '2017 - 2019' : '2015 - 2017';
                        
                        return (
                            <div key={num} className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-3 p-6 hover:bg-white/5 transition-colors group`}>
                                <div className="flex flex-col @md:flex-row @md:justify-between @md:items-start gap-2">
                                    <h4 className="font-bold text-white text-xl group-hover:text-[var(--hl)] transition-colors">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`bentogrid_exp_role_${num}`} 
                                            value={getCustomText(`bentogrid_exp_role_${num}`, defaultRole)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </h4>
                                    <span className="text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-full whitespace-nowrap self-start">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`bentogrid_exp_duration_${num}`} 
                                            value={getCustomText(`bentogrid_exp_duration_${num}`, defaultDuration)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                </div>
                                <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                    <EditableText 
                                        entity="appearance" 
                                        field={`bentogrid_exp_company_${num}`} 
                                        value={getCustomText(`bentogrid_exp_company_${num}`, defaultCompany)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </p>
                            </div>
                        );
                    })}
                </div>
            </motion.div>
        </div>
    );
}
