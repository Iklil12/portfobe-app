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
      initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }}
      variants={getStaggerContainer(0, 0.15)}
      className="border-b border-gray-200"
    >
      <div className="w-full">
        {/* Text Content */}
        <div className="p-8 @md:p-12 flex flex-col justify-center">
          <motion.p variants={cinematicBlurUp} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-4 min-heading">
            <EditableText value={theme?.customTexts?.min_about_label || 'About'} field="min_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} className="min-heading" />
          </motion.p>
          <motion.h2 variants={cinematicBlurUp} className="text-2xl @md:text-3xl font-black tracking-tighter uppercase leading-tight mb-6 min-heading">
            <EditableText value={theme?.customTexts?.min_about_title || 'A meticulous approach to every detail.'} field="min_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} className="min-heading" />
          </motion.h2>
          <motion.div variants={cinematicBlurUp} className="text-gray-500 text-sm leading-relaxed min-body">
            <EditableText value={theme?.customTexts?.min_about_desc || 'I believe in the power of restraint. Every project begins with deep research, moves through iterative design, and ends with pixel-perfect execution. The goal is always clarity — removing the unnecessary until only the essential remains.'} field="min_about_desc" entity="appearance" isEditor={isEditor} as="p" maxLength={400} className="min-body" />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};
