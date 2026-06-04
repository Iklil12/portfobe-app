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
      className="w-full py-6 overflow-hidden"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-10 px-5 shrink-0">
            {[...Array(4)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <React.Fragment key={`${groupIndex}-${index}`}>
                    <span className="text-sm font-medium text-slate-500 tracking-wide hover:text-white transition-colors duration-300">
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
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)] opacity-60 shrink-0"></span>
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
