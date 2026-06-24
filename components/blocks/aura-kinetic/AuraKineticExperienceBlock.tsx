"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function AuraKineticExperienceBlock({ theme, isEditor }: any) {
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


    return (
        <section className="w-full py-16 md:py-32 px-6 md:px-16 overflow-hidden relative">
            <div className="max-w-[1000px] mx-auto flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-16 gap-4 md:gap-6">
                <div>
                    <span className="font-mono text-xs tracking-[0.3em] text-[var(--hl)] font-bold uppercase block mb-3">
                        Timeline
                    </span>
                    <h2 className="text-3xl md:text-6xl font-black tracking-tight text-white uppercase leading-none">
                        <EditableText entity="appearance" field="aurakinetic_exp_title" value={getCustomText('aurakinetic_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                </div>
            </div>

            <div className="max-w-[1000px] mx-auto relative pl-8 md:pl-12 border-l border-white/10 flex flex-col gap-6 md:gap-10">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    
                    return (
                        <div key={index} className="relative group">
                            {/* Timeline Node Orb */}
                            <div className="absolute left-[-39px] md:left-[-57px] top-6 md:top-7 w-[14px] h-[14px] md:w-[18px] md:h-[18px] rounded-full bg-[#0a0a0c] border-[3px] border-white/30 group-hover:border-[var(--hl)] group-hover:scale-125 transition-all duration-300 z-10 flex items-center justify-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-[var(--hl)] transition-all duration-300" />
                            </div>

                            {/* Experience Content Card */}
                            <div className="p-5 md:p-8 rounded-2xl md:rounded-3xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden relative">
                                {/* Hover Background Glow */}
                                <div className="absolute -right-20 -top-20 w-48 h-48 bg-[var(--hl)] opacity-0 group-hover:opacity-[0.08] rounded-full blur-[60px] transition-opacity duration-700 pointer-events-none" />

                                <div className="flex flex-col md:flex-row md:items-baseline md:justify-between gap-1.5 md:gap-2 mb-2 md:mb-4">
                                    <h3 className="text-lg md:text-2xl font-bold text-white tracking-tight uppercase">
                                        <EditableText 
                                            value={defaultRole} 
                                            onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                        />
                                    </h3>
                                    <span className="font-mono text-[10px] md:text-xs text-[var(--hl)] font-semibold tracking-wider uppercase bg-white/[0.03] px-2.5 py-0.5 md:px-3 md:py-1 rounded-full border border-white/5 whitespace-nowrap self-start md:self-auto">
                                        <EditableText 
                                            value={defaultDuration} 
                                            onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                        />
                                    </span>
                                </div>

                                <div className="font-mono text-xs md:text-sm text-white/50 mb-3 md:mb-4 font-medium uppercase tracking-wider">
                                    <EditableText 
                                        value={defaultCompany} 
                                        onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                        isEditor={isEditor} 
                                        maxLength={50} 
                                    />
                                </div>

                                <p className="text-xs md:text-base text-white/60 leading-relaxed font-sans font-light">
                                    <EditableText 
                                        value={defaultDescription} 
                                        onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                        isEditor={isEditor} 
                                        maxLength={300} 
                                        className="bg-transparent text-white/60 focus:outline-none"
                                    />
                                </p>

                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-4 right-4 bg-red-500/20 hover:bg-red-500 text-red-300 hover:text-white rounded-full w-7 h-7 flex items-center justify-center text-[10px] z-30 transition-all duration-300 shadow-md border border-red-500/30"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {isEditor && (
                <div className="max-w-[1000px] mx-auto flex justify-center mt-12 w-full col-span-full">
                    <button
                        onClick={handleAddItem}
                        className="px-8 py-4 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 rounded-full"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </section>
    );
}
