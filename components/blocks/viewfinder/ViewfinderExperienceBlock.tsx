"use client";

import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

export function ViewfinderExperienceBlock({ theme, isEditor }: any) {
    

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#050505] shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]';
      if (style === 'flat') return 'border border-white/20 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#0a0a0a] shadow-2xl';
      return 'border border-white/10 bg-[#050505]';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    let experiences = [];
    try {
        if (customTexts.experience_items) {
            experiences = JSON.parse(customTexts.experience_items);
        } else {
            experiences = [
                { role: 'Lead Director of Photography', company: 'Cinema Labs Studio', duration: '2022 - PRESENT', description: 'Memimpin tim pengarah gaya visual dalam memproduksi film komersial dan naratif berskala internasional, mengoptimalkan tata cahaya analog dan alur kerja sensor digital Alexa.' },
                { role: 'Senior Editor & Colorist', company: 'Vanguard Post Co', duration: '2019 - 2022', description: 'Bertanggung jawab atas penyelarasan warna utama (primary grading) dan proses editorial ritmis untuk video klip musik premium serta iklan televisi kelas atas.' },
                { role: 'Creative Director', company: 'Aperture Agency', duration: '2017 - 2019', description: 'Merancang konsep visual kreatif, mengorganisasi papan cerita (storyboards), serta mengeksekusi visi sutradara utama dengan presisi framing tingkat tinggi.' }
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
        <section id="experience" className="w-full py-24 px-6 @md:px-12 @lg:px-20 border-b border-white/10 bg-[#050505] relative @container overflow-hidden">
            {/* Background HUD Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

            <div className="w-full relative z-10">
                
                {/* Header Title - Ledger Status Bar */}
                <div className="flex items-center gap-4 mb-16 select-none">
                  <div className="w-1.5 h-14 bg-[var(--primary)] shadow-[0_0_8px_var(--primary)] rounded-[1px]"></div>
                  <div className="flex flex-col">
                    <span className="font-mono text-[9px] text-slate-500 uppercase tracking-widest leading-none mb-2">
                      <EditableText entity="appearance" field="viewfinder_exp_label" value={getCustomText('viewfinder_exp_label', 'LOG_FILE // EXPS')} isEditor={isEditor} maxLength={40} as="span" />
                    </span>
                    <h2 className="font-cinema text-4xl @md:text-6xl text-white uppercase tracking-wider leading-none">
                      <EditableText entity="appearance" field="viewfinder_exp_title" value={getCustomText('viewfinder_exp_title', 'Experience')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                  </div>
                </div>

                {/* Timeline Entries */}
                <div className="flex flex-col gap-12 relative">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        const defaultDescription = exp.description || '';
                        
                        return (
                            <div key={index} className="relative group select-none">
                                <div className="grid grid-cols-1 @md:grid-cols-12 gap-4 @md:gap-8 relative">
                                    
                                    {/* Left Column: Duration */}
                                    <div className="@md:col-span-3 font-mono text-[9px] @md:text-xs text-[var(--primary)] font-bold tracking-widest uppercase flex items-center md:justify-start">
                                        <span className="border border-[var(--primary)]/30 px-3 py-1.5 rounded bg-[#0b0b0b]/60 shadow-sm flex items-center gap-1.5">
                                            <span className="w-1 h-1 rounded-full bg-[var(--primary)] animate-pulse"></span>
                                            <EditableText 
                                                value={defaultDuration} 
                                                onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                                isEditor={isEditor} 
                                                maxLength={40} 
                                                as="span" 
                                            />
                                        </span>
                                    </div>
                                    
                                    {/* Middle Dot / Connector Line (Desktop only) */}
                                    <div className="absolute left-[25%] top-0 bottom-0 w-px bg-white/10 hidden @md:block pointer-events-none">
                                        <div className="absolute top-[18px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-800 border border-white/20 group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:shadow-[0_0_8px_var(--primary)] transition-all duration-300"></div>
                                    </div>

                                    {/* Right Column: Role Title, Company, and Description */}
                                    <div className="@md:col-span-9 pl-0 @md:pl-10 pb-8 border-b border-white/5 last:border-b-0">
                                        <h3 className="font-cinema text-2xl @md:text-3xl uppercase tracking-wider text-white group-hover:text-[var(--primary)] transition-colors duration-300">
                                            <EditableText 
                                                value={defaultRole} 
                                                onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                isEditor={isEditor} 
                                                maxLength={50} 
                                                as="span" 
                                            />
                                        </h3>
                                        
                                        <div className="mt-2.5 font-mono text-[9px] text-slate-500 uppercase tracking-widest flex items-center gap-1">
                                            <span>STUDIO //</span> 
                                            <span className="text-white font-bold">
                                                <EditableText 
                                                    value={defaultCompany} 
                                                    onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                                    isEditor={isEditor} 
                                                    maxLength={50} 
                                                    as="span" 
                                                />
                                            </span>
                                        </div>
                                        
                                        <p className="text-xs @md:text-sm text-[#F3F3F1]/75 leading-relaxed mt-4 max-w-2xl text-justify font-medium">
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
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg cursor-pointer"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10 cursor-pointer"
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
