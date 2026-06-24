"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

export function CinematicTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    const buttonShape = theme?.buttonShape || 'hard';
    const cardStyle = theme?.cardStyle || 'hard';
    const radiusClass = buttonShape === 'pill' ? 'rounded-full' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardRadiusClass = buttonShape === 'pill' ? 'rounded-3xl' : buttonShape === 'rounded' ? 'rounded-2xl' : 'rounded-none';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#0a0a0a] shadow-[0_30px_60px_rgba(255,255,255,0.03)] border-transparent' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border border-white/30 shadow-[4px_4px_0_0_#fff]' : 'bg-black border border-[#1f1f1f] hover:border-white/20';

    if (testimonials.length === 0 && !isEditor) return null;

    return (
        <section className="bg-[#050505] border-t border-[#1f1f1f] py-20 @md:py-24 px-6 @md:px-12">
            <div className="flex justify-between items-end mb-12">
                <h2 className={`font-black uppercase tracking-tighter cine-heading text-[clamp(2.5rem,8cqi,5rem)]`}>
                    <EditableText value={theme?.customTexts?.cinematic_testimonials_title || 'Client Reviews'} field="cinematic_testimonials_title" entity="appearance" isEditor={isEditor} as="span" />
                    {' '}<span className="text-gray-600 text-xl @md:text-2xl">({testimonials.length})</span>
                </h2>
            </div>

            <div className="grid grid-cols-1 @md:grid-cols-2 gap-8 @md:gap-12">
                {testimonials.length > 0 ? testimonials.map((t: any, i: number) => (
                    <motion.div 
                        key={t.id || `testimonial-${i}`}
                        initial={{ opacity: 0, y: 30 }} 
                        {...{ [animationTrigger]: { opacity: 1, y: 0 } }} 
                        transition={{ duration: 0.6, delay: i * 0.1 }}
                        className={`group ${cardStyleClass} ${cardRadiusClass} transition-colors duration-700 p-8 @md:p-12`}
                    >
                        <div className="flex items-center gap-6 mb-8 border-b border-[#1f1f1f] pb-6 group-hover:border-white/20 transition-colors">
                            <div className={`w-16 h-16 shrink-0 bg-[#111] ${radiusClass} overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-700`}>
                                {t.avatarUrl ? (
                                    <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center font-bold text-xl text-white cine-heading">
                                        {t.clientName.charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <h4 className="font-black text-white text-xl uppercase tracking-tight cine-heading">{t.clientName}</h4>
                                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mt-1 cine-body">{t.company || 'CLIENT'}</span>
                            </div>
                        </div>
                        <p className="cine-body text-sm @md:text-lg text-gray-400 italic leading-relaxed mb-8 group-hover:text-white transition-colors duration-500">
                            "{t.content}"
                        </p>
                        <div className="flex gap-2 text-xs">
                            {[...Array(5)].map((_, idx) => (
                                <i key={idx} className={`${idx < t.rating ? 'fas fa-star text-white' : 'far fa-star text-white/20'}`}></i>
                            ))}
                        </div>
                    </motion.div>
                )) : (
                    isEditor && <div className="col-span-full py-10 text-center text-gray-600 font-mono text-xs uppercase tracking-widest">Add testimonials to preview</div>
                )}
            </div>
        </section>
    );
}
