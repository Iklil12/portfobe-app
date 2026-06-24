"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function LayeredMonolithSkillsBlock({ theme, isEditor }: any) {
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
        <section className="w-full min-h-[100vh] py-32 px-6 md:px-16 bg-[#111] text-white flex flex-col justify-center relative stack-card">
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto w-full">
                {/* Monolithic Title Area */}
                <div className="mb-20 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-2.5 h-2.5 bg-white shrink-0 block" />
                        <span className="text-[10px] font-mono tracking-[0.35em] text-white/50 uppercase">
                            [ CAPABILITIES MODULE ]
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none border-b-4 border-white pb-6 inline-block">
                        <EditableText
                            entity="appearance"
                            field="layeredmonolith_skills_title"
                            value={getCustomText('layeredmonolith_skills_title', 'Core Capabilities')}
                            isEditor={isEditor}
                            maxLength={40}
                            as="span"
                        />
                    </h2>
                </div>

                {/* Grid of Monolithic Skill Blocks */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                        const defaultProficiency = String(skill.level);
                        const val = parseInt(defaultProficiency || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));

                        const totalSegments = 10;
                        const activeSegments = Math.round(safeVal / 10);

                        return (
                            <div
                                key={index}
                                className="group relative bg-[#181818] p-6 md:p-8 border border-white/10 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.04)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.08)] hover:-translate-x-1 hover:-translate-y-1 flex flex-col justify-between"
                            >
                                {/* Decorative Monolith Corner Accent */}
                                <div className="absolute top-0 left-0 w-2 h-2 bg-white/20 group-hover:bg-white transition-colors duration-300" />

                                <div className="flex justify-between items-start mb-6 w-full">
                                    <div className="flex flex-col gap-1">
                                        <span className="font-mono text-[9px] tracking-widest text-white/30 group-hover:text-white/50 transition-colors duration-300">
                                            // STACK MODULE 0{index + 1}
                                        </span>
                                        <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white leading-none">
                                            <EditableText
                                                value={defaultName}
                                                onChange={(val) => handleUpdateItem(index, 'name', val)}
                                                isEditor={isEditor}
                                                maxLength={40}
                                                as="span"
                                            />
                                        </h3>
                                    </div>
                                    <div className="font-mono text-2xl md:text-3xl font-extrabold tracking-tighter text-white/80 group-hover:text-white transition-colors duration-300 flex items-baseline">
                                        <EditableText
                                            value={defaultProficiency}
                                            onChange={(val) => handleUpdateItem(index, 'level', val)}
                                            isEditor={isEditor}
                                            maxLength={3}
                                            as="span"
                                        />
                                        <span className="text-xs text-white/40 ml-0.5">%</span>
                                    </div>
                                </div>

                                {/* Layered Segments Progress Bar */}
                                <div className="w-full mt-auto">
                                    <div className="grid grid-cols-10 gap-1 md:gap-1.5 w-full">
                                        {Array.from({ length: totalSegments }).map((_, segmentIdx) => {
                                            const isActive = segmentIdx < activeSegments;
                                            return (
                                                <motion.div
                                                    key={segmentIdx}
                                                    initial={{ backgroundColor: "rgba(255, 255, 255, 0.04)" }}
                                                    whileInView={{
                                                        backgroundColor: isActive ? "rgba(255, 255, 255, 0.9)" : "rgba(255, 255, 255, 0.04)"
                                                    }}
                                                    viewport={{ once: true }}
                                                    transition={{ delay: segmentIdx * 0.04, duration: 0.2 }}
                                                    className={`h-2.5 md:h-3 border border-white/5 transition-all duration-300 ${isActive ? 'shadow-[0_0_8px_rgba(255,255,255,0.15)]' : ''
                                                        }`}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute -top-2.5 -right-2.5 bg-black hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors border border-white/10 shadow-lg"
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
                    <div className="flex justify-center mt-16 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-8 py-4 border-2 border-dashed border-white/20 hover:border-white text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white hover:text-black rounded-sm"
                        >
                            + TAMBAH CAPABILITY MODULE
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
