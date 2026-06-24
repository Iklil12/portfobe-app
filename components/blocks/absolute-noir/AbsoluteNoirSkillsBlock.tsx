"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function AbsoluteNoirSkillsBlock({ theme, isEditor }: any) {
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

    // Helper to map 0-100 level to professional classification
    const getClassification = (level: number) => {
        if (level >= 90) return "LEVEL_01 // EXPERT";
        if (level >= 80) return "LEVEL_02 // SENIOR";
        if (level >= 70) return "LEVEL_03 // CORE";
        return "LEVEL_04 // PROFESSIONAL";
    };

    return (
        <section className="w-full py-24 px-8 md:px-16 bg-[#050505] text-white wire-border-b">
            {/* Header */}
            <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3 text-white/50 block">
                        <EditableText
                            entity="appearance"
                            field="absolutenoir_skills_subtitle"
                            value={getCustomText('absolutenoir_skills_subtitle', '[ SKILLS_REGISTRY ]')}
                            isEditor={isEditor}
                            maxLength={30}
                            as="span"
                        />
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        <EditableText
                            entity="appearance"
                            field="absolutenoir_skills_title"
                            value={getCustomText('absolutenoir_skills_title', 'TECHNICAL INDEX')}
                            isEditor={isEditor}
                            maxLength={40}
                            as="span"
                        />
                    </h2>
                </div>
                <div className="font-mono text-[10px] text-white/40 uppercase">
                    SYS_STATUS // ONLINE
                </div>
            </div>

            {/* Table Header (hidden on mobile) */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 border-b border-white/20 font-mono text-[9px] uppercase tracking-wider text-white/40 mb-2">
                <div className="col-span-1">IDX</div>
                <div className="col-span-5">CAPABILITY</div>
                <div className="col-span-3">CLASSIFICATION</div>
                <div className="col-span-3 text-right">RATING SCORE</div>
            </div>

            {/* Skills Table List */}
            <div className="flex flex-col divide-y divide-white/10">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    const displayIndex = String(index + 1).padStart(2, '0');

                    return (
                        <div
                            key={index}
                            className="grid grid-cols-1 md:grid-cols-12 gap-y-2 md:gap-y-0 md:gap-4 py-5 items-center font-mono text-xs md:text-sm text-white/80 hover:text-white hover:bg-white/[0.01] transition-all duration-200 relative group"
                        >
                            {/* Column 1: Index */}
                            <div className="col-span-1 text-[10px] text-white/30">
                                {displayIndex} //
                            </div>

                            {/* Column 2: Name */}
                            <div className="col-span-5 font-sans font-bold uppercase text-sm tracking-tight">
                                <EditableText
                                    value={defaultName}
                                    onChange={(val) => handleUpdateItem(index, 'name', val)}
                                    isEditor={isEditor}
                                    maxLength={40}
                                    as="span"
                                />
                            </div>

                            {/* Column 3: Classification */}
                            <div className="col-span-3 text-[10px] text-white/50">
                                {getClassification(safeVal)}
                            </div>

                            {/* Column 4: Flat progress bar and Level Edit */}
                            <div className="col-span-3 flex justify-between items-center md:justify-end gap-6">
                                {/* Mobile label helper */}
                                <span className="inline-block md:hidden text-[9px] text-white/30 uppercase">RATING</span>

                                <div className="flex items-center gap-4 w-full md:w-36 justify-end">
                                    {/* Flat sharp progress bar */}
                                    <div className="hidden sm:block flex-1 h-[3px] bg-white/10 relative overflow-hidden rounded-none">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${safeVal}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                            className="h-full bg-white/40 group-hover:bg-white transition-colors duration-300"
                                            style={isEditor ? { width: `${safeVal}%` } : undefined}
                                        />
                                    </div>

                                    <span className="text-[10px] text-white/40 group-hover:text-white font-mono font-bold shrink-0 transition-colors">
                                        [ <EditableText
                                            value={defaultProficiency}
                                            onChange={(val) => handleUpdateItem(index, 'level', val)}
                                            isEditor={isEditor}
                                            maxLength={3}
                                            as="span"
                                        />% ]
                                    </span>
                                </div>
                            </div>

                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
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
                <div className="flex justify-center mt-12 w-full">
                    <button
                        onClick={handleAddItem}
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </section>
    );
}
