// File: app/[subdomain]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import PortfolioView from '@/components/PortfolioView';

export default function PublicPortfolioPage() {
  const params = useParams();
  const subdomain = params.subdomain as string;

  const [data, setData] = useState<any>(null);
  
  // --- STATE KONTROL ALUR ---
  const [isFetching, setIsFetching] = useState(true);
  const [showSplash, setShowSplash] = useState(false); 
  const [liftCurtain, setLiftCurtain] = useState(false);
  const [removeSplash, setRemoveSplash] = useState(false);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // --- FIX: Hanya menambahkan pencegah Cache agar data selalu baru ---
        // Sisanya 100% sama persis dengan struktur asli Anda
        const res = await fetch(`/api/portfolio/${subdomain}?t=${new Date().getTime()}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });

        if (res.ok) {
          const result = await res.json();
          setData(result);
          
          // --- LOGIKA PENENTUAN SPLASH ASLI ---
          if (result.splashScreen === true) {
            setShowSplash(true);
            setTimeout(() => {
              setLiftCurtain(true);
              setTimeout(() => setRemoveSplash(true), 800);
            }, 1800);
          } else {
            setLiftCurtain(true);
            setRemoveSplash(true);
            setShowSplash(false);
          }
        }
      } catch (error) {
        console.error("Gagal memuat portofolio");
      } finally {
        setIsFetching(false);
      }
    };
    if (subdomain) fetchPortfolio();
  }, [subdomain]);

  // --- TAMPILAN 404 ---
  if (!isFetching && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] font-mono p-10 text-center animate-in fade-in duration-700">
        <h1 className="text-6xl font-black mb-4 text-slate-800">404</h1>
        <p className="uppercase font-bold text-slate-500 mb-8">Portfolio [ {subdomain} ] Not Found.</p>
        <a href="/" className="px-8 py-3 bg-slate-900 text-white font-bold uppercase text-xs rounded-full hover:bg-slate-800 transition-colors">Kembali ke Beranda</a>
      </div>
    );
  }

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .splash-screen {
          position: fixed; inset: 0; z-index: 9999; background-color: #050505;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          transition: transform 0.8s cubic-bezier(0.76, 0, 0.24, 1);
        }
        .curtain-up { transform: translateY(-100%); }
        .splash-text {
          color: #ffffff; font-family: 'Space Mono', monospace; font-size: 11px;
          letter-spacing: 0.3em; text-transform: uppercase; font-weight: bold;
          opacity: 0; animation: blurFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .splash-line-container {
          width: 180px; height: 1px; background-color: rgba(255,255,255,0.15);
          margin-top: 24px; overflow: hidden; opacity: 0;
          animation: blurFadeIn 1s cubic-bezier(0.22, 1, 0.36, 1) 0.3s forwards;
        }
        .splash-line-progress {
          height: 100%; background-color: #ffffff; width: 0%;
          animation: loadProgress 1.5s cubic-bezier(0.8, 0, 0.2, 1) 0.4s forwards;
        }
        @keyframes blurFadeIn {
          0% { opacity: 0; filter: blur(5px); transform: translateY(10px); }
          100% { opacity: 1; filter: blur(0px); transform: translateY(0); }
        }
        @keyframes loadProgress { 0% { width: 0%; } 40% { width: 60%; } 100% { width: 100%; } }
        
        .initial-loader {
          position: fixed; inset: 0; z-index: 9998; background-color: #F1F5F9;
          display: flex; align-items: center; justify-content: center;
          transition: opacity 0.5s ease;
        }
      `}} />

      {isFetching && (
        <div className="initial-loader">
          <div className="w-6 h-6 border-2 border-slate-200 border-t-slate-900 rounded-full animate-spin"></div>
        </div>
      )}

      {!removeSplash && showSplash && (
        <div className={`splash-screen ${liftCurtain ? 'curtain-up' : ''}`}>
          <div className="splash-text">{subdomain || 'LOADING'}.SYS</div>
          <div className="splash-line-container"><div className="splash-line-progress"></div></div>
        </div>
      )}

      <main className={`min-h-screen bg-[#F1F5F9] text-black font-sans antialiased selection:bg-black selection:text-white p-0 sm:p-8 md:p-12 relative overflow-x-clip transition-all duration-1000
        ${liftCurtain ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'}
      `}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;900&family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Playfair+Display:wght@700&display=swap');
          @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
        `}} />
        <div className="absolute inset-0 opacity-[0.4] pointer-events-none hidden sm:block" style={{ backgroundImage: 'linear-gradient(#cbd5e1 1px, transparent 1px), linear-gradient(90deg, #cbd5e1 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        {/* Dikembalikan ke struktur ASLI: theme={data} */}
        {data && <PortfolioView data={data} theme={data} />}
      </main>
    </>
  );
}