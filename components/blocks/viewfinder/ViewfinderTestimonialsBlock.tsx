"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';

export function ViewfinderTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  if (!testimonials.length) return null;

  const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-2xl' : 'rounded-md';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClassLight = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-white shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-white border-2 border-[#050505] shadow-[6px_6px_0_0_#050505]' : 'bg-white border-2 border-[#050505]';

  return (
    <div className="w-full flex flex-col py-16 px-6 @md:px-12 @lg:px-20 bg-[#F3F3F1] shrink-0">
      <div className="max-w-4xl mx-auto w-full">
        <motion.h3
            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
            className="text-[10px] font-bold uppercase tracking-widest mb-6 bg-[#050505] text-[#F3F3F1] inline-block px-4 py-2"
        >
            <EditableText value={theme?.customTexts?.vf_reviews_title || 'CLIENT REVIEWS'} field="vf_reviews_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
        </motion.h3>
        
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-6">
            {testimonials.map((t: any, i: number) => (
                <motion.div
                    key={t.id || i}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                    className={`p-8 flex flex-col relative ${cardStyleClassLight} ${cardRadiusClass}`}
                >
                    <div className="absolute top-4 right-4 flex gap-1">
                        {[...Array(5)].map((_, idx) => (
                            <i key={idx} className={`text-[10px] ${idx < t.rating ? 'fas fa-star text-[var(--primary)]' : 'far fa-star text-gray-300'}`}></i>
                        ))}
                    </div>
                    <p className="vf-body text-xs @md:text-sm text-gray-600 italic mb-8 leading-relaxed relative z-10 mt-4">
                        "{t.content}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto">
                        <div className="w-10 h-10 border border-[#050505] overflow-hidden shrink-0">
                            {t.avatarUrl ? (
                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale" />
                            ) : (
                                <div className="w-full h-full bg-[#050505] flex items-center justify-center font-bold text-white text-[12px]">
                                    {t.clientName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="font-bold text-[10px] text-[#050505] uppercase tracking-widest">{t.clientName}</h4>
                            {t.company && <p className="vf-body text-[8px] uppercase tracking-[0.2em] text-[var(--primary)] mt-1 font-bold">{t.company}</p>}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
      </div>
    </div>
  );
}
