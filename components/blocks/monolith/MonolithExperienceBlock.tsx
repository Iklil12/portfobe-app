"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { motion } from 'framer-motion';

export function MonolithExperienceBlock({ theme, isEditor, isCardPreview }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    let experiences: any[] = [];
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

    const monolithEase = [0.22, 1, 0.36, 1] as any;
    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 60, filter: 'blur(10px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.2, ease: monolithEase } }
    };

    return (
        <motion.section
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
            className="relative z-20 w-full bg-[#050505] px-4 py-12 @md:px-12 @md:py-32 flex flex-col overflow-hidden"
        >
            {/* Top ambient line */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

            {/* Section Header */}
            <motion.div variants={itemVariants} className="flex flex-col @md:flex-row @md:justify-between @md:items-end gap-4 mb-10 @md:mb-24">
                <div className="flex flex-col gap-3">
                    <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
                        <EditableText entity="appearance" field="monolith_exp_label" value={getCustomText('monolith_exp_label', 'Career Archive')} isEditor={isEditor} maxLength={25} as="span" />
                    </span>
                    <h2 className="font-serif text-2xl @md:text-6xl @lg:text-[5.5cqi] leading-[0.9] text-white">
                        <EditableText entity="appearance" field="monolith_exp_title" value={getCustomText('monolith_exp_title', 'Professional Journey')} isEditor={isEditor} maxLength={40} as="span" />
                    </h2>
                </div>
                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-white/20 hidden @md:block">
                    {String(experiences.length).padStart(2, '0')} positions
                </span>
            </motion.div>

            {/* Experience Cards — Stacked Editorial */}
            <div className="flex flex-col w-full gap-0">
                {experiences.map((exp: any, index: number) => {
                    const defaultRole = exp.role;
                    const defaultCompany = exp.company;
                    const defaultDuration = exp.duration;
                    const defaultDescription = exp.description || '';

                    return (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="relative group"
                        >
                            {/* Card */}
                            <div className="relative border-t border-white/[0.06] py-5 @md:py-14 overflow-hidden">

                                {/* Ghost Index — positioned behind content */}
                                <div className="absolute -right-2 @md:right-4 top-1/2 -translate-y-1/2 font-serif text-[70px] @md:text-[200px] @lg:text-[280px] font-light leading-none text-white/[0.015] group-hover:text-white/[0.03] transition-colors duration-700 select-none pointer-events-none">
                                    {String(index + 1).padStart(2, '0')}
                                </div>

                                {/* Main Content — 2 column split on desktop */}
                                <div className="relative z-10 flex flex-col @lg:flex-row @lg:items-start gap-3 @lg:gap-16">

                                    {/* Left: Meta Info */}
                                    <div className="flex flex-col gap-3 @lg:w-[220px] @lg:shrink-0 @lg:pt-2">
                                        <span className="font-sans text-[9px] @md:text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] @md:text-[var(--hl)]/60 @md:group-hover:text-[var(--hl)] transition-colors duration-500">
                                            <EditableText
                                                value={defaultDuration}
                                                onChange={(val: string) => handleUpdateItem(index, 'duration', val)}
                                                isEditor={isEditor}
                                                maxLength={40}
                                                as="span"
                                            />
                                        </span>
                                        <span className="font-sans text-xs @md:text-sm font-medium text-white/50 @md:text-white/25 @md:group-hover:text-white/45 transition-colors duration-500 uppercase tracking-[0.1em]">
                                            <EditableText
                                                value={defaultCompany}
                                                onChange={(val: string) => handleUpdateItem(index, 'company', val)}
                                                isEditor={isEditor}
                                                maxLength={50}
                                                as="span"
                                            />
                                        </span>
                                    </div>

                                    {/* Right: Role + Description */}
                                    <div className="flex-1 flex flex-col">
                                        <h3 className="font-serif text-lg @md:text-4xl @lg:text-[3.2cqi] leading-[1.05] text-white group-hover:text-[var(--hl)] transition-colors duration-500">
                                            <EditableText
                                                value={defaultRole}
                                                onChange={(val: string) => handleUpdateItem(index, 'role', val)}
                                                isEditor={isEditor}
                                                maxLength={50}
                                                as="span"
                                            />
                                        </h3>

                                        {defaultDescription && (
                                            <p className="font-sans text-[13px] @md:text-sm text-white/40 @md:text-white/15 @md:group-hover:text-white/40 transition-colors duration-700 leading-relaxed mt-2 @md:mt-6 max-w-lg">
                                                <EditableText
                                                    value={defaultDescription}
                                                    onChange={(val: string) => handleUpdateItem(index, 'description', val)}
                                                    isEditor={isEditor}
                                                    maxLength={200}
                                                    as="span"
                                                />
                                            </p>
                                        )}

                                        {/* Accent line */}
                                        <div className="mt-4 @md:mt-8 flex items-center gap-3">
                                            <div className="h-[1px] w-8 bg-white/[0.06] group-hover:w-16 group-hover:bg-[var(--hl)]/40 transition-all duration-700 ease-out"></div>
                                            <span className="font-sans text-[8px] font-bold uppercase tracking-[0.4em] text-white/[0.08] group-hover:text-white/15 transition-colors duration-700">
                                                Chapter {String(index + 1).padStart(2, '0')}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Editor: Remove Button */}
                            {isEditor && (
                                <button
                                    onClick={(e) => handleRemoveItem(index, e)}
                                    className="absolute top-4 right-0 bg-red-500/80 hover:bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] z-30 transition-colors shadow-lg"
                                    title="Delete Experience"
                                >
                                    ✕
                                </button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* Bottom border */}
            <div className="w-full h-[1px] bg-white/[0.06]"></div>

            {/* Editor: Add Button */}
            {isEditor && (
                <div className="flex justify-center mt-12 w-full">
                    <button
                        onClick={handleAddItem}
                        className="px-8 py-3 border border-dashed border-white/15 hover:border-[var(--hl)]/40 text-white/40 hover:text-[var(--hl)] uppercase tracking-[0.3em] text-[9px] font-sans font-bold transition-all duration-300 bg-white/[0.02] hover:bg-[var(--hl)]/[0.04]"
                    >
                        + Tambah Pengalaman
                    </button>
                </div>
            )}
        </motion.section>
    );
}
