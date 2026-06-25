"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function ObsidianSkillsBlock({ theme, isEditor }: any) {
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

    const getBtnShapeClass = (shape?: string) => {
        if (shape === 'hard' || shape === 'square') return 'rounded-none';
        if (shape === 'rounded') return 'rounded-md';
        return 'rounded-full';
    };
    const btnShape = getBtnShapeClass(theme?.buttonShape);

    const getCardShapeClass = (style?: string) => {
        if (style === 'hard-shadow' || style === 'hard') {
            return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[6px_6px_0_0_var(--brand-accent)] bg-zinc-900/40';
        }
        if (style === 'flat') {
            return 'rounded-none border border-[rgba(255,255,255,0.1)] hover:border-[var(--brand-accent)] transition-colors duration-300 bg-transparent';
        }
        if (style === 'soft-shadow' || style === 'soft') {
            return 'rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all duration-300 bg-zinc-900/20';
        }
        return 'rounded-2xl border border-white/5 bg-zinc-900/20 hover:border-white/15 hover:bg-zinc-900/30';
    };
    const cardShape = getCardShapeClass(theme?.cardStyle);

    return (
        <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-zinc-950 border-t border-white/5 relative">
            {/* Ambient background highlight */}
            <div className="absolute right-[5%] top-[10%] w-[300px] h-[300px] bg-white/[0.01] rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-screen-2xl mx-auto">
                <div className="flex flex-col @sm:flex-row justify-between items-start @sm:items-end mb-8 md:mb-16 gap-4 @sm:gap-6">
                    <div>
                        <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                            CONSOLE // CHANNEL_METRICS
                        </span>
                        <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter">
                            <EditableText entity="appearance" field="obsidian_skills_title" value={getCustomText('obsidian_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                        </h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-white/5 hidden @sm:block mx-8 mb-4"></div>
                    <span className={`text-[9px] md:text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1.5 shrink-0 ${btnShape}`}>
                        DECIBEL_SCALE // DIRECT_OUT
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                        const defaultProficiency = String(skill.level);
                        const val = parseInt(defaultProficiency || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <div 
                              key={index} 
                              className={`${cardShape} p-4 md:p-6 transition-all duration-300 relative group flex flex-col justify-between min-h-[110px] md:min-h-[140px] overflow-hidden`}
                            >
                                {/* Technical Corner Marks */}
                                <div className="absolute top-2 left-2 w-1.5 h-1.5 border-t border-l border-white/20"></div>
                                <div className="absolute top-2 right-2 w-1.5 h-1.5 border-t border-r border-white/20"></div>
                                <div className="absolute bottom-2 left-2 w-1.5 h-1.5 border-b border-l border-white/20"></div>
                                <div className="absolute bottom-2 right-2 w-1.5 h-1.5 border-b border-r border-white/20"></div>

                                {/* Top Meta specs info */}
                                <div className="flex justify-between items-center text-[8px] md:text-[9px] font-mono text-zinc-500 uppercase tracking-widest mb-2 md:mb-3">
                                    <span>CHAN // 0{index + 1}</span>
                                    <span>GAIN // +0.0dB</span>
                                </div>

                                <div className="flex justify-between items-end mb-2 md:mb-4">
                                    <h4 className="text-sm @sm:text-base md:text-xl font-bold text-white uppercase tracking-tight pr-4 truncate">
                                        <EditableText 
                                            value={defaultName} 
                                            onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </h4>
                                    <span className="text-sm @sm:text-base md:text-xl font-mono font-bold text-white shrink-0">
                                        <EditableText 
                                            value={defaultProficiency} 
                                            onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                            isEditor={isEditor} 
                                            maxLength={3} 
                                            as="span" 
                                        />%
                                    </span>
                                </div>

                                {/* Audio Fader Segment Meter */}
                                <div className={`flex gap-0.5 w-full h-2 md:h-3 bg-zinc-950 p-0.5 ${btnShape} border border-white/5 select-none`}>
                                    {Array.from({ length: 20 }).map((_, segmentIdx) => {
                                        const segmentThreshold = (segmentIdx + 1) * 5;
                                        const isLit = safeVal >= segmentThreshold;
                                        return (
                                            <div 
                                                key={segmentIdx} 
                                                className={`h-full ${btnShape} transition-all duration-500 flex-1 ${
                                                    isLit 
                                                        ? 'bg-white shadow-[0_0_5px_rgba(255,255,255,0.7)]' 
                                                        : 'bg-zinc-900'
                                                }`}
                                            />
                                        );
                                    })}
                                </div>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-2.5 right-2.5 bg-zinc-800 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[8px] z-30 transition-colors border border-white/10"
                                        title="Delete Skill"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );})}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-12 w-full col-span-full">
                        <button
                            onClick={handleAddItem}
                            className="px-8 py-3.5 border border-dashed border-white/25 hover:border-white/50 text-white/70 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full"
                        >
                            + Tambah Skill
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
