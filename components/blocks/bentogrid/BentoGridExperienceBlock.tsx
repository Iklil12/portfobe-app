"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
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
        <div className="grid auto-rows-[minmax(120px,auto)] gap-4 @lg:gap-6 grid-cols-1 w-full mb-4 @lg:mb-6">
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card flex flex-col p-6 @lg:p-10 w-full`}
            >
                <h3 className="text-xl @md:text-2xl font-black text-white mb-6 flex items-center gap-3">
                    <i className="fas fa-history text-[var(--hl)]"></i>
                    <EditableText entity="appearance" field="bentogrid_exp_title" value={getCustomText('bentogrid_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                </h3>
                
                <div className="grid gap-4 grid-cols-1 @md:grid-cols-2">
                    {experiences.map((exp: any, index: number) => (
                        <div key={index} className={`${cardStyleClass} ${cardRadiusClass} flex flex-col gap-3 p-6 hover:bg-white/5 transition-colors group relative`}>
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Hapus Pengalaman"
                                >
                                    ✕
                                </button>
                            )}
                            <div className="flex flex-col @md:flex-row @md:justify-between @md:items-start gap-2">
                                <h4 className="font-bold text-white text-xl group-hover:text-[var(--hl)] transition-colors">
                                    <EditableText 
                                        value={exp.role} 
                                        onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                        as="span" 
                                    />
                                </h4>
                                <span className="text-xs font-bold bg-white/10 text-white px-3 py-1 rounded-full whitespace-nowrap self-start">
                                    <EditableText 
                                        value={exp.duration} 
                                        onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed text-sm">
                                <EditableText 
                                    value={exp.company} 
                                    onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                    isEditor={isEditor} 
                                    maxLength={50} 
                                    as="span" 
                                />
                            </p>
                        </div>
                    ))}
                </div>
                {isEditor && (
                    <div className="flex justify-center mt-12 w-full col-span-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </motion.div>
        </div>
    );
}
