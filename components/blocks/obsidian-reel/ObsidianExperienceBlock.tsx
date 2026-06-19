"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function ObsidianExperienceBlock({ theme, isEditor }: any) {
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

    const getBtnShapeClass = (shape?: string) => {
        if (shape === 'hard' || shape === 'square') return 'rounded-none';
        if (shape === 'rounded') return 'rounded-md';
        return 'rounded-full';
    };
    const btnShape = getBtnShapeClass(theme?.buttonShape);

    return (
        <section className="w-full py-16 md:py-24 px-4 md:px-8 bg-zinc-950 border-t border-white/5 relative">
            {/* Soft backdrop blur spot */}
            <div className="absolute left-[5%] bottom-[10%] w-[300px] h-[300px] bg-red-950/5 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-screen-xl mx-auto">
                <div className="flex flex-col @sm:flex-row justify-between items-start @sm:items-end mb-10 md:mb-20 gap-4 @sm:gap-6">
                    <div>
                        <span className="text-[9px] md:text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em] block mb-2">
                            TIMELINE // ARCHIVES
                        </span>
                        <h2 className="text-3xl md:text-6xl font-black uppercase text-white tracking-tighter">
                            <EditableText entity="appearance" field="obsidian_exp_title" value={getCustomText('obsidian_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                        </h2>
                    </div>
                    <div className="h-[1px] flex-1 bg-white/5 hidden @sm:block mx-8 mb-4"></div>
                    <span className="text-[9px] md:text-[10px] font-mono text-zinc-400 uppercase tracking-widest bg-white/5 border border-white/10 px-2.5 py-1.5 rounded shrink-0">
                        ROLL_DIR // SCENE_LIST
                    </span>
                </div>

                <div className="relative border-l border-white/10 pl-6 md:pl-16 ml-3 md:ml-8 flex flex-col gap-10 md:gap-16">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        const defaultDescription = exp.description || '';
                        
                        return (
                            <div key={index} className="relative group flex flex-col gap-4">
                                
                                {/* Film Strip Perforation Indicator (Bullet Dot) */}
                                <div className="absolute left-[-33px] md:left-[-69px] top-1 flex items-center justify-center">
                                    <div className="w-4 h-4 rounded-full bg-zinc-950 border border-white/20 flex items-center justify-center group-hover:border-white transition-colors duration-300 relative z-10">
                                        <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 group-hover:bg-red-500 transition-colors duration-300"></span>
                                    </div>
                                    {/* Connection node tag */}
                                    <span className="hidden md:inline absolute left-8 font-mono text-[9px] text-zinc-600 select-none">
                                        SC_0{index + 1}
                                    </span>
                                </div>

                                {/* Timeline Entry Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-10 items-start">
                                    
                                    {/* Left Column: Duration */}
                                    <div className="flex flex-col">
                                        <span className="font-mono text-base font-bold text-white group-hover:text-red-500 transition-colors duration-300">
                                            <EditableText 
                                                value={defaultDuration} 
                                                onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                                isEditor={isEditor} 
                                                maxLength={40} 
                                                as="span" 
                                            />
                                        </span>
                                        <span className="text-[9px] font-mono text-zinc-500 uppercase tracking-wider mt-1 select-none">
                                            TIMECODE_DURATION
                                        </span>
                                    </div>

                                    {/* Right Column: Description & Roles */}
                                    <div className="flex flex-col">
                                        <h3 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">
                                            <EditableText 
                                                value={defaultRole} 
                                                onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                isEditor={isEditor} 
                                                maxLength={50} 
                                                as="span" 
                                            />
                                        </h3>

                                        <div className="flex items-center gap-2 text-xs text-red-500/80 font-mono uppercase tracking-widest mb-4">
                                            <span>@</span>
                                            <span className="font-semibold text-zinc-300">
                                                <EditableText 
                                                    value={defaultCompany} 
                                                    onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                                    isEditor={isEditor} 
                                                    maxLength={50} 
                                                    as="span" 
                                                />
                                            </span>
                                        </div>

                                        <p className="text-zinc-400 text-sm md:text-base leading-relaxed max-w-2xl bg-white/[0.01] border border-white/5 p-4 rounded-xl group-hover:border-white/10 group-hover:bg-white/[0.02] transition-all duration-300">
                                            <EditableText 
                                                value={defaultDescription} 
                                                onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                                isEditor={isEditor} 
                                                maxLength={300} 
                                                as="span" 
                                            />
                                        </p>
                                    </div>
                                </div>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-2 right-2 bg-zinc-800 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[8px] z-30 transition-colors border border-white/10"
                                        title="Hapus Pengalaman"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );})}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-16 w-full">
                        <button
                            onClick={handleAddItem}
                            className={`px-8 py-3.5 border border-dashed border-white/25 hover:border-white/50 text-white/70 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 ${btnShape}`}
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
