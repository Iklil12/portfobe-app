"use client";
import React, { useRef } from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';

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


    const containerRef = useRef<HTMLElement>(null);

    useGSAP(() => {
        if (!isEditor) {
            gsap.fromTo('.hf-exp-row', 
                { x: -50, opacity: 0 },
                {
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: "top 75%",
                    },
                    x: 0,
                    opacity: 1,
                    duration: 1,
                    stagger: 0.1,
                    ease: "power4.out"
                }
            );
        }
    }, { scope: containerRef, dependencies: [experiences.length, isEditor] });

    return (
        <section ref={containerRef} className="py-32 w-full relative z-20 bg-[#050505] overflow-hidden">
            {/* Cinematic Background Elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="w-full max-w-[1600px] mx-auto px-6 md:px-12">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6 md:gap-8">
                    <h2 className="font-display text-5xl md:text-8xl font-bold uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 leading-[0.8]">
                       <EditableText entity="appearance" field="hf_exp_title" value={customTexts.hf_exp_title || 'MILESTONES'} isEditor={isEditor} />
                    </h2>
                    <div className="font-mono text-[10px] md:text-xs tracking-[0.3em] uppercase text-accent border-l border-white/20 pl-4 py-1 md:py-2">
                        0X / Professional Archive
                    </div>
                </div>
                
                <div className="border-t border-white/20">
                    {experiences.map((exp: any, index: number) => (
                        <div 
                            key={index} 
                            className={`hf-exp-row group relative border-b border-white/10 hover:bg-[#0a0a0a] transition-colors duration-500 ${isEditor ? '' : 'opacity-0'}`}
                        >
                            {/* Editor Delete Button */}
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-1/2 -translate-y-1/2 right-4 bg-red-500 hover:bg-red-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-xs z-50 transition-colors opacity-0 group-hover:opacity-100"
                                    title="Delete Experience"
                                >
                                    ✕
                                </button>
                            )}

                            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-4 py-8 md:py-16 items-start px-4 md:px-8">
                                
                                {/* 1. Index Number */}
                                <div className="md:col-span-1">
                                    <span className="font-display text-3xl md:text-5xl text-transparent font-bold" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.2)' }}>
                                        {(index + 1).toString().padStart(2, '0')}
                                    </span>
                                </div>
                                
                                {/* 2. Role (Massive Text) */}
                                <div className="md:col-span-6 flex flex-col justify-center">
                                    <h3 className="font-display text-3xl md:text-6xl lg:text-[5.5rem] font-bold uppercase tracking-tight text-white group-hover:text-accent transition-colors duration-500 leading-[0.9] md:leading-[0.85] -ml-1">
                                        <EditableText 
                                            value={exp.role} 
                                            onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </h3>
                                </div>
                                
                                {/* 3. Company & Duration */}
                                <div className="md:col-span-2 flex flex-col md:items-end justify-start pt-2">
                                    <div className="font-mono text-sm text-white uppercase tracking-widest mb-2 text-left md:text-right">
                                        <EditableText 
                                            value={exp.company} 
                                            onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                            isEditor={isEditor} 
                                            maxLength={50} 
                                            as="span" 
                                        />
                                    </div>
                                    <div className="font-mono text-[10px] text-white/40 uppercase tracking-[0.2em] text-left md:text-right border-t border-white/10 pt-2 w-full md:w-auto inline-block">
                                        <EditableText 
                                            value={exp.duration} 
                                            onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                            isEditor={isEditor} 
                                            maxLength={40} 
                                            as="span" 
                                        />
                                    </div>
                                </div>

                                {/* 4. Description */}
                                <div className="md:col-span-3 pt-2">
                                    <p className="font-body text-white/50 text-sm leading-relaxed text-justify group-hover:text-white/80 transition-colors duration-500">
                                        <EditableText 
                                            value={exp.description} 
                                            onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                            isEditor={isEditor} 
                                            as="span" 
                                        />
                                    </p>
                                </div>
                                
                            </div>
                        </div>
                    ))}
                </div>
                
                {isEditor && (
                    <div className="mt-12 flex justify-end">
                        <button
                            onClick={handleAddItem}
                            className="flex items-center gap-4 px-8 py-4 bg-white/5 hover:bg-white text-white hover:text-black font-mono text-xs uppercase tracking-[0.2em] transition-all duration-300"
                        >
                            <span>+ Append Record</span>
                            <div className="w-12 h-[1px] bg-current"></div>
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
