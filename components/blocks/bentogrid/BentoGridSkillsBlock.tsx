"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function BentoGridSkillsBlock({ theme, isEditor, isCardPreview }: any) {
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


    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full mb-4 @lg:mb-6">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col p-6 @lg:p-10 w-full`}
            >
                <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-bolt text-[var(--hl)]"></i>
                    <EditableText entity="appearance" field="bentogrid_skills_title" value={getCustomText('bentogrid_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                </h3>
                
                <div className="grid gap-4 grid-cols-1 @md:grid-cols-2">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <div key={index} className={`${cardStyleClass} ${cardRadiusClass} p-5 hover:bg-white/5 transition-colors relative`}>
                                <div className="flex justify-between items-start gap-4 mb-4 text-base @md:text-lg font-bold text-white">
                                    <span className="flex-1 break-words pr-2">
                                        <EditableText 
                                        value={defaultName} 
                                        onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                    </span>
                                    <span className="text-[var(--hl)] whitespace-nowrap shrink-0 flex items-center">
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
                                        className={`h-full bg-[var(--hl)] rounded-full`}
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
            </motion.div>
        </div>
    );
}
