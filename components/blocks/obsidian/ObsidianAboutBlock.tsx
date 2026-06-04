"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export function ObsidianAboutBlock({ data, theme, isEditor }: any) {
  const awardItems = data?.certificates || data?.user?.certificates || [];

  const revealVariants: any = {
      hidden: { opacity: 0, y: 30 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };
  
  const staggerReveal: any = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  return (
    <section id="about" className="py-24 px-6 border-t border-[rgba(255,255,255,0.1)] bg-[#050505]">
        <div className="max-w-screen-2xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-5">
                    <h2 className="font-heading text-3xl md:text-4xl font-medium mb-6">
                        <EditableText value={theme?.customTexts?.obs_about_title || 'About our studio'} field="obs_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={40} />
                    </h2>
                </motion.div>
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-7">
                    <p className="font-heading text-xl md:text-3xl font-light leading-snug text-gray-300">
                        <EditableText value={theme?.customTexts?.obs_about_desc || 'Founded by a passionate team of filmmakers, editors, and visual artists, our studio was born from a shared vision. With years of experience and a diverse portfolio, we have established ourselves as a leading force in the world of video production.'} field="obs_about_desc" entity="appearance" isEditor={isEditor} as="span" maxLength={300} />
                    </p>
                </motion.div>
            </div>
        </div>
    </section>
  );
}
