"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function NexusSplitAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1, delayChildren: 0.1 }
      }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 30, filter: 'blur(5px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.8, ease: nexusEase } }
  };

  const highlightColor = theme?.themeColor || '#4f46e5';

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.2 }} variants={staggerContainer}
        className="flex flex-col pt-16 @lg:pt-24 pb-20 border-b border-white/5 bg-black relative px-6 @md:px-12 overflow-hidden"
    >
        {/* Title Block */}
        <motion.div variants={itemFadeUp} className="mb-10 flex flex-col gap-1.5 select-none relative z-10">
            <span className="font-mono text-[9px] text-neutral-500 uppercase tracking-[0.3em]">
              // PROFILE_CORE_STATEMENT
            </span>
            <h2 className="font-display font-black text-3xl @lg:text-5xl text-white uppercase tracking-tight">
                <EditableText value={theme?.customTexts?.nexus_about_title || 'System Core'} field="nexus_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
        </motion.div>

        {/* 2-Column Grid Layout */}
        <div className="grid grid-cols-1 @xl:grid-cols-12 gap-10 @xl:gap-12 w-full max-w-5xl items-center relative z-10">
            
            {/* Left Column: Typographic bio text */}
            <motion.div variants={itemFadeUp} className="col-span-1 @xl:col-span-8 flex flex-col gap-6">
                <div 
                  className="font-sans font-light text-lg @lg:text-2xl text-neutral-200 leading-relaxed tracking-tight pl-6 border-l-2 transition-colors duration-500"
                  style={{ borderLeftColor: 'rgba(255,255,255,0.1)' }}
                  onMouseEnter={(e) => e.currentTarget.style.borderLeftColor = highlightColor}
                  onMouseLeave={(e) => e.currentTarget.style.borderLeftColor = 'rgba(255,255,255,0.1)'}
                >
                    <EditableText 
                      value={data?.profile?.about || data?.about || "I am a multi-disciplinary creator with a deep focus on building scalable systems and immersive experiences. Let's engineer the future together."} 
                      field="about" 
                      entity="profile" 
                      isEditor={isEditor} 
                      as="div" 
                      maxLength={1000} 
                    />
                </div>

                {/* Minimal status sequence tag */}
                <div className="flex gap-4 text-[9px] font-mono text-neutral-500 uppercase tracking-widest pl-6 select-none">
                    <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: highlightColor }}></span>
                        <span>CORE_INIT_OK</span>
                    </div>
                </div>
            </motion.div>

            {/* Right Column: High-end Minimalist CSS/SVG Telemetry Radar */}
            <motion.div variants={itemFadeUp} className="col-span-1 @xl:col-span-4 flex justify-center items-center">
                <div className="relative w-48 h-48 @md:w-56 @md:h-56 flex items-center justify-center select-none pointer-events-none">
                    {/* Outer slow dashed ring */}
                    <div className="absolute inset-0 border border-dashed border-white/10 rounded-full animate-[spin_60s_linear_infinite]" />
                    
                    {/* Inner counter-rotating ring with notch */}
                    <div className="absolute inset-6 border border-white/5 border-t-white/20 rounded-full animate-[spin_20s_linear_infinite_reverse]" />
                    
                    {/* Tiny orbit dot container */}
                    <div className="absolute inset-12 animate-[spin_10s_linear_infinite]">
                        <div className="w-1 h-1 rounded-full absolute -top-0.5 left-1/2 -translate-x-1/2" style={{ backgroundColor: highlightColor }} />
                    </div>

                    {/* Glowing core dot */}
                    <div className="w-2.5 h-2.5 rounded-full shadow-[0_0_15px_var(--hl)] transition-transform duration-500 scale-100 hover:scale-125" style={{ backgroundColor: highlightColor, shadowColor: highlightColor } as any} />
                    
                    {/* Clean crosshairs lines */}
                    <div className="absolute w-[80%] h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="absolute h-[80%] w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
                    
                    {/* Corner coordinates markings */}
                    <span className="absolute top-4 left-4 font-mono text-[7px] text-neutral-600 tracking-wider">RDR // 08-B</span>
                    <span className="absolute bottom-4 right-4 font-mono text-[7px] text-neutral-600 tracking-wider">SYS_LOCK // OK</span>
                </div>
            </motion.div>

        </div>
    </motion.section>
  );
}
