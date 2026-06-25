"use client";

import React, { useState, useEffect, useLayoutEffect } from 'react';
import Link from 'next/link';
import PortfolioView from '@/components/PortfolioView';
import { AnalyticsTracker } from '@/features/analytics/ui/AnalyticsTracker';

export default function PortfolioClientWrapper({
  data,
  subdomain
}: {
  data: any;
  subdomain: string;
}) {
  const shouldShowSplash = (data.siteAppearance?.splashScreen === true || data.splashScreen === true);
  const [showSplash, setShowSplash] = useState(shouldShowSplash);
  const [liftCurtain, setLiftCurtain] = useState(!shouldShowSplash);
  const [removeSplash, setRemoveSplash] = useState(!shouldShowSplash);

  // Mencegah flash splash screen saat client-side navigation (misal kembali dari galeri)
  useLayoutEffect(() => {
    if (sessionStorage.getItem(`_pfIntroPlayed_${subdomain}`)) {
      setShowSplash(false);
      setLiftCurtain(true);
      setRemoveSplash(true);
    }
  }, [subdomain]);

  useEffect(() => {
    const hasPlayedKey = `_pfIntroPlayed_${subdomain}`;
    const hasPlayed = typeof window !== 'undefined' ? sessionStorage.getItem(hasPlayedKey) : false;

    const w = (data.siteAppearance?.splashScreen === true || data.splashScreen === true);

    let t1: any, t2: any;
    if (w && !hasPlayed) {
      setShowSplash(true);
      t1 = setTimeout(() => {
        setLiftCurtain(true);
        t2 = setTimeout(() => {
          setRemoveSplash(true);
          if (typeof window !== 'undefined') sessionStorage.setItem(hasPlayedKey, 'true');
        }, 800);
      }, 1800);
    } else {
      setLiftCurtain(true);
      setRemoveSplash(true);
      setShowSplash(false);
    }

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [data, subdomain]);

  if (data.isLive === false) {
    return (
      <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans overflow-hidden">
        <div className="relative z-10 flex flex-col items-center w-full max-w-xl mx-auto text-white">
          <h1 className="text-4xl md:text-6xl font-black mb-6 uppercase">Currently <span className="text-white/50 italic font-medium">Cooking.</span></h1>
          <p className="text-white/50 text-sm leading-relaxed mb-10">Access to this portfolio has been temporarily suspended by the owner.</p>
          <Link href="/" className="px-8 py-4 bg-white text-black font-bold text-sm tracking-wide hover:bg-white/80 transition-colors">BUILD YOUR OWN</Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <AnalyticsTracker subdomain={subdomain} />

      <style dangerouslySetInnerHTML={{
        __html: `
        html { overflow-y: scroll; }
        .splash-screen { position: fixed; inset: 0; width: 100vw; z-index: 9999; background-color: #050505; display: flex; flex-direction: column; align-items: center; justify-content: center; transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1), opacity 0.8s cubic-bezier(0.76, 0, 0.24, 1); }
        .curtain-up { transform: translateY(-100%); opacity: 0; pointer-events: none; }
        .splash-text { color: #ffffff; font-family: 'Space Mono', monospace; font-size: 11px; letter-spacing: 0.3em; text-transform: uppercase; font-weight: bold; opacity: 0; animation: blurFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        .splash-line-container { width: 180px; height: 1px; background-color: rgba(255,255,255,0.15); margin-top: 24px; overflow: hidden; opacity: 0; animation: blurFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards; }
        .splash-line-progress { height: 100%; background-color: #ffffff; width: 0%; animation: loadProgress 1.5s cubic-bezier(0.8, 0, 0.2, 1) 0.4s forwards; }
        @keyframes blurFadeIn { 0% { opacity: 0; filter: blur(5px); transform: translateY(10px); } 100% { opacity: 1; filter: blur(0px); transform: translateY(0); } }
        @keyframes loadProgress { 0% { width: 0%; } 40% { width: 60%; } 100% { width: 100%; } }
      `}} />

      {!removeSplash && showSplash && (
        <div className={`splash-screen ${liftCurtain ? 'curtain-up' : ''}`}>
          <div className="splash-text">{subdomain?.toUpperCase() || 'LOADING'}.SYS</div>
          <div className="splash-line-container"><div className="splash-line-progress"></div></div>
        </div>
      )}

      <main className="min-h-screen relative overflow-x-clip bg-[#050505]">
        <React.Suspense fallback={<div className="w-full min-h-screen bg-[#050505]"></div>}>
          <PortfolioView data={data} theme={data.siteAppearance || data} />
        </React.Suspense>
      </main>

      {/* PORTFOBE WATERMARK FOR FREE USERS */}
      {data.plan === 'FREE' && (
        <div className="w-full flex justify-center pb-8 pt-4 bg-transparent relative z-50">
          <a
            href="https://portfo.be?utm_source=watermark&utm_medium=portfolio"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 md:gap-3 px-4 py-2 md:px-5 md:py-2.5 bg-[#0a0a0a] hover:bg-black border border-white/10 rounded-full shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300 group"
          >
            <img src="/portfo.be2.png" alt="Portfobe" className="h-4 md:h-5 w-auto rounded object-contain opacity-70 group-hover:opacity-100 transition-opacity" />
            <span className="text-[10px] md:text-xs font-semibold text-white/70 tracking-wider group-hover:text-white transition-colors">Build with Portfo.be</span>
          </a>
        </div>
      )}
    </>
  );
}
