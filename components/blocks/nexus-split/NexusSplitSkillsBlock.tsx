"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function NexusSplitSkillsBlock({ theme, isEditor }: any) {
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

    const highlightColor = theme?.themeColor || '#4f46e5';

    return (
        <section className="w-full pt-16 @lg:pt-24 pb-16 px-6 @md:px-12 border-b border-white/5 bg-black relative">
            
            {/* Title with minimal prefix */}
            <div className="mb-12 flex flex-col gap-1.5 select-none">
                <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.3em]">
                  // SYSTEM_INTEGRITY_INDEX
                </span>
                <h2 className="text-3xl @lg:text-5xl font-display font-black uppercase text-white tracking-tight">
                    <EditableText entity="appearance" field="nexussplit_skills_title" value={getCustomText('nexussplit_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                </h2>
            </div>

            {/* Skills Slider Console Grid */}
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-16 gap-y-4">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={index} className="flex items-center gap-4 py-4 border-b border-white/5 hover:border-white/10 group relative transition-colors w-full">
                            {/* Monospace prefix number */}
                            <span className="font-mono text-[9px] text-neutral-600 group-hover:text-neutral-400 transition-colors select-none">
                                [{String(index + 1).padStart(2, '0')}]
                            </span>
                            
                            {/* Skill Name */}
                            <span className="font-sans text-xs font-bold uppercase tracking-wider text-neutral-300 group-hover:text-white shrink-0 transition-colors">
                                <EditableText 
                                    value={defaultName} 
                                    onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                    isEditor={isEditor} 
                                    maxLength={40} 
                                    as="span" 
                                />
                            </span>
                            
                            {/* Sliding Dot Line */}
                            <div className="flex-1 h-[1px] bg-white/10 group-hover:bg-white/20 relative mx-4 transition-colors">
                                <motion.div 
                                    initial={{ left: 0 }}
                                    whileInView={{ left: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                                    className="w-2 h-2 rounded-full absolute -top-1 -ml-1 transition-transform duration-300 group-hover:scale-125"
                                    style={{ 
                                        backgroundColor: highlightColor,
                                        boxShadow: `0 0 10px ${highlightColor}`,
                                        left: isEditor ? `${safeVal}%` : undefined
                                    }}
                                />
                            </div>
                            
                            {/* Percentage Value */}
                            <span className="font-mono text-[10px] font-bold text-neutral-500 group-hover:text-white transition-colors shrink-0">
                                <EditableText 
                                    value={defaultProficiency} 
                                    onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                    isEditor={isEditor} 
                                    maxLength={3} 
                                    as="span" 
                                />%
                            </span>
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute -top-1 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-4.5 h-4.5 flex items-center justify-center text-[8px] z-30 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
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
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </section>
    );
}
