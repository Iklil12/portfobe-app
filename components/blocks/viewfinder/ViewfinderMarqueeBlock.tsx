"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ViewfinderMarqueeBlock({ data, theme, isEditor }: any) {
  

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

const animationTrigger = isEditor ? "animate" : "whileInView";

  const marqueeItems = [
    { type: 'editable', field: 'vf_mq_1', default: 'LIDAR_SCAN_ACTIVE' },
    { type: 'editable', field: 'vf_mq_2', default: 'RAW_UNCOMPRESSED_VIDEO' },
    { type: 'editable', field: 'vf_mq_3', default: 'ZERO_SIGNAL_LOSS' },
    { type: 'editable', field: 'vf_mq_4', default: 'COLOR_GRADE_ACES' },
  ];

  const canvasEase = [0.16, 1, 0.3, 1] as any;
  const revealVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: canvasEase } }
  };

  return (
    <motion.div
      initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
      variants={revealVariants}
      className="w-full border-y border-white/10 py-6 overflow-hidden bg-[#050505] shrink-0 relative select-none"
    >
      {/* Background scanline bar */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent pointer-events-none z-0" />
      
      <div className="flex animate-marquee whitespace-nowrap relative z-10 items-center">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-12 shrink-0">
            {[...Array(3)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <div key={`${groupIndex}-${index}`} className="flex items-center gap-6">
                    
                    {/* Pulsing camera recording beacon */}
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary)] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--primary)]"></span>
                    </span>

                    {/* Hollow Stroke Outline Marquee Text */}
                    <span className="font-cinema text-3xl md:text-5xl uppercase tracking-widest text-transparent [-webkit-text-stroke:1px_rgba(243,243,241,0.25)] hover:[-webkit-text-stroke:1px_var(--primary)] hover:text-white transition-all duration-300 cursor-pointer">
                      <EditableText 
                        value={theme?.customTexts?.[item.field as string] || item.default} 
                        field={item.field as string} 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="span" 
                        maxLength={40} 
                      />
                    </span>

                    {/* Dynamic telemetry spacer */}
                    <span className="font-mono text-[9px] text-slate-600 tracking-[0.2em] px-2">
                      [ REC_RUN // TC 24.00 ]
                    </span>

                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
