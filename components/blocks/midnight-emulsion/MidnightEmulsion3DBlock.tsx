"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsion3DBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');

  const canvasEase = [0.16, 1, 0.3, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: canvasEase } }
  };

  if (!items3D.length) return null;

  return (
    <div className="w-full py-24 @md:py-32 px-8 @md:px-12 @lg:px-20 border-b border-white/5 bg-[#030508] relative @container overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden opacity-40">
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-[var(--hl)] opacity-5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        <div className="flex flex-col mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4">
            <EditableText value={theme?.customTexts?.midnight_3d_top || 'Spatial Gallery'} field="midnight_3d_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_3d_title || '3D Showcase'} field="midnight_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </div>
        
        <div className="flex flex-col gap-24 @lg:gap-32">
          {items3D.map((p: any, i: number) => {
            const sceneNumber = (i + 1).toString().padStart(2, '0');
            return (
              <motion.div
                key={i}
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                className="group flex flex-col @lg:flex-row gap-10 @lg:gap-16 w-full items-stretch"
              >
                {/* Left side: Editorial Details */}
                <div className="w-full @lg:w-[350px] shrink-0 flex flex-col justify-between py-2 border-b @lg:border-b-0 @lg:border-r border-white/10 pb-8 @lg:pb-0 @lg:pr-12">
                  <div className="flex flex-col">
                    <div className="flex items-center gap-4 mb-6">
                      <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-[var(--hl)]">
                        Spatial Scene {sceneNumber}
                      </span>
                      <div className="h-px flex-1 bg-white/10"></div>
                    </div>
                    
                    <h3 className="font-serif text-3xl @md:text-4xl text-white group-hover:text-[var(--hl)] transition-colors duration-500 leading-tight">
                      {p.title}
                    </h3>
                    
                    {p.description && (
                      <p className="font-sans text-sm text-slate-400 leading-relaxed mt-6">
                        {p.description}
                      </p>
                    )}
                  </div>

                  {/* Interactive Tip */}
                  <div className="mt-8 flex items-center gap-3 font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--hl)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--hl)]"></span>
                    </span>
                    <span>Hold & drag to rotate model</span>
                  </div>
                </div>

                {/* Right side: Viewfinder CAD viewport */}
                <div className="flex-1 aspect-[4/3] @lg:aspect-video bg-[#05070a] overflow-hidden relative shadow-[0_30px_80px_rgba(0,0,0,0.6)] rounded-xl border border-white/10 group-hover:border-[var(--hl)]/30 transition-all duration-700 flex items-center justify-center">
                  {/* Interactive 3D Canvas */}
                  <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#05070a" />

                  {/* Viewfinder 3x3 Grid Overlay */}
                  <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-10 opacity-[0.03]">
                    <div className="border-r border-b border-white"></div>
                    <div className="border-r border-b border-white"></div>
                    <div className="border-b border-white"></div>
                    <div className="border-r border-b border-white"></div>
                    <div className="border-r border-b border-white"></div>
                    <div className="border-b border-white"></div>
                    <div className="border-r border-white"></div>
                    <div className="border-r border-white"></div>
                    <div></div>
                  </div>

                  {/* Center Viewfinder Target Crosshair */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 opacity-20">
                    <div className="w-4 h-px bg-white"></div>
                    <div className="h-4 w-px bg-white absolute"></div>
                  </div>

                  {/* Viewfinder Corner Brackets */}
                  <div className="absolute inset-4 pointer-events-none z-10 opacity-60">
                    <div className="absolute top-0 left-0 border-t border-l border-[var(--hl)] w-3 h-3"></div>
                    <div className="absolute top-0 right-0 border-t border-r border-[var(--hl)] w-3 h-3"></div>
                    <div className="absolute bottom-0 left-0 border-b border-l border-[var(--hl)] w-3 h-3"></div>
                    <div className="absolute bottom-0 right-0 border-b border-r border-[var(--hl)] w-3 h-3"></div>
                  </div>

                  {/* Top HUD Overlay */}
                  <div className="absolute top-4 left-6 right-6 pointer-events-none z-10 flex justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse"></span>
                      <span>3D STREAMPATH ACTIVE</span>
                    </div>
                    <span>ISO 400</span>
                  </div>

                  {/* Bottom HUD Overlay */}
                  <div className="absolute bottom-4 left-6 right-6 pointer-events-none z-10 flex justify-between font-mono text-[9px] text-slate-500 uppercase tracking-widest">
                    <span>F/2.8 · ROT: XYZ</span>
                    <span>1.0x SCALE</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
