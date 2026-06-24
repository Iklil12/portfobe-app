import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function EditorialMarqueeBlock({ data, theme, isEditor }: any) {
    const profession = data?.profile?.profession || data?.profession || "Art Director & Designer";

    const marqueeItems = [
        { type: 'fixed', text: profession },
        { type: 'editable', field: 'edit_marquee_1', default: 'Creative Thinker' },
        { type: 'editable', field: 'edit_marquee_2', default: 'Available for work' },
    ];

    return (
        <div className="w-full border-y border-subtle py-4 @md:py-6 bg-white overflow-hidden my-12 @md:my-20">
            <div className="flex animate-marquee font-serif italic text-2xl @md:text-4xl text-slate-300 whitespace-nowrap">
                {[...Array(2)].map((_, blockIndex) => (
                    <div key={blockIndex} className="flex items-center gap-8 @md:gap-16 px-4 @md:px-8 shrink-0">
                        {[...Array(4)].map((_, groupIndex) => (
                            <React.Fragment key={groupIndex}>
                                {marqueeItems.map((item, index) => (
                                    <React.Fragment key={`${groupIndex}-${index}`}>
                                        <span className="hover:text-[var(--hl)] transition-colors">
                                            {item.type === 'editable' ? (
                                                <EditableText 
                                                    value={theme?.customTexts?.[item.field as string] || item.default} 
                                                    field={item.field as string} 
                                                    entity="appearance" 
                                                    isEditor={isEditor} 
                                                    as="span" 
                                                    maxLength={40} 
                                                />
                                            ) : (
                                                item.text
                                            )}
                                        </span>
                                        <span className="text-slate-200">✦</span>
                                    </React.Fragment>
                                ))}
                            </React.Fragment>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
