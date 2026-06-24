"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function CinematicGallerySkillsBlock({ theme, isEditor }: any) {
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
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow Theater Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Lens Flare Glow */}
            <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-white/[0.02] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Cinematic Header Area */}
            <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
                <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
                    [ SECTION 02 // EXPERTISE ]
                </div>
                <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
                    <EditableText 
                        entity="appearance" 
                        field="cinematicgallery_skills_title" 
                        value={getCustomText('cinematicgallery_skills_title', 'Seni & Keterampilan')} 
                        isEditor={isEditor} 
                        maxLength={40} 
                        as="span" 
                    />
                </h2>
            </div>
            
            <div className="w-full max-w-6xl mx-auto z-10 mt-[13vh] md:mt-[16vh] h-[68vh] md:h-[63vh] overflow-y-auto cinematic-scrollbar pointer-events-auto pr-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 pb-6">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                        const defaultProficiency = String(skill.level);
                        const val = parseInt(defaultProficiency || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <div 
                                key={index} 
                                className="group relative flex flex-col justify-between border border-white/5 p-4 md:p-6 bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-md transition-all duration-500 ease-out hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full overflow-hidden"
                            >
                                {/* Corner Viewfinder brackets on Hover */}
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-20">
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40"></div>
                                </div>

                                {/* Top Row: Index number & Delete (if editor) */}
                                <div className="flex justify-between items-center z-10">
                                    <span className="text-[9px] md:text-[10px] font-mono text-white/30 tracking-widest group-hover:text-white/60 transition-colors duration-300">
                                        [ 0{index + 1} ]
                                    </span>
                                    
                                    {isEditor && (
                                        <button
                                            onClick={(e) => handleRemoveItem(index, e)}
                                            className="bg-white/5 hover:bg-red-500/80 hover:text-white text-white/40 rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-all duration-300 shadow-md border border-white/10"
                                            title="Delete Skill"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* Middle Row: Skill Name */}
                                <div className="mt-2 mb-3 md:mt-4 md:mb-5 z-10">
                                    <EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="h3" 
                                        className="text-white text-sm md:text-lg font-sans font-bold uppercase tracking-wider block"
                                    />
                                </div>

                                {/* Bottom Row: Progress & Percentage */}
                                <div className="z-10 mt-auto">
                                    <div className="flex justify-between items-end mb-1.5 md:mb-2">
                                        <span className="text-[8px] md:text-[9px] tracking-[0.2em] text-white/30 uppercase font-mono">Tingkat Kemahiran</span>
                                        <span className="text-xs md:text-sm font-mono font-semibold text-white/80 flex items-center">
                                            <EditableText 
                                                value={defaultProficiency} 
                                                onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                                isEditor={isEditor} 
                                                maxLength={3} 
                                                as="span" 
                                                className="font-mono text-white inline-block text-right"
                                            />
                                            <span className="ml-0.5 text-white/60">%</span>
                                        </span>
                                    </div>
                                    <div className={`relative w-full h-[3px] md:h-1 bg-white/10 ${isEditor ? '' : 'overflow-hidden'}`}>
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${safeVal}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-neutral-600 via-neutral-200 to-white"
                                            style={isEditor ? { width: `${safeVal}%` } : undefined}
                                        />
                                        {/* Glowing Laser Dot at progress tip */}
                                        <motion.div 
                                            initial={{ left: 0 }}
                                            whileInView={{ left: `${safeVal}%` }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
                                            className="absolute top-1/2 -translate-y-1/2 -ml-0.5 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_#ffffff,0_0_15px_#ffffff]"
                                            style={isEditor ? { left: `${safeVal}%` } : undefined}
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-6 w-full pointer-events-auto pb-8">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-white/10 hover:border-white/30 text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05]"
                        >
                            + Tambah Keterampilan
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
