"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { BrutalismContext } from './BrutalismShell';

export function Brutalism3DBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { hardShadow, radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const allProjects = data?.projects || data?.user?.projects || [];
    const items3D = allProjects.filter((p: any) => p.projectType === '3d');

    if (items3D.length === 0) return null;

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.12 } }
    };

    return (
        <section className="w-full flex flex-col border-b-[3px] border-black bg-[#f4f4f0]">
            {/* Title Bar dengan Retro Controls & warna highlight editor */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} 
                className="p-6 border-b-[3px] border-black bg-[var(--hl)] flex justify-between items-center"
            >
                <h2 className="custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter text-black">
                    3D_MODELS
                </h2>
                
                {/* Retro controls window */}
                <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
                </div>
            </motion.div>

            {/* Sub-bar / Info Toolbar */}
            <div className="w-full bg-white border-b-[3px] border-black px-6 py-3 flex justify-between items-center text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-neutral-50">
                <div className="flex items-center gap-4">
                    <span>ENGINE: <span className="text-black">THREE.JS / GLTF_LOADER</span></span>
                    <span className="hidden @md:inline">|</span>
                    <span>BUFFER: <span className="text-green-600">STABLE</span></span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[var(--hl)] animate-pulse border border-black"></span>
                    <span className="text-black">GL_RENDER_READY</span>
                </div>
            </div>

            {/* Grid Kartu Model 3D */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={staggerContainer} 
                className={`p-4 @sm:p-12 grid gap-8 bg-[#f4f4f0] ${items3D.length === 1 ? 'grid-cols-1 max-w-5xl mx-auto w-full' : 'grid-cols-1 @lg:grid-cols-2'}`}
            >
                {items3D.map((p: any, i: number) => {
                    return (
                        <motion.div 
                            key={i} 
                            variants={starkReveal} 
                            className={`flex flex-col bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[5px_5px_0px_0px_#000] transition-all cursor-pointer group relative ${radiusClass}`}
                        >
                            {/* Card Header Bar - Highlight Color */}
                            <div className="flex justify-between items-center p-4 border-b-[3px] border-black font-mono text-xs font-black uppercase bg-[var(--hl)] text-black">
                                <span className="bg-black text-[var(--hl)] px-2 py-1 border border-black">3D_RENDER_0{i + 1}</span>
                                <span className="tracking-widest flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                    ONLINE
                                </span>
                            </div>

                            {/* Viewer Area */}
                            <div className={`w-full ${items3D.length === 1 ? 'aspect-[16/9]' : 'aspect-[4/3]'} border-b-[3px] border-black bg-neutral-200 overflow-hidden relative`}>
                                <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#f4f4f0" />
                            </div>

                            {/* Details Area */}
                            <div className="p-6 flex flex-col justify-between flex-1">
                                <div>
                                    <h3 className="custom-heading text-xl @sm:text-2xl font-black uppercase tracking-tighter mb-2 leading-none text-black group-hover:text-[var(--hl)] transition-colors duration-150">
                                        {p.title}
                                    </h3>
                                    {p.description && (
                                        <p className="custom-body font-mono text-xs text-slate-600 leading-relaxed mt-3">
                                            &gt; {p.description.toUpperCase()}
                                        </p>
                                    )}
                                </div>
                                <div className="border-t border-dashed border-black/20 pt-4 mt-6 flex justify-between items-center font-mono text-[9px] text-slate-400">
                                    <span>STATUS: LOAD_SUCCESS</span>
                                    <span className="text-black font-bold">DEVICE_ACCELERATED</span>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
