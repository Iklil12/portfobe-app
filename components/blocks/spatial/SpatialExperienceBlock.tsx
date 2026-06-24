"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function SpatialExperienceBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    let experiences = [];
    try {
        if (customTexts.experience_items) {
            experiences = JSON.parse(customTexts.experience_items);
        } else {
            experiences = [
                { role: 'Senior Lead Developer', company: 'Tech Corp', duration: '2022 - Present', description: 'Memimpin tim arsitek antarmuka dalam merumuskan ulang batasan antara seni digital dan pengalaman pengguna.' },
                { role: 'Frontend Engineer', company: 'Startup Inc', duration: '2019 - 2022', description: 'Merancang sistem desain skala besar untuk perusahaan fintech, berfokus pada tipografi dan interaksi mikro.' },
                { role: 'UI Designer', company: 'Creative Agency', duration: '2017 - 2019', description: 'Merancang aset visual kreatif untuk berbagai klien global terkemuka.' }
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
        const newExps = [...experiences, { role: "Role Baru", company: "Perusahaan Baru", duration: "Tahun - Tahun", description: "Deskripsi pekerjaan baru." }];
        updateExperiences(newExps);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExps = experiences.filter((_: any, i: number) => i !== index);
        updateExperiences(newExps);
    };

    const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

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
            id="experience"
            className="w-full px-8 py-20 @md:py-32 max-w-[1360px] mx-auto"
        >
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-20">
                <motion.div variants={auraAnim} className={`inline-flex items-center gap-2 px-4 py-2 ${radiusClass} glass-panel mb-6`}>
                    <span className="text-xs font-medium text-slate-300">
                        <EditableText value={getCustomText('spatial_exp_label', 'Journey')} field="spatial_exp_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                </motion.div>
                <motion.h2 variants={auraAnim} className="font-semibold tracking-[-0.03em] text-gradient leading-tight text-4xl @md:text-5xl">
                    <EditableText entity="appearance" field="spatial_exp_title" value={getCustomText('spatial_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                </motion.h2>
            </div>

            {/* Timeline Experience Layout */}
            <div className="relative flex flex-col pl-4 @md:pl-8">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    
                    return (
                        <motion.div 
                            key={index} 
                            variants={auraAnim}
                            className="relative pl-8 @md:pl-12 pb-12 last:pb-0 group"
                        >
                            {/* Timeline Connection Line */}
                            {index < experiences.length - 1 && (
                                <div className="absolute left-[11px] top-3 bottom-0 w-px bg-gradient-to-b from-white/15 via-white/5 to-transparent pointer-events-none"></div>
                            )}

                            {/* Timeline Glowing Dot */}
                            <div 
                                className="absolute left-[7px] top-[10px] w-[9px] h-[9px] rounded-full transition-transform duration-500 group-hover:scale-150 z-10"
                                style={{
                                    backgroundColor: 'var(--hl, #6366f1)',
                                    boxShadow: '0 0 10px var(--hl, #6366f1), 0 0 4px var(--hl, #6366f1)'
                                }}
                            />

                            {/* Card Content */}
                            <div className={`glass-panel ${cardRadiusClass} p-6 @md:p-8 border border-white/5 hover:border-white/15 hover:bg-white/[0.03] transition-all duration-500 relative flex flex-col @lg:flex-row gap-6 justify-between items-start`}>
                                {/* Ambient Background Glow */}
                                <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-[var(--hl, #6366f1)] rounded-full blur-[60px] opacity-0 group-hover:opacity-15 transition-opacity duration-700 pointer-events-none"></div>

                                {/* Job Details Column */}
                                <div className="flex-1 min-w-0">
                                    {/* Duration Tag */}
                                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/[0.03] border border-white/10 rounded-full text-xs font-mono text-[var(--hl, #6366f1)] mb-4">
                                        <i className="far fa-calendar-alt text-[10px] opacity-80"></i>
                                        <EditableText 
                                            value={defaultDuration} 
                                            onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </div>

                                    {/* Role Title */}
                                    <h3 className="text-xl @md:text-2xl font-semibold text-white tracking-tight mb-2">
                                        <EditableText 
                                            value={defaultRole} 
                                            onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </h3>

                                    {/* Company Name */}
                                    <div className="flex items-center gap-2 text-sm text-slate-400 font-medium">
                                        <span className="w-1.5 h-1.5 rounded-full bg-slate-500 opacity-60"></span>
                                        <EditableText 
                                            value={defaultCompany} 
                                            onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </div>
                                </div>

                                {/* Description Column */}
                                <div className="w-full @lg:w-[50%] shrink-0 text-slate-400 text-sm leading-relaxed @lg:pt-2">
                                    <EditableText 
                                        value={defaultDescription} 
                                        onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                        isEditor={isEditor} 
                                        maxLength={300} 
                                        as="p" 
                                    />
                                </div>

                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute -top-2 -right-2 bg-rose-500 hover:bg-rose-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg border border-rose-400/20"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {isEditor && (
                <div className="flex justify-center mt-16 w-full col-span-full">
                    <button
                        onClick={handleAddItem}
                        className={`px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 ${radiusClass}`}
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </motion.section>
    );
}
