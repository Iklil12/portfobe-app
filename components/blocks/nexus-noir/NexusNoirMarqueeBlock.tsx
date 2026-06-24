import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirMarqueeBlock({ theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <div className="border-y border-white/10 py-6 bg-black relative z-20 transform -rotate-1 scale-105 my-20 overflow-hidden">
            <div className="marquee-wrap">
                <div className="marquee-inner">
                    {[1, 2, 3].map((group) => (
                        <div key={group} className="flex items-center gap-10 px-5 shrink-0">
                            <span className="font-nn-heading text-4xl text-transparent font-bold shrink-0" style={{ WebkitTextStroke: '1px #888' }}>
                                <EditableText 
                                    entity="appearance" field="nn_mq_1" value={getCustomText('nn_mq_1', 'UI/UX DESIGN')} isEditor={isEditor} 
                                    as="span" className="!whitespace-nowrap !break-keep inline-block" 
                                />
                            </span>
                            <span className="w-3 h-3 rounded-full bg-white shrink-0"></span>
                            <span className="font-nn-heading text-4xl text-white font-bold shrink-0">
                                <EditableText 
                                    entity="appearance" field="nn_mq_2" value={getCustomText('nn_mq_2', 'FRONTEND DEV')} isEditor={isEditor} 
                                    as="span" className="!whitespace-nowrap !break-keep inline-block" 
                                />
                            </span>
                            <span className="w-3 h-3 rounded-full bg-white shrink-0"></span>
                            <span className="font-nn-heading text-4xl text-transparent font-bold shrink-0" style={{ WebkitTextStroke: '1px #888' }}>
                                <EditableText 
                                    entity="appearance" field="nn_mq_3" value={getCustomText('nn_mq_3', 'CREATIVE DIRECTION')} isEditor={isEditor} 
                                    as="span" className="!whitespace-nowrap !break-keep inline-block" 
                                />
                            </span>
                            <span className="w-3 h-3 rounded-full bg-white shrink-0"></span>
                            <span className="font-nn-heading text-4xl text-white font-bold shrink-0">
                                <EditableText 
                                    entity="appearance" field="nn_mq_4" value={getCustomText('nn_mq_4', 'INTERACTION DESIGN')} isEditor={isEditor} 
                                    as="span" className="!whitespace-nowrap !break-keep inline-block" 
                                />
                            </span>
                            <span className="w-3 h-3 rounded-full bg-white shrink-0"></span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
