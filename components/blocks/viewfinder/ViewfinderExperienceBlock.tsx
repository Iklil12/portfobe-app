"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderExperienceBlock({ theme, isEditor }: any) {
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
        <section className="w-full py-24 px-4 md:px-8">
            <h2 className="text-2xl font-mono uppercase tracking-[0.2em] text-white/80 mb-12 flex items-center gap-4 before:w-8 before:h-[1px] before:bg-white/80">
                <EditableText entity="appearance" field="viewfinder_exp_title" value={getCustomText('viewfinder_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    
                    return (
                        <div key={index} className="relative pl-8 py-4 border-l border-white/20 mb-8 before:absolute before:left-[-4px] before:top-6 before:w-2 before:h-2 before:bg-white before:rounded-full">
                            <div className="flex-1">
                                <h3 className="text-xl uppercase tracking-widest text-white">
                                    <EditableText 
                                         value={defaultRole} 
                                         onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                         isEditor={isEditor} 
                                         maxLength={50} 
                                         as="span" 
                                     />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-xs font-mono text-white/40`}>
                                    <span>
                                        <EditableText 
                                             value={defaultCompany} 
                                             onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                             isEditor={isEditor} 
                                             maxLength={50} 
                                             as="span" 
                                         />
                                    </span>
                                    <span className="hidden md:inline">•</span>
                                    <span>
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
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
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
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </section>
    );
}
