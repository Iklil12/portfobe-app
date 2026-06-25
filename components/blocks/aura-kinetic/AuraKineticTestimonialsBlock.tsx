"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { LazyImage } from '@/shared/ui/LazyImage';
import { EditableText } from '@/shared/ui/EditableText';

export function AuraKineticTestimonialsBlock({ data, theme, isEditor }: any) {
  const testimonials = data?.testimonials || data?.user?.testimonials || [];

  if (testimonials.length === 0 && !isEditor) return null;

  const displayTestimonials = isEditor && testimonials.length === 0 ? [
      { id: '1', clientName: "Sarah Jenkins", company: "TechNova", content: "The level of detail and interaction is unmatched. Truly a kinetic experience that elevated our brand presence.", rating: 5 },
      { id: '2', clientName: "David Chen", company: "Studio X", content: "Working together was seamless. The aesthetic is incredibly modern, fluid, and exactly what we needed.", rating: 5 },
      { id: '3', clientName: "Elena Rodriguez", company: "Vanguard", content: "An eye for motion and space. Every interaction feels deliberate and satisfying.", rating: 4 }
  ] : testimonials;

  
  const cardStyle = theme?.cardStyle || 'glassmorphism';
  const cardStyleClassDark = cardStyle === 'soft-shadow' || cardStyle === 'soft' ? 'bg-[#18181b] border-transparent shadow-[0_20px_50px_rgba(0,0,0,0.5)]' : cardStyle === 'hard-shadow' || cardStyle === 'hard' ? 'bg-[#050505] border-2 border-[var(--hl)] shadow-[6px_6px_0_0_var(--hl)]' : cardStyle === 'flat' ? 'bg-[#0a0a0c] border-2 border-white/20' : 'bg-white/5 border border-white/10 backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:border-white/20 hover:bg-white/10';

  const fadeUp = {
      hidden: { opacity: 0, y: 50 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  const animationTrigger = isEditor ? "animate" : "whileInView";

  
    const getBtnShapeClass = (shape?: string) => {
        if (shape === 'hard' || shape === 'square') return 'rounded-none';
        if (shape === 'rounded') return 'rounded-xl';
        return 'rounded-full';
    };
    const btnShape = getBtnShapeClass(theme?.buttonShape);
    const cardShape = btnShape;

    


  return (
    <section id="testimonials" className="relative z-10 w-full max-w-[1400px] mx-auto px-6 py-24 md:py-32">
        <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp} className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl font-bold">
                <EditableText value={theme?.customTexts?.aura_testimonials_title || 'Client Feedback'} field="aura_testimonials_title" entity="appearance" isEditor={isEditor} as="span" maxLength={25} />
            </h2>
            <p className="font-sans text-white/50 mt-4 text-sm">
                <EditableText value={theme?.customTexts?.aura_testimonials_subtitle || 'Voices of collaboration and impact.'} field="aura_testimonials_subtitle" entity="appearance" isEditor={isEditor} as="span" maxLength={45} />
            </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {displayTestimonials.map((t: any, i: number) => {
                const authorName = t.clientName || t.author || "Client";
                const role = t.company || t.role || "";
                
                return (
                <motion.div
                    key={t.id || i}
                    initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={fadeUp}
                    className={`group relative p-8 transition-all duration-500 ${cardShape} ${cardStyleClassDark} overflow-hidden flex flex-col justify-between`}
                >
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-[var(--hl)] opacity-0 group-hover:opacity-10 blur-[50px] transition-opacity duration-500 rounded-full"></div>

                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            {t.avatarUrl ? (
                                <LazyImage src={t.avatarUrl} alt={authorName} className={`w-12 h-12 ${btnShape} object-cover border border-white/20`} />
                            ) : (
                                <div className={`w-12 h-12 ${btnShape} bg-white/10 flex items-center justify-center font-bold text-lg border border-white/20 text-[var(--hl)]`}>
                                    {authorName.charAt(0)}
                                </div>
                            )}
                            <div>
                                <h4 className="font-sans font-bold text-white group-hover:text-[var(--hl)] transition-colors">{authorName}</h4>
                                {role && <p className="font-sans text-[10px] uppercase tracking-widest text-white/40">{role}</p>}
                            </div>
                        </div>
                        <p className="font-sans text-sm md:text-base leading-relaxed text-white/70 mb-8 italic relative z-10">
                            "{t.content}"
                        </p>
                    </div>

                    <div className="flex gap-1 relative z-10 mt-auto">
                        {[...Array(5)].map((_, idx) => (
                            <i key={idx} className={`text-xs ${idx < (t.rating || 5) ? 'fas fa-star text-[var(--hl)]' : 'far fa-star text-white/20'}`}></i>
                        ))}
                    </div>
                </motion.div>
            )})}
        </div>
    </section>
  );
}

