"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

export function AcidTechTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const testimonialStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-zinc-950/80 shadow-[0_20px_50px_rgba(0,0,0,0.8)] border-transparent' : cardStyle === 'flat' ? 'bg-black border border-zinc-800' : 'bg-black border border-zinc-800 hover:shadow-[6px_6px_0_0_var(--tc)]';

    const rawThemeColor = theme?.themeColor || "#00ff00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#00ff00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    if (testimonials.length === 0 && !isEditor) return null;

    return (
        <section className="w-full bg-black text-white py-24 border-y border-[var(--tc)]/20 font-mono" id="testimonials" style={{ '--tc': themeColor } as React.CSSProperties}>
            <div className="max-w-[90rem] mx-auto px-6 md:px-16 flex flex-col md:flex-row gap-16">
                <motion.div 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: false }} variants={fadeUp}
                    className="md:w-1/3"
                >
                    <span className="text-[var(--tc)] font-bold text-[10px] uppercase tracking-[0.2em] mb-2 block">[ CLIENT_ENDORSEMENTS ]</span>
                    <h2 className="font-extrabold uppercase tracking-tight text-4xl text-white">
                        <EditableText value={theme?.customTexts?.acid_testimonials_title || 'ENDORSEMENTS'} field="acid_testimonials_title" entity="appearance" isEditor={isEditor} as="span" />
                    </h2>
                </motion.div>

                <div className="md:w-2/3">
                    {testimonials.length > 0 ? (
                        <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 @md:gap-10">
                            {testimonials.map((t: any, i: number) => (
                                <motion.div 
                                    key={`testimonial-${t.id || i}`}
                                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                    className={`${testimonialStyleClass} ${cardRadiusClass} p-6 pt-10 @md:p-10 @md:pt-14 hover:-translate-y-1 transition-all duration-300 relative`}
                                >
                                    {/* Tab header simulated */}
                                    <div className="absolute top-0 left-0 right-0 h-5 bg-zinc-950 border-b border-zinc-900 px-3 py-1 flex justify-between items-center text-[7px] text-zinc-600">
                                        <span>FEEDBACK_NODE // 0{i + 1}</span>
                                        <span>RATING: {t.rating}.0/5.0</span>
                                    </div>

                                    <p className="text-sm md:text-base leading-relaxed text-zinc-400 italic mb-8">
                                        &gt; "{t.content}"
                                    </p>
                                    <div className="flex items-center gap-4 pt-6 border-t border-zinc-900">
                                        {t.avatarUrl ? (
                                            <LazyImage src={t.avatarUrl} alt={t.clientName} className={`w-12 h-12 ${radiusClass} border border-zinc-800 grayscale object-cover`} />
                                        ) : (
                                            <div className={`w-12 h-12 bg-zinc-950 border border-zinc-800 flex items-center justify-center font-bold text-lg uppercase text-[var(--tc)] ${radiusClass}`}>
                                                {t.clientName.charAt(0)}
                                            </div>
                                        )}
                                        <div>
                                            <h4 className="font-bold text-white text-sm uppercase tracking-wider">{t.clientName}</h4>
                                            {t.company && <p className="text-[9px] uppercase tracking-widest text-zinc-500 mt-0.5">{t.company}</p>}
                                        </div>
                                        <div className="ml-auto flex gap-1 text-[8px] text-[var(--tc)]">
                                            {[...Array(5)].map((_, idx) => (
                                                <i key={idx} className={`${idx < t.rating ? 'fas fa-star' : 'far fa-star text-zinc-800'}`}></i>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="py-10 text-center font-bold text-xs uppercase tracking-widest text-zinc-700">
                            System: No Testimonials Found
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
