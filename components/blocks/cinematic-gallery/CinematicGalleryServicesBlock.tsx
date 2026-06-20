"use client";

import React from 'react';
import { useCinematicGallery } from './CinematicGalleryShell';
import { EditableText } from '@/components/ui/EditableText';

export function CinematicGalleryServicesBlock(props: any) {
    const { isEditor, theme } = useCinematicGallery();
    const customTexts = theme?.customTexts || {};

    const toggleVisibility = (id: string, currentStatus: boolean) => {
        if (!isEditor) return;
        window.parent.postMessage({
            type: 'INLINE_EDIT',
            entity: 'appearance',
            field: `cg_svc_${id}_visible`,
            value: currentStatus ? 'false' : 'true'
        }, window.location.origin);
    };

    const isVisible1 = customTexts.cg_svc_1_visible !== 'false';
    const isVisible2 = customTexts.cg_svc_2_visible !== 'false';
    const isVisible3 = customTexts.cg_svc_3_visible !== 'false';

    return (
        <section className="panel w-[100vw] h-[100vh] flex flex-col justify-center px-6 md:px-24 bg-[#050505] shrink-0 border-r border-white/10 relative overflow-hidden">
            {/* Vignette Shadow Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)] pointer-events-none z-0" />
            
            {/* Ambient Glow */}
            <div className="absolute -top-48 -right-48 w-96 h-96 bg-white/[0.015] rounded-full blur-[120px] pointer-events-none z-0" />
            <div className="absolute -bottom-48 -left-48 w-96 h-96 bg-white/[0.01] rounded-full blur-[120px] pointer-events-none z-0" />

            {/* Cinematic Header */}
            <div className="absolute top-[8vh] left-6 md:top-[12vh] md:left-24 z-20 flex flex-col gap-1.5 pointer-events-auto">
                <div className="text-white/40 text-[9px] md:text-[10px] tracking-[0.45em] uppercase font-mono">
                    [ SECTION 03 // OFFERS ]
                </div>
                <h2 className="font-serif italic text-3xl md:text-5xl text-white leading-none">
                    <EditableText value={customTexts.cg_services_heading || 'Layanan'} field="cg_services_heading" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </h2>
            </div>
            
            {/* Services List */}
            <div className="w-full max-w-5xl mx-auto z-10 mt-[14vh] md:mt-[16vh] h-[67vh] md:h-[63vh] overflow-y-auto cinematic-scrollbar pointer-events-auto pr-3">
                <div className="flex flex-col md:flex-row gap-5 md:gap-8 items-stretch justify-start pb-6">
                    {/* Service 1 */}
                    {(isVisible1 || isEditor) && (
                        <div className={`w-full md:w-[300px] border-t border-white/10 pt-4 md:pt-6 shrink-0 group hover:-translate-y-1 transition-all duration-500 relative ${
                            !isVisible1 ? 'opacity-40 bg-zinc-950/20' : ''
                        }`}>
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility('1', isVisible1)}
                                    className={`absolute top-0 right-0 z-30 px-2 py-0.5 text-[8px] font-mono border transition-all ${
                                        isVisible1 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible1 ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {isVisible1 ? "✕ Hide" : "➕ Show"}
                                </button>
                            )}
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/60 transition-colors duration-500">
                                    01 {!isVisible1 && "[HIDDEN]"}
                                </span>
                            </div>
                            <h3 className="font-serif text-lg md:text-2xl text-white mb-2 md:mb-4 italic group-hover:not-italic transition-all duration-500 leading-snug">
                                <EditableText value={customTexts.cg_svc_1_title || 'Direksi Kreatif'} field="cg_svc_1_title" entity="appearance" isEditor={isEditor} as="span" />
                            </h3>
                            <p className="font-sans text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                                <EditableText value={customTexts.cg_svc_1_desc || 'Mengarahkan visi visual dan narasi untuk kampanye atau proyek artistik dengan estetika yang mendalam.'} field="cg_svc_1_desc" entity="appearance" isEditor={isEditor} as="span" />
                            </p>
                        </div>
                    )}

                    {/* Service 2 */}
                    {(isVisible2 || isEditor) && (
                        <div className={`w-full md:w-[300px] border-t border-white/10 pt-4 md:pt-6 shrink-0 group hover:-translate-y-1 transition-all duration-500 relative ${
                            !isVisible2 ? 'opacity-40 bg-zinc-950/20' : ''
                        }`}>
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility('2', isVisible2)}
                                    className={`absolute top-0 right-0 z-30 px-2 py-0.5 text-[8px] font-mono border transition-all ${
                                        isVisible2 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible2 ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {isVisible2 ? "✕ Hide" : "➕ Show"}
                                </button>
                            )}
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/60 transition-colors duration-500">
                                    02 {!isVisible2 && "[HIDDEN]"}
                                </span>
                            </div>
                            <h3 className="font-serif text-lg md:text-2xl text-white mb-2 md:mb-4 italic group-hover:not-italic transition-all duration-500 leading-snug">
                                <EditableText value={customTexts.cg_svc_2_title || 'Eksplorasi Digital'} field="cg_svc_2_title" entity="appearance" isEditor={isEditor} as="span" />
                            </h3>
                            <p className="font-sans text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                                <EditableText value={customTexts.cg_svc_2_desc || 'Eksperimen dengan medium digital baru, interaksi 3D, dan penceritaan berbasis web modern.'} field="cg_svc_2_desc" entity="appearance" isEditor={isEditor} as="span" />
                            </p>
                        </div>
                    )}

                    {/* Service 3 */}
                    {(isVisible3 || isEditor) && (
                        <div className={`w-full md:w-[300px] border-t border-white/10 pt-4 md:pt-6 shrink-0 group hover:-translate-y-1 transition-all duration-500 relative ${
                            !isVisible3 ? 'opacity-40 bg-zinc-950/20' : ''
                        }`}>
                            {isEditor && (
                                <button
                                    onClick={() => toggleVisibility('3', isVisible3)}
                                    className={`absolute top-0 right-0 z-30 px-2 py-0.5 text-[8px] font-mono border transition-all ${
                                        isVisible3 
                                            ? 'border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white' 
                                            : 'border-green-500/50 text-green-400 hover:bg-green-500 hover:text-white'
                                    }`}
                                    title={isVisible3 ? "Sembunyikan" : "Tampilkan"}
                                >
                                    {isVisible3 ? "✕ Hide" : "➕ Show"}
                                </button>
                            )}
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                                <span className="font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white/30 group-hover:text-white/60 transition-colors duration-500">
                                    03 {!isVisible3 && "[HIDDEN]"}
                                </span>
                            </div>
                            <h3 className="font-serif text-lg md:text-2xl text-white mb-2 md:mb-4 italic group-hover:not-italic transition-all duration-500 leading-snug">
                                <EditableText value={customTexts.cg_svc_3_title || 'Fotografi Visual'} field="cg_svc_3_title" entity="appearance" isEditor={isEditor} as="span" />
                            </h3>
                            <p className="font-sans text-xs text-white/50 leading-relaxed group-hover:text-white/70 transition-colors duration-500">
                                <EditableText value={customTexts.cg_svc_3_desc || 'Menangkap momen, subjek, dan lanskap dalam komposisi yang bercerita dan menggugah emosi penonton.'} field="cg_svc_3_desc" entity="appearance" isEditor={isEditor} as="span" />
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
