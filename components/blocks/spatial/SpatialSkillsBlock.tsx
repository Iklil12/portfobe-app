"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function SpatialSkillsBlock({ theme, isEditor, isCardPreview }: any) {
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
        const newSkills = [...skills, { name: "New Capability", level: 80 }];
        updateSkills(newSkills);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newSkills = skills.filter((_: any, i: number) => i !== index);
        updateSkills(newSkills);
    };

    const getSkillIcon = (name: string, index: number) => {
        const lowerName = name.toLowerCase();
        if (lowerName.includes('front') || lowerName.includes('react') || lowerName.includes('web') || lowerName.includes('dev')) return 'fa-laptop-code';
        if (lowerName.includes('design') || lowerName.includes('ux') || lowerName.includes('ui') || lowerName.includes('creative') || lowerName.includes('art')) return 'fa-wand-magic-sparkles';
        if (lowerName.includes('back') || lowerName.includes('api') || lowerName.includes('database') || lowerName.includes('server') || lowerName.includes('system')) return 'fa-server';
        if (lowerName.includes('manage') || lowerName.includes('lead') || lowerName.includes('director') || lowerName.includes('product')) return 'fa-compass';
        const fallbacks = ['fa-atom', 'fa-code-branch', 'fa-cubes', 'fa-terminal'];
        return fallbacks[index % fallbacks.length];
    };

    // 3D Perspective Hover Effect Handlers
    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const { currentTarget, clientX, clientY } = e;
        const rect = currentTarget.getBoundingClientRect();
        const x = clientX - rect.left - rect.width / 2;
        const y = clientY - rect.top - rect.height / 2;
        
        // Tilt max 10 degrees
        const rotateX = -(y / (rect.height / 2)) * 10;
        const rotateY = (x / (rect.width / 2)) * 10;
        
        currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    };

    const handleMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
        currentTargetRestore(e.currentTarget);
    };

    const currentTargetRestore = (el: HTMLDivElement) => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    };

    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';
    
    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

    const auraAnim = isCardPreview
        ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
        : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
    const staggerContainer = isCardPreview
        ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
        : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

    return (
        <motion.section 
            initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            id="skills"
            className="w-full px-8 py-20 @md:py-32 max-w-[1360px] mx-auto"
        >
            {/* Custom Stripes Animation Style */}
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes progress-stripes {
                    from { background-position: 1rem 0; }
                    to { background-position: 0 0; }
                }
                .animate-stripes {
                    background-image: linear-gradient(
                        45deg,
                        rgba(255, 255, 255, 0.15) 25%,
                        transparent 25%,
                        transparent 50%,
                        rgba(255, 255, 255, 0.15) 50%,
                        rgba(255, 255, 255, 0.15) 75%,
                        transparent 75%,
                        transparent
                    );
                    background-size: 1rem 1rem;
                    animation: progress-stripes 1.2s linear infinite;
                }
                `
            }} />

            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <motion.div variants={auraAnim} className={`inline-flex items-center gap-2 px-4 py-2 ${radiusClass} ${cardStyleClass} mb-6`}>
                    <span className="text-xs font-medium text-slate-300">
                        <EditableText value={getCustomText('spatial_skills_label', 'Expertise')} field="spatial_skills_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                </motion.div>
                <motion.h2 variants={auraAnim} className="font-semibold tracking-[-0.03em] text-gradient leading-tight text-4xl @md:text-5xl">
                    <EditableText entity="appearance" field="spatial_skills_title" value={getCustomText('spatial_skills_title', 'Core Capabilities')} isEditor={isEditor} maxLength={40} as="span" />
                </motion.h2>
            </div>

            {/* 3D Holographic Perspective Grid */}
            <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
                {skills.map((skill: any, index: number) => {
                    const defaultName = skill.name;
                    const defaultProficiency = String(skill.level);
                    const val = parseInt(defaultProficiency || '0', 10);
                    const safeVal = isNaN(val) ? 0 : Math.min(100, Math.max(0, val));

                    return (
                        <motion.div 
                            key={index} 
                            variants={auraAnim}
                            onMouseMove={handleMouseMove}
                            onMouseLeave={handleMouseLeave}
                            className={`${cardStyleClass} ${cardRadiusClass} p-8 hover:border-white/20 transition-all duration-300 ease-out relative group flex flex-col justify-between`}
                            style={{ 
                                transformStyle: 'preserve-3d',
                                transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
                            }}
                        >
                            {/* Accent Glow backdrop */}
                            <div className="absolute right-0 top-0 w-48 h-48 bg-[var(--hl, #6366f1)] rounded-full blur-[70px] opacity-10 group-hover:opacity-25 transition-opacity duration-700 pointer-events-none"></div>

                            {/* Top Content Row */}
                            <div className="flex justify-between items-start mb-8 relative z-10">
                                <div className="flex gap-4 items-center min-w-0">
                                    {/* Icon Badge */}
                                    <div className={`w-12 h-12 shrink-0 ${radiusClass} bg-white/5 border border-white/10 flex items-center justify-center text-lg text-slate-400 group-hover:text-[var(--hl, #6366f1)] group-hover:border-[var(--hl, #6366f1)]/20 transition-colors duration-500`}>
                                        <i className={`fas ${getSkillIcon(defaultName, index)}`}></i>
                                    </div>
                                    <div className="flex flex-col min-w-0">
                                        <h3 className="text-xl font-semibold text-white tracking-tight">
                                            <EditableText 
                                                value={defaultName} 
                                                onChange={(val) => handleUpdateItem(index, 'name', val)} 
                                                isEditor={isEditor} 
                                                maxLength={40} 
                                                as="span" 
                                            />
                                        </h3>
                                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest mt-0.5">CORE_MODULE_0{index + 1}</span>
                                    </div>
                                </div>
                                <div className="font-mono text-2xl text-white tracking-tight font-semibold flex items-baseline relative z-10">
                                    <EditableText 
                                        value={defaultProficiency} 
                                        onChange={(val) => handleUpdateItem(index, 'level', val)} 
                                        isEditor={isEditor} 
                                        maxLength={3} 
                                        as="span" 
                                    />
                                    <span className="text-xs text-slate-500 ml-0.5">%</span>
                                </div>
                            </div>

                            {/* Glowing Liquid Energy Capsule Progress Bar */}
                            <div className="relative z-10 w-full">
                                <div className="w-full h-4 bg-black/60 border border-white/5 shadow-inner rounded-full overflow-hidden p-[2px] relative flex items-center">
                                    {/* Liquid current fill */}
                                    <motion.div 
                                        variants={{
                                            hidden: { width: 0 },
                                            visible: { width: isEditor ? `${safeVal}%` : `${safeVal}%`, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
                                        }}
                                        className="h-full rounded-full relative flex items-center justify-end overflow-hidden"
                                        style={{ 
                                            width: isEditor ? `${safeVal}%` : undefined,
                                            backgroundColor: 'var(--hl, #6366f1)',
                                            boxShadow: '0 0 15px var(--hl, #6366f1), 0 0 5px var(--hl, #6366f1)'
                                        }}
                                    >
                                        {/* Animated liquid stripes texture overlay */}
                                        <div className="absolute inset-0 w-full h-full animate-stripes opacity-30"></div>
                                    </motion.div>
                                    
                                    {/* Floating Glowing Cap Point */}
                                    <motion.div
                                        variants={{
                                            hidden: { left: 0 },
                                            visible: { left: isEditor ? `${safeVal}%` : `${safeVal}%`, transition: { duration: 1.5, ease: [0.16, 1, 0.3, 1] } }
                                        }}
                                        className="absolute w-4 h-4 rounded-full bg-white border border-[var(--hl, #6366f1)] flex items-center justify-center shadow-[0_0_15px_#fff]"
                                        style={{ 
                                            left: isEditor ? `${safeVal}%` : undefined,
                                            transform: 'translateX(-50%)',
                                            boxShadow: '0 0 15px #ffffff, 0 0 5px var(--hl, #6366f1)'
                                        }}
                                    >
                                        <div className="w-1.5 h-1.5 rounded-full bg-[var(--hl, #6366f1)]"></div>
                                    </motion.div>
                                </div>
                            </div>
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute -top-1 -right-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg border border-rose-400/20"
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
                <div className="flex justify-center mt-16 w-full col-span-full">
                    <button
                        onClick={handleAddItem}
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full"
                    >
                        + Tambah Skill
                    </button>
                </div>
            )}
        </motion.section>
    );
}
