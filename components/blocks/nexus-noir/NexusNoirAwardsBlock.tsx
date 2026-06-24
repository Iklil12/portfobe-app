"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function NexusNoirAwardsBlock({ data, theme, isEditor }: any) {
    const certificates = data?.certificates || data?.user?.certificates || [];
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    if (certificates.length === 0) return null;

    const accentColor = theme?.themeColor || '#4F46E5';
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="py-24 px-6 md:px-10 border-t border-white/10 relative bg-[#050505] z-20">
            <div className="max-w-5xl mx-auto w-full">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
                    <div className={isEditor ? '' : 'gs-reveal'}>
                        <p className="text-[10px] font-nn-sans font-bold tracking-[0.3em] uppercase mb-4" style={{ color: accentColor }}>[ Distinctions ]</p>
                        <h2 className="font-nn-heading text-4xl md:text-6xl font-semibold text-white uppercase tracking-tighter">
                            <EditableText entity="appearance" field="nn_awards_title" value={getCustomText('nn_awards_title', 'Honors & Awards.')} isEditor={isEditor} />
                        </h2>
                    </div>
                </div>

                <div className={`w-full border-t border-white/10 ${isEditor ? '' : 'gs-reveal'}`}>
                    {certificates.map((cert: any, i: number) => {
                        const isOpen = openIndex === i;
                        const mediaSrc = cert.mediaUrl || cert.imageUrl || cert.image;

                        return (
                            <div key={i} className="border-b border-white/10 w-full group">
                                <button 
                                    onClick={() => setOpenIndex(isOpen ? null : i)}
                                    className="w-full py-8 md:py-10 flex flex-col md:flex-row justify-between items-start md:items-center text-left focus:outline-none hover:bg-white/[0.02] transition-colors px-4 md:px-8 cursor-pointer"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-8 w-full md:w-auto">
                                        <span className="font-nn-sans text-xs uppercase tracking-widest text-white/40 block w-16">
                                            {cert.year || (cert.createdAt ? new Date(cert.createdAt).getFullYear() : '2024')}
                                        </span>
                                        <h4 className={`font-nn-heading text-xl md:text-3xl font-bold uppercase transition-colors duration-300 ${isOpen ? 'text-[var(--accent)]' : 'text-white group-hover:text-white/80'}`}>
                                            {cert.title}
                                        </h4>
                                    </div>
                                    <div className="flex items-center gap-6 mt-4 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                                        <span className="font-nn-sans text-xs uppercase tracking-widest text-[#888888]">{cert.issuer}</span>
                                        <div className={`w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 ${isOpen ? 'rotate-180 bg-[var(--accent)] text-black border-[var(--accent)]' : 'text-white group-hover:border-white/50 group-hover:bg-white/5'}`}>
                                            <i className="fas fa-chevron-down text-[10px]"></i>
                                        </div>
                                    </div>
                                </button>
                                
                                <AnimatePresence>
                                    {isOpen && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-4 md:px-8 pb-10 pt-2 flex flex-col md:flex-row gap-8">
                                                {mediaSrc ? (
                                                    <div className="w-full md:w-1/2 aspect-[4/3] bg-[#0A0A0A] border border-white/10 relative overflow-hidden flex-shrink-0 p-2 rounded-xl">
                                                        <LazyImage src={mediaSrc} alt={cert.title} className="w-full h-full object-contain" />
                                                    </div>
                                                ) : (
                                                    <div className="w-full md:w-1/2 aspect-[4/3] bg-[#0A0A0A] border border-white/10 relative overflow-hidden flex-shrink-0 flex flex-col items-center justify-center rounded-xl">
                                                        <i className="fas fa-award text-4xl text-white/20 mb-3"></i>
                                                        <span className="font-nn-sans text-[10px] uppercase tracking-widest text-white/30">No Media Provided</span>
                                                    </div>
                                                )}
                                                
                                                <div className="flex-1 flex flex-col justify-center py-4">
                                                    <p className="font-nn-sans text-sm md:text-base text-white/60 leading-relaxed mb-8">
                                                        {cert.description || `Dianugerahkan oleh ${cert.issuer} sebagai bentuk penghargaan atas pencapaian luar biasa dalam kategori ${cert.title}. Sertifikasi ini memvalidasi dedikasi, kualitas teknis, dan keahlian tingkat lanjut yang diakui oleh profesional industri.`}
                                                    </p>
                                                    
                                                    {cert.credentialUrl && (
                                                        <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer" className="font-nn-sans text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/20 px-6 py-4 hover:bg-white hover:text-black transition-colors w-max hover-trigger flex items-center gap-3">
                                                            Verify Credential <i className="fas fa-arrow-right -rotate-45"></i>
                                                        </a>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
