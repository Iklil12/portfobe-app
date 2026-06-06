"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function SpatialSkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 md:py-32 px-4 md:px-8 bg-black/40 backdrop-blur-xl border-t border-white/10">
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/50 mb-16">
                <EditableText entity="appearance" field="spatial_skills_title" value={getCustomText('spatial_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((num) => {
                    const defaultName = num === 1 ? 'Frontend Development' : num === 2 ? 'UI/UX Design' : num === 3 ? 'Backend Systems' : 'Creative Direction';
                    const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : num === 3 ? '85' : '90';
                    const val = parseInt(getCustomText(`spatial_skill_prof_${num}`, defaultProficiency) || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={num} className="p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all mb-4">
                            <div className="flex justify-between items-center mb-4 text-2xl font-semibold text-white">
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`spatial_skill_name_${num}`} 
                                        value={getCustomText(`spatial_skill_name_${num}`, defaultName)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`spatial_skill_prof_${num}`} 
                                        value={getCustomText(`spatial_skill_prof_${num}`, defaultProficiency)} 
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
                                    className={`h-full bg-white rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]`}
                                    style={isEditor ? { width: `${safeVal}%` } : undefined}
                                ></motion.div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
