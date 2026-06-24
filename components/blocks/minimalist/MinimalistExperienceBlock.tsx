"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { motion } from 'framer-motion';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.2, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.08) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

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

    const animationTrigger = isEditor ? "animate" : "whileInView";

    return (
        <motion.section 
            initial="hidden"
            {...{ [animationTrigger]: "visible" }}
            viewport={{ once: true, amount: 0.1 }}
            variants={getStaggerContainer(0, 0.08)}
            className="w-full py-20 @md:py-28 px-8 @md:px-12 @lg:px-16 border-t border-gray-200 bg-white @container"
        >
            <div className="max-w-4xl w-full mx-auto">
                {/* Title (Full Width) */}
                <motion.h2 variants={cinematicBlurUp} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 min-heading mb-12">
                    <EditableText entity="appearance" field="minimalist_exp_title" value={getCustomText('minimalist_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                </motion.h2>

                {/* Experience Items List */}
                <div className="flex flex-col w-full divide-y divide-gray-100">
                    {experiences.map((exp: any, index: number) => {
                        const defaultRole = exp.role;
                        const defaultCompany = exp.company;
                        const defaultDuration = exp.duration;
                        const defaultDescription = exp.description || '';
                        
                        return (
                            <motion.div 
                                key={index} 
                                variants={cinematicBlurUp}
                                className={`flex flex-col py-6 relative group transition-all duration-300 hover:bg-gray-50/50 px-3 -mx-3 rounded-md ${isEditor ? 'pr-8' : ''}`}
                            >
                                <div className="flex flex-col @md:flex-row @md:items-baseline justify-between gap-1 w-full">
                                    {/* Role & Company */}
                                    <div className="flex flex-col @sm:flex-row @sm:items-baseline gap-1 @sm:gap-2">
                                        <h3 className="text-base @md:text-lg font-semibold text-gray-900 group-hover:text-black transition-colors min-heading">
                                            <EditableText 
                                                 value={defaultRole} 
                                                 onChange={(val) => handleUpdateItem(index, 'role', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={50} 
                                                 as="span" 
                                             />
                                        </h3>
                                        <span className="hidden @sm:inline text-gray-300 text-xs select-none">•</span>
                                        <span className="text-sm font-mono text-gray-500 font-medium">
                                            <EditableText 
                                                 value={defaultCompany} 
                                                 onChange={(val) => handleUpdateItem(index, 'company', val)} 
                                                 isEditor={isEditor} 
                                                 maxLength={50} 
                                                 as="span" 
                                             />
                                        </span>
                                    </div>
                                    
                                    {/* Duration */}
                                    <span className="text-xs font-mono text-gray-400 group-hover:text-gray-600 transition-colors">
                                        <EditableText 
                                             value={defaultDuration} 
                                             onChange={(val) => handleUpdateItem(index, 'duration', val)} 
                                             isEditor={isEditor} 
                                             maxLength={40} 
                                             as="span" 
                                         />
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-xs @md:text-sm text-gray-500 font-light mt-3 leading-relaxed max-w-3xl min-body">
                                    <EditableText 
                                         value={defaultDescription} 
                                         onChange={(val) => handleUpdateItem(index, 'description', val)} 
                                         isEditor={isEditor} 
                                         maxLength={200} 
                                         as="span" 
                                     />
                                </p>
                            
                                {isEditor && (
                                    <button
                                        onClick={(e) => handleRemoveItem(index, e)}
                                        className="absolute top-6 right-0 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-sm"
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
                    <div className="flex justify-center mt-12 w-full">
                        <button
                            onClick={handleAddItem}
                            className="px-6 py-3 border border-dashed border-gray-300 hover:border-gray-400 text-gray-600 hover:text-gray-900 uppercase tracking-widest text-[10px] font-mono transition-all duration-300 bg-gray-50 hover:bg-gray-100 rounded-lg"
                        >
                            + Tambah Pengalaman
                        </button>
                    </div>
                )}
            </div>
        </motion.section>
    );
}
