"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';
import { LazyImage } from '@/components/ui/LazyImage';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const { radiusClass } = useContext(BrutalismContext);
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    const staggerContainer = {
        hidden: { opacity: 1 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    return (
        <section id="testimonials" className="w-full bg-[#f4f4f0] border-b-[3px] border-black font-mono">
            {/* Title Bar - Cyber Retro Window Style */}
            <div className="p-6 border-b-[3px] border-black bg-[var(--hl)] flex justify-between items-center text-black">
                <h2 className="custom-heading text-xl @xs:text-2xl @sm:text-4xl @md:text-5xl font-black uppercase tracking-tighter flex items-center gap-2">
                    <svg viewBox="0 0 24 24" className="w-6 h-6 @sm:w-8 @sm:h-8 fill-current shrink-0" xmlns="http://www.w3.org/2000/svg">
                        <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 9h12v2H6V9zm8 5H6v-2h8v2zm4-6H6V6h12v2z"/>
                    </svg>
                    <EditableText value={theme?.customTexts?.brutal_testimonials_title || 'CLIENT_RECORDS'} field="brutal_testimonials_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
                {/* Retro controls window */}
                <div className="flex items-center gap-1.5 hidden @sm:flex font-mono text-xs font-bold border-[3px] border-black bg-white p-1.5 shadow-[3px_3px_0px_0px_#000] select-none">
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">_</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-black hover:text-white cursor-pointer transition-colors duration-100">⧠</span>
                    <span className="w-6 h-6 flex items-center justify-center border-[2px] border-black bg-white hover:bg-red-500 hover:text-white cursor-pointer transition-colors duration-100">X</span>
                </div>
            </div>

            {/* Sub-bar / Info Toolbar */}
            <div className="w-full bg-white border-b-[3px] border-black px-4 @sm:px-6 py-2 flex justify-between items-center text-[9px] @sm:text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-neutral-50">
                <div className="flex items-center gap-2 @sm:gap-4">
                    <span><span className="hidden @xs:inline">DB: </span><span className="text-black">TESTIMONIALS</span></span>
                    <span>|</span>
                    <span>RECORDS: <span className="text-black">{testimonials.length}</span></span>
                </div>
                <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--hl)] animate-pulse border border-black"></span>
                    <span className="text-black">VERIFIED</span>
                </div>
            </div>

            <div className="p-4 @sm:p-8 @lg:p-12">
                <motion.div 
                    className="grid grid-cols-1 @md:grid-cols-2 @xl:grid-cols-3 gap-4 @sm:gap-8"
                    initial="hidden"
                    {...{ [animationTrigger]: "visible" }}
                    viewport={{ once: true, amount: 0 }}
                    variants={staggerContainer}
                >
                    {testimonials.map((t: any, index: number) => (
                        <motion.div 
                            key={t.id || index} 
                            variants={starkReveal}
                            className={`flex flex-col justify-between bg-white border-[3px] border-black p-4 @sm:p-6 shadow-[6px_6px_0px_0px_#000] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-[3px_3px_0px_0px_#000] transition-all rounded-none`}
                        >
                            <div>
                                {/* Client Info Header */}
                                <div className="flex items-center gap-3 @sm:gap-4 mb-3 pb-3 border-b border-dashed border-black/10">
                                    {t.avatarUrl ? (
                                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-10 h-10 @sm:w-12 @sm:h-12 border-2 border-black object-cover rounded-none" />
                                    ) : (
                                        <div className="w-10 h-10 @sm:w-12 @sm:h-12 border-2 border-black bg-black text-[var(--hl)] flex items-center justify-center font-black text-base @sm:text-lg rounded-none select-none">
                                            {t.clientName.charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div className="min-w-0">
                                        <h4 className="font-black text-sm uppercase truncate text-black">{t.clientName}</h4>
                                        {t.company && <p className="text-[10px] font-bold text-slate-500 uppercase truncate mt-0.5">{t.company}</p>}
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-3 bg-[#f4f4f0] border border-black px-2 py-1 w-max">
                                    {[...Array(5)].map((_, i) => (
                                        <i 
                                            key={i} 
                                            className={`fas fa-star text-[10px] ${i < t.rating ? 'text-black' : 'text-slate-300'}`}
                                        ></i>
                                    ))}
                                </div>

                                {/* Testimonial Quote Content */}
                                <p className="text-xs font-bold uppercase leading-relaxed text-black italic bg-[#f4f4f0] border-[2px] border-black p-3 @sm:p-4 relative min-h-0 @sm:min-h-[100px]">
                                    &quot;{t.content}&quot;
                                </p>
                            </div>

                            {/* Card Footer Info */}
                            <div className="border-t border-dashed border-black/20 pt-3 mt-4 flex justify-between items-center text-[9px] text-slate-400 font-bold uppercase">
                                <span>RECORD_ID: TST-0{index + 1}</span>
                                <span className="text-green-600">SECURE_DATA</span>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
