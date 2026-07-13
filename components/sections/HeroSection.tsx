"use client";

import { useState, useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

export function HeroSection() {
    const router = useRouter();
    const t = useTranslations('Hero');
    const [inputValue, setInputValue] = useState('');
    const [typed, setTyped] = useState('');
    const names = ['sarah-chen', 'studio.noir', 'alex.dev', 'maya.foto', 'reza.ui'];

    const handleGetStarted = () => {
        if (inputValue.trim()) {
            router.push(`/register?subdomain=${inputValue.trim()}`);
        } else {
            router.push('/register');
        }
    };

    useEffect(() => {
        let nameIdx = 0, charIdx = 0, deleting = false;
        let timer: ReturnType<typeof setTimeout>;
        const tick = () => {
            const name = names[nameIdx];
            if (!deleting) { charIdx++; setTyped(name.slice(0, charIdx)); if (charIdx === name.length) { deleting = true; timer = setTimeout(tick, 2200); return; } }
            else { charIdx--; setTyped(name.slice(0, charIdx)); if (charIdx === 0) { deleting = false; nameIdx = (nameIdx + 1) % names.length; } }
            timer = setTimeout(tick, deleting ? 40 : 90);
        };
        timer = setTimeout(tick, 1200);
        return () => clearTimeout(timer);
    }, []);

    return (
        <section className="relative w-full min-h-screen bg-[#050505] text-white overflow-hidden font-mono selection:bg-white selection:text-black flex flex-col">

            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-ticker { animation: ticker 25s linear infinite; }
                .wire-b { border-bottom: 1px solid rgba(255,255,255,0.1); }
                .wire-r { border-right: 1px solid rgba(255,255,255,0.1); }
                .wire-t { border-top: 1px solid rgba(255,255,255,0.1); }
                .wire-l { border-left: 1px solid rgba(255,255,255,0.1); }
                .hover-invert:hover { background-color: white !important; color: black !important; }
                @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
                .cursor-blink { animation: blink 1s step-end infinite; }
                @media (max-width: 767px) {
                    .mobile-stroke { -webkit-text-stroke: 1px white !important; }
                }
            `}} />


            {/* ═══ BAND 2: FULL-WIDTH CENTERED HEADLINE ═══ */}
            <div className="w-full wire-b flex-1 flex flex-col items-center justify-center px-5 pt-32 pb-12 md:pt-40 md:pb-20 lg:pt-48 lg:pb-28 text-center relative overflow-hidden">
                {/* Crosshair decorations */}
                <div aria-hidden="true" className="absolute top-6 left-6 md:top-10 md:left-10 font-mono text-[10px] text-white/20 tracking-widest">
                    <div className="flex items-center gap-2">
                        <span className="w-4 h-px bg-white/20"></span>
                        <span>00.HERO</span>
                    </div>
                </div>
                <div aria-hidden="true" className="absolute bottom-6 right-6 md:bottom-10 md:right-10 font-mono text-[10px] text-white/20 tracking-widest">
                    <div className="flex items-center gap-2">
                        <span>SECTION_01</span>
                        <span className="w-4 h-px bg-white/20"></span>
                    </div>
                </div>

                <h1 className="font-mono font-black text-[14vw] md:text-[9vw] lg:text-[8vw] leading-[0.85] uppercase tracking-tighter text-white">
                    {t('headline1')}
                </h1>
                <h1 className="font-mono font-black text-[14vw] md:text-[9vw] lg:text-[8vw] leading-[0.85] uppercase tracking-tighter text-transparent mobile-stroke" style={{ WebkitTextStroke: '2px white' }}>
                    {t('headline2')}
                </h1>
                <h1 className="font-mono font-black text-[14vw] md:text-[9vw] lg:text-[8vw] leading-[0.85] uppercase tracking-tighter text-white">
                    {t('headline3')}
                </h1>
            </div>

            {/* ═══ BAND 3: THREE-COLUMN INFO STRIP ═══ */}
            <div className="w-full grid grid-cols-1 md:grid-cols-3 wire-b">

                {/* Col 1: Overview */}
                <div className="px-5 py-5 md:p-8 wire-b md:wire-b-0 md:wire-r bg-[#050505] flex flex-col justify-between min-h-[120px] md:min-h-[180px]">
                    <span aria-hidden="true" className="font-mono text-[10px] text-white/30 uppercase tracking-widest">[ {t('overview')} ]</span>
                    <p className="font-mono text-[13px] md:text-sm font-medium leading-relaxed mt-3 text-white/70">
                        {t('description')}
                    </p>
                </div>

                {/* Col 2: Live Preview */}
                <div className="px-5 py-5 md:p-8 wire-b md:wire-b-0 md:wire-r bg-[#0a0a0a] flex flex-col justify-between min-h-[120px] md:min-h-[180px]">
                    <span aria-hidden="true" className="font-mono text-[10px] text-white/30 uppercase tracking-widest">[ {t('claimUsername')} ]</span>
                    <div className="mt-3">
                        <div className="font-mono text-[11px] text-white/30 mb-0.5">portfo.be/</div>
                        <div className="font-mono text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                            <span translate="no">{typed}</span><span className="cursor-blink text-white/50 font-light">|</span>
                        </div>
                    </div>
                </div>

                {/* Col 3: Stats */}
                <div className="px-5 py-5 md:p-8 bg-[#050505] flex flex-col justify-between min-h-[120px] md:min-h-[180px]">
                    <span aria-hidden="true" className="font-mono text-[10px] text-white/30 uppercase tracking-widest">[ {t('metrics')} ]</span>
                    <div className="mt-3 grid grid-cols-2 gap-4">
                        <div>
                            <div className="font-mono text-2xl md:text-3xl font-black text-white">100+</div>
                            <div aria-hidden="true" className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-1">{t('deployed')}</div>
                        </div>
                        <div>
                            <div className="font-mono text-2xl md:text-3xl font-black text-white"><span>99.9</span><span className="text-white/40">%</span></div>
                            <div aria-hidden="true" className="font-mono text-[10px] text-white/30 uppercase tracking-wider mt-1">{t('uptime')}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ═══ BAND 4: FULL-WIDTH CLAIM INPUT ═══ */}
            <div className="w-full wire-b bg-[#0a0a0a]">
                <div className="flex flex-col md:flex-row">
                    {/* Label */}
                    <div className="px-5 py-4 md:px-8 md:py-6 md:wire-r flex items-center shrink-0">
                        <span aria-hidden="true" className="font-mono text-[10px] text-white/60 uppercase tracking-widest">[ {t('claimUsername')} ]</span>
                    </div>
                    {/* Input */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleGetStarted(); }}
                        className="flex-1 flex items-center px-5 py-4 md:px-8 md:py-6 gap-2"
                    >
                        <span className="font-mono text-xs md:text-sm text-white/70 select-none whitespace-nowrap">PORTFO.BE/</span>
                        <input
                            aria-label="Username"
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value.toLowerCase().replace(/[^a-z0-9-_.]/g, ''))}
                            placeholder={t('yourNamePlaceholder')}
                            className="bg-transparent outline-none flex-1 text-white font-mono text-xs md:text-sm uppercase placeholder-white/40 tracking-wider min-h-[44px]"
                            spellCheck={false}
                            autoComplete="off"
                        />
                    </form>
                </div>
            </div>

            {/* ═══ BAND 5: DUAL ACTION BAR ═══ */}
            <div className="w-full grid grid-cols-2">
                <button onClick={handleGetStarted} className="hover-invert px-5 py-5 md:px-8 md:py-6 wire-r font-mono text-base md:text-xl font-black uppercase tracking-tight flex items-center justify-center gap-2 md:gap-3 transition-colors min-h-[56px] active:bg-white active:text-black">
                    <span>{t('getStarted')}</span> <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
                </button>
                <button aria-label="Initiate Deployment" onClick={handleGetStarted} className="px-5 py-5 md:px-8 md:py-6 bg-white text-black font-mono text-xs text-center uppercase tracking-widest font-medium flex items-center justify-center min-h-[56px] hover:bg-black hover:text-white active:bg-black active:text-white transition-colors cursor-pointer w-full">
                    {t('initiateDeployment')} →
                </button>
            </div>

        </section>
    );
}
