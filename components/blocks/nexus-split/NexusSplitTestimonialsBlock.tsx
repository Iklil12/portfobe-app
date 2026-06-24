"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function NexusSplitTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  if (testimonials.length === 0) return null;

  const buttonShape = theme?.buttonShape || 'rounded';
  const cardRadiusClass = buttonShape === 'square' || buttonShape === 'hard' ? 'rounded-none' : buttonShape === 'pill' ? 'rounded-3xl' : 'rounded-2xl';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_20px_50px_rgba(255,255,255,0.05)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : 'bg-white/[0.02] border border-white/10 hover:border-white/20';

  const nexusEase = [0.16, 1, 0.3, 1] as any;
  const staggerContainer = {
      hidden: { opacity: 0 },
      visible: { opacity: 1, transition: { staggerChildren: 0.15 } }
  };
  const itemFadeUp = {
      hidden: { opacity: 0, y: 40, filter: 'blur(10px)' },
      visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1, ease: nexusEase } }
  };
  const cardVariants = {
      hidden: { opacity: 0, y: 30, scale: 0.98 },
      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.8, ease: nexusEase } }
  };

  return (
    <motion.section 
        initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1 }} variants={staggerContainer}
        className="flex flex-col pt-16 @lg:pt-24 pb-16 border-b nexus-border"
    >
        <motion.div variants={itemFadeUp} className={`mb-10 px-6 @md:px-12`}>
            <h2 className="font-display font-extrabold text-4xl @lg:text-6xl text-white">
                <EditableText value={theme?.customTexts?.nexus_testi_title || 'Client Feedback'} field="nexus_testi_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </h2>
        </motion.div>
        <div className="flex flex-col w-full px-6 @md:px-12 gap-6">
            {testimonials.map((t: any, i: number) => (
                <motion.div
                    key={t.id}
                    variants={cardVariants}
                    className={`p-8 flex flex-col gap-6 transition-colors ${cardRadiusClass} ${cardStyleClass}`}
                >
                    <p className="font-sans text-sm @md:text-lg text-slate-300 leading-relaxed font-medium">
                        "{t.content}"
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                        <div className="w-12 h-12 rounded-full overflow-hidden border border-white/20 shrink-0">
                            {t.avatarUrl ? (
                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-80" />
                            ) : (
                                <div className="w-full h-full bg-white/10 flex items-center justify-center font-bold text-white">
                                    {t.clientName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="font-display font-bold text-white uppercase tracking-wider">{t.clientName}</h4>
                            {t.company && <span className="font-sans text-[10px] uppercase tracking-widest text-[var(--hl)]">{t.company}</span>}
                        </div>
                        <div className="ml-auto flex gap-1">
                            {[...Array(5)].map((_, idx) => (
                                <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </motion.section>
  );
}
