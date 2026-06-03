"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function SpatialTestimonialsBlock({ data, theme, isMobileView, isCardPreview, isEditor }: any) {
  const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

  if (testimonials.length === 0 && !isEditor) return null;

  const xlCardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[48px]' : 'rounded-[32px]';
  const cardStyle = theme?.cardStyle || 'flat';
  const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0f1115] shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/20 shadow-[8px_8px_0_0_#ffffff]' : 'glass-panel border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]';

  const auraAnim = isCardPreview
      ? { hidden: { opacity: 1, y: 0, filter: "blur(0px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)" } }
      : { hidden: { opacity: 0, y: 40, filter: "blur(10px)" }, visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 1, ease: [0.16, 1, 0.3, 1] as any } } };
  const viewAnim = isCardPreview
      ? { initial: "visible" as const, animate: "visible" as const }
      : { initial: "hidden" as const, whileInView: "visible" as const, viewport: { once: true, amount: 0.1 } };

  return (
    <div className={`flex flex-col w-full mt-24 @md:mt-32 px-8`}>
        <motion.div {...viewAnim} variants={auraAnim} className="mb-8">
            <h2 className={`font-medium tracking-tight text-white text-4xl`}>
                <EditableText value={theme?.customTexts?.spatial_testimonials_title || 'Client Voices'} field="spatial_testimonials_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
        </motion.div>

        {testimonials.length === 0 && isEditor && (
            <div className={`w-full p-12 ${cardStyleClass} ${xlCardRadiusClass} flex flex-col items-center justify-center text-center opacity-70`}>
                <i className="fas fa-comment-dots text-4xl text-slate-500 mb-4"></i>
                <p className="text-slate-400">Tambahkan testimoni untuk menampilkannya di sini.</p>
            </div>
        )}

        <div className="grid grid-cols-1 @md:grid-cols-2 gap-8">
            {testimonials.map((t: any) => (
                <motion.div
                    key={t.id}
                    {...viewAnim} variants={auraAnim}
                    className={`${cardStyleClass} p-8 ${xlCardRadiusClass} flex flex-col gap-6 relative overflow-hidden group hover:border-[var(--hl)]/30 transition-colors`}
                >
                    <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-[var(--hl)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <p className="text-slate-300 italic text-base @md:text-lg leading-relaxed font-light">
                        "{t.content}"
                    </p>
                    <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                        <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-white/10">
                            {t.avatarUrl ? (
                                <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-white/5 flex items-center justify-center font-bold text-white text-lg">
                                    {t.clientName.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col">
                            <h4 className="font-semibold text-white group-hover:text-[var(--hl)] transition-colors">{t.clientName}</h4>
                            {t.company && <p className="text-[10px] uppercase tracking-widest text-slate-500 mt-1">{t.company}</p>}
                        </div>
                        <div className="ml-auto flex gap-1">
                            {[...Array(5)].map((_, idx) => (
                                <i key={idx} className={`text-[10px] ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                            ))}
                        </div>
                    </div>
                </motion.div>
            ))}
        </div>
    </div>
  );
}
