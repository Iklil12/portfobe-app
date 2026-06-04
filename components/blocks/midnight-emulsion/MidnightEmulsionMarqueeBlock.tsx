"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionMarqueeBlock({ data, theme, isEditor }: any) {
  const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";
  const animationTrigger = isEditor ? "animate" : "whileInView";

  const marqueeItems = [
    { type: 'fixed', text: profession },
    { type: 'editable', field: 'mid_marquee_1', default: 'Creative Vision' },
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
      className="w-full border-b border-white/5 py-4 overflow-hidden bg-[#030508]"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-12 px-6 shrink-0">
            {[...Array(4)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <React.Fragment key={`${groupIndex}-${index}`}>
                    <span className="font-serif text-lg md:text-xl uppercase tracking-[0.2em] text-[#e2e8f0] hover:text-[var(--hl)] transition-colors duration-500">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0"></span>
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
