"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';
import { useViewfinder } from './ViewfinderContext';

export function ViewfinderAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const { setSelectedMedia } = useViewfinder();
  const [selectedCert, setSelectedCert] = useState<any>(null);

  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const certificates = data?.certificates || data?.user?.certificates || [];

  if (!certificates.length) return null;

  return (
    <div className="w-full flex flex-col py-16 px-6 @md:px-12 @lg:px-20 bg-[#F3F3F1] shrink-0">
      <div className="max-w-4xl mx-auto w-full">
        <motion.h3
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
            className="text-[10px] font-bold uppercase tracking-widest mb-4 bg-[#050505] text-[#F3F3F1] inline-block px-4 py-2"
        >
            <EditableText value={theme?.customTexts?.vf_festivals_title || 'FESTIVALS & RECOGNITION'} field="vf_festivals_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
        </motion.h3>

        <div className="border-y-2 border-[#050505]">
            {certificates.map((cert: any, idx: number) => (
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0 }}
                    transition={{ duration: 0.6, delay: idx * 0.05, ease: cinematicEase }}
                    key={cert.id || idx} className="border-b border-[#050505]/20 overflow-hidden last:border-b-0"
                >
                    <motion.div
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.03)", x: 10 }}
                        onClick={() => setSelectedCert(selectedCert?.id === cert.id ? null : cert)}
                        className="grid grid-cols-12 py-5 transition-all cursor-pointer items-center px-2"
                    >
                        <div className="col-span-3 @md:col-span-2 text-[10px] @md:text-xs font-bold text-gray-500 vf-hud-text">{cert.year || new Date(cert.createdAt).getFullYear()}</div>
                        <div className="col-span-7 @md:col-span-9 text-sm @md:text-lg font-black uppercase tracking-wide" style={{ color: 'var(--primary)' }}>{cert.title}</div>
                        <div className={`col-span-2 @md:col-span-1 text-right transition-transform duration-500 ${selectedCert?.id === cert.id ? 'rotate-90' : ''}`}>
                            <i className="fas fa-chevron-right text-xs opacity-50 text-[#050505]"></i>
                        </div>
                    </motion.div>

                    <AnimatePresence>
                        {selectedCert?.id === cert.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.5, ease: cinematicEase }}
                                className="bg-white/50"
                            >
                                <div className="p-6 flex flex-col @md:flex-row gap-8 items-start">
                                    {cert.mediaUrl && (
                                        <div className="w-full @md:w-64 aspect-video overflow-hidden bg-gray-200 border border-[#050505]/20 shrink-0 cursor-pointer group" onClick={(e) => { e.stopPropagation(); setSelectedMedia({ url: cert.mediaUrl, title: cert.title, type: 'certificate' }); }}>
                                            <LazyImage src={cert.mediaUrl} alt={cert.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                    )}
                                    <div className="flex flex-col gap-4">
                                        <p className="text-[#050505]/80 text-sm leading-relaxed max-w-2xl">{cert.description}</p>
                                        <div className="flex gap-4 items-center">
                                            {cert.issuer && <span className="text-[10px] uppercase font-bold tracking-widest text-[#050505]/50 vf-hud-text">ISSUER: {cert.issuer}</span>}
                                            {cert.credentialUrl && (
                                                <a href={cert.credentialUrl} target="_blank" rel="noreferrer" className="text-[10px] uppercase font-bold tracking-widest hover:underline vf-hud-text" style={{ color: 'var(--primary)' }}>
                                                    VERIFY_RECORD <i className="fas fa-external-link-alt ml-1"></i>
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
