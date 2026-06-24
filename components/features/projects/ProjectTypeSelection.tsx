"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Film, Image as ImageIcon, Award, Box } from 'lucide-react';
import { ProjectType } from '@/hooks/useProjects';

const smoothEase = [0.22, 1, 0.36, 1] as const;

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const cardItem = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: smoothEase } }
};

export function ProjectTypeSelection({
  userPlan,
  setProjectType,
  setShowUpgradeModal
}: {
  userPlan: string;
  setProjectType: (type: ProjectType) => void;
  setShowUpgradeModal: (show: boolean) => void;
}) {
  return (
    <motion.div
      key="type-selection"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      exit={{ opacity: 0, x: -10, transition: { duration: 0.2 } }}
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4"
    >
      {[
        { id: 'video', icon: Film, label: 'Video', desc: 'Youtube / Vimeo' },
        { id: 'photo', icon: ImageIcon, label: 'Photo / Design', desc: 'Visual Format' },
        { id: 'certificate', icon: Award, label: 'Certificate', desc: 'License & Awards' },
        { id: '3d', icon: Box, label: '3D Model', desc: 'Format .GLB', isPro: true }
      ].map((opt) => {
        const IconComponent = opt.icon;
        return (
          <motion.button
            key={opt.id}
            variants={cardItem}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              if (opt.isPro && userPlan === 'FREE') {
                 setShowUpgradeModal(true);
                 return;
              }
              setProjectType(opt.id as ProjectType)
            }}
            className="group relative p-5 rounded-none border border-white/10 bg-zinc-900/40 hover:border-[#ff9e00] hover:bg-zinc-900 transition-all text-center overflow-hidden flex flex-col justify-between min-h-[140px]"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            {opt.isPro && (
               <span className="absolute top-2.5 right-2.5 bg-[#ff9e00] text-black text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none shadow-sm z-20">PRO</span>
            )}
            <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center mx-auto mb-3 group-hover:bg-[#ff9e00]/10 group-hover:border-[#ff9e00]/30 transition-colors duration-300 relative z-10">
              <IconComponent className="w-5 h-5 text-white/30 group-hover:text-[#ff9e00] transition-colors duration-300" />
            </div>
            <div>
              <p className="font-mono font-bold text-white text-[11px] uppercase tracking-wider relative z-10">{opt.label}</p>
              <p className="text-[8px] font-mono text-white/30 mt-1 uppercase tracking-widest relative z-10 leading-none">{opt.desc}</p>
            </div>
          </motion.button>
        );
      })}
    </motion.div>
  );
}
