"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function ViewfinderTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
  const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";
  const cinematicEase = [0.16, 1, 0.3, 1] as any;
  const fadeUpVariants = {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0, transition: { duration: 1, ease: cinematicEase } }
  };

  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  if (!testimonials.length) return null;

  return (
    <div id="testimonials" className="w-full flex flex-col py-24 bg-[#050505] text-white border-b border-white/10 shrink-0 @container relative overflow-hidden">
      {/* Background HUD Scope Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.01)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.01)_1px,transparent_1px)] bg-[size:40px_40px] z-0 pointer-events-none" />

      {/* Header Container - Satellite Telemetry Monitor Header */}
      <div className="w-full relative z-10 px-6 @md:px-12 @lg:px-20 mb-16">
        <div className="w-full flex flex-col md:flex-row justify-between items-start md:items-end gap-6 select-none border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 font-mono text-[8px] text-slate-500 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-ping"></span>
              <span>FEED STATUS // LIVE SATELLITE</span>
            </div>
            <div className="relative border border-white/20 px-6 py-4 rounded-sm bg-white/[0.01] inline-block">
              {/* Corner focus brackets */}
              <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[var(--primary)]"></div>
              <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[var(--primary)]"></div>
              <h2 className="font-cinema text-4xl @md:text-6xl text-white uppercase tracking-widest leading-none">
                Reviews
              </h2>
            </div>
          </div>
          {/* Metadata ledger details */}
          <div className="flex flex-col items-start md:items-end font-mono text-[8px] text-slate-500 uppercase tracking-[0.2em] gap-1">
            <span>DISP_MODE // HORIZ_TRACK</span>
            <span className="text-[var(--primary)] font-bold">
              <EditableText value={theme?.customTexts?.vf_reviews_title || 'LOG_SYS // REVIEWS'} field="vf_reviews_title" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
            </span>
          </div>
        </div>
      </div>
      
      {/* Testimonial Cards Horizontal Scroll - Full Width track */}
      <div className="w-full overflow-hidden mt-4 relative z-10">
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x snap-mandatory max-w-[100vw] no-scrollbar px-6 @md:px-12 @lg:px-20">
            {testimonials.map((t: any, i: number) => (
                <motion.div
                    key={t.id || i}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUpVariants}
                    className="group bg-[#0b0b0d]/80 border border-white/10 hover:border-[var(--primary)] rounded p-6 @md:p-8 flex flex-col relative transition-all duration-500 shadow-2xl select-none flex-none w-[85vw] @md:w-[45vw] max-w-[420px] snap-center"
                >
                    {/* Viewfinder crosshairs or corners inside card */}
                    <div className="absolute inset-4 border border-white/0 group-hover:border-white/[0.02] transition-colors pointer-events-none rounded">
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-white/10 group-hover:border-white/30"></div>
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-white/10 group-hover:border-white/30"></div>
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-white/10 group-hover:border-white/30"></div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-white/10 group-hover:border-white/30"></div>
                    </div>

                    {/* Telemetry info row in card */}
                    <div className="flex justify-between items-center font-mono text-[8px] text-slate-500 uppercase tracking-widest border-b border-white/5 pb-3 mb-5 select-none pointer-events-none">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                        <span>FEED_0{i + 1} // LIVE</span>
                      </div>
                      <span className="text-[var(--primary)] font-bold">RATING // {t.rating}.0★</span>
                    </div>

                    {/* Testimonial quote content */}
                    <p className="vf-body text-xs @md:text-sm text-[#F3F3F1]/80 italic mb-8 leading-relaxed relative z-10 mt-1 text-justify font-medium">
                        "{t.content}"
                    </p>

                    {/* Author client info */}
                    <div className="flex items-center gap-4 mt-auto">
                        <div className="w-10 h-10 border border-white/20 rounded-full overflow-hidden shrink-0 relative shadow-inner">
                            {t.avatarUrl ? (
                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                            ) : (
                                <div className="w-full h-full bg-[#050505] flex items-center justify-center font-bold text-white text-[12px] font-mono">
                                    {t.clientName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="font-bold text-[10px] text-white uppercase tracking-widest font-mono leading-none">{t.clientName}</h4>
                            {t.company && (
                              <p className="vf-body text-[8px] uppercase tracking-[0.2em] text-[var(--primary)] mt-1.5 font-bold">
                                {t.company}
                              </p>
                            )}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
        {/* Swipe guide indicator */}
        <div className="w-full flex justify-center items-center gap-3 mt-4 font-mono text-[8px] text-slate-500 uppercase tracking-[0.3em] select-none pointer-events-none">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
          <span className="animate-pulse">&lt;&lt; SWIPE TO VIEW REVIEWS &gt;&gt;</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-pulse"></span>
        </div>
      </div>
    </div>
  );
}
