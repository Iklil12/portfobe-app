"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Interactive3DViewer } from '@/components/ui/Interactive3DViewer';
import { EditableText } from '@/components/ui/EditableText';

export function Obsidian3DBlock({ data, theme, isEditor }: any) {
  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType?.toLowerCase() === '3d');

  if (items3D.length === 0 && !isEditor) return null;
  const displayItems = items3D.length > 0 ? items3D : [{ title: 'Sample 3D Asset', description: 'This is a preview of 3D asset.', mediaUrl: '' }];

  const getCardShapeClass = (style?: string) => {
      if (style === 'hard-shadow' || style === 'hard') {
          return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[6px_6px_0_0_var(--brand-accent)]';
      }
      if (style === 'flat') {
          return 'rounded-none border border-[rgba(255,255,255,0.1)] hover:border-[var(--brand-accent)] transition-colors duration-300';
      }
      if (style === 'soft-shadow' || style === 'soft') {
          return 'rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all duration-300';
      }
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.cardStyle);

  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section className="py-16 md:py-24 px-6 bg-[#0a0a0a] border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-screen-2xl mx-auto">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="flex flex-col md:flex-row justify-between md:items-end mb-16">
                <div>
                    <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                        <EditableText value={theme?.customTexts?.obs_obsidian_3d_label || 'Immersive'} field="obs_obsidian_3d_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                    </span>
                    <h2 className="font-heading text-4xl md:text-5xl font-medium">
                        <EditableText value={theme?.customTexts?.obs_obsidian_3d_title || '3D Models'} field="obs_obsidian_3d_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                    </h2>
                </div>
                <span className="text-[#8a8a93] font-medium hidden md:block group">
                    <i className="fas fa-cube mr-2 group-hover-accent transition-colors"></i> 
                    {items3D.length} Models
                </span>
            </motion.div>

            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} 
                className={`grid grid-cols-1 ${displayItems.length === 1 ? 'max-w-4xl mx-auto w-full' : 'md:grid-cols-2'} gap-10 md:gap-16`}
            >
                {displayItems.map((p: any, i: number) => (
                    <motion.div key={i} variants={revealVariants} className="group flex flex-col">
                        <div className={`w-full ${cardShape} overflow-hidden bg-[#050505] relative shadow-2xl group-hover:border-[var(--brand-accent)] transition-colors duration-500`}>
                            <Interactive3DViewer mediaUrl={p.mediaUrl} bgColor="#050505" />
                        </div>
                        <div className="mt-8 flex justify-between items-start px-2">
                            <div>
                                <h3 className="font-heading text-2xl md:text-3xl font-medium group-hover-accent transition-colors">{p.title}</h3>
                                <p className="font-body text-[#8a8a93] text-base mt-2 max-w-lg">{p.description || 'Interactive 3D Asset'}</p>
                            </div>
                            <span className="font-sans text-[10px] md:text-xs font-bold uppercase tracking-widest text-[#8a8a93] border border-white/10 px-4 py-2 rounded-full flex items-center gap-2">
                                <i className="fas fa-cube"></i>
                                <EditableText value={theme?.customTexts?.obs_obsidian_3d_badge || '3D Asset'} field="obs_obsidian_3d_badge" entity="appearance" isEditor={isEditor} as="span" maxLength={15} />
                            </span>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  );
}
