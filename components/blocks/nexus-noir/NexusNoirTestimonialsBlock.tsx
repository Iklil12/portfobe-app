import React from 'react';
import { TestimonialSection } from '@/features/testimonials';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirTestimonialsBlock({ data, theme, isEditor }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0 && !isEditor) return null;

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="py-24 px-6 md:px-10 border-t border-white/10 relative bg-[#050505] z-20">
            <div className="max-w-7xl mx-auto">
                <h3 className="font-nn-heading text-4xl uppercase tracking-tighter mb-12 text-white">
                    <EditableText entity="appearance" field="nn_testimonials_title" value={getCustomText('nn_testimonials_title', 'Endorsements')} isEditor={isEditor} />
                </h3>
                <TestimonialSection testimonials={testimonials} variant="grid" isEditor={isEditor} theme={theme} />
            </div>
        </section>
    );
}
