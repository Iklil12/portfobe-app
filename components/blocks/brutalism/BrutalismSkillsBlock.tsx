"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function BrutalismSkillsBlock({ theme, isEditor }: any) {
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
        <section className="w-full py-24 px-4 md:px-8 bg-[#ffff00] border-b-[6px] border-black @container">
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase mb-12 border-4 border-black p-4 inline-block bg-white shadow-[8px_8px_0_0_#000]">
                <EditableText entity="appearance" field="brutalism_skills_title" value={getCustomText('brutalism_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={index} className="border-4 border-black p-6 bg-white shadow-[8px_8px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all relative">
                            <div className="flex justify-between items-start gap-4 mb-4 text-xl @md:text-2xl @lg:text-3xl font-black uppercase text-black mb-2">
                                <span className="flex-1 break-words pr-2">
                                    <EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span className="whitespace-nowrap shrink-0 flex items-center font-black">
                                    <EditableText 
                                        value={defaultProficiency} 
                                        onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={`w-full h-2 ${isEditor ? '' : 'overflow-hidden'} bg-gray-200 border-2 border-black`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`h-full bg-[#ff00ff] border-r-2 border-black`}
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
                        className="px-6 py-3 border-4 border-black hover:bg-black hover:text-[#ffff00] text-black uppercase tracking-widest text-[11px] font-black transition-all duration-300 bg-white shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000]"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </section>
    );
}
