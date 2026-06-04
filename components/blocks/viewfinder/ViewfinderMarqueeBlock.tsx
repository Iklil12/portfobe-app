"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ViewfinderMarqueeBlock({ data, theme, isEditor }: any) {
  const animationTrigger = isEditor ? "animate" : "whileInView";

  const marqueeItems = [
    { type: 'editable', field: 'vf_mq_1', default: 'RAW_DATA_STREAM' },
    { type: 'editable', field: 'vf_mq_2', default: 'UNCOMPRESSED_VIDEO' },
    { type: 'editable', field: 'vf_mq_3', default: 'NO_SIGNAL_LOSS' },
    { type: 'editable', field: 'vf_mq_4', default: 'COLOR_GRADE_ACTIVE' },
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
      className="w-full border-b border-white/10 py-3 overflow-hidden bg-[#050505] shrink-0"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-8 px-4 shrink-0">
            {[...Array(4)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <React.Fragment key={`${groupIndex}-${index}`}>
                    <span className="vf-hud-text uppercase tracking-[0.2em] text-[#F3F3F1]/60 hover:text-[var(--primary)] transition-colors duration-300">
                      <EditableText 
                        value={theme?.customTexts?.[item.field as string] || item.default} 
                        field={item.field as string} 
                        entity="appearance" 
                        isEditor={isEditor} 
                        as="span" 
                        maxLength={40} 
                      />
                    </span>
                    <span className="text-[var(--primary)] mx-4">&lt;///&gt;</span>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
}
