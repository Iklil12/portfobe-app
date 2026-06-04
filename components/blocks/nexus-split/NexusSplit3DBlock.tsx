"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';

export function NexusSplit3DBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');

  if (items3D.length === 0) return null;

  const buttonShape = theme?.buttonShape || 'rounded';
  const cardRadiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_20px_50px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : 'bg-white/[0.02] border border-white/10 hover:border-white/20';

  const nexusEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: nexusEase } }
  };

  return (
    <section className="flex flex-col pt-16 @lg:pt-24 pb-10 border-b nexus-border">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }} variants={fadeUp} className={`flex justify-between items-end mb-10 px-6 @md:px-12`}>
            <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_3d_title || '3D Models'} field="nexus_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
            <span className="font-sans text-xs font-medium text-[var(--hl)] hidden @sm:block">
                ({items3D.length}) <EditableText value={theme?.customTexts?.nexus_3d_items || 'Items'} field="nexus_3d_items" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
            </span>
        </motion.div>

        <div className="flex flex-col gap-10 px-6 @md:px-12">
            {items3D.map((p: any, i: number) => {
                return (
                    <motion.div 
                        key={i}
                        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                        className={`relative w-full group overflow-hidden ${cardRadiusClass} ${cardStyleClass}`}
                    >
                        <div className="flex flex-col w-full relative z-10 p-8 @md:p-12 bg-gradient-to-b from-white/10 to-transparent">
                            <div className="flex flex-col gap-3">
                                <span className="font-sans text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 group-hover:text-[var(--hl)] transition-colors">
                                    <EditableText value={theme?.customTexts?.nexus_3d_label || 'Spatial_Data_0'} field="nexus_3d_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />{i + 1}
                                </span>
                                <h3 className={`font-display font-bold text-white transition-colors duration-300 text-4xl @md:text-7xl leading-none`}>
                                    {p.title}
                                </h3>
                                {p.description && <p className="font-sans text-slate-400 text-sm @md:text-lg max-w-2xl mt-6 leading-relaxed">{p.description}</p>}
                            </div>
                        </div>

                        <div className="w-full aspect-video bg-[#0a0a0a] border-t nexus-border relative">
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#0a0a0a" />
                        </div>
                    </motion.div>
                );
            })}
        </div>
    </section>
  );
}
