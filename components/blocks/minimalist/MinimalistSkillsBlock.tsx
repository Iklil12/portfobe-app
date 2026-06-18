"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function MinimalistSkillsBlock({ theme, isEditor }: any) {
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
        <section className="w-full py-24 md:py-32 px-4 md:px-8 border-t border-gray-200 bg-white @container">
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-gray-900 mb-12">
                <EditableText entity="appearance" field="minimalist_skills_title" value={getCustomText('minimalist_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-x-12 gap-y-8">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                    
                    return (
                        <div key={index} className="flex flex-col py-4 border-b border-gray-100 relative group">
                            <div className="flex justify-between items-end mb-3 text-sm @md:text-base font-mono uppercase tracking-wider text-gray-900">
                                <span className="font-medium text-gray-800 break-words flex-1 pr-4">
                                    <EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span className="whitespace-nowrap shrink-0 flex items-center font-bold text-gray-950">
                                    <EditableText 
                                        value={defaultProficiency} 
                                        onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                </span>
                            </div>
                            <div className={`w-full h-1.5 ${isEditor ? '' : 'overflow-hidden'} bg-gray-100 rounded-full`}>
                                <motion.div 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${safeVal}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                    className={`h-full bg-gray-900 rounded-full`}
                                    style={isEditor ? { width: `${safeVal}%` } : undefined}
                                ></motion.div>
                            </div>
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-sm"
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
                        className="px-6 py-3 border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-lg"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </section>
    );
}
