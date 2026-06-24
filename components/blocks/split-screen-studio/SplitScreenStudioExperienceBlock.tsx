"use client";

import React from 'react';
import { ScrollBlock } from './ScrollBlock';
import { EditableText } from '@/shared/ui/EditableText';

export function SplitScreenStudioExperienceBlock({ theme, isEditor }: any) {
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
        <ScrollBlock 
            bg="#050805" index="EXP / 08" 
            tag={<EditableText entity="appearance" field="sss_exp_tag" value={getCustomText('sss_exp_tag', 'JOURNEY')} isEditor={isEditor} maxLength={30} as="span" />} 
            title={
                <>
                    <EditableText entity="appearance" field="sss_exp_title1" value={getCustomText('sss_exp_title1', 'WORK')} isEditor={isEditor} maxLength={20} as="span" /><br/>
                    <EditableText entity="appearance" field="sss_exp_title2" value={getCustomText('sss_exp_title2', 'HISTORY.')} isEditor={isEditor} maxLength={20} as="span" />
                </>
            } 
            desc={<EditableText entity="appearance" field="sss_exp_desc" value={getCustomText('sss_exp_desc', 'Our professional journey and past collaborations.')} isEditor={isEditor} maxLength={200} as="span" />}
        >
            {({ y }: any) => (
                <div className="flex flex-col gap-8 mt-8">
                    {experiences.map((exp: any, index: number) => (
                        <div key={index} className="flex flex-col border-b border-white/10 pb-6 group relative">
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Delete Experience"
                                >
                                    ✕
                                </button>
                            )}
                            <h3 className="font-display text-2xl md:text-3xl font-bold uppercase mb-2 group-hover:text-[var(--hl)] transition-colors">
                                <EditableText 
                                    value={exp.role} 
                                    onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                    isEditor={isEditor} 
                                    maxLength={40} 
                                    as="span" 
                                />
                            </h3>
                            <div className="flex flex-col md:flex-row md:items-center justify-between font-sans text-sm text-white/50 uppercase tracking-widest gap-2">
                                <span>
                                    <EditableText 
                                        value={exp.company} 
                                        onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </span>
                                <span className="hidden md:block w-12 h-[1px] bg-white/20"></span>
                                <span>
                                    <EditableText 
                                        value={exp.duration} 
                                        onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                        isEditor={isEditor} 
                                        maxLength={30} 
                                        as="span" 
                                    />
                                </span>
                            </div>
                        </div>
                    ))}
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
            )}
        </ScrollBlock>
    );
}
