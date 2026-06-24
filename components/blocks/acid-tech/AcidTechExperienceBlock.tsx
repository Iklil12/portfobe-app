"use client";

import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function AcidTechExperienceBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

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

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
    };

    return (
        <section className="w-full py-16 md:py-24 bg-black border-y border-[var(--tc)]/20 font-mono text-white" style={{ '--tc': themeColor } as React.CSSProperties}>
            <div className="w-full max-w-[90rem] mx-auto px-4 md:px-16">
                
                {/* Header Container */}
                <div className="mb-10 md:mb-16 flex flex-col md:flex-row md:items-end justify-between border-b border-zinc-900 pb-6 gap-4">
                    <div>
                        <span className="text-[var(--tc)] font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mb-2 block">
                            [ JOURNEY_LOG ]
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-white uppercase tracking-tight">
                            <EditableText entity="appearance" field="acidtech_exp_title" value={getCustomText('acidtech_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                        </h2>
                    </div>
                    <span className="text-[9px] text-zinc-600 uppercase tracking-widest">[ ENGINE_STAMP: VER_4.8 ]</span>
                </div>

                {/* 3-Column Server Blade Grid */}
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer}
                    className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
                >
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        const defaultDescription = exp.description || '';
                        
                        return (
                            <motion.div 
                                key={index} 
                                variants={fadeUp}
                                className="group relative border border-zinc-900 hover:border-[var(--tc)]/40 bg-zinc-950/20 hover:bg-[var(--tc)]/[0.01] p-5 pt-8 flex flex-col justify-between min-h-[220px] md:min-h-[280px] transition-all duration-300 shadow-[0_4px_20px_rgba(0,0,0,0.4)]"
                            >
                                {/* Simulated Server Blade Bracket Top Header */}
                                <div className="absolute top-0 left-0 right-0 h-5 bg-zinc-950 px-3 py-1 flex justify-between items-center text-[7px] text-zinc-500 font-mono border-b border-zinc-900 group-hover:bg-[var(--tc)]/5 transition-colors">
                                    <span>BLADE_UNIT // 0{index + 1}</span>
                                    <span className="text-[var(--tc)] font-bold">VER_0{experiences.length - index}.0</span>
                                </div>

                                <div className="flex-1 flex flex-col justify-between mt-2">
                                    <div>
                                        <h3 className="text-base md:text-lg font-bold text-white group-hover:text-[var(--tc)] transition-colors uppercase leading-snug">
                                            <EditableText 
                                                 value={defaultRole} 
                                                 onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={50} 
                                                 as="span" 
                                             />
                                        </h3>
                                        <div className="mt-2 flex flex-wrap gap-2 text-[9px] font-bold uppercase tracking-wider">
                                            <span className="px-2 py-0.5 bg-zinc-900 border border-zinc-800 text-zinc-300">
                                                <EditableText 
                                                     value={defaultCompany} 
                                                     onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                                     isEditor={isEditor} 
                                                     maxLength={50} 
                                                     as="span" 
                                                 />
                                            </span>
                                            <span className="px-2 py-0.5 bg-zinc-900/60 border border-zinc-900 text-zinc-500">
                                                <EditableText 
                                                     value={defaultDuration} 
                                                     onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                                     isEditor={isEditor} 
                                                     maxLength={40} 
                                                     as="span" 
                                                 />
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 md:mt-6 text-xs text-zinc-400 leading-relaxed font-medium">
                                        <span className="text-[var(--tc)] mr-1.5 font-bold">&gt;</span>
                                        <EditableText 
                                             value={defaultDescription} 
                                             onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                             isEditor={isEditor} 
                                             as="span" 
                                         />
                                    </div>
                                </div>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-1 right-2 text-zinc-600 hover:text-red-500 text-[10px] z-30 transition-colors"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
                </motion.div>

                {isEditor && (
                    <div className="flex justify-center mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-[var(--tc)]/30 text-[var(--tc)] bg-black font-bold uppercase tracking-widest text-[10px] hover:bg-[var(--tc)] hover:text-black transition-all duration-300"
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
