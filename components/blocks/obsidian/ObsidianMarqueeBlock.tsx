"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ObsidianMarqueeBlock({ data, theme, isEditor }: any) {
  const profession = data?.profile?.profession || data?.profession || "Filmmaker & Visual Artist";
  const animationTrigger = isEditor ? "animate" : "whileInView";

  const revealVariants: any = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const marqueeItems = [
    { type: 'fixed', text: profession },
    { type: 'editable', field: 'obs_marquee_1', default: 'Creative Thinker' },
    { type: 'editable', field: 'obs_marquee_2', default: 'Available for work' },
  ];

  return (
    <motion.div
      initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
      variants={revealVariants}
      className="w-full border-t border-b border-[rgba(255,255,255,0.08)] py-5 overflow-hidden bg-[#050505]"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-12 px-6 shrink-0">
            {[...Array(4)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <React.Fragment key={`${groupIndex}-${index}`}>
                    <span className="font-heading text-sm font-medium tracking-[0.2em] uppercase text-[#8a8a93] hover-accent transition-colors duration-300">
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
                    <span className="text-[#8a8a93] opacity-40">◆</span>
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
