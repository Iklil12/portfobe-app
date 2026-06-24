import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function HorizontalFlowMarqueeBlock({ theme, isEditor }: any) {
    return (
        <section className="py-12 md:py-24 border-y border-white/10 bg-surface/30">
            <div className="marquee-wrapper mb-4">
                <div className="marquee-content flex-shrink-0 min-w-max items-center font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-white/15">
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_1 || 'Awwwards SOTD'} field="hf_mq1_1" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_2 || 'FWA of the Day'} field="hf_mq1_2" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_3 || 'Webby Nominee'} field="hf_mq1_3" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq1_4 || 'CSSDA Winner'} field="hf_mq1_4" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    
                    <span className="mx-8">{theme?.customTexts?.hf_mq1_1 || 'Awwwards SOTD'}</span>&bull;
                    <span className="mx-8">{theme?.customTexts?.hf_mq1_2 || 'FWA of the Day'}</span>&bull;
                    <span className="mx-8">{theme?.customTexts?.hf_mq1_3 || 'Webby Nominee'}</span>&bull;
                    <span className="mx-8">{theme?.customTexts?.hf_mq1_4 || 'CSSDA Winner'}</span>&bull;
                </div>
            </div>
            <div className="marquee-wrapper">
                <div className="marquee-content reverse flex-shrink-0 min-w-max items-center font-display text-5xl md:text-7xl font-bold uppercase tracking-tight text-white/15">
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_1 || 'Creative Strategy'} field="hf_mq2_1" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_2 || 'WebGL Engineering'} field="hf_mq2_2" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_3 || 'Spatial UX/UI'} field="hf_mq2_3" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    <span className="mx-8"><EditableText value={theme?.customTexts?.hf_mq2_4 || 'Motion Design'} field="hf_mq2_4" entity="appearance" isEditor={isEditor} as="span" /></span>&bull;
                    
                    <span className="mx-8">{theme?.customTexts?.hf_mq2_1 || 'Creative Strategy'}</span>&bull;
                    <span className="mx-8">{theme?.customTexts?.hf_mq2_2 || 'WebGL Engineering'}</span>&bull;
                    <span className="mx-8">{theme?.customTexts?.hf_mq2_3 || 'Spatial UX/UI'}</span>&bull;
                    <span className="mx-8">{theme?.customTexts?.hf_mq2_4 || 'Motion Design'}</span>&bull;
                </div>
            </div>
        </section>
    );
}
