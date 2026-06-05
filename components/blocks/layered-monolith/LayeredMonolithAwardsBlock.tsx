import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function LayeredMonolithAwardsBlock({ data, theme, isEditor = false }: any) {
    const awardItems = data?.certificates || data?.user?.certificates || [];

    if (awardItems.length === 0) return null;

    return (
        <section id="awards" className="stack-card bg-[#F5F5F0] text-[#1A1A18] p-8 md:p-16 flex flex-col justify-center relative" >
            <div className="noise mix-blend-multiply opacity-5"></div>
            
            <div className="w-full max-w-5xl mx-auto relative z-10 flex flex-col gap-12">
                <p className="font-display text-xs tracking-[0.3em] uppercase opacity-50 border-l border-brand-accent pl-4">
                    <EditableText value={theme?.customTexts?.lm_awards_label || 'Recognition'} field="lm_awards_label" entity="appearance" isEditor={isEditor} as="span" maxLength={20} />
                </p>
                
                <div className="flex flex-col border-t border-black/10 text-sm md:text-base font-body font-medium uppercase tracking-widest">
                    {awardItems.map((award: any, i: number) => (
                        <div key={i} className="flex flex-col md:flex-row justify-between py-6 border-b border-black/10 cursor-hover group" data-cursor-text="WINNER">
                            <span className="mb-2 md:mb-0 group-hover:text-brand-accent transition-colors">{award.title}</span>
                            <span className="opacity-60 mb-2 md:mb-0">{award.issuer}</span>
                            <span>{award.year || new Date(award.createdAt).getFullYear()}</span>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
