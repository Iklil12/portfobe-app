"use client";

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { TestimonialSection } from '@/components/features/testimonials/TestimonialSection';
import { EditableText } from '@/components/ui/EditableText';
import { BrutalismContext } from './BrutalismShell';

export function BrutalismTestimonialsBlock({ data, theme, isEditor, isCardPreview }: any) {
    const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0) return null;

    const brutalEase = [0, 0, 0, 1] as any;

    const starkReveal = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: brutalEase } }
    };

    return (
        <section className="w-full bg-white border-b-[3px] border-black">
            <motion.div initial="hidden" {...{ [animationTrigger]: "visible" }} viewport={{ once: true, amount: 0 }} variants={starkReveal} className="p-6 border-b-[3px] border-black bg-[var(--hl)] text-black">
                <h2 className={"custom-heading text-4xl @sm:text-5xl font-black uppercase tracking-tighter"}>
                    <EditableText value={theme?.customTexts?.brutal_testimonials_title || 'CLIENT_RECORDS'} field="brutal_testimonials_title" entity="appearance" isEditor={isEditor} as="span" />
                </h2>
            </motion.div>
            <div className="p-8 @lg:p-12">
                <TestimonialSection testimonials={testimonials} variant="grid" />
            </div>
        </section>
    );
}
