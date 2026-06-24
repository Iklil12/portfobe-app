"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function EditorialExperienceBlock({ theme, isEditor, isCardPreview }: any) {
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


    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    return (
        <section id="experience" className="w-full max-w-[1600px] mx-auto flex flex-col px-6 py-12 @md:px-12 @lg:px-20 @md:py-24 border-t border-subtle">
            <div className="flex flex-col @lg:flex-row gap-16 @lg:gap-24">
                
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="w-full @lg:w-1/3">
                    <h2 className="font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl @lg:text-6xl mb-6">
                        <EditableText value={getCustomText('editorial_exp_t1', 'Selected')} field="editorial_exp_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />{' '}
                        <EditableText value={getCustomText('editorial_exp_t2', 'History')} field="editorial_exp_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                    </h2>
                    <p className="font-sans text-sm @md:text-base text-slate-500 max-w-sm leading-relaxed">
                        <EditableText value={getCustomText('editorial_exp_sub', 'A chronological overview of professional roles and industry experience.')} field="editorial_exp_sub" entity="appearance" isEditor={isEditor} as="span" maxLength={150} />
                    </p>
                </motion.div>

                <div className="w-full @lg:w-2/3 flex flex-col border-t border-subtle">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                        
                        return (
                            <motion.div
                                key={index}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                                className="group flex flex-col @md:flex-row @md:items-start border-b border-subtle py-8 @md:py-12 relative overflow-hidden"
                            >
                                <div className="absolute top-0 left-0 w-full h-full bg-slate-50 transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom -z-10"></div>
                                
                                <div className="w-full @md:w-1/3 mb-4 @md:mb-0 pr-4">
                                    <span className="font-sans text-xs font-bold text-slate-400 uppercase tracking-widest block mb-2">
                                        <EditableText 
                                             value={defaultDuration} 
                                             onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                             isEditor={isEditor} 
                                             maxLength={40} 
                                             as="span" 
                                         />
                                    </span>
                                </div>
                                
                                <div className="w-full @md:w-2/3">
                                    <h3 className="font-serif italic text-2xl @md:text-3xl text-[#111] mb-2 group-hover:text-[var(--hl)] transition-colors duration-300">
                                        <EditableText 
                                         value={defaultRole} 
                                         onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                         isEditor={isEditor} 
                                         maxLength={50} 
                                         as="span" 
                                     />
                                    </h3>
                                    <p className="font-sans text-sm @md:text-base text-slate-500 leading-relaxed uppercase tracking-wider">
                                        <EditableText 
                                             value={defaultCompany} 
                                             onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                             isEditor={isEditor} 
                                             maxLength={50} 
                                             as="span" 
                                         />
                                    </p>
                                </div>
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                        title="Delete Experience"
                                    >
                                        ✕
                                    </button>
                                )}
                            </motion.div>
                        );
                    })}
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

            </div>
        </section>
    );
}

