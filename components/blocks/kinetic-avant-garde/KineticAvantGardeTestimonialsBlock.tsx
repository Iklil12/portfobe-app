"use client";
import React from 'react';
import { EditableText } from '@/components/ui/EditableText';
import { TestimonialSection } from '@/components/features/testimonials/TestimonialSection';

export function KineticAvantGardeTestimonialsBlock({ data, theme, isEditor }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    if (testimonials.length === 0) return null;

    return (
        <section className="relative kag-bg-bone kag-text-void py-32 px-6 md:px-20 z-10 border-b border-black/20">
            <h3 className="font-kag-mono kag-text-blood tracking-[0.3em] uppercase text-sm mb-16">
                <EditableText entity="appearance" field="kag_testi_subtitle" value={getCustomText('kag_testi_subtitle', '[ SUARA KLIEN ]')} isEditor={isEditor} />
            </h3>
            <div className="bg-transparent border-4 border-black p-4">
                <TestimonialSection testimonials={testimonials} variant="grid" isEditor={isEditor} theme={theme} />
            </div>
        </section>
    );
}
