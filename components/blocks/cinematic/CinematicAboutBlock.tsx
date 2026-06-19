"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
    const themeColor = theme?.themeColor || "#ff9e00";

    // Specs/credits layout items (Simplified: 3 columns, no extra descriptions/numbers)
    const specItems = [
        {
            titleKey: 'cinematic_about_spec1_title',
            titleDefault: 'Focus',
            valueKey: 'cinematic_about_spec1_val',
            valueDefault: 'Film & Commercials',
        },
        {
            titleKey: 'cinematic_about_spec2_title',
            titleDefault: 'Location',
            valueKey: 'cinematic_about_spec2_val',
            valueDefault: 'Jakarta, ID',
        },
        {
            titleKey: 'cinematic_about_spec3_title',
            titleDefault: 'Credo',
            valueKey: 'cinematic_about_spec3_val',
            valueDefault: 'Emotion over visual noise',
        }
    ];

    return (
        <section className="py-24 px-6 @md:px-12 border-b border-[#1f1f1f] bg-[#050505] select-none">
            <div className="w-full flex flex-col">
                
                {/* Header Grid */}
                <div className="grid grid-cols-1 @md:grid-cols-12 gap-8 @md:gap-12 items-start">
                    
                    {/* Left Column: Heading */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                        transition={{ duration: 0.6 }} 
                        className="@md:col-span-4"
                    >
                        <h2 className="font-black uppercase tracking-tighter cine-heading text-4xl @md:text-6xl text-white">
                            <EditableText value={theme?.customTexts?.cinematic_about_title || 'About'} field="cinematic_about_title" entity="appearance" isEditor={isEditor} as="span" />
                        </h2>
                    </motion.div>
                    
                    {/* Right Column: Quotes & Description */}
                    <motion.div 
                        initial={{ opacity: 0, y: 15 }} 
                        {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                        transition={{ duration: 0.6, delay: 0.1 }} 
                        className="@md:col-span-8 flex flex-col gap-6"
                    >
                        <h3 className="font-serif italic text-white/90 text-2xl @md:text-4xl leading-snug">
                            <EditableText 
                                value={theme?.customTexts?.cinematic_about_quote || '“We believe in the power of visual storytelling. Every frame is meticulously crafted to evoke emotion.”'} 
                                field="cinematic_about_quote" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="span" 
                            />
                        </h3>
                        <div className="cine-body text-slate-400 leading-relaxed text-sm @md:text-base font-light">
                            <EditableText 
                                value={theme?.customTexts?.cinematic_about_content || 'Working closely with brands, creators, and artists, I turn raw, abstract concepts into complete visual experiences. From storyboard sketch to final color grading pass, each project is handled with pure creative focus.'} 
                                field="cinematic_about_content" 
                                entity="appearance" 
                                isEditor={isEditor} 
                                as="p" 
                            />
                        </div>
                    </motion.div>
                </div>

                {/* Clean minimalist divider */}
                <div className="w-full h-[1px] bg-white/10 my-16" />

                {/* Specs / Credits Grid */}
                <div className="grid grid-cols-1 @sm:grid-cols-3 gap-8">
                    {specItems.map((spec, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 10 }} 
                            {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                            transition={{ duration: 0.5, delay: 0.1 * i + 0.2 }}
                            className="flex flex-col border-l border-white/5 pl-4 hover:border-white/20 transition-all duration-300"
                        >
                            <span 
                                className="text-[10px] font-mono uppercase tracking-[0.2em] mb-2 inline-block"
                                style={{ color: themeColor }}
                            >
                                <EditableText value={theme?.customTexts?.[spec.titleKey] || spec.titleDefault} field={spec.titleKey} entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </span>
                            <h4 className="font-serif text-white/90 text-base @md:text-lg leading-snug">
                                <EditableText value={theme?.customTexts?.[spec.valueKey] || spec.valueDefault} field={spec.valueKey} entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                            </h4>
                        </motion.div>
                    ))}
                </div>

            </div>
        </section>
    );
}

