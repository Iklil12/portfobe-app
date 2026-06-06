"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function AbsoluteNoirSkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-32 px-4 md:px-12 bg-black">
            <h2 className="text-4xl md:text-6xl font-black uppercase text-white tracking-widest mb-16 text-center">
                <EditableText entity="appearance" field="absolutenoir_skills_title" value={getCustomText('absolutenoir_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((num) => {
                    const defaultName = num === 1 ? 'Frontend Development' : num === 2 ? 'UI/UX Design' : num === 3 ? 'Backend Systems' : 'Creative Direction';
                    const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : num === 3 ? '85' : '90';
                    const val = parseInt(getCustomText(`absolutenoir_skill_prof_${num}`, defaultProficiency) || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={num} className="border border-white/20 p-8 mb-8 hover:bg-white hover:text-black transition-all duration-500 group">
                            <div className="flex justify-between items-center mb-4 text-3xl font-bold uppercase mb-2">
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`absolutenoir_skill_name_${num}`} 
                                        value={getCustomText(`absolutenoir_skill_name_${num}`, defaultName)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`absolutenoir_skill_prof_${num}`} 
                                        value={getCustomText(`absolutenoir_skill_prof_${num}`, defaultProficiency)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={`w-full h-2 ${isEditor ? '' : 'overflow-hidden'} bg-white/20 group-hover:bg-black/20`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`h-full bg-white group-hover:bg-black`}
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
