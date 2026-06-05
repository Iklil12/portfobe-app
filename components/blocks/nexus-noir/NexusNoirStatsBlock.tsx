import React from 'react';
import { EditableText } from '@/components/ui/EditableText';

export function NexusNoirStatsBlock({ theme, isEditor }: any) {
    const accentColor = theme?.themeColor || '#4F46E5'; 
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="py-20 px-6 relative z-20">
            <div className="max-w-7xl mx-auto w-full border-y border-white/10 py-16">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-10 md:gap-4 text-center divide-x-0 md:divide-x divide-white/10">
                    {[
                        { id: 1, val: '5+', label: 'Years Exp.' },
                        { id: 2, val: '40+', label: 'Projects' },
                        { id: 3, val: '20+', label: 'Clients' },
                        { id: 4, val: '100%', label: 'Commitment' }
                    ].map((stat) => (
                        <div key={stat.id} className={`flex flex-col items-center justify-center ${isEditor ? '' : 'gs-reveal'}`}>
                            <h3 className="font-nn-heading text-5xl md:text-6xl font-bold mb-2 text-white">
                                <EditableText entity="appearance" field={`nn_stat_v${stat.id}`} value={getCustomText(`nn_stat_v${stat.id}`, stat.val)} isEditor={isEditor} />
                            </h3>
                            <p className="text-xs font-mono uppercase tracking-widest" style={{ color: accentColor }}>
                                <EditableText entity="appearance" field={`nn_stat_l${stat.id}`} value={getCustomText(`nn_stat_l${stat.id}`, stat.label)} isEditor={isEditor} />
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
