"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function BrutalismSkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="w-full py-24 px-4 md:px-8 bg-[#ffff00] border-b-[6px] border-black">
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase mb-12 border-4 border-black p-4 inline-block bg-white shadow-[8px_8px_0_0_#000]">
                <EditableText entity="appearance" field="brutalism_skills_title" value={getCustomText('brutalism_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((num) => {
                    const defaultName = num === 1 ? 'Frontend Development' : num === 2 ? 'UI/UX Design' : num === 3 ? 'Backend Systems' : 'Creative Direction';
                    const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : num === 3 ? '85' : '90';
                    const val = parseInt(getCustomText(`brutalism_skill_prof_${num}`, defaultProficiency) || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={num} className="border-4 border-black p-6 bg-white mb-8 shadow-[8px_8px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all">
                            <div className="flex justify-between items-center mb-4 text-3xl font-black uppercase text-black mb-2">
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`brutalism_skill_name_${num}`} 
                                        value={getCustomText(`brutalism_skill_name_${num}`, defaultName)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`brutalism_skill_prof_${num}`} 
                                        value={getCustomText(`brutalism_skill_prof_${num}`, defaultProficiency)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={`w-full h-2 ${isEditor ? '' : 'overflow-hidden'} bg-gray-200 border-2 border-black`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`h-full bg-[#ff00ff] border-r-2 border-black`}
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
