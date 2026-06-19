"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
  const profession = data?.profile?.profession || data?.profession || "Software Engineer & Designer";

  const auraAnim = isCardPreview
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } } };

  const marqueeItems = [
    { type: 'fixed', text: profession },
    { type: 'editable', field: 'spatial_marquee_1', default: 'Creative Thinker' },
    { type: 'editable', field: 'spatial_marquee_2', default: 'Available for work' },
  ];

  return (
    <motion.div
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0 }}
      variants={auraAnim}
      className="w-screen relative left-1/2 -translate-x-1/2 py-8 overflow-hidden bg-[#020202]/30 backdrop-blur-[2px] border-y border-white/[0.04]"
    >
      {/* Subtle highlight theme line glow in the center */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-px blur-sm opacity-30 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, var(--hl, #6366f1), transparent)` }}
      />

      {/* Fade edge masks */}
      <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#020202] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#020202] to-transparent pointer-events-none z-10" />

      <div className="flex animate-marquee whitespace-nowrap relative z-0">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-16 px-8 shrink-0">
            {[...Array(4)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <React.Fragment key={`${groupIndex}-${index}`}>
                    <span className="text-sm @md:text-base font-semibold tracking-[0.12em] text-slate-400 hover:text-white transition-all duration-300 cursor-default select-none">
                      {item.type === 'editable' ? (
                        <EditableText 
                          value={theme?.customTexts?.[item.field as string] || item.default} 
                          field={item.field as string} 
                          entity="appearance" 
                          isEditor={isEditor} 
                          as="span" 
                          maxLength={40} 
                        />
                      ) : (
                        item.text
                      )}
                    </span>
                    <span 
                      className="w-2 h-2 rounded-full opacity-80 shrink-0 transition-transform duration-500 hover:scale-125"
                      style={{ 
                        backgroundColor: 'var(--hl, #6366f1)',
                        boxShadow: '0 0 10px var(--hl, #6366f1), 0 0 4px var(--hl, #6366f1)'
                      }}
                    />
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
