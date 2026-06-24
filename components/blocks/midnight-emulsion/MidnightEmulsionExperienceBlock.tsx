"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: premiumEase } }
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.1) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export function MidnightEmulsionExperienceBlock({ theme, isEditor }: any) {
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

    const animationTrigger = isEditor ? "animate" : "whileInView";

    return (
        <motion.section 
            initial="hidden"
            {...{ [animationTrigger]: "visible" }}
            viewport={{ once: true, amount: 0.1 }}
            variants={getStaggerContainer(0, 0.1)}
            className="w-full py-16 @md:py-32 px-4 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative @container overflow-hidden"
        >
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
                <div className="absolute top-1/4 right-1/4 w-[300px] h-[300px] bg-[var(--hl)] opacity-5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-5xl mx-auto w-full relative z-10">
                {/* Heading */}
                <motion.div variants={fadeUp} className="mb-12 @md:mb-20">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-2 @md:mb-4 block">
                        <EditableText entity="appearance" field="midnightemulsion_exp_label" value={getCustomText('midnightemulsion_exp_label', 'Timeline Journey')} isEditor={isEditor} maxLength={30} as="span" />
                    </span>
                    <h2 className="font-serif text-3xl @xs:text-4xl @md:text-6xl text-white uppercase tracking-wide">
                        <EditableText entity="appearance" field="midnightemulsion_exp_title" value={getCustomText('midnightemulsion_exp_title', 'Professional Experience')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                </motion.div>

                {/* Experience Timeline */}
                <div className="flex flex-col">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        const defaultDescription = exp.description || '';
                        
                        return (
                            <motion.div 
                                key={index} 
                                variants={fadeUp}
                                className="group relative flex gap-4 @md:gap-12 pb-8 @md:pb-12 last:pb-0"
                            >
                                {/* Timeline Line */}
                                {index !== experiences.length - 1 && (
                                    <div className="absolute left-[66px] @xs:left-[86px] @md:left-[216px] top-8 bottom-0 w-px border-l border-dashed border-white/10 group-hover:border-[var(--hl)]/30 transition-colors duration-500"></div>
                                )}

                                {/* Left: Duration */}
                                <div className="w-[70px] @xs:w-[90px] @md:w-[220px] shrink-0 flex items-start gap-2 @md:gap-8 justify-between pt-1">
                                    <span className="font-sans text-[8px] @xs:text-[9px] @md:text-xs font-bold uppercase tracking-widest text-[var(--hl)]">
                                        <EditableText 
                                             value={defaultDuration} 
                                             onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                             isEditor={isEditor} 
                                             maxLength={40} 
                                             as="span" 
                                         />
                                    </span>
                                    {/* Visual Dot on Timeline */}
                                    <div className="w-2.5 h-2.5 rounded-full bg-[#030508] border border-[var(--hl)] shadow-[0_0_8px_var(--hl)] relative z-10 mt-1 shrink-0"></div>
                                </div>

                                {/* Right: Content Card */}
                                <div className="flex-1 pb-4 pr-2 relative">
                                    <h3 className="font-serif text-base @xs:text-lg @md:text-2xl text-white group-hover:text-white transition-colors duration-300">
                                        <EditableText 
                                             value={defaultRole} 
                                             onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                             isEditor={isEditor} 
                                             maxLength={50} 
                                             as="span" 
                                         />
                                    </h3>
                                    <h4 className="font-sans text-[8px] @xs:text-[9px] @md:text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1.5 @md:mt-2">
                                        <EditableText 
                                             value={defaultCompany} 
                                             onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                             isEditor={isEditor} 
                                             maxLength={30} 
                                             as="span"
                                         />
                                    </h4>
                                    <p className="font-sans text-xs @md:text-sm text-slate-400 mt-3 @md:mt-4 leading-relaxed max-w-2xl">
                                        <EditableText 
                                             value={defaultDescription} 
                                             onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                             isEditor={isEditor} 
                                             maxLength={300} 
                                             as="span" 
                                         />
                                    </p>

                                    {isEditor && (
                                        <button
                                            onClick={(e) => handleRemoveItem(index, e)}
                                            className="absolute top-0 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                            title="Delete Experience"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {isEditor && (
                    <div className="flex justify-center mt-16 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
