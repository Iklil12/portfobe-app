"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/components/ui/LazyImage';
import { EditableText } from '@/components/ui/EditableText';

export function AcidTechTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    const cardStyle = theme?.cardStyle || 'hard-shadow';
    const buttonShape = theme?.buttonShape || 'hard';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-2xl' : buttonShape === 'rounded' ? 'rounded-lg' : 'rounded-none';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const testimonialStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-transparent' : cardStyle === 'flat' ? 'bg-[#09090b] border-4 border-[#09090b]' : 'bg-[#09090b] border-4 border-[#09090b] hover:shadow-[10px_10px_0px_var(--theme-color)]';

    const rawThemeColor = theme?.themeColor || "#DFFF00";
    const themeColor = /^#([0-9A-Fa-f]{3}){1,2}$/i.test(rawThemeColor) ? rawThemeColor : "#ff9e00";

    const acidEase = [0.22, 1, 0.36, 1] as any;
    const fadeUp = {
        hidden: { opacity: 0, y: 50 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: acidEase } }
    };

    if (testimonials.length === 0 && !isEditor) return null;

    return (
        <section className="bg-zinc-900 border-y-4 border-[#09090b] py-20 @md:py-24" id="testimonials">
            <div className="max-w-6xl mx-auto px-6 @md:px-12">
                <motion.h2 
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: false }} variants={fadeUp}
                    className={`acid-heading font-extrabold uppercase tracking-tighter mb-12 text-4xl @md:text-[clamp(3rem,6cqi,5rem)] acid-text`}
                >
                    <EditableText value={theme?.customTexts?.acid_testimonials_title || 'ENDORSEMENTS'} field="acid_testimonials_title" entity="appearance" isEditor={isEditor} as="span" />
                </motion.h2>

                {testimonials.length > 0 ? (
                    <div className="grid grid-cols-1 @lg:grid-cols-2 gap-6 @md:gap-10">
                        {testimonials.map((t: any, i: number) => (
                            <motion.div 
                                key={`testimonial-${t.id || i}`}
                                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, margin: "50px" }} variants={fadeUp}
                                className={`${testimonialStyleClass} ${cardRadiusClass} p-6 @md:p-10 hover:-translate-y-2 transition-all duration-300`}
                                style={{ '--theme-color': themeColor } as any}
                            >
                                <p className="font-medium text-lg @md:text-2xl leading-relaxed text-[#fafafa] italic mb-8 acid-body">
                                    "{t.content}"
                                </p>
                                <div className="flex items-center gap-4 pt-6 border-t-2 border-zinc-800">
                                    {t.avatarUrl ? (
                                        <LazyImage src={t.avatarUrl} alt={t.clientName} className={`w-14 h-14 ${radiusClass} border-2 border-zinc-600 grayscale object-cover`} />
                                    ) : (
                                        <div className={`w-14 h-14 bg-zinc-800 border-2 border-zinc-600 flex items-center justify-center font-bold text-xl uppercase acid-heading text-white ${radiusClass}`}>
                                            {t.clientName.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-extrabold text-white text-lg uppercase tracking-tight acid-heading">{t.clientName}</h4>
                                        {t.company && <p className="text-[10px] uppercase font-bold tracking-widest text-zinc-500 acid-body">{t.company}</p>}
                                    </div>
                                    <div className="ml-auto flex gap-1">
                                        {[...Array(5)].map((_, idx) => (
                                            <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star acid-text' : 'far fa-star text-zinc-700'}`}></i>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="py-10 text-center font-bold text-xs uppercase tracking-widest acid-body text-zinc-500">
                        System: No Testimonials Found
                    </div>
                )}
            </div>
        </section>
    );
}
