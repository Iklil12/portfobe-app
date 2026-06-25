"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';
import { useViewfinder } from './ViewfinderContext';

export function ViewfinderAwardsBlock({ data, theme, isEditor, isCardPreview }: any) {
  

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#050505] shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]';
      if (style === 'flat') return 'border border-white/20 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#0a0a0a] shadow-2xl';
      return 'border border-white/10 bg-[#050505]';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

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
    <div id="awards" className="w-full flex flex-col py-24 px-6 @md:px-12 @lg:px-20 bg-[#050505] text-white border-b border-white/10 shrink-0 @container relative overflow-hidden">
      {/* Background HUD Scope Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      <div className="w-full relative z-10">
        
        {/* Header Title - Lens Calibration HUD */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 select-none border-b border-white/10 pb-8 relative w-full">
          {/* Left calibration marks */}
          <div className="flex items-center gap-4">
            <div className="font-mono text-[7px] text-slate-500 flex flex-col leading-none">
              <span>FOCUS // A</span>
              <span>DIST // INFINITE</span>
            </div>
            <div className="h-8 w-px bg-white/20"></div>
            <div className="flex flex-col">
              <span className="font-mono text-[9px] text-[var(--primary)] uppercase tracking-[0.2em] font-bold mb-1">
                <EditableText value={theme?.customTexts?.vf_festivals_title || 'HONORS & RECOGNITION'} field="vf_festivals_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
              </span>
              <h2 className="font-cinema text-5xl @md:text-7xl text-white uppercase tracking-widest leading-none">
                Laurels
              </h2>
            </div>
          </div>
          {/* Right optics coordinate indicator */}
          <div className="bg-[#0b0b0d] border border-white/10 px-4 py-2 rounded-sm font-mono text-[8px] text-slate-500 uppercase tracking-widest flex items-center gap-4 self-stretch md:self-auto justify-between">
            <span>FILTER // ND8</span>
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></div>
            <span>CERT_REG // ACTIVE</span>
          </div>
        </div>

        {/* Awards list ledger */}
        <div className="border-y border-white/10 divide-y divide-white/5">
            {certificates.map((cert: any, idx: number) => {
                const isSelected = selectedCert?.id === cert.id;
                return (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, amount: 0 }}
                        transition={{ duration: 0.6, delay: idx * 0.05, ease: cinematicEase }}
                        key={cert.id || idx} 
                        className="overflow-hidden group"
                    >
                        <div
                            onClick={() => setSelectedCert(isSelected ? null : cert)}
                            className="grid grid-cols-12 py-6 transition-all cursor-pointer items-center px-4 hover:bg-white/[0.02]"
                        >
                            {/* Year */}
                            <div className="col-span-3 @md:col-span-2 font-mono text-[9px] @md:text-xs text-slate-500 group-hover:text-[var(--primary)] transition-colors select-none">
                              [ YR_{cert.year || new Date(cert.createdAt).getFullYear()} ]
                            </div>
                            
                            {/* Title */}
                            <div className="col-span-7 @md:col-span-9 text-sm @md:text-xl font-cinema uppercase tracking-wider text-white group-hover:text-[var(--primary)] transition-colors duration-300">
                              {cert.title}
                            </div>
                            
                            {/* Expand arrow */}
                            <div className={`col-span-2 @md:col-span-1 text-right transition-transform duration-500 ${isSelected ? 'rotate-90 text-[var(--primary)]' : 'text-white'}`}>
                                <i className="fas fa-chevron-right text-xs opacity-40"></i>
                            </div>
                        </div>

                        {/* Collapsible content */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.5, ease: cinematicEase }}
                                    className="bg-[#0b0b0b]/60 border-t border-white/5 relative"
                                >
                                    {/* Subtitle crop tags */}
                                    <div className="absolute top-2 right-2 font-mono text-[7px] text-slate-600 select-none">
                                      VERIFIED_RECORD_SECURE_AUTH
                                    </div>

                                    <div className="p-6 flex flex-col @md:flex-row gap-8 items-start">
                                        
                                        {/* Image wrapper with viewfinder focus frame */}
                                        {cert.mediaUrl && (
                                            <div 
                                              className="w-full @md:w-64 aspect-video overflow-hidden bg-zinc-950 border border-white/10 shrink-0 cursor-pointer group/thumb relative rounded-sm shadow-lg" 
                                              onClick={(e) => { 
                                                e.stopPropagation(); 
                                                setSelectedMedia({ url: cert.mediaUrl, title: cert.title, type: 'certificate' }); 
                                              }}
                                            >
                                                <LazyImage src={cert.mediaUrl} alt={cert.title} className="w-full h-full object-cover grayscale hover:scale-105 group-hover/thumb:grayscale-0 transition-all duration-700 opacity-80 group-hover/thumb:opacity-100" />
                                                
                                                {/* Lens bracket outline overlay */}
                                                <div className="absolute inset-2 border border-white/0 group-hover/thumb:border-white/10 transition-all duration-500 pointer-events-none">
                                                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white"></div>
                                                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white"></div>
                                                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white"></div>
                                                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white"></div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Certificate descriptions & verify meta links */}
                                        <div className="flex flex-col gap-4 flex-1">
                                            <p className="text-[#F3F3F1]/70 text-xs @md:text-sm leading-relaxed max-w-xl text-justify font-medium">
                                              {cert.description}
                                            </p>
                                            
                                            <div className="flex flex-wrap gap-4 items-center mt-2 border-t border-white/5 pt-4 font-mono text-[9px]">
                                                {cert.issuer && (
                                                  <span className="font-bold text-slate-500 uppercase tracking-widest">
                                                    RECORD // {cert.issuer}
                                                  </span>
                                                )}
                                                {cert.credentialUrl && (
                                                    <a 
                                                      href={cert.credentialUrl} 
                                                      target="_blank" 
                                                      rel="noreferrer" 
                                                      className="font-bold uppercase tracking-widest hover:text-white transition-colors flex items-center gap-1 text-[var(--primary)]"
                                                    >
                                                        VERIFY_RECORD <i className="fas fa-external-link-alt text-[8px]"></i>
                                                    </a>
                                                )}
                                            </div>
                                        </div>

                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                );
            })}
        </div>

      </div>
    </div>
  );
}
