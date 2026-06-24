"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function AuraKineticSkillsBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    let skills = [];
    try {
        if (customTexts.skills_items) {
            skills = JSON.parse(customTexts.skills_items);
        } else {
            skills = [
                { name: 'Frontend Development', level: 95 },
                { name: 'UI/UX Design', level: 90 },
                { name: 'Backend Systems', level: 85 },
                { name: 'Creative Direction', level: 90 }
            ];
        }
    } catch (e) {
        skills = [];
    }

    const updateSkills = (newSkills: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'skills_items', value: JSON.stringify(newSkills) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'name' | 'level', value: string) => {
        const newSkills = [...skills];
        if (key === 'level') {
            const parsed = parseInt(value, 10);
            newSkills[index][key] = isNaN(parsed) ? 0 : Math.min(100, Math.max(0, parsed));
        } else {
            newSkills[index][key] = value;
        }
        updateSkills(newSkills);
    };

    const handleAddItem = () => {
        const newSkills = [...skills, { name: "New Skill", level: 80 }];
        updateSkills(newSkills);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSkills = skills.filter((_: any, i: number) => i !== index);
        updateSkills(newSkills);
    };


    return (
        <section className="w-full py-16 md:py-32 px-6 md:px-16 overflow-hidden relative">
            <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
                <div>
                    <span className="font-mono text-xs tracking-[0.3em] text-[var(--hl)] font-bold uppercase block mb-3">
                        Expertise
                    </span>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
                        <EditableText entity="appearance" field="aurakinetic_skills_title" value={getCustomText('aurakinetic_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div 
                            key={index} 
                            className="group relative flex flex-col justify-between p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden"
                        >
                            {/* Hover Background Glow */}
                            <div className="absolute -right-20 -top-20 w-48 h-48 bg-[var(--hl)] opacity-0 group-hover:opacity-[0.08] rounded-full blur-[60px] transition-opacity duration-700 pointer-events-none" />

                            <div>
                                <div className="flex justify-between items-baseline mb-4 md:mb-6">
                                    <span className="font-mono text-[10px] md:text-xs text-white/30">
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className="font-mono text-[9px] md:text-[10px] tracking-widest text-[var(--hl)] font-bold uppercase">
                                        Skill level
                                    </span>
                                </div>

                                <div className="flex justify-between items-end gap-3 md:gap-4">
                                    <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight uppercase">
                                        <EditableText 
                                            value={defaultName} 
                                            onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            className="bg-transparent text-white focus:outline-none"
                                        />
                                    </h3>
                                    <span className="text-2xl md:text-4xl font-extrabold text-[var(--hl)] tracking-tighter tabular-nums">
                                        <EditableText 
                                            value={defaultProficiency} 
                                            onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                            isEditor={isEditor} 
                                            maxLength={3} 
                                            className="bg-transparent text-[var(--hl)] focus:outline-none"
                                        />%
                                    </span>
                                </div>
                            </div>

                            <div className="relative w-full h-1.5 bg-white/10 rounded-full mt-4 md:mt-8 overflow-visible">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[var(--hl)] to-pink-500 rounded-full shadow-[0_0_12px_var(--hl)]"
                                    style={isEditor ? { width: `${safeVal}%` } : undefined}
                                >
                                    {/* Glowing slider handle tip on hover */}
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-[0_0_8px_#fff,0_0_15px_var(--hl)] scale-0 group-hover:scale-100 transition-transform duration-300" />
                                </motion.div>
                            </div>
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] z-30 transition-all duration-300 shadow-md border border-red-500/30"
                                    title="Delete Skill"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );
                })}
            </div>

            {isEditor && (
                <div className="max-w-[1400px] mx-auto flex justify-center mt-12 w-full col-span-full">
                    <button
                        onClick={handleAddItem}
                        className="px-8 py-4 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </section>
    );
}
