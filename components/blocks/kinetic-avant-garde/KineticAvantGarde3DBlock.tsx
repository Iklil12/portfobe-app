"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/shared/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function KineticAvantGarde3DBlock({ data, theme, isEditor }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (items3D.length === 0) return null;

    return (
        <section className="relative kag-bg-void py-32 md:py-48 px-6 md:px-12 z-10 border-t border-white/10 overflow-hidden" id="3d-models" style={{ '--accent': theme?.themeColor || '#c92a2a' } as any}>
            
            {/* Elegant Noise Background */}
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none mix-blend-screen"></div>

            <div className="max-w-[90rem] mx-auto relative z-10">
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-16 h-[2px] bg-[var(--accent)]"></div>
                    <h3 className="font-kag-mono text-[#e6e4dc] tracking-[0.4em] uppercase text-xs md:text-sm font-bold opacity-70">
                        <EditableText entity="appearance" field="kag_3d_subtitle" value={getCustomText('kag_3d_subtitle', 'DIMENSI KETIGA')} isEditor={isEditor} />
                    </h3>
                </div>
                
                <h2 className="flex flex-col text-[clamp(4.5rem,10vw,10rem)] leading-[0.85] tracking-tighter uppercase mb-20 relative z-20">
                    <span className="font-kag-brutal text-[#e6e4dc] block relative">
                        <EditableText entity="appearance" field="kag_3d_title1" value={getCustomText('kag_3d_title1', 'OBJEK')} isEditor={isEditor} as="span" />
                    </span>
                    <span 
                        className="font-kag-serif italic text-transparent text-right -mt-[6vw] relative z-30 md:pr-12 pointer-events-none"
                        style={{ WebkitTextStroke: '2px var(--accent)' }}
                    >
                        <EditableText entity="appearance" field="kag_3d_title2" value={getCustomText('kag_3d_title2', 'SPASIAL')} isEditor={isEditor} as="span" className="pointer-events-auto" />
                    </span>
                </h2>

                <div className={`grid grid-cols-1 ${items3D.length > 1 ? 'md:grid-cols-2' : ''} gap-8 md:gap-12 w-full`}>
                    {items3D.map((p: any, i: number) => (
                    <div key={i} className="group rounded-3xl overflow-hidden relative bg-[#0a0a0a] border border-white/10 shadow-2xl transition-transform duration-700 hover:-translate-y-2">
                        
                        {/* 3D Canvas Container */}
                        <div className="w-full h-[60vh] md:h-[70vh] relative cursor-move overflow-hidden">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" className="w-full h-full relative group/mv" />
                            
                            {/* Futuristic UI Overlay */}
                            <div className="absolute top-6 right-6 md:top-8 md:right-8 font-kag-mono text-[10px] md:text-xs tracking-widest text-white/50 border border-white/20 px-4 py-2 rounded-full backdrop-blur-md bg-black/30 pointer-events-none z-10 uppercase">
                                INTERACTIVE [3D]
                            </div>
                            
                            <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 w-12 h-12 md:w-16 md:h-16 border border-white/20 rounded-full flex items-center justify-center backdrop-blur-md bg-black/30 pointer-events-none opacity-50 group-hover:opacity-100 transition-opacity duration-500 z-10 group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-current animate-spin-slow">
                                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                                    <path d="M21 3v5h-5" />
                                </svg>
                            </div>
                        </div>
                        
                        {/* Info Footer */}
                        <div className="p-8 md:p-10 border-t border-white/10 flex flex-col md:flex-row md:justify-between md:items-end gap-6 bg-gradient-to-t from-black/80 to-[#0a0a0a] relative z-20">
                            <div>
                                <span className="font-kag-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-white/40 block mb-3 font-bold">
                                    00{i+1} — {p.projectType || '3D ASSET'}
                                </span>
                                <h3 className="font-kag-brutal text-4xl md:text-5xl text-[#e6e4dc] uppercase tracking-tight leading-none">{p.title}</h3>
                            </div>
                            <div className="font-kag-mono text-xs uppercase tracking-widest text-[var(--accent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500 hidden md:block">
                                TARIK UNTUK MEMUTAR
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
