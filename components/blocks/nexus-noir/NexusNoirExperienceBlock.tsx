"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirExperienceBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const accentColor = theme?.themeColor || '#4F46E5'; 

    let experiences = [];
    try {
        if (customTexts.experience_items) {
            experiences = JSON.parse(customTexts.experience_items);
        } else {
            experiences = [
                { role: 'Senior Lead Developer', company: 'Tech Corp', duration: '2022 — Present', description: 'Memimpin tim arsitek antarmuka dalam merumuskan ulang batasan antara seni digital dan pengalaman pengguna.' },
                { role: 'Frontend Engineer', company: 'Startup Inc', duration: '2019 — 2022', description: 'Merancang sistem desain skala besar untuk perusahaan fintech, berfokus pada tipografi dan interaksi mikro.' },
                { role: 'UI Designer', company: 'Creative Agency', duration: '2017 — 2019', description: 'Merancang aset visual kreatif untuk berbagai klien global terkemuka.' }
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
        const newExps = [...experiences, { role: "Role Baru", company: "Perusahaan Baru", duration: "Tahun — Tahun", description: "Deskripsi pekerjaan baru." }];
        updateExperiences(newExps);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExps = experiences.filter((_: any, i: number) => i !== index);
        updateExperiences(newExps);
    };

    return (
        <section id="experience" className="py-32 px-6 bg-[#030303] relative z-20">
            <div className="max-w-7xl mx-auto w-full">
                <div className={`text-center mb-24`}>
                    <p className="text-sm tracking-widest uppercase mb-4" style={{ color: accentColor }}>
                        <EditableText entity="appearance" field="nn_exp_subtitle" value={customTexts.nn_exp_subtitle || '[ The Journey ]'} isEditor={isEditor} />
                    </p>
                    <h2 className="font-nn-heading text-4xl md:text-5xl font-semibold whitespace-pre-line">
                        <EditableText entity="appearance" field="nn_exp_title" value={customTexts.nn_exp_title || 'Professional\nTimeline.'} isEditor={isEditor} />
                    </h2>
                </div>

                <div className="relative max-w-4xl mx-auto">
                    {/* Vertical Line */}
                    <div className="absolute left-[15px] md:left-1/2 top-0 bottom-0 w-[1px] bg-white/10 md:-translate-x-1/2"></div>

                    {experiences.map((exp: any, i: number) => {
                        const isLeft = i % 2 === 0;
                        return (
                            <div key={i} className={`relative flex flex-col ${isLeft ? 'md:flex-row' : 'md:flex-row-reverse'} justify-between items-center w-full mb-16 group`}>
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(i, e)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                                {/* Marker */}
                                <div className="absolute left-[11px] md:left-1/2 w-[9px] h-[9px] bg-white/20 rounded-full md:-translate-x-1/2 group-hover:scale-150 group-hover:bg-white transition-all duration-300 z-10"></div>
                                
                                <div className={`w-full md:w-[45%] pl-10 md:pl-0 ${isLeft ? 'md:text-right pr-0 md:pr-10' : 'md:text-left pr-0 md:pr-0 md:ml-10'} mb-4 md:mb-0`}>
                                    <h3 className="font-nn-heading text-2xl font-medium text-white">
                                        <EditableText 
                                            value={exp.role} 
                                            onChange={(val) => handleUpdateItem(i, 'role', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </h3>
                                    <p className="font-medium mt-1" style={{ color: accentColor }}>
                                        <EditableText 
                                            value={exp.company} 
                                            onChange={(val) => handleUpdateItem(i, 'company', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </p>
                                </div>
                                
                                <div className={`w-full md:w-[45%] pl-10 ${isLeft ? 'md:pl-10' : 'md:pl-0 md:text-right pr-0 md:pr-10'}`}>
                                    <span className={`text-xs font-mono text-[#888888] mb-2 block border border-white/10 w-max px-3 py-1 rounded-full ${!isLeft ? 'md:ml-auto' : ''}`}>
                                        <EditableText 
                                            value={exp.duration} 
                                            onChange={(val) => handleUpdateItem(i, 'duration', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </span>
                                    <p className="text-sm text-[#888888] leading-relaxed">
                                        <EditableText 
                                            value={exp.description} 
                                            onChange={(val) => handleUpdateItem(i, 'description', val)} 
                                            isEditor={isEditor} 
                                            as="span" 
                                        />
                                    </p>
                                </div>
                            </div>
                        );
                    })}
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
            </div>
        </section>
    );
}
