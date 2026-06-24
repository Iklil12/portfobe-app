"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { Viewfinder3DViewer } from './Viewfinder3DViewer';

export function Viewfinder3DBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');

  if (!items3D.length) return null;

  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-2xl' : 'rounded-md';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#111] shadow-[0_30px_60px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#050505] border border-[#222] hover:border-[#444]';

  return (
    <section className="relative z-20 py-24 bg-[#050505] border-y border-white/10 overflow-hidden shrink-0 @container">
        {/* Background alignment overlay grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:50px_50px] z-0 pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full relative z-10">
          
          {/* Header Block - Volumetric Radar Grid */}
          <motion.div
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
              variants={fadeUpVariants}
              className="flex flex-col mb-16 px-6 @md:px-12 select-none"
          >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2.5 h-2.5 rounded-full border-2 border-[var(--primary)] animate-pulse flex items-center justify-center">
                  <div className="w-1 h-1 bg-[var(--primary)] rounded-full"></div>
                </div>
                <span className="font-mono text-[9px] text-[var(--primary)] uppercase tracking-[0.3em] font-bold">
                  [ 3D VOLUMETRIC SCANS ]
                </span>
              </div>
              <h2 className="font-cinema tracking-wide text-[#F3F3F1] text-5xl @md:text-7xl uppercase leading-none">
                  <EditableText value={theme?.customTexts?.vf_3d_title || '3D MODELS'} field="vf_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
              </h2>
              {/* Radar coordinate label running below the header */}
              <div className="flex gap-4 font-mono text-[7px] text-slate-500 uppercase tracking-widest mt-4">
                <span>COORD // LAT 34.0522</span>
                <span>LON -118.2437</span>
                <span className="text-[var(--primary)] font-bold">GRID ACTIVE // 85%</span>
              </div>
          </motion.div>
          
          {/* 3D Items Grid */}
          <div className="flex flex-col gap-24 @md:gap-32 px-6 @md:px-12">
              {items3D.map((p: any, idx: number) => (
                  <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0 }}
                      transition={{ duration: 1.2, delay: (idx % 3) * 0.1, ease: cinematicEase }}
                      key={idx}
                      className="relative block w-full group"
                  >
                      {/* 3D Viewer Container with high-tech HUD */}
                      <div className={`w-full aspect-video overflow-hidden ${cardStyleClassDark} ${cardRadiusClass} relative shadow-[0_0_100px_rgba(0,0,0,0.55)]`}>
                          <Viewfinder3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                          
                          {/* Volumetric LiDAR Scanner HUD Overlay */}
                          <div className="absolute inset-0 pointer-events-none z-20 p-4 @md:p-8 flex flex-col justify-between select-none">
                              
                              {/* Top Telemetry Info */}
                              <div className="flex justify-between items-start font-mono text-[7px] @md:text-[9px] text-[#F3F3F1]/40 uppercase tracking-[0.2em]">
                                  <div className="flex items-center gap-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                                      <span className="text-[var(--primary)] font-bold">LIDAR SCANNING ACTIVE</span>
                                  </div>
                                  <div>
                                      SYS // RASTERIZE_WEBGL
                                  </div>
                              </div>

                              {/* Target Frame corners */}
                              <div className="absolute inset-4 @md:inset-8 border border-white/5">
                                  <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-white/30"></div>
                                  <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-white/30"></div>
                                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-white/30"></div>
                                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-white/30"></div>

                                  {/* Focus crosshairs */}
                                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                      <div className="w-4 h-px bg-white"></div>
                                      <div className="w-px h-4 bg-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
                                  </div>
                              </div>

                              {/* Bottom Model Specs Telemetry */}
                              <div className="flex justify-between items-end font-mono text-[7px] @md:text-[8px] text-[#F3F3F1]/40 uppercase tracking-[0.2em] z-20">
                                  <div className="flex flex-col gap-0.5">
                                      <span>VERTICES // 420,915</span>
                                      <span>POLYS // 841,830</span>
                                  </div>
                                  <div className="text-right flex flex-col gap-0.5">
                                      <span>ROTATION // X:0.0 Y:AUTO Z:0.0</span>
                                      <span>SCALE // 1.000 : 1</span>
                                  </div>
                              </div>

                          </div>
                          
                          <div className="absolute inset-0 border-2 border-transparent group-hover:border-[var(--primary)]/20 transition-all duration-700 pointer-events-none"></div>
                      </div>

                      {/* Description & Metadata labels */}
                      <div className="mt-8 flex flex-col @md:flex-row justify-between items-start @md:items-end gap-6">
                          <div className="flex flex-col gap-2 flex-1">
                              <h3 className="font-cinema tracking-wide text-[#F3F3F1] text-5xl @md:text-8xl group-hover:text-[var(--primary)] transition-colors duration-500 leading-none">
                                  {p.title}
                              </h3>
                              {p.description && <p className="vf-hud-text text-xs @md:text-sm text-[#F3F3F1]/50 max-w-xl mt-4 leading-relaxed uppercase tracking-widest">{p.description}</p>}
                          </div>
                          <div className="flex flex-col items-start @md:items-end gap-2 shrink-0 select-none">
                              <p className="uppercase tracking-[0.5em] vf-hud-text text-[10px] opacity-60 font-bold" style={{ color: 'var(--primary)' }}>
                                  <EditableText value={theme?.customTexts?.vf_3d_metadata || 'Cine_Asset_Metadata'} field="vf_3d_metadata" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                              </p>
                              <div className="h-px w-24 bg-[var(--primary)] opacity-20 mt-1"></div>
                          </div>
                      </div>
                  </motion.div>
              ))}
          </div>
        </div>
    </section>
  );
}
