"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusSplitMarqueeBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const marqueeText1 = theme?.customTexts?.nexus_marquee_1 || "BUILDING THE IMPOSSIBLE";
  const marqueeText2 = theme?.customTexts?.nexus_marquee_2 || "SYSTEMS OPERATIONAL";
  const profession = data?.profile?.profession || data?.profession || "CREATIVE ENGINEER";

  return (
    <section className="flex flex-col py-6 @lg:py-8 border-b nexus-border overflow-hidden bg-[var(--hl)]/5">
        <div className="relative flex whitespace-nowrap overflow-hidden group">
            <motion.div 
                animate={{ x: ["0%", "-50%"] }} 
                transition={{ repeat: Infinity, ease: "linear", duration: 25 }}
                className="flex items-center gap-8 font-display font-black text-2xl @md:text-4xl uppercase tracking-tighter text-[var(--hl)] opacity-80"
            >
                {/* Kita render 2 kali untuk efek seamless loop */}
                {[...Array(2)].map((_, idx) => (
                    <React.Fragment key={idx}>
                        {idx === 0 ? (
                            <EditableText value={marqueeText1} field="nexus_marquee_1" entity="appearance" isEditor={isEditor} as="span" maxLength={50} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto relative z-20" />
                        ) : (
                            <span className="whitespace-nowrap pointer-events-none">{marqueeText1}</span>
                        )}
                        <span className="text-white/20 whitespace-nowrap pointer-events-none">/</span>
                        <span className="text-white whitespace-nowrap pointer-events-none">{profession}</span>
                        <span className="text-white/20 whitespace-nowrap pointer-events-none">/</span>
                        {idx === 0 ? (
                            <EditableText value={marqueeText2} field="nexus_marquee_2" entity="appearance" isEditor={isEditor} as="span" maxLength={50} className="!break-normal !whitespace-nowrap inline-block pointer-events-auto relative z-20" />
                        ) : (
                            <span className="whitespace-nowrap pointer-events-none">{marqueeText2}</span>
                        )}
                        <span className="text-white/20 whitespace-nowrap pointer-events-none">/</span>
                        <span className="text-white whitespace-nowrap pointer-events-none">{profession}</span>
                        <span className="text-white/20 whitespace-nowrap pointer-events-none">/</span>
                    </React.Fragment>
                ))}
            </motion.div>
        </div>
    </section>
  );
}
