"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { EditableText } from '@/components/ui/EditableText';

export interface Testimonial {
  id: string;
  clientName: string;
  company?: string;
  content: string;
  rating: number;
  avatarUrl?: string;
}

interface TestimonialSectionProps {
  testimonials: Testimonial[];
  variant?: 'marquee' | 'grid' | 'slider' | 'stack';
  isEditor?: boolean;
  theme?: any;
}

export function TestimonialSection({ testimonials, variant = 'grid', isEditor = false, theme }: TestimonialSectionProps) {
  if (!testimonials || testimonials.length === 0) return null;

  if (variant === 'grid') {
    return (
      <div className="w-full py-10">
        <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 min-heading">
          <EditableText value={theme?.customTexts?.testimonials_title || 'Testimonials'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={25} className="min-heading" />
        </h3>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          initial="hidden"
          {...(isEditor ? { animate: "visible" } : { whileInView: "visible", viewport: { once: true, margin: "100px" } })}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {testimonials.map((t) => (
            <motion.div 
              key={t.id} 
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
              }}
              className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              <div className="flex items-center gap-4 mb-4">
                {t.avatarUrl ? (
                  <img src={t.avatarUrl} alt={t.clientName} loading="lazy" className="w-12 h-12 rounded-full object-cover" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center font-bold">
                    {t.clientName.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold">{t.clientName}</h4>
                  {t.company && <p className="text-sm opacity-70">{t.company}</p>}
                </div>
              </div>
              <div className="flex mb-3">
                {[...Array(t.rating)].map((_, i) => <i key={i} className="fas fa-star text-sm text-amber-400"></i>)}
              </div>
              <p className="text-sm opacity-90 leading-relaxed italic">"{t.content}"</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  // BISA DITAMBAHKAN VARIAN LAIN SEPERTI MARQUEE, SLIDER, STACK DI SINI
  
  return (
    <div className="w-full py-10">
      <h3 className="text-2xl font-black uppercase tracking-tighter mb-8 text-center min-heading">
        <EditableText value={theme?.customTexts?.testimonials_title || 'Testimonials'} field="testimonials_title" entity="appearance" isEditor={isEditor} maxLength={25} className="min-heading" />
      </h3>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto">
        {testimonials.map((t) => (
          <div key={t.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
            <p className="text-lg opacity-90 leading-relaxed italic mb-6">"{t.content}"</p>
            <div className="flex justify-center mb-2">
              {[...Array(t.rating)].map((_, i) => <i key={i} className="fas fa-star text-sm text-amber-400 mx-0.5"></i>)}
            </div>
            <h4 className="font-bold">{t.clientName}</h4>
            {t.company && <p className="text-sm opacity-70">{t.company}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
