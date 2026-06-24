"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function SpatialAboutBlock({ data, theme, isEditor, isCardPreview }: any) {
  const rawAvatar = data?.profile?.avatarUrl || data?.avatarUrl || data?.user?.avatar || data?.avatar || "";
  const cleanAvatar = rawAvatar.replace(/"/g, '').trim();
  const displayAvatar = (cleanAvatar !== "" && cleanAvatar !== "null") ? cleanAvatar : `https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop`;

  const radiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-full' : 'rounded-[24px]';

  const auraAnim = isCardPreview
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const staggerContainer = isCardPreview
    ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
    : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.15 } } };

  return (
    <motion.section
      initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.1 }}
      variants={staggerContainer}
      id="about"
      className="w-full px-8 py-20 @md:py-32 max-w-[1360px] mx-auto"
    >
      <div className="flex flex-col @lg:flex-row gap-16 @lg:gap-24 items-center">
        {/* Image Side */}
        <motion.div variants={auraAnim} className="flex-1 w-full max-w-lg">
          <div className={`glass-panel p-2 ${radiusClass} border border-white/10 overflow-hidden`}>
            <div className={`w-full aspect-[4/5] overflow-hidden ${radiusClass}`}>
              <LazyImage src={displayAvatar} alt="About" className="w-full h-full object-cover brightness-90 contrast-110" />
            </div>
          </div>
        </motion.div>

        {/* Text Side */}
        <div className="flex-1 w-full">
          <motion.div variants={auraAnim} className={`inline-flex items-center gap-2 px-4 py-2 ${radiusClass} glass-panel mb-6`}>
            <span className="text-xs font-medium text-slate-300">
              <EditableText value={theme?.customTexts?.spatial_about_label || 'About Me'} field="spatial_about_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
            </span>
          </motion.div>

          <motion.h2 variants={auraAnim} className="font-semibold tracking-[-0.03em] text-gradient leading-tight text-4xl @md:text-5xl mb-8">
            <EditableText value={theme?.customTexts?.spatial_about_title || 'Crafting clarity from complexity.'} field="spatial_about_title" entity="appearance" isEditor={isEditor} as="span" maxLength={60} />
          </motion.h2>

          <motion.div variants={auraAnim} className="text-slate-400 text-lg leading-relaxed mb-8">
            <EditableText value={theme?.customTexts?.spatial_about_desc || 'I specialize in translating complex ideas into clean, intuitive digital experiences. With a background spanning engineering and design, I bring a holistic perspective to every project — bridging the gap between aesthetics and functionality.'} field="spatial_about_desc" entity="appearance" isEditor={isEditor} as="p" maxLength={400} />
          </motion.div>

          <motion.div variants={auraAnim} className="w-full h-px bg-gradient-to-r from-white/20 to-transparent"></motion.div>
        </div>
      </div>
    </motion.section>
  );
}
