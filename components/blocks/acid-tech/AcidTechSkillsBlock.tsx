"use client";

import React, { useEffect, useState } from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function AcidTechSkillsBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

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

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    return (
        <section className="w-full py-16 md:py-24 bg-black border-y border-[var(--tc)]/20 font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <div className="w-full max-w-[90rem] mx-auto px-4 md:px-16 flex flex-col lg:flex-row gap-8 md:gap-16">
                
                {/* Left Column: Heading */}
                <div className="lg:w-1/3 flex flex-col justify-start py-2">
                    <div>
                        <span className="text-[var(--tc)] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-3 block">
                            [ SKILLS_REGISTRY ]
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight mb-4 md:mb-8">
                            <EditableText entity="appearance" field="acidtech_skills_title" value={getCustomText('acidtech_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                        </h2>
                    </div>
                </div>

                {/* Right Column: Grid of Segmented Skill Indicators */}
                <div className="lg:w-2/3 flex flex-col gap-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {skills.map((skill: any, index: number) => {
                            const defaultName = skill.name;
                            const defaultProficiency = String(skill.level);
                            const val = parseInt(defaultProficiency || '0', 10);
                            const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                            
                            return (
                                <div 
                                    key={index} 
                                    className="border border-zinc-900 p-5 md:p-6 bg-zinc-950/40 hover:border-[var(--tc)]/40 hover:bg-[var(--tc)]/[0.01] transition-all duration-300 relative group"
                                >
                                    {/* Small node metadata header */}
                                    <div className="absolute top-0 left-0 right-0 h-4.5 bg-zinc-950/90 px-3 py-0.5 flex justify-between items-center text-[7px] text-zinc-500 font-mono border-b border-zinc-900">
                                        <span>MODULE_NODE // 0{index + 1}</span>
                                        <span className="text-[var(--tc)] uppercase tracking-wider font-bold">STATUS_ACTIVE</span>
                                    </div>

                                    {/* Skill Name & Level */}
                                    <div className="flex justify-between items-end mb-3 mt-2">
                                        <h3 className="text-xs md:text-sm lg:text-base font-extrabold text-white uppercase tracking-wider">
                                            <EditableText 
                                                value={defaultName} 
                                                onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                                isEditor={isEditor} 
                                                maxLength={40} 
                                                as="span" 
                                            />
                                        </h3>
                                        <span className="text-xs md:text-sm font-extrabold text-[var(--tc)] font-mono shrink-0">
                                            <EditableText 
                                                value={defaultProficiency} 
                                                onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                                isEditor={isEditor} 
                                                maxLength={3} 
                                                as="span" 
                                            />%
                                        </span>
                                    </div>

                                    {/* Segmented LED Level progress indicator bar */}
                                    <div className="w-full h-2 md:h-3 bg-zinc-900 border border-zinc-800 p-[1px] relative overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${safeVal}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="h-full shadow-[0_0_10px_var(--tc)]"
                                            style={{
                                                width: `${safeVal}%`,
                                                backgroundImage: `repeating-linear-gradient(90deg, ${themeColor} 0px, ${themeColor} 5px, transparent 5px, transparent 7px)`
                                            }}
                                        />
                                    </div>

                                    {isEditor && (
                                        <button
                                            onClick={(e) => handleRemoveItem(index, e)}
                                            className="absolute top-1.5 right-2 text-zinc-500 hover:text-red-500 text-[10px] z-30 transition-colors"
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
                        <div className="flex justify-center mt-6 w-full">
                            <button
                                onClick={handleAddItem}
                                className="px-6 py-3 border border-[var(--tc)]/30 text-[var(--tc)] bg-black font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--tc)] hover:text-black transition-all duration-300"
                            >
                                + Tambah Skill
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
