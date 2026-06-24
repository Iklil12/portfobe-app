"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function ObsidianTestimonialsBlock({ data, theme, isEditor }: any) {
  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  if (testimonials.length === 0 && !isEditor) return null;
  const displayItems = testimonials.length > 0 ? testimonials : [{ content: 'This is a sample testimonial.', clientName: 'John Doe', position: 'CEO', company: 'Acme Corp' }];

  const getCardShapeClass = (style?: string) => {
      if (style === 'hard-shadow' || style === 'hard') {
          return 'rounded-none border-2 border-[rgba(255,255,255,0.2)] shadow-[6px_6px_0_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:border-[var(--brand-accent)] hover:shadow-[6px_6px_0_0_var(--brand-accent)]';
      }
      if (style === 'flat') {
          return 'rounded-none border border-[rgba(255,255,255,0.1)] hover:border-[var(--brand-accent)] transition-colors duration-300';
      }
      if (style === 'soft-shadow' || style === 'soft') {
          return 'rounded-2xl border border-[rgba(255,255,255,0.05)] shadow-xl hover:shadow-[0_8px_30px_rgb(255,255,255,0.1)] transition-all duration-300';
      }
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.cardStyle);

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
    <section className="py-16 md:py-24 px-6 border-t border-[rgba(255,255,255,0.1)]">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={revealVariants} viewport={{ once: true, amount: 0 }} className="md:col-span-4">
                <span className="font-body text-sm text-[#8a8a93] uppercase tracking-widest mb-4 block">
                    <EditableText value={theme?.customTexts?.obs_testimonials_label || 'Voices'} field="obs_testimonials_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </span>
                <h2 className="font-heading text-4xl md:text-5xl font-medium">
                    <EditableText value={theme?.customTexts?.obs_testimonials_title || 'Client Feedback'} field="obs_testimonials_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </h2>
            </motion.div>
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} variants={staggerReveal} viewport={{ once: true, amount: 0 }} className="md:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                {displayItems.map((t: any, i: number) => (
                    <motion.div key={i} variants={revealVariants} className={`p-8 bg-[#050505] border border-[rgba(255,255,255,0.05)] ${cardShape} flex flex-col justify-between group hover:border-[var(--brand-accent)] transition-colors duration-300`}>
                        <div>
                            <i className="fas fa-quote-left text-2xl text-[var(--brand-accent)] opacity-50 mb-6 block"></i>
                            <p className="font-body text-lg text-[#d1d1d6] leading-relaxed mb-8">"{t.content}"</p>
                        </div>
                        <div className="flex items-center gap-4 mt-2">
                            {t.avatarUrl || t.avatar ? (
                                <LazyImage src={t.avatarUrl || t.avatar} alt={t.clientName || t.name || 'Client'} className="w-12 h-12 rounded-full object-cover border border-white/10" />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-white/40 border border-white/10 uppercase font-medium">
                                    {(t.clientName || t.name || 'U').charAt(0)}
                                </div>
                            )}
                            <div>
                                <h4 className="font-heading text-lg font-medium text-white">{t.clientName || t.name || 'Anonymous Client'}</h4>
                                <p className="font-body text-[#8a8a93] text-sm">{t.position || ''} {t.company ? `${t.position ? 'at ' : ''}${t.company}` : ''}</p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </div>
    </section>
  );
}
