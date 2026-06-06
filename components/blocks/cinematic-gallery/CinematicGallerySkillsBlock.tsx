"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function CinematicGallerySkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-12 md:px-24 bg-[#0a0a0a] shrink-0 border-r border-white/10 relative">
            <h2 className="text-6xl md:text-8xl font-black uppercase text-white/10 absolute top-12 left-12 whitespace-nowrap">
                <EditableText entity="appearance" field="cinematicgallery_skills_title" value={getCustomText('cinematicgallery_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[1, 2, 3, 4].map((num) => {
                    const defaultName = num === 1 ? 'Frontend Development' : num === 2 ? 'UI/UX Design' : num === 3 ? 'Backend Systems' : 'Creative Direction';
                    const defaultProficiency = num === 1 ? '95' : num === 2 ? '90' : num === 3 ? '85' : '90';
                    const val = parseInt(getCustomText(`cinematicgallery_skill_prof_${num}`, defaultProficiency) || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={num} className="flex flex-col md:flex-row gap-8 items-center border border-white/10 p-8 bg-white/5 backdrop-blur-md mb-6 w-full max-w-4xl z-10">
                            <div className="flex justify-between items-center mb-4 text-3xl font-bold text-white uppercase">
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`cinematicgallery_skill_name_${num}`} 
                                        value={getCustomText(`cinematicgallery_skill_name_${num}`, defaultName)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span>
                                    <EditableText 
                                        entity="appearance" 
                                        field={`cinematicgallery_skill_prof_${num}`} 
                                        value={getCustomText(`cinematicgallery_skill_prof_${num}`, defaultProficiency)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={`w-full h-2 ${isEditor ? '' : 'overflow-hidden'} bg-white/10 flex-1`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`h-full bg-white`}
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
