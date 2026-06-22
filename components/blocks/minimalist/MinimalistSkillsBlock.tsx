"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.2, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

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

    const animationTrigger = isEditor ? "animate" : "whileInView";

    return (
        <motion.section 
            initial="hidden"
            {...{ [animationTrigger]: "visible" }}
            viewport={{ once: true, amount: 0.1 }}
            variants={getStaggerContainer(0, 0.08)}
            className="w-full py-20 @md:py-28 px-8 @md:px-12 @lg:px-16 border-t border-gray-200 bg-white @container"
        >
            <div className="max-w-4xl w-full mx-auto">
                {/* Title (Full Width) */}
                <motion.h2 variants={cinematicBlurUp} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 min-heading mb-12">
                    <EditableText entity="appearance" field="minimalist_skills_title" value={getCustomText('minimalist_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                </motion.h2>

                {/* Skills List (Full Width) */}
                <div className="flex flex-col w-full divide-y divide-gray-100">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                        const defaultProficiency = String(skill.level);
                        
                            return (
                                <motion.div 
                                    key={index} 
                                    variants={cinematicBlurUp}
                                    className={`flex items-center justify-between py-6 group relative ${isEditor ? 'pr-8' : ''}`}
                                >
                                    {/* Left: Skill Name (Large and light-colored by default) */}
                                    <span className="font-light tracking-tight text-gray-300 group-hover:text-gray-900 text-xl @md:text-2xl @lg:text-3xl transition-colors duration-300 flex-1 pr-4 min-body">
                                        <EditableText 
                                            value={defaultName} 
                                            onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>

                                    {/* Right: Hover Reveal Percentage */}
                                    <span className={`whitespace-nowrap shrink-0 flex items-center font-mono text-sm @md:text-base text-gray-400 transform transition-all duration-300 select-none ${
                                        isEditor 
                                            ? 'opacity-100 translate-x-0' 
                                            : 'opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0'
                                    }`}>
                                        —&nbsp;
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
                                            className="absolute top-1/2 -translate-y-1/2 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-sm"
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
                    <div className="flex justify-center mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-lg"
                        >
                            + Tambah Skill
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
