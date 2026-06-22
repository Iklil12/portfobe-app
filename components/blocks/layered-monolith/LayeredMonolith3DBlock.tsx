import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

export function LayeredMonolith3DBlock({ data, theme, isEditor = false }: any) {
    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

    const brandAccent = theme?.brandAccent || '#CCFF00';

    if (items3D.length === 0) return null;

    return (
        <section id="expertise-3d" className="stack-card bg-black text-white py-28 px-6 md:px-16 flex flex-col justify-center relative overflow-hidden" >
            <div id="nav-expertise" className="absolute -top-20 w-full h-0 pointer-events-none invisible"></div>
            
            {/* Dark Tech Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px),linear-gradient(to_bottom,#ffffff02_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-[radial-gradient(circle_at_center,rgba(204,255,0,0.05)_0%,transparent_70%)] pointer-events-none" style={{ '--accent-glow': brandAccent } as any} />

            <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col min-h-[70vh] justify-center">
                {/* Centered Header Section */}
                <div className="flex flex-col items-center text-center mb-16 gap-4">
                    <p className="font-display text-xs tracking-[0.4em] uppercase opacity-60 flex items-center justify-center gap-2 mb-2">
                        <span className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: brandAccent }}></span>
                        <EditableText value={theme?.customTexts?.lm_3d_label || '3D Experience'} field="lm_3d_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </p>
                    <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tighter leading-none mb-2">
                        SPATIAL <span className="text-transparent" style={{ WebkitTextStroke: '1px rgba(255,255,255,0.3)' }}>DIMENSIONS.</span>
                    </h2>
                    <p className="font-mono text-[9px] md:text-[10px] text-white/40 uppercase tracking-widest max-w-lg leading-relaxed">
                        // INTERACTIVE WEBGL ENGINE // REAL-TIME SHADERS & POLYGONAL MODEL RENDERING DIRECTLY IN THE BROWSER.
                    </p>
                </div>

                {/* Centered 3D Card Container */}
                <div className="flex flex-col lg:flex-row justify-center items-stretch gap-12 w-full max-w-5xl mx-auto">
                    {items3D.map((p: any, i: number) => (
                    <div key={i} className="group relative bg-[#090909] border border-white/10 hover:border-white/20 transition-all duration-500 flex flex-col justify-between w-full lg:max-w-[480px]">
                        
                        {/* Technical Corner Ornaments */}
                        <div className="absolute top-0 left-0 w-3 h-[1px]" style={{ backgroundColor: brandAccent }}></div>
                        <div className="absolute top-0 left-0 w-[1px] h-3" style={{ backgroundColor: brandAccent }}></div>
                        <div className="absolute bottom-0 right-0 w-3 h-[1px]" style={{ backgroundColor: brandAccent }}></div>
                        <div className="absolute bottom-0 right-0 w-[1px] h-3" style={{ backgroundColor: brandAccent }}></div>

                        {/* Top Meta Bar */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-white/5 font-mono text-[10px] tracking-wider text-white/50 bg-black/40">
                            <span className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                RENDERER_ACTIVE: GLB
                            </span>
                            <span>PANEL // 0{i + 1}</span>
                        </div>

                        {/* 3D Viewer Container */}
                        <div className="w-full h-96 relative bg-gradient-to-b from-black/60 to-black/20 group/viewer">
                            {/* Guideline crosshairs */}
                            <div className="absolute top-4 left-4 font-mono text-[8px] text-white/20 select-none">SYS.3D_SYS_OK</div>
                            <div className="absolute bottom-4 left-4 font-mono text-[8px] text-white/20 select-none">FOV: 45deg</div>
                            <div className="absolute bottom-4 right-4 font-mono text-[8px] text-white/20 select-none flex items-center gap-1.5">
                                <i className="fas fa-hand-pointer text-[8px] animate-bounce"></i>
                                DRAG TO ROTATE
                            </div>

                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="transparent" className="w-full h-full" />
                        </div>

                        {/* Bottom Description Panel */}
                        <div className="p-8 border-t border-white/5 bg-black/30 flex-grow flex flex-col justify-between gap-6">
                            <div>
                                <h3 className="font-display font-black uppercase tracking-tight text-2xl mb-2 text-white group-hover:text-white transition-colors">
                                    {p.title}
                                </h3>
                                <p className="font-body text-sm text-white/60 leading-relaxed font-medium">
                                    {p.description || 'Proyek visualisasi spasial 3D interaktif yang dirender secara real-time langsung di browser menggunakan WebGL.'}
                                </p>
                            </div>
                            
                            {/* Technical Specs Footer inside Card */}
                            <div className="pt-6 border-t border-white/5 flex flex-wrap justify-between items-center gap-4 font-mono text-[9px] uppercase tracking-widest text-white/40">
                                <div className="flex gap-4">
                                    <span>[ SHADOWS: ON ]</span>
                                    <span>[ LIGHTING: NEUTRAL ]</span>
                                </div>
                                <span className="px-2 py-0.5 border border-white/10 text-white/60">
                                    INTERACTION_PROMPT: NONE
                                </span>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
