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
        <div className="grid gap-3 @lg:gap-6 grid-cols-2 @lg:grid-cols-3 w-full mb-4 @lg:mb-6">
            
            {/* Title Card */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-4 @md:p-8 flex flex-col justify-between min-h-[120px] @md:min-h-[180px] relative overflow-hidden col-span-2 @lg:col-span-1`}
            >
                <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none text-[3rem] @md:text-[6rem] font-black tracking-widest uppercase font-mono">
                    SKILL
                </div>
                
                <div className="flex items-center justify-between z-10">
                    <div className="w-8 h-8 @md:w-10 @md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--hl)]">
                        <i className="fas fa-bolt text-sm"></i>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Node.04 // Skills
                    </span>
                </div>

                <div className="mt-3 @md:mt-6 z-10">
                    <h3 className="text-sm @md:text-xl font-sans font-black text-white leading-tight uppercase tracking-tight">
                        <EditableText entity="appearance" field="bentogrid_skills_title" value={getCustomText('bentogrid_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                    </h3>
                    <p className="text-[7px] @md:text-[9px] font-mono text-slate-400 mt-1 @md:mt-2 uppercase tracking-wider">
                        {skills.length} MODULES DETECTED // STABLE
                    </p>
                </div>
            </motion.div>

            {/* Skill Cards */}
            {skills.map((skill: any, index: number) => {
                const defaultName = skill.name;
                const defaultProficiency = String(skill.level);
                const val = parseInt(defaultProficiency || '0', 10);
                const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));
                
                return (
                    <motion.div 
                        key={index}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                        className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-4 @md:p-6 flex flex-col justify-between min-h-[120px] @md:min-h-[180px] relative group overflow-hidden`}
                    >
                        {/* Glow effect matching skill level */}
                        <div 
                            className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-[0.08] transition-opacity duration-300 group-hover:opacity-[0.12]"
                            style={{ backgroundColor: 'var(--hl)' }}
                        />

                        <div className="flex justify-between items-start z-10">
                            <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                                MOD.0{index + 1}
                            </span>
                            <span className="text-base @md:text-xl font-black text-[var(--hl)] tracking-tighter">
                                <EditableText 
                                    value={defaultProficiency} 
                                    onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                    isEditor={isEditor} 
                                    maxLength={3} 
                                    as="span" 
                                />%
                            </span>
                        </div>

                        <div className="mt-2 @md:mt-4 z-10">
                            <h4 className="text-white font-extrabold text-xs @md:text-base tracking-tight leading-tight uppercase">
                                <EditableText 
                                    value={defaultName} 
                                    onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                    isEditor={isEditor} 
                                    maxLength={40} 
                                    as="span" 
                                />
                            </h4>
                        </div>

                        {/* Custom visual indicator: High-end progress bar */}
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden mt-2 @md:mt-4 z-10 relative">
                            <motion.div 
                                initial={{ width: 0 }}
                                whileInView={{ width: `${safeVal}%` }}
                                viewport={{ once: true }}
                                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                                className="h-full bg-[var(--hl)] rounded-full"
                                style={isEditor ? { width: `${safeVal}%` } : undefined}
                            />
                        </div>

                        {isEditor && (
                            <button
                                onClick={(e) => handleRemoveItem(index, e)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                                title="Delete Skill"
                            >
                                ✕
                            </button>
                        )}
                    </motion.div>
                );
            })}

            {/* Add Skill Button Card */}
            {isEditor && (
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    onClick={handleAddItem}
                    className={`bento-card cursor-pointer border-2 border-dashed border-white/10 hover:border-[var(--hl)]/40 hover:bg-white/[0.01] transition-all duration-300 ${cardRadiusClass} p-4 @md:p-8 flex flex-col items-center justify-center min-h-[120px] @md:min-h-[180px] group`}
                >
                    <div className="w-10 h-10 rounded-full border border-dashed border-white/20 group-hover:border-[var(--hl)]/40 flex items-center justify-center text-slate-500 group-hover:text-[var(--hl)] transition-all mb-3">
                        <i className="fas fa-plus text-xs"></i>
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 group-hover:text-white transition-all">
                        + Tambah Skill
                    </span>
                </motion.div>
            )}

        </div>
    );
}
