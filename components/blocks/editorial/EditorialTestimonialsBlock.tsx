import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';
import { LazyImage } from '@/shared/ui/LazyImage';

export function EditorialTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    const canvasEase = [0.22, 1, 0.36, 1] as any;
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const fadeUp = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: canvasEase } }
    };

    if (testimonials.length === 0) return null;

    return (
        <section className="w-full bg-[#fdfdfc] py-20 @md:py-32 px-6 @md:px-12 @lg:px-20 border-t border-subtle">
            <div className="max-w-[1600px] mx-auto">
                <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="mb-16">
                    <h2 className={`font-sans font-semibold tracking-tight text-[#111] text-4xl @md:text-5xl`}>
                        <EditableText value={theme?.customTexts?.editorial_testi_t1 || 'Client'} field="editorial_testi_t1" entity="appearance" isEditor={isEditor} as="span" maxLength={20} /> <EditableText value={theme?.customTexts?.editorial_testi_t2 || 'Voices'} field="editorial_testi_t2" entity="appearance" isEditor={isEditor} as="span" className="font-serif italic text-slate-400" maxLength={20} />
                    </h2>
                </motion.div>

                <div className="grid grid-cols-1 @lg:grid-cols-2 gap-12 @md:gap-20">
                    {testimonials.map((t: any, i: number) => (
                        <motion.div
                            key={t.id}
                            initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                            className="flex flex-col"
                        >
                            <span className="text-6xl font-serif text-slate-300 mb-[-20px] leading-none">"</span>
                            <p className="font-serif italic text-xl @md:text-3xl text-[#111] leading-relaxed mb-10 pl-6 border-l-2 border-[var(--hl)]">
                                {t.content}
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 border border-subtle">
                                    {t.avatarUrl ? (
                                        <LazyImage src={t.avatarUrl} alt={t.clientName} className="w-full h-full object-cover grayscale" />
                                    ) : (
                                        <div className="w-full h-full bg-slate-100 flex items-center justify-center font-serif text-xl font-bold text-[#111]">
                                            {t.clientName.charAt(0)}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="font-sans font-bold text-[#111] uppercase tracking-wide text-sm">{t.clientName}</h4>
                                    {t.company && <p className="font-sans text-[10px] uppercase font-bold tracking-widest text-slate-400">{t.company}</p>}
                                </div>
                                <div className="ml-auto flex gap-1">
                                    {[...Array(5)].map((_, idx) => (
                                        <i key={idx} className={`text-xs ${idx < t.rating ? 'fas fa-star text-slate-800' : 'far fa-star text-slate-300'}`}></i>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
