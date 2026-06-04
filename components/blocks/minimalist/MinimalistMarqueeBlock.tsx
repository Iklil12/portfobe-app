"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40, filter: "blur(12px)" },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

export const MinimalistMarqueeBlock = ({ data, theme, isEditor }: any) => {
  const profession = data?.profile?.profession || data?.profession || "Director & Editor";
  const animationTrigger = isEditor ? "animate" : "whileInView";

  const marqueeItems = [
    { type: 'fixed', text: profession },
    { type: 'editable', field: 'min_marquee_1', default: 'Creative Thinker' },
    { type: 'editable', field: 'min_marquee_2', default: 'Available for work' },
  ];

  return (
    <motion.div
      initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
      variants={cinematicBlurUp}
      className="w-full border-b border-gray-200 py-4 overflow-hidden"
    >
      <div className="flex animate-marquee text-[10px] font-bold uppercase tracking-[0.3em] text-gray-300 whitespace-nowrap">
        {[...Array(2)].map((_, blockIndex) => (
          <div key={blockIndex} className="flex items-center gap-8 px-4 shrink-0">
            {[...Array(4)].map((_, groupIndex) => (
              <React.Fragment key={groupIndex}>
                {marqueeItems.map((item, index) => (
                  <React.Fragment key={`${groupIndex}-${index}`}>
                    <span className="hover:text-black transition-colors">
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
                    <span className="text-gray-200">●</span>
                  </React.Fragment>
                ))}
              </React.Fragment>
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  );
};
