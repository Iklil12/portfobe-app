"use client";

import React from 'react';
import { motion } from 'framer-motion';
import dynamic from 'next/dynamic';
const Interactive3DViewer = dynamic(() => import('@/components/ui/Interactive3DViewer').then(mod => mod.Interactive3DViewer), { ssr: false });

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const Minimalist3DBlock = ({ data, theme, isEditor, blockConfig }: any) => {


  const animationTrigger = isEditor ? "animate" : "whileInView";
  const allProjects = data?.projects || data?.user?.projects || [];
  const items3D = allProjects.filter((p: any) => p.projectType === '3d');

  if (items3D.length === 0) return null;

  const buttonShape = theme?.buttonShape || 'rounded';
  const radiusClass = buttonShape === 'hard' || buttonShape === 'square' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-lg';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-black shadow-[6px_6px_0_0_rgba(0,0,0,1)]' : 'bg-gray-50 border border-gray-200 shadow-sm';

  return (
    <section className="border-t border-gray-200 bg-zinc-50/50">
      <motion.div
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true }}
        variants={cinematicBlurUp} custom={0.2}
        className="p-8 @lg:p-12 pb-6 flex justify-between items-end"
      >
        <div>
          <h2 className="text-2xl font-black uppercase tracking-tighter min-heading">3D Showcase</h2>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-1">Interactive Models</p>
        </div>
        <span className="text-[10px] font-mono text-gray-400 uppercase"><i className="fas fa-cube mr-1"></i> {items3D.length} Model{items3D.length > 1 ? 's' : ''}</span>
      </motion.div>

      <motion.div
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
        variants={getStaggerContainer(0.4, 0.3)}
        className="px-8 @lg:px-12 pb-12 grid grid-cols-1 gap-8"
      >
        {items3D.map((p: any, i: number) => (
          <motion.div key={p.id || i} variants={cinematicBlurUp} className="group w-full">
            <div className={`w-full overflow-hidden relative hover:shadow-xl transition-shadow ${cardStyleClass} ${radiusClass}`}>
              <Interactive3DViewer mediaUrl={p.mediaUrl} />
            </div>
            <div className="flex justify-between items-start mt-4">
              <div>
                <h3 className="text-lg font-bold tracking-tight mb-1 min-heading">{p.title}</h3>
                {p.description && <p className="text-xs text-gray-500 max-w-lg">{p.description}</p>}
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 bg-gray-100 px-3 py-1.5 border border-gray-200 shrink-0">3D Model</span>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};
