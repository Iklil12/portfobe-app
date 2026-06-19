"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function CinematicSkillsBlock({ theme, isEditor }: any) {
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
        <section className="py-24 px-6 @md:px-12 border-b border-[#1f1f1f] bg-[#030303] select-none">
            <div className="w-full flex flex-col">
                <div className="grid grid-cols-1 @md:grid-cols-12 gap-8 @md:gap-12 items-start">
                    
                    {/* Left Column: Title & Description */}
                    <div className="@md:col-span-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] block mb-3">
                            [ CAPABILITIES / CORE ]
                        </span>
                        <h2 className="font-black uppercase tracking-tighter cine-heading text-4xl @md:text-6xl text-white">
                            <EditableText entity="appearance" field="cinematic_skills_title" value={getCustomText('cinematic_skills_title', 'Skills')} isEditor={isEditor} maxLength={40} as="span" />
                        </h2>
                        <p className="cine-body text-slate-400 leading-relaxed text-xs @md:text-sm font-light mt-6 max-w-sm">
                            <EditableText 
                                entity="appearance" 
                                field="cinematic_skills_description" 
                                value={getCustomText('cinematic_skills_description', 'A balance of technical proficiency and aesthetic execution, honed across various creative projects.')} 
                                isEditor={isEditor} 
                                as="span" 
                            />
                        </p>
                    </div>

                    {/* Right Column: Skills */}
                    <div className="@md:col-span-8 grid grid-cols-1 @sm:grid-cols-2 gap-x-8 gap-y-10">
                        {skills.map((skill: any, index: number) => {
                            const defaultName = skill.name;
                            const defaultProficiency = String(skill.level);
                            const val = parseInt(defaultProficiency || '0', 10);
                            const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                            const filledBlocks = Math.round(safeVal / 10);
                            const themeColor = theme?.themeColor || "#ff9e00";

                            return (
                                <div key={index} className="flex flex-col relative group/skill">
                                    <div className="flex justify-between items-end mb-2">
                                        <span className="font-serif text-white/90 text-base @md:text-lg">
                                            <EditableText 
                                                value={defaultName} 
                                                onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                                isEditor={isEditor} 
                                                maxLength={40} 
                                                as="span" 
                                            />
                                        </span>
                                        <span className="font-mono text-xs text-slate-400 group-hover/skill:text-white transition-colors">
                                            [<EditableText 
                                                value={defaultProficiency} 
                                                onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                                isEditor={isEditor} 
                                                maxLength={3} 
                                                as="span" 
                                            />%]
                                        </span>
                                    </div>

                                    {/* Segmented VU Meter / Step bar */}
                                    <div className="flex gap-1 h-[3px] w-full mt-2">
                                        {Array.from({ length: 10 }).map((_, i) => {
                                            const isFilled = i < filledBlocks;
                                            return (
                                                <div 
                                                    key={i} 
                                                    className={`h-full flex-1 transition-all duration-300 ${
                                                        isFilled 
                                                        ? 'bg-white/80 group-hover/skill:bg-[var(--hl)]' 
                                                        : 'bg-white/10'
                                                    }`}
                                                    style={isFilled ? { '--hl': themeColor } as any : undefined}
                                                />
                                            );
                                        })}
                                    </div>

                                    {isEditor && (
                                        <button
                                            onClick={(e) => handleRemoveItem(index, e)}
                                            className="absolute -top-1 -right-6 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] z-30 transition-colors shadow-lg"
                                            title="Hapus Skill"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isEditor && (
                    <div className="flex justify-start mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-5 py-2.5 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                        >
                            + Tambah Skill
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
