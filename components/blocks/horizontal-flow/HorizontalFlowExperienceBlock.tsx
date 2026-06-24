"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function HorizontalFlowExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};

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
        <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full relative z-20">
            <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-slate-400 border-l border-white pl-4 mb-16">
               <span className="text-white">0X / Career Timeline</span>
            </h2>
            
            <div className="flex flex-col gap-12">
                {experiences.map((exp: any, index: number) => (
                    <div key={index} className="group flex flex-col md:flex-row gap-6 md:gap-12 pb-12 border-b border-white/10 relative">
                        {isEditor && (
                            <button
                                onClick={(e) => handleRemoveItem(index, e)}
                                className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                title="Delete Experience"
                            >
                                ✕
                            </button>
                        )}
                        <div className="md:w-1/4 font-mono text-xs uppercase tracking-widest text-white/60 pt-2">
                            <EditableText 
                                value={exp.duration} 
                                onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                isEditor={isEditor} 
                                maxLength={40} 
                                as="span" 
                            />
                        </div>
                        <div className="md:w-3/4">
                            <h3 className="font-display text-3xl font-medium uppercase tracking-tight text-white mb-2">
                                <EditableText 
                                    value={exp.role} 
                                    onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                    isEditor={isEditor} 
                                    maxLength={50} 
                                    as="span" 
                                />
                            </h3>
                            <div className="font-mono text-sm text-slate-400 uppercase tracking-widest mb-4">
                                <EditableText 
                                    value={exp.company} 
                                    onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                    isEditor={isEditor} 
                                    maxLength={50} 
                                    as="span" 
                                />
                            </div>
                            <p className="font-body text-slate-400 text-sm leading-relaxed max-w-2xl">
                                <EditableText 
                                    value={exp.description} 
                                    onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                    isEditor={isEditor} 
                                    as="span" 
                                />
                            </p>
                        </div>
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
        </section>
    );
}
