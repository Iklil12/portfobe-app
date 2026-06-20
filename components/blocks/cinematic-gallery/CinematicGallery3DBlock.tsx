"use client";

import React, { useState } from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGallery3DBlock({ isEditor, theme }: any) {
    const { data } = useCinematicGallery();
    const [activeIndex, setActiveIndex] = useState(0);

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

    if (items3D.length === 0) return null;

    const activeItem = items3D[activeIndex] || items3D[0];
    const getCustomText = (key: string, fallback: string) => theme?.customTexts?.[key] || fallback;

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow Theater Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Lens Flare Glow */}
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Cinematic Header Area */}
            <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
                <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
                    [ SECTION 05 // MULTIDIMENSIONAL ]
                </div>
                <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
                    <EditableText 
                        entity="appearance" 
                        field="cinematicgallery_3d_title" 
                        value={getCustomText('cinematicgallery_3d_title', 'Visualisasi 3D')} 
                        isEditor={isEditor} 
                        maxLength={40} 
                        as="span" 
                    />
                </h2>
            </div>

            {/* Main Content Area */}
            <div className="w-full max-w-6xl mx-auto z-10 mt-[14vh] flex flex-col md:flex-row gap-4 md:gap-8 items-stretch justify-center pointer-events-auto px-1 md:px-0">
                {/* 3D Viewer Container */}
                <div className="w-full h-[45vh] md:h-[55vh] relative border border-white/10 bg-black/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] overflow-hidden group">
                    {/* Corner Viewfinder brackets on Hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity duration-500 ease-out z-25">
                        <div className="absolute top-2 left-2 md:top-4 md:left-4 w-3 h-3 md:w-4 md:h-4 border-t border-l border-white/50"></div>
                        <div className="absolute top-2 right-2 md:top-4 md:right-4 w-3 h-3 md:w-4 md:h-4 border-t border-r border-white/50"></div>
                        <div className="absolute bottom-2 left-2 md:bottom-4 md:left-4 w-3 h-3 md:w-4 md:h-4 border-b border-l border-white/50"></div>
                        <div className="absolute bottom-2 right-2 md:bottom-4 md:right-4 w-3 h-3 md:w-4 md:h-4 border-b border-r border-white/50"></div>
                    </div>

                    {/* HUD Status Overlay */}
                    <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20 bg-black/40 backdrop-blur-md px-2 py-0.5 md:px-2.5 md:py-1 border border-white/10 rounded-sm pointer-events-none">
                        <span className="text-[6.5px] md:text-[7.5px] font-mono tracking-widest text-white/50 uppercase">
                            [ ACTIVE VIEWPORT // ROTATE & ZOOM ]
                        </span>
                    </div>

                    {/* Interactive Viewer */}
                    <div className="w-full h-full relative z-10">
                        <Interactive3DViewer 
                            mediaUrl={activeItem.mediaUrl} 
                            bgColor="#050505" 
                            className="w-full h-full relative group/mv"
                        />
                    </div>

                    {/* Model Details overlay inside the Viewer */}
                    <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-4 md:right-auto z-20 bg-black/80 md:bg-black/75 backdrop-blur-md border-t md:border border-white/10 p-3 md:p-4 md:max-w-sm shadow-lg pointer-events-auto">
                        <div className="text-[7px] md:text-[8px] font-mono text-white/30 tracking-widest uppercase mb-0.5 md:mb-1">
                            [ MODEL IDENTIFICATION ]
                        </div>
                        <h3 className="font-sans font-bold text-white text-xs md:text-sm uppercase tracking-wider">
                            {activeItem.title}
                        </h3>
                        {activeItem.description && (
                            <p className="font-sans text-[9px] md:text-[10px] text-white/60 mt-1 md:mt-1.5 leading-relaxed line-clamp-2 md:line-clamp-none">
                                {activeItem.description}
                            </p>
                        )}
                    </div>
                </div>

                {/* Sidebar Selector for Multiple Models (if items3D.length > 1) */}
                {items3D.length > 1 && (
                    <div className="w-full md:w-64 flex flex-col gap-3 justify-start overflow-y-auto max-h-[55vh] cinematic-scrollbar pr-1">
                        <div className="text-[8px] font-mono text-white/40 tracking-[0.25em] uppercase mb-1">
                            [ ARCHIVE LIST ]
                        </div>
                        {items3D.map((item: any, idx: number) => (
                            <button
                                key={item.id}
                                onClick={() => setActiveIndex(idx)}
                                className={`w-full text-left p-4 border transition-all duration-300 backdrop-blur-md flex flex-col gap-1 ${
                                    idx === activeIndex 
                                        ? 'bg-white/10 border-white/30 shadow-md' 
                                        : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/20'
                                }`}
                            >
                                <span className="text-[8px] font-mono text-white/40 tracking-wider">
                                    [ MODEL 0{idx + 1} ]
                                </span>
                                <span className="text-xs font-sans font-bold text-white uppercase tracking-wide truncate">
                                    {item.title}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
