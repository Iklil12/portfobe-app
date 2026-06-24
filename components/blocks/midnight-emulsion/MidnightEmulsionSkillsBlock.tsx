"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: premiumEase } }
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export function MidnightEmulsionSkillsBlock({ theme, isEditor }: any) {
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
            className="w-full py-16 @md:py-32 px-4 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative @container overflow-hidden"
        >
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute bottom-1/4 left-1/4 w-[300px] h-[300px] bg-[var(--hl)] opacity-5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto w-full relative z-10">
                {/* Heading */}
                <motion.div variants={fadeUp} className="mb-16">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4 block">
                        <EditableText entity="appearance" field="midnightemulsion_skills_label" value={getCustomText('midnightemulsion_skills_label', 'Production Tech Stack')} isEditor={isEditor} maxLength={30} as="span" />
                    </span>
                    <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
                        <EditableText entity="appearance" field="midnightemulsion_skills_title" value={getCustomText('midnightemulsion_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                </motion.div>

                {/* Skills Grid */}
                <div className="grid grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 gap-6">
                    {skills.map((skill: any, index: number) => {
                        const defaultName = skill.name;
                        const defaultProficiency = String(skill.level);
                        const val = parseInt(defaultProficiency || '0', 10);
                        const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                        
                        return (
                            <motion.div 
                                key={index} 
                                variants={fadeUp}
                                className="group relative bg-[#06080c] border border-white/5 p-4 @md:p-6 hover:border-[var(--hl)]/30 hover:bg-[#080b11] transition-all duration-500 rounded-lg flex flex-col justify-between min-h-[130px] @md:min-h-[170px]"
                            >
                                {/* Top row: Index and Status */}
                                <div className="flex justify-between items-center mb-2 @md:mb-4">
                                    <span className="font-mono text-[8px] @md:text-[9px] text-slate-500 uppercase tracking-widest">
                                        CAP. // {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                    <span className="font-mono text-[7px] @md:text-[8px] text-[var(--hl)] bg-[var(--hl)]/5 border border-[var(--hl)]/20 px-2 py-0.5 rounded uppercase tracking-wider">
                                        {safeVal >= 90 ? 'Expert' : safeVal >= 80 ? 'Advanced' : 'Proficient'}
                                    </span>
                                </div>

                                {/* Title */}
                                <div className="mb-3 @md:mb-6">
                                    <h3 className="font-serif text-base @md:text-xl text-white group-hover:text-[var(--hl)] transition-colors duration-300">
                                        <EditableText 
                                            value={defaultName} 
                                            onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </h3>
                                </div>

                                {/* Bottom row: Segmented Level Indicator */}
                                <div className="flex flex-col gap-1.5 @md:gap-2">
                                    <div className="flex justify-between items-center text-[9px] @md:text-[10px] font-mono text-slate-400">
                                        <span className="uppercase tracking-wider">Signal Level</span>
                                        <span className="text-[var(--hl)] font-bold">
                                            <EditableText 
                                                value={defaultProficiency} 
                                                onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                                isEditor={isEditor} 
                                                maxLength={3} 
                                                as="span" 
                                            />%
                                        </span>
                                    </div>
                                    
                                    {/* 10 Segment Bars */}
                                    <div className="flex gap-1 h-2 @md:h-3 items-end">
                                        {Array.from({ length: 10 }).map((_, i) => {
                                            const isActive = i < Math.round(safeVal / 10);
                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={{ scaleY: 0.3, opacity: 0.1 }}
                                                    whileInView={isActive ? { scaleY: 1, opacity: 1 } : { scaleY: 0.3, opacity: 0.1 }}
                                                    viewport={{ once: true }}
                                                    transition={{ 
                                                        duration: 0.4, 
                                                        ease: "easeOut",
                                                        delay: index * 0.03 + i * 0.02 
                                                    }}
                                                    className={`h-full flex-1 rounded-sm transition-all duration-300 ${
                                                        isActive 
                                                            ? 'bg-[var(--hl)] shadow-[0_0_6px_var(--hl)]' 
                                                            : 'bg-white/10'
                                                    }`}
                                                    style={isEditor ? (isActive ? { scaleY: 1, opacity: 1 } : { scaleY: 0.3, opacity: 0.1 }) : undefined}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                        title="Delete Skill"
                                    >
                                        ✕
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-16 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                        >
                            + Tambah Skill
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
