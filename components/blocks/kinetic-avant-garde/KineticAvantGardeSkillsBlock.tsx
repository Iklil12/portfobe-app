"use client";
import React from 'react';
import { EditableText } from '@/shared/ui/EditableText';

export function KineticAvantGardeSkillsBlock({ data, theme, isEditor }: any) {
    const customTexts = theme?.customTexts || {};
    const getCustomText = (key: string, fallback: string) => customTexts[key] || fallback;

    return (
        <section className="relative kag-bg-bone kag-text-void py-32 md:py-48 px-4 md:px-12 z-10 overflow-hidden" id="expertise">
            {/* Brutalist Grid Background */}
            <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)', backgroundSize: 'clamp(20px, 4vw, 50px) clamp(20px, 4vw, 50px)' }}></div>
            
            {/* Corner Crosshairs */}
            <div className="absolute top-8 left-8 w-12 h-12 border-t-4 border-l-4 kag-border-void opacity-100 pointer-events-none"></div>
            <div className="absolute bottom-8 right-8 w-12 h-12 border-b-4 border-r-4 kag-border-void opacity-100 pointer-events-none"></div>

            <div className="w-full max-w-7xl mx-auto relative z-10">
                <div className="flex items-center gap-3 mb-16 md:mb-24 px-2">
                    <div className="w-3 h-3 kag-bg-blood animate-pulse"></div>
                    <h3 className="font-kag-mono kag-text-void font-bold tracking-[0.2em] uppercase text-xs md:text-sm">
                        <EditableText entity="appearance" field="kag_expertise_subtitle" value={getCustomText('kag_expertise_subtitle', '[ KEAHLIAN INTI ]')} isEditor={isEditor} />
                    </h3>
                </div>
                
                <div className="flex flex-col border-t-4 kag-border-void w-full">
                    
                    {/* Row 1 */}
                    <div className="group border-b-4 kag-border-void py-6 md:py-16 px-4 md:px-8 flex justify-between items-center hover-trigger relative overflow-hidden transition-colors duration-500 hover:kag-bg-blood">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                        <h2 className="font-kag-brutal text-[clamp(1.8rem,8vw,9rem)] leading-[0.8] uppercase transition-all duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-12 z-10 group-hover:kag-text-bone mix-blend-difference group-hover:mix-blend-normal break-words max-w-[80%]">
                            <EditableText entity="appearance" field="kag_skill_1" value={getCustomText('kag_skill_1', 'DIREKSI SENI')} isEditor={isEditor} />
                        </h2>
                        <div className="flex items-center gap-4 md:gap-6 z-10">
                            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full border-4 kag-border-bone kag-text-bone opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <i className="fas fa-arrow-right text-3xl -rotate-45 group-hover:rotate-0 transition-transform duration-500 delay-100"></i>
                            </div>
                            <span className="font-kag-mono text-xl md:text-3xl font-bold transition-all duration-500 group-hover:-translate-x-4 group-hover:kag-text-bone mix-blend-difference group-hover:mix-blend-normal">/01</span>
                        </div>
                    </div>
                    
                    {/* Row 2 */}
                    <div className="group border-b-4 kag-border-void py-6 md:py-16 px-4 md:px-8 flex justify-between items-center hover-trigger relative overflow-hidden transition-colors duration-500 hover:kag-bg-blood">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                        <h2 className="font-kag-brutal text-[clamp(1.8rem,8vw,9rem)] leading-[0.8] uppercase transition-all duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-12 z-10 group-hover:kag-text-bone mix-blend-difference group-hover:mix-blend-normal break-words max-w-[80%]">
                            <EditableText entity="appearance" field="kag_skill_2" value={getCustomText('kag_skill_2', 'DESAIN SPASIAL')} isEditor={isEditor} />
                        </h2>
                        <div className="flex items-center gap-4 md:gap-6 z-10">
                            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full border-4 kag-border-bone kag-text-bone opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <i className="fas fa-arrow-right text-3xl -rotate-45 group-hover:rotate-0 transition-transform duration-500 delay-100"></i>
                            </div>
                            <span className="font-kag-mono text-xl md:text-3xl font-bold transition-all duration-500 group-hover:-translate-x-4 group-hover:kag-text-bone mix-blend-difference group-hover:mix-blend-normal">/02</span>
                        </div>
                    </div>

                    {/* Row 3 */}
                    <div className="group border-b-4 kag-border-void py-6 md:py-16 px-4 md:px-8 flex justify-between items-center hover-trigger relative overflow-hidden transition-colors duration-500 hover:kag-bg-blood">
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-0 group-hover:opacity-20 transition-opacity duration-500 pointer-events-none"></div>
                        <h2 className="font-kag-brutal text-[clamp(1.5rem,8vw,9rem)] leading-[0.8] uppercase transition-all duration-500 ease-out group-hover:translate-x-2 md:group-hover:translate-x-12 z-10 group-hover:kag-text-bone mix-blend-difference group-hover:mix-blend-normal break-words max-w-[80%]">
                            <EditableText entity="appearance" field="kag_skill_3" value={getCustomText('kag_skill_3', 'PENGKODEAN KREATIF')} isEditor={isEditor} />
                        </h2>
                        <div className="flex items-center gap-4 md:gap-6 z-10">
                            <div className="hidden md:flex items-center justify-center w-24 h-24 rounded-full border-4 kag-border-bone kag-text-bone opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.87,0,0.13,1)]">
                                <i className="fas fa-arrow-right text-3xl -rotate-45 group-hover:rotate-0 transition-transform duration-500 delay-100"></i>
                            </div>
                            <span className="font-kag-mono text-xl md:text-3xl font-bold transition-all duration-500 group-hover:-translate-x-4 group-hover:kag-text-bone mix-blend-difference group-hover:mix-blend-normal">/03</span>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
