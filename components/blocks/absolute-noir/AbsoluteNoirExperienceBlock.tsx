"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

const smoothEase = [0.33, 1, 0.68, 1] as any;
const wireframeReveal = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: smoothEase } }
};
const staggerGrid = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

export function AbsoluteNoirExperienceBlock({ theme, isEditor }: any) {
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

    const colsCount = Math.min(3, experiences.length) || 1;
    const gridColsClass = colsCount === 1 ? 'grid-cols-1' : colsCount === 2 ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 md:grid-cols-3';

    return (
        <motion.section 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerGrid}
            className="w-full py-24 px-8 md:px-16 bg-[#050505] text-white wire-border-b"
        >
            {/* Header */}
            <div className="mb-16 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
                <div>
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] mb-3 text-white/50 block">
                        <EditableText 
                            entity="appearance" 
                            field="absolutenoir_exp_subtitle" 
                            value={getCustomText('absolutenoir_exp_subtitle', '[ TIMELINE_REGISTRY ]')} 
                            isEditor={isEditor} 
                            maxLength={30} 
                            as="span" 
                            className="inline-block px-1"
                        />
                    </span>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                        <EditableText 
                            entity="appearance" 
                            field="absolutenoir_exp_title" 
                            value={getCustomText('absolutenoir_exp_title', 'PROFESSIONAL EXPERIENCE')} 
                            isEditor={isEditor} 
                            maxLength={40} 
                            as="span" 
                            className="inline-block px-1"
                        />
                    </h2>
                </div>
                <div className="font-mono text-[10px] text-white/40 uppercase">
                    SYS_STATUS // ONLINE
                </div>
            </div>

            {/* Vertical Columns Grid (Magazine Style layout) */}
            <div className={`grid ${gridColsClass} divide-y md:divide-y-0 md:divide-x divide-white/10 border-t border-b border-white/20 mb-12`}>
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';
                    const displayIndex = String(index + 1).padStart(2, '0');
                    
                    return (
                        <motion.div 
                            key={index} 
                            variants={wireframeReveal}
                            className="group py-8 md:py-12 px-0 md:px-8 first:pl-0 last:pr-0 flex flex-col relative transition-all duration-300 hover:bg-white/[0.01]"
                        >
                            {/* Monospace Indicator */}
                            <span className="font-mono text-[10px] text-white/30 uppercase tracking-wider mb-6 block select-none">
                                {displayIndex} // <EditableText 
                                     value={defaultDuration} 
                                     onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                     isEditor={isEditor} 
                                     maxLength={40} 
                                     as="span" 
                                     className="inline-block px-1 text-white/50"
                                 />
                            </span>

                            {/* Role title */}
                            <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-white mb-2 leading-tight">
                                <EditableText 
                                     value={defaultRole} 
                                     onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                     isEditor={isEditor} 
                                     maxLength={50} 
                                     as="span" 
                                     className="inline-block px-1"
                                 />
                            </h3>

                            {/* Company */}
                            <span className="font-mono text-[11px] text-white/40 group-hover:text-white/60 transition-colors uppercase mb-6 block">
                                <EditableText 
                                     value={defaultCompany} 
                                     onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                     isEditor={isEditor} 
                                     maxLength={50} 
                                     as="span" 
                                     className="inline-block px-1"
                                 />
                            </span>

                            {/* Description */}
                            <div className="font-mono text-xs md:text-sm text-white/50 group-hover:text-white/80 transition-colors leading-relaxed mt-auto">
                                <EditableText 
                                     value={defaultDescription} 
                                     onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                     isEditor={isEditor} 
                                     as="p" 
                                 />
                            </div>
                        
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute right-2 top-2 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg opacity-0 group-hover:opacity-100"
                                    title="Hapus Pengalaman"
                                >
                                    ✕
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {isEditor && (
                <div className="flex justify-center mt-6 w-full">
                    <button
                        onClick={handleAddItem}
                        className="px-6 py-3 border border-dashed border-white/20 hover:border-white/40 text-white/60 hover:text-white uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-white/5 hover:bg-white/10"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </motion.section>
    );
}
