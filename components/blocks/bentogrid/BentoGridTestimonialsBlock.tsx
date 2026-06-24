"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';

export function BentoGridTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    const cardStyle = theme?.cardStyle || 'flat';
    const cardStyleClass = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#121214] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#1a1a1d] border-2 border-white shadow-[6px_6px_0_0_#fff]' : 'bg-[#1a1a1d] border border-white/5 shadow-md';
    const cardRadiusClass = theme?.buttonShape === 'hard' || theme?.buttonShape === 'square' ? 'rounded-none' : theme?.buttonShape === 'pill' ? 'rounded-[32px]' : 'rounded-[24px]';

    const bentoAnim = {
        hidden: { opacity: 0, y: 30, scale: 0.97 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 90, damping: 20, mass: 1 } as any }
    };

    return (
        <div className="grid gap-4 @lg:gap-6 grid-cols-1 @md:grid-cols-2 @lg:grid-cols-3 w-full">
            
            {/* Title Card */}
            <motion.div 
                initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-8 flex flex-col justify-between min-h-[220px] relative overflow-hidden`}
            >
                <div className="absolute right-[-10%] bottom-[-10%] opacity-[0.02] pointer-events-none select-none text-[6rem] font-black tracking-widest uppercase font-mono">
                    VOX
                </div>
                
                <div className="flex items-center justify-between z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[var(--hl)]">
                        <i className="fas fa-comment-dots text-sm"></i>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                        Node.08 // Feedback
                    </span>
                </div>

                <div className="mt-6 z-10">
                    <h3 className="text-xl font-sans font-black text-white leading-tight uppercase tracking-tight">
                        Client Voices
                    </h3>
                    <p className="text-[9px] font-mono text-slate-400 mt-2 uppercase tracking-wider">
                        {testimonials.length} VERIFIED REVIEWS
                    </p>
                </div>
            </motion.div>

            {/* Testimonial Cards */}
            {testimonials.map((t: any, i: number) => (
                <motion.div 
                    key={t.id}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0.1, margin: "-50px" }} variants={bentoAnim} 
                    className={`bento-card ${cardStyleClass} ${cardRadiusClass} p-6 flex flex-col justify-between min-h-[220px] relative group overflow-hidden`}
                >
                    {/* Hover Glow */}
                    <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-0 group-hover:opacity-[0.06] transition-opacity duration-300 bg-[var(--hl)]" />

                    <div className="flex items-center gap-4 border-b border-white/5 pb-4 z-10">
                        {t.avatarUrl ? (
                            <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-12 h-12 rounded-full object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300" />
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center font-bold text-lg text-white">
                                {t.clientName.charAt(0)}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <h4 className="font-extrabold text-white text-sm leading-tight uppercase tracking-tight">{t.clientName}</h4>
                            {t.company && <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono font-bold mt-1">{t.company}</span>}
                        </div>
                    </div>

                    <div className="my-4 z-10 flex-1 flex flex-col justify-center">
                        <p className="text-xs text-slate-400 italic leading-relaxed">
                            "{t.content}"
                        </p>
                    </div>

                    <div className="pt-3 border-t border-white/5 z-10 flex justify-between items-center">
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, idx) => (
                                <i key={idx} className={`text-[8px] ${idx < t.rating ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/10'}`}></i>
                            ))}
                        </div>
                        <span className="text-[8px] font-mono text-slate-600 uppercase">verified</span>
                    </div>
                </motion.div>
            ))}

        </div>
    );
}
