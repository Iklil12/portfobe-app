"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialExperienceBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    return (
        <section id="experience" className="w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle">
            <div className="flex flex-col @lg:flex-row gap-16 @lg:gap-24">
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3">
                    <h2 className="font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl mb-6">
                        <EditableText value={getCustomText('editorial_exp_t1', 'Selected')} field="editorial_exp_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />{' '}
                        <EditableText value={getCustomText('editorial_exp_t2', 'History')} field="editorial_exp_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                    </h2>
                    <p className="font-sans text-sm @md:text-base text-slate-500 max-w-sm leading-relaxed">
                        <EditableText value={getCustomText('editorial_exp_sub', 'A chronological overview of professional roles and industry experience.')} field="editorial_exp_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                    </p>
                </motion.div>

                <div className="w-full @lg:w-2/3 flex flex-col border-t border-subtle">
                    {[1, 2, 3].map((num) => {
                        const defaultRole = num === 1 ? 'Senior Lead Developer' : num === 2 ? 'Frontend Engineer' : 'UI Designer';
                        const defaultCompany = num === 1 ? 'Tech Corp' : num === 2 ? 'Startup Inc' : 'Creative Agency';
                        const defaultDuration = num === 1 ? '2022 - Present' : num === 2 ? '2019 - 2022' : '2017 - 2019';
                        
                        return (
                            <motion.div
                                key={num}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className="group flex flex-col @md:flex-row @md:items-start border-b border-subtle py-8 @md:py-12 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-slate-50 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom -z-10"></div>
                                
                                <div className="w-full @md:w-1/3 mb-4 @md:mb-0 pr-4">
                                    <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`editorial_exp_duration_${num}`} 
                                            value={getCustomText(`editorial_exp_duration_${num}`, defaultDuration)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                </div>
                                
                                <div className="w-full @md:w-2/3">
                                    <h3 className="font-serif italic text-2xl @md:text-3xl text-[#111] mb-2 group-hover:text-[var(--hl)] transition-colors duration-300">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`editorial_exp_role_${num}`} 
                                            value={getCustomText(`editorial_exp_role_${num}`, defaultRole)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </h3>
                                    <p className="font-sans text-sm @md:text-base text-slate-500 leading-relaxed uppercase tracking-wider">
                                        <EditableText 
                                            entity="appearance" 
                                            field={`editorial_exp_company_${num}`} 
                                            value={getCustomText(`editorial_exp_company_${num}`, defaultCompany)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}

