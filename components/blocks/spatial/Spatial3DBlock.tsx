"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function Spatial3DBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');

  if (items3D.length === 0 && !isEditor) return null;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';
  const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
      : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const viewAnim = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

  return (
    <div className={`flex flex-col w-full px-8 gap-12 mt-24 @md:mt-32`}>
        <motion.div {...viewAnim} variants={auraAnim} className="flex justify-between items-end mb-4">
            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                <EditableText value={theme?.customTexts?.spatial_models_title || 'Spatial Assets'} field="spatial_models_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
            <span className="text-slate-500 font-medium">({items3D.length})</span>
        </motion.div>

        {items3D.length === 0 && isEditor && (
            <div className={`w-full p-12 ${cardStyleClass} ${xlCardRadiusClass} flex flex-col items-center justify-center text-center opacity-70`}>
                <i className="fas fa-cube text-4xl text-slate-500 mb-4"></i>
                <p className="text-slate-400">Tambahkan project tipe 3D untuk menampilkannya di sini.</p>
            </div>
        )}

        <div className="flex flex-col gap-12 @md:gap-20">
            {items3D.map((p: any, i: number) => (
                <motion.div
                    key={i}
                    {...viewAnim} variants={auraAnim}
                    className="group flex flex-col gap-6"
                >
                    <div className={`w-full aspect-[4/3] @md:aspect-video ${xlCardRadiusClass} overflow-hidden relative ${cardStyleClass} p-2 @md:p-3 transition-all duration-700 group-hover:shadow-[0_0_60px_rgba(var(--hl-rgb),0.2)] group-hover:border-[var(--hl)]/30`}>
                        <div className="w-full h-full rounded-[24px] @md:rounded-[36px] overflow-hidden relative bg-[#0a0a0a]">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                            {/* Hover Overlay */}
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center pointer-events-none">
                                <div className="w-20 h-20 bg-white/10 backdrop-blur-md border-white/20 rounded-full flex items-center justify-center transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 scale-50 group-hover:scale-100 transition-all duration-500 shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                                    <i className="fas fa-cube text-white text-2xl"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col px-4">
                        <div className="flex justify-between items-center mb-2">
                            <div className="flex flex-col">
                                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--hl)] font-bold mb-1 opacity-60">
                                    <EditableText value={theme?.customTexts?.spatial_model_label || 'Spatial Model'} field="spatial_model_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> 0{i+1}
                                </span>
                                <h3 className="text-3xl @md:text-5xl font-medium text-white group-hover:text-[var(--hl)] transition-colors">{p.title}</h3>
                            </div>
                            <span className={`text-[10px] uppercase tracking-widest text-slate-500 border border-slate-800 px-4 py-2 ${radiusClass}`}>
                                <EditableText value={theme?.customTexts?.spatial_asset_label || '3D Asset'} field="spatial_asset_label" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </span>
                        </div>
                        {p.description && <p className="text-slate-400 text-sm @md:text-base max-w-2xl mt-2 leading-relaxed">{p.description}</p>}
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );
}
