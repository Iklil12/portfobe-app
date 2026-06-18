"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialSkillsBlock({ theme, isEditor, isCardPreview }: any) {
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


    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    return (
        <section id="skills" className="w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle">
            <div className="flex flex-col @lg:flex-row gap-16 @lg:gap-24">
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3">
                    <h2 className="font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl mb-6">
                        <EditableText value={getCustomText('editorial_skills_t1', 'Core')} field="editorial_skills_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />{' '}
                        <EditableText value={getCustomText('editorial_skills_t2', 'Capabilities')} field="editorial_skills_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                    </h2>
                    <p className="font-sans text-sm @md:text-base text-slate-500 max-w-sm leading-relaxed">
                        <EditableText value={getCustomText('editorial_skills_sub', 'The technical foundation and creative tools that power our design execution.')} field="editorial_skills_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                    </p>
                </motion.div>

                <div className="w-full @lg:w-2/3 flex flex-col border-t border-subtle">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <motion.div
                                key={index}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className="group flex flex-col py-8 @md:py-10 border-b border-subtle relative overflow-hidden"
                            >
                                <div className="flex flex-col @md:flex-row @md:items-center justify-between mb-4">
                                    <h3 className="font-serif italic text-2xl @md:text-3xl text-[#111]">
                                        <EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                    </h3>
                                    <span className="font-sans text-xs font-bold text-slate-400 mt-2 @md:mt-0 tracking-widest uppercase">
                                        <EditableText 
                                        value={defaultProficiency} 
                                        onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />%
                                    </span>
                                </div>
                                <div className={`w-full h-[1px] bg-slate-200 relative ${isEditor ? '' : 'overflow-hidden'}`}>
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${safeVal}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                                        className="h-full bg-[var(--hl)]"
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
                            </motion.div>
                        );
                    })}
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

            </div>
        </section>
    );
}

