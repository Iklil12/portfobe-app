"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function BentoGridExperienceBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    let experiences = [];
    try {
        if (customTexts.experience_items) {
            experiences = JSON.parse(customTexts.experience_items);
        } else {
            experiences = [
                { role: 'Senior Lead Developer', company: 'Tech Corp', duration: '2022 - Present', description: '' },
                { role: 'Frontend Engineer', company: 'Startup Inc', duration: '2019 - 2022', description: '' },
                { role: 'UI Designer', company: 'Creative Agency', duration: '2017 - 2019', description: '' },
                { role: 'Freelance Developer', company: 'Self Employed', duration: '2015 - 2017', description: '' }
            ];
        }
    } catch (e) {
        experiences = [];
    }

    const updateExperiences = (newExps: any[]) => {
        if (!isEditor) return;
        window.parent.postMessage({ type: 'INLINE_EDIT', entity: 'appearance', field: 'experience_items', value: JSON.stringify(newExps) }, window.location.origin);
    };

    const handleUpdateItem = (index: number, key: 'role' | 'company' | 'duration' | 'description', value: string) => {
        const newExps = [...experiences];
        newExps[index][key] = value;
        updateExperiences(newExps);
    };

    const handleAddItem = () => {
        const newExps = [...experiences, { role: "Role Baru", company: "Perusahaan Baru", duration: "Tahun - Tahun", description: "" }];
        updateExperiences(newExps);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExps = experiences.filter((_: any, i: number) => i !== index);
        updateExperiences(newExps);
    };

    return (
        <div id="experience" className="grid gap-3 @lg:gap-6 grid-cols-2 @lg:grid-cols-3 w-full mb-4 @lg:mb-6 scroll-mt-24">
            
            {/* Title Card */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-4 @md:p-8 flex flex-col justify-between min-h-[120px] @md:min-h-[180px] relative overflow-hidden col-span-2 @lg:col-span-1`}
            >
                <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none text-[3rem] @md:text-[6rem] font-black tracking-widest uppercase font-mono">
                    EXP
                </div>
                
                <div className="flex items-center justify-between z-10">
                    <div className="w-8 h-8 @md:w-10 @md:h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--hl)]">
                        <i className="fas fa-history text-sm"></i>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Node.05 // Careers
                    </span>
                </div>

                <div className="mt-3 @md:mt-6 z-10">
                    <h3 className="text-sm @md:text-xl font-sans font-black text-white leading-tight uppercase tracking-tight">
                        <EditableText entity="appearance" field="bentogrid_exp_title" value={getCustomText('bentogrid_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                    </h3>
                    <p className="text-[7px] @md:text-[9px] font-mono text-slate-400 mt-1 @md:mt-2 uppercase tracking-wider">
                        {experiences.length} PLACEMENTS COMPLETED
                    </p>
                </div>
            </motion.div>

            {/* Experience Cards */}
            {experiences.map((exp: any, index: number) => (
                <motion.div 
                    key={index}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-4 @md:p-6 flex flex-col justify-between min-h-[120px] @md:min-h-[180px] relative group overflow-hidden`}
                >
                    {/* Hover Glow */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-[var(--hl)]" />

                    <div className="flex justify-between items-center z-10">
                        <span className="text-[7px] @md:text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                            POS.0{index + 1}
                        </span>
                        
                        <span className="text-[8px] @md:text-[10px] font-mono font-bold bg-white/5 border border-white/10 text-slate-300 px-1.5 @md:px-2.5 py-0.5 @md:py-1 rounded-md whitespace-nowrap">
                            <EditableText 
                                value={exp.duration} 
                                onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                isEditor={isEditor} 
                                maxLength={40} 
                                as="span" 
                            />
                        </span>
                    </div>

                    <div className="my-2 @md:my-4 z-10">
                        <h4 className="font-extrabold text-white text-xs @md:text-base tracking-tight leading-tight group-hover:text-[var(--hl)] transition-colors uppercase">
                            <EditableText 
                                value={exp.role} 
                                onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                isEditor={isEditor} 
                                maxLength={50} 
                                as="span" 
                            />
                        </h4>
                    </div>

                    <div className="pt-2 @md:pt-3 border-t border-white/5 z-10">
                        <p className="text-slate-400 font-mono text-[8px] @md:text-[10px] tracking-wider uppercase">
                            <EditableText 
                                value={exp.company} 
                                onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                isEditor={isEditor} 
                                maxLength={50} 
                                as="span" 
                            />
                        </p>
                    </div>

                    {isEditor && (
                        <button
                            onClick={(e) => handleRemoveItem(index, e)}
                            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-all opacity-0 group-hover:opacity-100 shadow-md"
                            title="Delete Experience"
                        >
                            ✕
                        </button>
                    )}
                </motion.div>
            ))}

            {/* Add Experience Button Card */}
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
                        + Tambah Pengalaman
                    </span>
                </motion.div>
            )}

        </div>
    );
}
