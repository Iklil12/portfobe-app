import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';
import { TestimonialSection } from '@/features/testimonials';

export function HorizontalFlowTestimonialsBlock({ data, theme, isEditor }: any) {
    const testimonials = data?.testimonials?.filter((t: any) => t.isVisible) || data?.user?.testimonials?.filter((t: any) => t.isVisible) || [];

    if (testimonials.length === 0 && !isEditor) return null;

    return (
        <section className="py-20 px-6 md:px-10 max-w-7xl mx-auto w-full border-t border-white/10 relative z-20">
           <h2 className="font-mono text-[10px] tracking-[0.3em] uppercase text-textMuted border-l border-accent pl-4 mb-16">
             <EditableText value={theme?.customTexts?.hf_testimonials_label || '0X / Client Words'} field="hf_testimonials_label" entity="appearance" isEditor={isEditor} as="span" />
           </h2>
           <div className="bg-surface/40 backdrop-blur-md border border-white/5 rounded-2xl p-4">
             {testimonials.length > 0 ? (
               <TestimonialSection testimonials={testimonials} variant="grid" isEditor={isEditor} theme={theme} />
             ) : (
               <div className="text-textMuted font-mono text-xs p-10 text-center border border-white/10 rounded-2xl border-dashed">
                   No testimonials found. Add some to display them here.
               </div>
             )}
           </div>
        </section>
    );
}
