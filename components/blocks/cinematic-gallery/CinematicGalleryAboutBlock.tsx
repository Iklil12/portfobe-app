"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryAboutBlock(props: any) {
    const { isEditor, data, theme } = useCinematicGallery();

    const bio = data?.profile?.bio || data?.bio || "Sebuah perjalanan visual melalui ruang, bentuk, dan waktu.";
    
    // Stats calculation
    const allProjects = data?.projects || data?.user?.projects || [];
    const archiveItems = allProjects.filter((p: any) => p.projectType?.toLowerCase() !== '3d');
    const awardItems = data?.certificates || data?.user?.certificates || [];

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow Theater Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Lens Flare Glow */}
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-center w-full max-w-7xl mx-auto px-4 z-10 pointer-events-auto">
                {/* Left Column: Heading */}
                <div className="col-span-1 md:col-span-4 flex flex-col gap-2 z-10">
                    <span className="text-[10px] font-mono text-white/30 tracking-[0.45em] uppercase">
                        [ SECTION 01 // ESSENCE ]
                    </span>
                    <h2 className="font-serif italic text-3xl md:text-5xl text-white mt-1 leading-tight">
                        <EditableText value={theme?.customTexts?.cg_about_label || 'Pendekatan'} field="cg_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </h2>
                </div>

                {/* Right Column: Bio, Tags, and Stats */}
                <div className="col-span-1 md:col-span-8 flex flex-col justify-center z-10 md:pl-10 md:border-l border-white/5">
                    {/* Dramatic Blockquote */}
                    <p className="font-serif text-lg md:text-2xl lg:text-3xl leading-relaxed text-white/95 italic font-light tracking-wide break-words">
                        “<EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />”
                    </p>
                    
                    {/* Services Badges bar */}
                    <div className="mt-8 flex flex-wrap items-center gap-3 font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-white/60">
                        <div className="flex items-center space-x-2 bg-white/[0.03] border border-white/10 px-4 py-2.5 rounded-sm">
                            <EditableText value={theme?.customTexts?.cg_services || 'Direksi Kreatif / Fotografi / Eksplorasi Digital'} field="cg_services" entity="appearance" isEditor={isEditor} as="span" maxLength={100} className="w-full text-center" />
                        </div>
                    </div>

                    {/* Framed Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-8 border-t border-white/10">
                        {/* Stat 1 */}
                        <div className="group/stat relative flex flex-col p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300">
                            <span className="font-serif italic text-3xl md:text-4xl text-white mb-1 leading-none">{archiveItems.length}</span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
                                <EditableText value={theme?.customTexts?.cg_stat_1_label || 'Proyek Selesai'} field="cg_stat_1_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                        {/* Stat 2 */}
                        <div className="group/stat relative flex flex-col p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300">
                            <span className="font-serif italic text-3xl md:text-4xl text-white mb-1 leading-none">{awardItems.length}</span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
                                <EditableText value={theme?.customTexts?.cg_stat_2_label || 'Penghargaan'} field="cg_stat_2_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                        {/* Stat 3 */}
                        <div className="group/stat relative flex flex-col p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300">
                            <span className="font-serif italic text-3xl md:text-4xl text-white mb-1 leading-none">
                                <EditableText value={theme?.customTexts?.cg_stat_3_val || '10+'} field="cg_stat_3_val" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
                                <EditableText value={theme?.customTexts?.cg_stat_3_label || 'Tahun Pengalaman'} field="cg_stat_3_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                        {/* Stat 4 */}
                        <div className="group/stat relative flex flex-col p-4 bg-white/[0.01] hover:bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all duration-300">
                            <span className="font-serif italic text-3xl md:text-4xl text-white mb-1 leading-none">
                                <EditableText value={theme?.customTexts?.cg_stat_4_val || '50+'} field="cg_stat_4_val" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-white/40 group-hover:text-white/60 transition-colors">
                                <EditableText value={theme?.customTexts?.cg_stat_4_label || 'Klien Global'} field="cg_stat_4_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
