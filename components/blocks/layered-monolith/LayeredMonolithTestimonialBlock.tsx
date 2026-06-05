import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function LayeredMonolithTestimonialBlock({ data, theme, isEditor = false }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    return (
        <section id="testimonials" className="stack-card bg-[#1A1A18] text-white p-8 md:p-16 flex flex-col justify-center relative" >
            <div className="noise mix-blend-overlay opacity-10"></div>
            
            <div className="w-full max-w-6xl mx-auto relative z-10 flex flex-col h-full justify-center py-20">
                <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4 mb-12">
                    <EditableText value={theme?.customTexts?.lm_testi_label || 'Client Feedback'} field="lm_testi_label" entity="appearance" isEditor={isEditor} as="span" maxLength={30} />
                </p>
                
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-8 pb-8 no-scrollbar cursor-hover" data-cursor-text="DRAG">
                    {testimonials.map((t: any, i: number) => (
                        <div key={i} className="min-w-[85vw] md:min-w-[600px] snap-center bg-white/5 border border-white/10 p-8 md:p-12 rounded-2xl flex flex-col justify-between">
                            <p className="font-display text-2xl md:text-4xl font-light italic leading-tight mb-12">
                                "{t.content}"
                            </p>
                            <div className="flex items-center gap-4">
                                {t.avatarUrl || t.avatar ? (
                                    <img src={t.avatarUrl || t.avatar} alt={t.clientName} className="w-14 h-14 rounded-full object-cover grayscale border border-white/20" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-brand-accent/20 flex items-center justify-center font-display font-bold text-brand-accent border border-brand-accent/30">
                                        {(t.clientName || 'U').charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-display font-bold uppercase tracking-tight text-lg">{t.clientName}</h4>
                                    <p className="font-body text-xs uppercase tracking-widest text-white/50">{t.position} {t.company ? `AT ${t.company}` : ''}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
