import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function NexusNoirHeroBlock({ data, theme, isEditor }: any) {
    const fullName = data?.profile?.fullName || data?.fullName || "AURA KINETIC";
    const bio = data?.profile?.bio || data?.bio || "Saya membantu startup dan korporasi global merancang antarmuka digital yang premium, fungsional, dengan perhatian absolut pada setiap detail piksel.";
    const accentColor = theme?.themeColor || '#4F46E5'; 

    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="min-h-screen flex flex-col justify-center px-6 pt-24 pb-10 relative z-20">
            <div className="max-w-7xl mx-auto w-full flex flex-col items-start">
                
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    <div className="text-reveal-wrap">
                        <p className={`text-[#888888] font-mono text-xs md:text-sm uppercase tracking-widest flex gap-4 items-center ${isEditor ? '' : 'text-reveal'}`}>
                            <span><EditableText entity="appearance" field="nn_hero_avail" value={getCustomText('nn_hero_avail', 'Available for Work')} isEditor={isEditor} /></span>
                        </p>
                    </div>
                </div>
                
                <h1 className="font-nn-heading font-semibold text-[12vw] md:text-8xl lg:text-[8rem] leading-[0.95] tracking-tight w-full">
                    <div className="text-reveal-wrap"><span className={`block ${isEditor ? '' : 'text-reveal'}`}><EditableText entity="profile" field="fullName" value={fullName} isEditor={isEditor} /></span></div>
                    <div className="text-reveal-wrap flex flex-col md:flex-row md:items-center gap-2 md:gap-6">
                        <span className={`block text-gray-500 italic font-light ${isEditor ? '' : 'text-reveal'}`}><EditableText entity="appearance" field="nn_hero_mid" value={getCustomText('nn_hero_mid', 'Excellence')} isEditor={isEditor} /></span>
                        <div className={`hidden md:block h-[2px] bg-white/20 flex-grow mt-4 origin-left ${isEditor ? 'scale-x-100' : 'scale-x-0'}`} id={isEditor ? '' : 'hero-line'}></div>
                    </div>
                    <div className="text-reveal-wrap"><span className={`block ${isEditor ? '' : 'text-reveal'}`} style={{ color: accentColor }}><EditableText entity="appearance" field="nn_hero_bot" value={getCustomText('nn_hero_bot', 'By Design.')} isEditor={isEditor} /></span></div>
                </h1>
                
                <div className="mt-16 text-reveal-wrap ml-auto md:w-1/2">
                    <p className={`text-[#888888] text-lg leading-relaxed text-right md:text-left ${isEditor ? '' : 'text-reveal'}`}>
                        <EditableText entity="profile" field="bio" value={bio} isEditor={isEditor} />
                    </p>
                </div>
            </div>

            <div className="absolute bottom-10 left-6 text-reveal-wrap">
                <span className={`text-xs tracking-widest uppercase text-[#888888] flex items-center gap-3 ${isEditor ? '' : 'text-reveal'}`}>
                    <div className="w-12 h-[1px] bg-[#888888]"></div> Scroll to explore
                </span>
            </div>
        </section>
    );
}
