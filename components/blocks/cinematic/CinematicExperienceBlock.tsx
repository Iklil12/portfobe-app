"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicExperienceBlock({ theme, isEditor }: any) {
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
        <section className="py-16 @md:py-24 px-6 @md:px-12 border-b border-[#1f1f1f] bg-[#030303] select-none">
            <div className="w-full flex flex-col">
                <div className="grid grid-cols-1 @md:grid-cols-12 gap-6 @md:gap-12 items-start">
                    
                    {/* Left Column: Title & Section Info */}
                    <div className="@md:col-span-4">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-[0.3em] block mb-3">
                            [ RECORDED LOGS ]
                        </span>
                        <h2 className="font-black uppercase tracking-tighter cine-heading text-3xl @md:text-6xl text-white">
                            <EditableText entity="appearance" field="cinematic_exp_title" value={getCustomText('cinematic_exp_title', 'Experience')} isEditor={isEditor} maxLength={40} as="span" />
                        </h2>
                        <p className="cine-body text-slate-400 leading-relaxed text-xs @md:text-sm font-light mt-3 @md:mt-6 max-w-sm">
                            <EditableText 
                                entity="appearance" 
                                field="cinematic_exp_description" 
                                value={getCustomText('cinematic_exp_description', 'A timeline of key productions, roles, and creative milestones achieved over the years.')} 
                                isEditor={isEditor} 
                                as="span" 
                            />
                        </p>
                    </div>

                    {/* Right Column: Experience Items List */}
                    <div className="@md:col-span-8 flex flex-col divide-y divide-white/10">
                        {experiences.map((exp: any, index: number) => {
                            const defaultRole = exp.role;
                            const defaultCompany = exp.company;
                            const defaultDuration = exp.duration;
                            const defaultDescription = exp.description || '';
                            const themeColor = theme?.themeColor || "#ff9e00";
                            
                            return (
                                <div 
                                    key={index} 
                                    className="group/exp py-5 @md:py-8 first:pt-0 last:pb-0 flex flex-col @sm:flex-row gap-2 @sm:gap-8 relative transition-all duration-300 hover:bg-white/[0.01] -mx-4 px-4 rounded"
                                >
                                    {/* Duration / Time Tag */}
                                    <div className="w-full @sm:w-1/4 shrink-0 pt-1">
                                        <span className="font-mono text-xs text-slate-500 group-hover/exp:text-white transition-colors">
                                            // <EditableText 
                                                 value={defaultDuration} 
                                                 onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={40} 
                                                 as="span" 
                                             />
                                        </span>
                                    </div>

                                    {/* Role, Company, & Description */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="text-base @md:text-xl font-serif text-white/95 group-hover/exp:text-white transition-colors">
                                            <EditableText 
                                                 value={defaultRole} 
                                                 onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={50} 
                                                 as="span" 
                                             />
                                        </h3>
                                        
                                        <span 
                                            className="text-[9px] @md:text-[10px] font-mono uppercase tracking-widest mt-0.5 mb-2 inline-block"
                                            style={{ color: themeColor }}
                                        >
                                            <EditableText 
                                                 value={defaultCompany} 
                                                 onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={50} 
                                                 as="span" 
                                             />
                                        </span>

                                        <p className="text-[11px] @sm:text-xs @md:text-sm text-slate-400 leading-relaxed font-light mt-0.5 max-w-xl">
                                            <EditableText 
                                                 value={defaultDescription} 
                                                 onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={300} 
                                                 as="span" 
                                             />
                                        </p>
                                    </div>
                                
                                    {isEditor && (
                                        <button
                                            onClick={(e) => handleRemoveItem(index, e)}
                                            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] z-30 transition-colors shadow-lg"
                                            title="Hapus Pengalaman"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {isEditor && (
                    <div className="flex justify-start mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-5 py-2.5 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
