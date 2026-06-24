"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryExperienceBlock({ theme, isEditor }: any) {
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
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow Theater Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Lens Flare Glow */}
            <div className="absolute -bottom-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -top-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Cinematic Header Area */}
            <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
                <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
                    [ SECTION 04 // CHRONOLOGY ]
                </div>
                <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
                    <EditableText 
                        entity="appearance" 
                        field="cinematicgallery_exp_title" 
                        value={getCustomText('cinematicgallery_exp_title', 'Perjalanan Karir')} 
                        isEditor={isEditor} 
                        maxLength={40} 
                        as="span" 
                    />
                </h2>
            </div>
            
            <div className="w-full max-w-4xl mx-auto z-10 mt-[13vh] md:mt-[16vh] h-[68vh] md:h-[63vh] overflow-y-auto cinematic-scrollbar pointer-events-auto pr-3">
                <div className="flex flex-col gap-3 md:gap-5 pb-8">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        
                        return (
                            <div 
                                key={index} 
                                className="group relative flex flex-col md:flex-row gap-3 md:gap-8 items-start border border-white/5 p-4 md:p-6 bg-gradient-to-br from-white/[0.02] to-transparent backdrop-blur-md transition-all duration-500 ease-out hover:bg-white/[0.05] hover:border-white/20 hover:-translate-y-0.5 shadow-[0_8px_32px_rgba(0,0,0,0.5)] w-full overflow-hidden"
                            >
                                {/* Corner Viewfinder brackets on Hover */}
                                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out z-20">
                                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/40"></div>
                                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/40"></div>
                                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/40"></div>
                                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/40"></div>
                                </div>

                                {/* Monospace Timeline Duration badge */}
                                <div className="text-[9px] md:text-[10px] font-mono text-white/40 tracking-wider bg-white/5 border border-white/10 px-2.5 py-1.5 rounded-sm uppercase group-hover:text-white group-hover:border-white/25 transition-all duration-300 min-w-[100px] text-center z-10">
                                    <EditableText 
                                        value={defaultDuration} 
                                        onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                        isEditor={isEditor} 
                                        maxLength={40} 
                                        as="span" 
                                    />
                                </div>

                                {/* Details */}
                                <div className="flex-1 w-full z-10">
                                    <div className="flex flex-col md:flex-row md:items-baseline md:gap-3">
                                        <h3 className="text-sm md:text-lg font-sans font-bold text-white uppercase tracking-wider">
                                            <EditableText 
                                                value={defaultRole} 
                                                onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                isEditor={isEditor} 
                                                maxLength={50} 
                                                as="span" 
                                            />
                                        </h3>
                                        <span className="text-white/20 hidden md:inline">/</span>
                                        <span className="text-[9px] md:text-xs font-mono text-white/30 uppercase tracking-widest mt-0.5 md:mt-0">
                                            <EditableText 
                                                value={defaultCompany} 
                                                onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                                isEditor={isEditor} 
                                                maxLength={50} 
                                                as="span" 
                                            />
                                        </span>
                                    </div>
                                    
                                    {exp.description && (
                                        <p className="mt-2 md:mt-3 text-xs md:text-sm text-white/70 font-sans leading-relaxed tracking-wide">
                                            <EditableText 
                                                value={exp.description} 
                                                onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                                isEditor={isEditor} 
                                                as="span" 
                                            />
                                        </p>
                                    )}
                                </div>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="bg-white/5 hover:bg-red-500/80 hover:text-white text-white/40 rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-all duration-300 shadow-md border border-white/10 absolute top-3 right-3"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                            </div>
                        );
                    })}

                    {isEditor && (
                        <div className="flex justify-center mt-6 w-full pointer-events-auto">
                            <button
                                onClick={handleAddItem}
                                className="px-6 py-3 border border-dashed border-white/10 hover:border-white/30 text-white/40 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/[0.02] hover:bg-white/[0.05]"
                            >
                                + Tambah Pengalaman
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
