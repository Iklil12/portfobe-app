"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
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
        <section className="w-full py-32 px-4 md:px-16 overflow-hidden relative">
            <h2 className="text-5xl md:text-7xl font-extrabold tracking-tighter text-transparent mix-blend-difference mb-16 outline-text">
                <EditableText entity="appearance" field="aurakinetic_skills_title" value={getCustomText('aurakinetic_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={index} className="p-8 rounded-3xl bg-gradient-to-br from-white/10 to-transparent border border-white/20 backdrop-blur-md mb-6 hover:scale-[1.02] transition-transform relative">
                            <div className="flex justify-between items-center mb-4 text-3xl font-bold text-white">
                                <span>
                                    <EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span>
                                    <EditableText 
                                        value={defaultProficiency} 
                                        onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={`w-full h-2 ${isEditor ? '' : 'overflow-hidden'} bg-white/10 rounded-full`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full`}
                                    style={isEditor ? { width: `${safeVal}%` } : undefined}
                                ></motion.div>
                            </div>
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Hapus Skill"
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
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </section>
    );
}
