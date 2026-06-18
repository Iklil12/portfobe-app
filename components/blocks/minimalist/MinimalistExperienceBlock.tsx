"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function MinimalistExperienceBlock({ theme, isEditor }: any) {
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
        <section className="w-full py-24 md:py-32 px-4 md:px-8 border-t border-gray-200 bg-white">
            <h2 className="text-2xl md:text-4xl font-light tracking-tight text-gray-900 mb-12">
                <EditableText entity="appearance" field="minimalist_exp_title" value={getCustomText('minimalist_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
            </h2>
            <div className="flex flex-col">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    
                    return (
                        <div key={index} className="flex flex-col md:flex-row md:items-center justify-between py-6 border-b border-gray-100 relative">
                            <div className="flex-1">
                                <h3 className="text-xl font-medium text-gray-900">
                                    <EditableText 
                                         value={defaultRole} 
                                         onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                         isEditor={isEditor} 
                                         maxLength={50} 
                                         as="span" 
                                     />
                                </h3>
                                <div className={`mt-2 flex flex-col md:flex-row md:items-center gap-2 text-sm text-gray-500 font-mono`}>
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
                        className="px-6 py-3 border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-lg"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </section>
    );
}
