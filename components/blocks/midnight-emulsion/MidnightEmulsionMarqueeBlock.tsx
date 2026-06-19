"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionMarqueeBlock({ data, theme, isEditor }: any) {
  const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
  const animationTrigger = isEditor ? "animate" : "whileInView";

  const marqueeItems = [
    { type: 'status', text: 'SYS // ONLINE' },
    { type: 'fixed', text: profession, isOutline: true },
    { type: 'editable', field: 'mid_marquee_1', default: 'Creative Vision', isItalic: true },
    { type: 'editable', field: 'mid_marquee_2', default: 'Available for work' },
  ];

  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const revealVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, ease: canvasEase } }
  };

  return (
    <motion.div
      initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
      variants={revealVariants}
      className="w-full border-y border-white/5 py-6 overflow-hidden bg-[#030508] relative @container"
    >
      {/* Visual coordinates ticks on borders */}
      <div className="absolute top-1 inset-x-6 flex justify-between pointer-events-none opacity-30 select-none">
        <span className="font-mono text-[7px] text-slate-500">00:00:00:00</span>
        <span className="font-mono text-[7px] text-slate-500">TC // RUN</span>
      </div>
      
      <div className="flex animate-marquee whitespace-nowrap items-center my-1.5">
        {[...Array(3)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-12 px-6 shrink-0">
            {marqueeItems.map((item, index) => {
              if (item.type === 'status') {
                return (
                  <React.Fragment key={`${blockIndex}-${index}`}>
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[var(--hl)] bg-[var(--hl)]/10 border border-[var(--hl)]/20 px-3 py-1 rounded shrink-0 select-none">
                      {item.text}
                    </span>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)] shadow-[0_0_6px_var(--hl)] shrink-0 animate-pulse"></span>
                  </React.Fragment>
                );
              }

              const textClass = `font-serif text-lg md:text-2xl uppercase tracking-[0.15em] transition-all duration-500 ${
                item.isOutline 
                  ? 'text-transparent hover:text-white' 
                  : 'text-white hover:text-[var(--hl)]'
              } ${item.isItalic ? 'italic' : ''}`;

              const textStyle = item.isOutline ? {
                WebkitTextStroke: '1.2px rgba(255, 255, 255, 0.25)',
              } : undefined;

              return (
                <React.Fragment key={`${blockIndex}-${index}`}>
                  <span 
                    className={textClass}
                    style={textStyle}
                    onMouseEnter={(e) => {
                      if (item.isOutline) (e.currentTarget.style as any).WebkitTextStrokeColor = 'var(--hl)';
                    }}
                    onMouseLeave={(e) => {
                      if (item.isOutline) (e.currentTarget.style as any).WebkitTextStrokeColor = 'rgba(255, 255, 255, 0.25)';
                    }}
                  >
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
                  <span className="w-1 h-1 rounded-full bg-white/20 shrink-0"></span>
                </React.Fragment>
              );
            })}
          </div>
        ))}
      </div>

      <div className="absolute bottom-1 inset-x-6 flex justify-between pointer-events-none opacity-30 select-none">
        <span className="font-mono text-[7px] text-slate-500">FORMAT // 24P</span>
        <span className="font-mono text-[7px] text-slate-500">AUDIO // MUTED</span>
      </div>
    </motion.div>
  );
}
