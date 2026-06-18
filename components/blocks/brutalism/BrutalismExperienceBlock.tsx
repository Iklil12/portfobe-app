"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function BrutalismExperienceBlock({ theme, isEditor }: any) {
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
        <section className="w-full py-24 px-4 md:px-8 bg-[#ffff00] border-b-[6px] border-black">
            <h2 className="text-5xl md:text-7xl font-black text-black uppercase mb-12 border-4 border-black p-4 inline-block bg-white shadow-[8px_8px_0_0_#000]">
                <EditableText entity="appearance" field="brutalism_exp_title" value={getCustomText('brutalism_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    
                    return (
                        <div key={index} className="border-4 border-black p-6 bg-white mb-8 shadow-[8px_8px_0_0_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_#000] transition-all relative">
                            <div className="flex-1">
                                <h3 className="text-3xl font-black uppercase text-black mb-2">
                                    <EditableText 
                                         value={defaultRole} 
                                         onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                         isEditor={isEditor} 
                                         maxLength={50} 
                                         as="span" 
                                     />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm font-bold bg-black text-white px-2 py-1 inline-block`}>
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
                        className="px-6 py-3 border-4 border-black hover:bg-black hover:text-[#ffff00] text-black uppercase tracking-widest text-[11px] font-black transition-all duration-300 bg-white shadow-[6px_6px_0_0_#000] active:translate-x-1 active:translate-y-1 active:shadow-[2px_2px_0_0_#000]"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </section>
    );
}
