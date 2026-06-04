"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function MidnightEmulsionTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  const canvasEase = [0.22, 1, 0.36, 1] as any;
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 1, ease: canvasEase } }
  };

  if (!testimonials.length) return null;

  return (
    <div className="w-full p-8 @md:p-12 @lg:p-20 flex flex-col border-b border-white/5 bg-[#030508]/40 shrink-0">
      <div className="max-w-7xl mx-auto w-full">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16">
          <span className="font-sans text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--hl)] mb-4 block">
            <EditableText value={theme?.customTexts?.midnight_testi_top || 'Client Experience'} field="midnight_testi_top" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
          </span>
          <h2 className="font-serif text-4xl @md:text-6xl text-white uppercase tracking-wide">
            <EditableText value={theme?.customTexts?.midnight_testi_title || 'Endorsements'} field="midnight_testi_title" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
          </h2>
        </motion.div>
        
        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12">
          {testimonials.map((t: any, i: number) => (
            <motion.div
              key={t.id || i}
              initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
              className="group flex flex-col p-10 @md:p-12 border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500 rounded-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-1 h-full bg-[var(--hl)] transform scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-top z-0"></div>
              
              <div className="text-[var(--hl)] opacity-20 font-serif text-6xl absolute top-6 right-8">"</div>
              
              <p className="font-serif italic text-xl @md:text-2xl text-slate-300 leading-relaxed mb-12 relative z-10">
                "{t.content}"
              </p>
              
              <div className="flex items-center gap-6 relative z-10 mt-auto border-t border-white/10 pt-8">
                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-white/20">
                  {t.avatarUrl ? (
                    <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-500" />
                  ) : (
                    <div className="w-full h-full bg-white/10 flex items-center justify-center font-sans font-bold text-white text-xl">
                      {t.clientName.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  <h4 className="font-sans font-bold text-white group-hover:text-[var(--hl)] transition-colors tracking-wide">{t.clientName}</h4>
                  {t.company && <p className="font-sans text-[10px] uppercase tracking-widest text-slate-500">{t.company}</p>}
                </div>
                <div className="ml-auto flex gap-1.5">
                  {[...Array(5)].map((_, idx) => (
                    <i key={idx} className={`text-[10px] ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
