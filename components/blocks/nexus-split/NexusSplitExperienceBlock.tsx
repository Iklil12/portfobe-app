"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function NexusSplitExperienceBlock({ theme, isEditor }: any) {
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
        const newExps = [...experiences, { role: "Role Baru", company: "Perusahaan Baru", duration: "2024 - Present", description: "Deskripsi pekerjaan baru." }];
        updateExperiences(newExps);
    };

    const handleRemoveItem = (index: number, e: React.MouseEvent) => {
        e.stopPropagation();
        const newExps = experiences.filter((_: any, i: number) => i !== index);
        updateExperiences(newExps);
    };

    const highlightColor = theme?.themeColor || '#4f46e5';

    return (
        <section className="w-full pt-16 @lg:pt-24 pb-16 px-6 @md:px-12 border-b border-white/5 bg-black relative">
            
            {/* Minimal Title matching About block style */}
            <div className="mb-12 select-none">
                <span className="font-mono text-[10px] uppercase tracking-[0.25em]" style={{ color: highlightColor }}>
                  [ 02 / JOURNEY ]
                </span>
            </div>

            {/* Vertical Timeline container */}
            <div className="relative pl-6 @md:pl-8 border-l border-white/10 flex flex-col gap-10 max-w-5xl">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    
                    return (
                        <div key={index} className="group relative flex flex-col gap-2">
                            {/* Dot node on the vertical timeline line */}
                            <div 
                                className="absolute -left-[30px] @md:-left-[38px] top-1.5 w-2.5 h-2.5 rounded-full border bg-black transition-all duration-300 group-hover:scale-125"
                                style={{ 
                                    borderColor: 'rgba(255,255,255,0.2)',
                                    backgroundColor: 'black'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.borderColor = highlightColor;
                                    e.currentTarget.style.backgroundColor = highlightColor;
                                    e.currentTarget.style.boxShadow = `0 0 8px ${highlightColor}`;
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
                                    e.currentTarget.style.backgroundColor = 'black';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            />
                            
                            {/* Time Period in Monospace */}
                            <span className="font-mono text-[9px] uppercase tracking-widest text-neutral-500 group-hover:text-neutral-300 transition-colors select-none">
                                <EditableText 
                                     value={defaultDuration} 
                                     onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                     isEditor={isEditor} 
                                     maxLength={40} 
                                     as="span" 
                                 />
                            </span>

                            {/* Role / Company */}
                            <h3 className="text-base @md:text-lg font-bold uppercase text-neutral-200 group-hover:text-white transition-colors flex items-center gap-2">
                                <EditableText 
                                     value={defaultRole} 
                                     onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                     isEditor={isEditor} 
                                     maxLength={50} 
                                     as="span" 
                                 />
                                <span className="text-neutral-600 font-light text-sm select-none">/</span>
                                <span className="font-medium text-sm @md:text-base text-neutral-400 group-hover:text-neutral-200 transition-colors">
                                    <EditableText 
                                         value={defaultCompany} 
                                         onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                         isEditor={isEditor} 
                                         maxLength={50} 
                                         as="span" 
                                     />
                                </span>
                            </h3>

                            {/* Job Description details */}
                            <p className="text-xs @md:text-sm text-neutral-400 leading-relaxed font-light max-w-2xl mt-0.5">
                                <EditableText 
                                     value={defaultDescription} 
                                     onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                     isEditor={isEditor} 
                                     maxLength={200} 
                                     as="span" 
                                 />
                            </p>

                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                    title="Hapus Pengalaman"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    );})}
            </div>

            {isEditor && (
                <div className="flex justify-center mt-12 w-full col-span-full">
                    <button
                        onClick={handleAddItem}
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[9px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </section>
    );
}
