"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function LayeredMonolithExperienceBlock({ theme, isEditor }: any) {
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
        <section className="w-full min-h-[100vh] py-32 px-6 md:px-16 bg-[#111] text-white flex flex-col justify-center relative stack-card">
            {/* Ambient Background Grid Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

            <div className="relative z-10 max-w-5xl mx-auto w-full">
                {/* Monolithic Title Area */}
                <div className="mb-20 flex flex-col items-start">
                    <div className="flex items-center gap-3 mb-4">
                        <span className="w-2.5 h-2.5 bg-white shrink-0 block" />
                        <span className="text-[10px] font-mono tracking-[0.35em] text-white/50 uppercase">
                            [ CHRONOLOGY MODULE ]
                        </span>
                    </div>
                    <h2 className="text-5xl md:text-7xl font-bold uppercase tracking-tighter leading-none border-b-4 border-white pb-6 inline-block">
                        <EditableText
                            entity="appearance"
                            field="layeredmonolith_exp_title"
                            value={getCustomText('layeredmonolith_exp_title', 'Professional Journey')}
                            isEditor={isEditor}
                            maxLength={40}
                            as="span"
                        />
                    </h2>
                </div>

                {/* Timeline Cards Container */}
                <div className="flex flex-col gap-6">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        const defaultDescription = exp.description || '';

                        return (
                            <div
                                key={index}
                                className="group relative bg-[#181818] p-6 md:p-8 border border-white/10 transition-all duration-300 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.04)] hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.08)] hover:-translate-x-1 hover:-translate-y-1 flex flex-col md:flex-row gap-6 md:gap-8 justify-between"
                            >
                                {/* Decorative Monolith Corner Accent */}
                                <div className="absolute top-0 left-0 w-2 h-2 bg-white/20 group-hover:bg-white transition-colors duration-300" />

                                {/* Monolithic Index Badge */}
                                <div className="absolute top-4 right-4 font-mono text-[9px] tracking-widest text-white/10 group-hover:text-white/30 transition-colors duration-300">
                                    LAYER // 0{index + 1}
                                </div>

                                {/* Left Side: Duration Tag */}
                                <div className="md:w-44 shrink-0 flex items-start">
                                    <div className="px-3 py-1.5 bg-white text-black font-mono text-[10px] uppercase tracking-wider font-extrabold border border-white/20 shadow-[4px_4px_0px_rgba(255,255,255,0.1)]">
                                        <EditableText
                                            value={defaultDuration}
                                            onChange={(val) => handleUpdateItem(index, 'duration', val)}
                                            isEditor={isEditor}
                                            maxLength={40}
                                            as="span"
                                        />
                                    </div>
                                </div>

                                {/* Right Side: Role & Details */}
                                <div className="flex-1 flex flex-col justify-start">
                                    <h3 className="text-xl md:text-2xl font-bold uppercase tracking-tight text-white mb-1 group-hover:text-white transition-colors duration-300">
                                        <EditableText
                                            value={defaultRole}
                                            onChange={(val) => handleUpdateItem(index, 'role', val)}
                                            isEditor={isEditor}
                                            maxLength={50}
                                            as="span"
                                        />
                                    </h3>
                                    <span className="font-mono text-xs tracking-widest text-white/40 uppercase mb-4 block">
                                        <EditableText
                                            value={defaultCompany}
                                            onChange={(val) => handleUpdateItem(index, 'company', val)}
                                            isEditor={isEditor}
                                            maxLength={50}
                                            as="span"
                                        />
                                    </span>
                                    <p className="text-sm text-white/60 group-hover:text-white/80 leading-relaxed transition-colors duration-300 max-w-2xl">
                                        <EditableText
                                            value={defaultDescription}
                                            onChange={(val) => handleUpdateItem(index, 'description', val)}
                                            isEditor={isEditor}
                                            as="span"
                                        />
                                    </p>
                                </div>

                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute -top-2.5 -right-2.5 bg-black hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors border border-white/10 shadow-lg"
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
                    <div className="flex justify-center mt-16 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-8 py-4 border-2 border-dashed border-white/20 hover:border-white text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white hover:text-black rounded-sm"
                        >
                            + TAMBAH JOURNEY MODULE
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
