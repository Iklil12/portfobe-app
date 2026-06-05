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
        <section className="panel flex-col">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full max-w-7xl mx-auto px-4 mt-auto mb-auto">
                <div className="col-span-1 md:col-span-4 font-sans text-xs tracking-[0.2em] uppercase text-[#8b8b8b] mb-4 md:mb-0 reveal-on-scroll">
                    [ 01 — <EditableText value={theme?.customTexts?.cg_about_label || 'Pendekatan'} field="cg_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> ]
                </div>
                <div className="col-span-1 md:col-span-8 reveal-on-scroll">
                    <h2 className="font-serif text-xl md:text-3xl lg:text-4xl leading-snug break-words text-[#f5f5f0]">
                        <EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={200} />
                    </h2>
                    
                    <div className="mt-8 md:mt-16 w-full h-[1px] bg-white/20"></div>
                    
                    <div className="mt-8 flex flex-wrap gap-4 justify-between font-sans text-[10px] md:text-xs tracking-widest uppercase opacity-70 mb-12">
                        <EditableText value={theme?.customTexts?.cg_services || 'Direksi Kreatif / Fotografi / Eksplorasi Digital'} field="cg_services" entity="appearance" isEditor={isEditor} as="span" maxLength={100} className="w-full" />
                    </div>

                    {/* Embedded Stats Section */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#f5f5f0]/10">
                        <div className="flex flex-col">
                            <span className="font-serif italic text-3xl md:text-4xl text-[#f5f5f0] mb-2">{archiveItems.length}</span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-[#8b8b8b]">
                                <EditableText value={theme?.customTexts?.cg_stat_1_label || 'Proyek Selesai'} field="cg_stat_1_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif italic text-3xl md:text-4xl text-[#f5f5f0] mb-2">{awardItems.length}</span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-[#8b8b8b]">
                                <EditableText value={theme?.customTexts?.cg_stat_2_label || 'Penghargaan'} field="cg_stat_2_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif italic text-3xl md:text-4xl text-[#f5f5f0] mb-2">
                                <EditableText value={theme?.customTexts?.cg_stat_3_val || '10+'} field="cg_stat_3_val" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-[#8b8b8b]">
                                <EditableText value={theme?.customTexts?.cg_stat_3_label || 'Tahun Pengalaman'} field="cg_stat_3_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                        <div className="flex flex-col">
                            <span className="font-serif italic text-3xl md:text-4xl text-[#f5f5f0] mb-2">
                                <EditableText value={theme?.customTexts?.cg_stat_4_val || '50+'} field="cg_stat_4_val" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                            <span className="font-sans text-[9px] md:text-[10px] tracking-widest uppercase text-[#8b8b8b]">
                                <EditableText value={theme?.customTexts?.cg_stat_4_label || 'Klien Global'} field="cg_stat_4_label" entity="appearance" isEditor={isEditor} as="span" />
                            </span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
