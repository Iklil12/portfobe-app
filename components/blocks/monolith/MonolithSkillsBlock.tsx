"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function MonolithSkillsBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    let skills: any[] = [];
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

    const monolithEase = [0.22, 1, 0.36, 1] as any;
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12, delayChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 50, filter: 'blur(8px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: monolithEase } }
    };

    return (
        <motion.section
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.15 }} variants={staggerContainer}
            className="relative z-20 w-full bg-[#050505] px-6 @md:px-12 py-20 @md:py-32 flex flex-col overflow-hidden"
        >
            {/* Ambient glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Section Header */}
            <motion.div variants={itemVariants} className="flex flex-col @md:flex-row @md:justify-between @md:items-end gap-4 mb-16 @md:mb-24">
                <div className="flex flex-col gap-3">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
                        <EditableText entity="appearance" field="monolith_skills_label" value={getCustomText('monolith_skills_label', 'Technical Index')} isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <h2 className="font-serif text-4xl @md:text-6xl @lg:text-[5.5cqi] leading-[0.9] text-white">
                        <EditableText entity="appearance" field="monolith_skills_title" value={getCustomText('monolith_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                </div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hidden @md:block">
                    {String(skills.length).padStart(2, '0')} modules
                </span>
            </motion.div>

            {/* Skills Grid */}
            <div className="flex flex-col w-full">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group border-t border-white/[0.06] first:border-t-0"
                        >
                            <div className="flex items-center w-full py-6 @md:py-10 gap-4 @md:gap-8">
                                {/* Index Number */}
                                <span className="shrink-0 font-serif text-3xl @md:text-5xl @lg:text-6xl font-light text-white/[0.06] group-hover:text-white/10 transition-colors duration-500 tabular-nums w-10 @md:w-16 text-right leading-none select-none">
                                    {String(index + 1).padStart(2, '0')}
                                </span>

                                {/* Content */}
                                <div className="flex-1 min-w-0 flex flex-col gap-3 @md:gap-4">
                                    {/* Name + Percentage Row */}
                                    <div className="flex justify-between items-baseline gap-4">
                                        <h3 className="font-serif text-xl @md:text-3xl @lg:text-4xl text-white group-hover:text-[var(--hl)] transition-colors duration-500 truncate">
                                            <EditableText
                                                value={defaultName}
                                                onChange={(val: string) => handleUpdateItem(index, 'name', val)}
                                                isEditor={isEditor}
                                                maxLength={40}
                                                as="span"
                                            />
                                        </h3>
                                        <span className="shrink-0 font-sans text-sm @md:text-lg font-bold text-white/20 group-hover:text-white/50 transition-colors duration-500 tabular-nums">
                                            <EditableText
                                                value={defaultProficiency}
                                                onChange={(val: string) => handleUpdateItem(index, 'level', val)}
                                                isEditor={isEditor}
                                                maxLength={3}
                                                as="span"
                                            />
                                            <span className="text-white/10 ml-0.5">%</span>
                                        </span>
                                    </div>

                                    {/* Progress Track */}
                                    <div className="relative w-full h-[2px] @md:h-[3px] bg-white/[0.04] overflow-hidden">
                                        {/* Background shimmer on hover */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                        
                                        {/* Active fill */}
                                        <motion.div
                                            initial={{ width: 0 }}
                                            {...{ [animationTrigger]: { width: `${safeVal}%` } }}
                                            viewport={{ once: true }}
                                            transition={{ duration: 1.8, ease: monolithEase, delay: index * 0.1 }}
                                            className="absolute top-0 left-0 h-full"
                                            style={isEditor ? { width: `${safeVal}%` } : undefined}
                                        >
                                            {/* Gradient fill */}
                                            <div className="w-full h-full bg-gradient-to-r from-[var(--hl)] to-white/60 group-hover:to-white transition-all duration-700"></div>
                                            
                                            {/* Glow dot at end */}
                                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-1.5 @md:w-2 @md:h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.4)] opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            {/* Editor: Remove Button */}
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-3 right-0 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Delete Skill"
                                >
                                    ✕
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom divider line */}
            <div className="w-full h-[1px] bg-white/[0.06] mt-0"></div>

            {/* Editor: Add Button */}
            {isEditor && (
                <div className="flex justify-center mt-12 w-full">
                    <button
                        onClick={handleAddItem}
                        className="px-8 py-3 border border-dashed border-white/15 hover:border-[var(--hl)]/40 text-white/40 hover:text-[var(--hl)] uppercase tracking-[0.3em] text-[9px] font-sans font-bold transition-all duration-300 bg-white/[0.02] hover:bg-[var(--hl)]/[0.04]"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </motion.section>
    );
}
