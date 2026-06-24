"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

const premiumEase = [0.16, 1, 0.3, 1] as const;

const cinematicBlurUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (customDelay = 0) => ({
    opacity: 1,
    y: 0,
    
    transition: { duration: 1.4, ease: premiumEase, delay: customDelay }
  })
};

const getStaggerContainer = (delayStart = 0, staggerGap = 0.15) => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: staggerGap, delayChildren: delayStart }
  }
});

export const MinimalistAboutBlock = ({ data, theme, isEditor }: any) => {
  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <motion.section
      initial="hidden"
      {...{ [animationTrigger]: "visible" }}
      viewport={{ once: true, amount: 0.1 }}
      variants={getStaggerContainer(0, 0.15)}
      className="border-b border-gray-200 bg-white"
    >
      <div className="w-full py-20 @md:py-28 px-8 @md:px-12 @lg:px-16">
        <div className="grid grid-cols-1 @lg:grid-cols-12 gap-8 @lg:gap-12 items-stretch">
          
          {/* Left Column: Label & Decorative Year */}
          <div className="@lg:col-span-3 flex @lg:flex-col justify-between items-start @lg:border-r @lg:border-gray-100 @lg:pr-8 pb-4 @lg:pb-0">
            <motion.p variants={cinematicBlurUp} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 min-heading">
              <EditableText value={theme?.customTexts?.min_about_label || 'About'} field="min_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="min-heading" />
            </motion.p>
            
            <motion.div variants={cinematicBlurUp} className="hidden @lg:block font-mono text-[9px] text-gray-400 uppercase tracking-widest mt-auto">
              <EditableText value={theme?.customTexts?.min_about_year || `Est. ${new Date().getFullYear()}`} field="min_about_year" entity="appearance" isEditor={isEditor} as="span" maxLength={10} className="min-body" />
            </motion.div>
          </div>

          {/* Right Column: Heading & Description */}
          <div className="@lg:col-span-9 @lg:pl-8 flex flex-col justify-center">
            <motion.h2 variants={cinematicBlurUp} className="text-2xl @md:text-3xl @lg:text-4xl font-black tracking-tighter uppercase leading-tight mb-6 min-heading text-gray-900 max-w-3xl">
              <EditableText value={theme?.customTexts?.min_about_title || 'A meticulous approach to every detail.'} field="min_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} className="min-heading" />
            </motion.h2>
            
            <motion.div variants={cinematicBlurUp} className="text-gray-500 text-sm @md:text-base leading-relaxed min-body font-light max-w-2xl">
              <EditableText value={theme?.customTexts?.min_about_desc || 'I believe in the power of restraint. Every project begins with deep research, moves through iterative design, and ends with pixel-perfect execution. The goal is always clarity — removing the unnecessary until only the essential remains.'} field="min_about_desc" entity="appearance" isEditor={isEditor} as="p" maxLength={400} className="min-body" />
            </motion.div>
          </div>

        </div>
      </div>
    </motion.section>
  );
};
