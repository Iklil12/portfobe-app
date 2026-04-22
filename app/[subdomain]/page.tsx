// File: app/[subdomain]/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link'; // Ditambahkan untuk tombol kembali
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

  // --- TAMPILAN 404 (JIKA USER TIDAK ADA) ---
  if (!isFetching && !data) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] font-mono p-10 text-center animate-in fade-in duration-700">
        <h1 className="text-6xl font-black mb-4 text-slate-800">404</h1>
        <p className="uppercase font-bold text-slate-500 mb-8">Portfolio [ {subdomain} ] Not Found.</p>
        <Link href="/" className="px-8 py-3 bg-slate-900 text-white font-bold uppercase text-xs rounded-full hover:bg-slate-800 transition-colors">
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

// --- TAMPILAN OFFLINE / SEDANG DIMASAK (MONOKROM MURNI + BACKGROUND BERGERAK TERANG) ---
  if (!isFetching && data && data.isLive === false) {
    return (
      <div className="relative min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center font-sans overflow-hidden selection:bg-white/30 selection:text-white">
        
        {/* CSS Custom untuk Animasi Minimalis & Latar Bergerak */}
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&display=swap');
          
          .font-mono-custom { font-family: 'Space Mono', monospace; }
          
          @keyframes subtlePulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
          .animate-subtle-pulse { animation: subtlePulse 2s ease-in-out infinite; }
          
          @keyframes revealText {
            0% { opacity: 0; transform: translateY(20px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
          }
          .animate-reveal { animation: revealText 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }

          /* --- ANIMASI BACKGROUND (INTENSITAS DINAIKKAN) --- */
          @keyframes panGrid {
            0% { background-position: 0px 0px; }
            100% { background-position: 40px 40px; }
          }
          @keyframes glowShift {
            0% { opacity: 0.1; transform: scale(1) translate(0px, 0px); }
            50% { opacity: 0.25; transform: scale(1.2) translate(30px, -30px); }
            100% { opacity: 0.1; transform: scale(1) translate(0px, 0px); }
          }
          .animate-pan-grid { animation: panGrid 4s linear infinite; }
          .animate-glow-1 { animation: glowShift 8s ease-in-out infinite; }
          .animate-glow-2 { animation: glowShift 12s ease-in-out infinite alternate-reverse; }
        `}} />

        {/* Latar Belakang 1: Cahaya Sistem Bergerak (Terlihat Lebih Terang) */}
        <div className="absolute top-0 left-0 w-[80vw] h-[80vw] bg-white blur-[120px] rounded-full pointer-events-none animate-glow-1"></div>
        <div className="absolute bottom-0 right-0 w-[60vw] h-[60vw] bg-white blur-[100px] rounded-full pointer-events-none animate-glow-2"></div>

        {/* Latar Belakang 2: Grid Garis Bergerak (Opacity dinaikkan jadi 15%) */}
        <div className="absolute inset-0 opacity-15 pointer-events-none animate-pan-grid" style={{ 
          backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.4) 1px, transparent 1px)', 
          backgroundSize: '40px 40px'
        }}></div>

        {/* Latar Belakang 3: Noise/Tekstur Halus */}
        <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")' }}></div>

        {/* --- Konten Utama --- */}
        <div className="relative z-10 flex flex-col items-center animate-reveal w-full max-w-xl mx-auto">
          
          {/* Ikon Statis & Tajam */}
          <div className="mb-10">
            <div className="w-16 h-16 border border-white/30 bg-black/40 backdrop-blur-md flex items-center justify-center relative">
               {/* Titik indikator di pojok (lebih bersinar) */}
               <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white rounded-full animate-subtle-pulse shadow-[0_0_12px_rgba(255,255,255,1)]"></div>
               <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="1.5" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
               </svg>
            </div>
          </div>
          
          {/* Tipografi Utama - Monokrom Tajam */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter mb-6">
            SEDANG <span className="text-white/50 italic font-medium">DIMASAK.</span>
          </h1>
          
          <div className="w-12 h-[2px] bg-white/40 mb-8"></div>
          
          {/* Teks Deskripsi - Gaya Terminal/Data */}
          <div className="text-left bg-black/40 border border-white/20 p-5 w-full mb-10 font-mono-custom backdrop-blur-md shadow-2xl shadow-black">
             <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/20">
                <span className="text-white/50 text-[10px] uppercase tracking-widest">Sistem Status</span>
                <span className="text-white text-[10px] uppercase tracking-widest bg-white/20 px-2 py-0.5">Offline</span>
             </div>
             <p className="text-white/90 text-xs sm:text-sm leading-relaxed mb-2">
               Akses ke entitas <b className="text-white">{data.name || subdomain}</b> ditangguhkan sementara.
             </p>
             <p className="text-white/50 text-[11px] leading-relaxed">
               Pembaruan arsitektur atau konten sedang berlangsung di balik layar. Silakan muat ulang halaman ini nanti.
             </p>
          </div>
          
          {/* Tombol Aksi - Minimalis Kasar (Brutalism touch) */}
          <Link 
            href="/" 
            className="group relative flex items-center justify-between w-full sm:w-auto min-w-[240px] px-6 py-4 bg-white text-black font-bold text-sm tracking-wide transition-transform hover:-translate-y-1 hover:shadow-[0_8px_25px_rgba(255,255,255,0.3)]"
          >
            <span>BUAT PORTOFOLIOMU JUGA</span>
            <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="square" strokeLinejoin="miter" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

        </div>
      </div>
    );
  }

  // --- TAMPILAN UTAMA (JIKA ISLIVE TRUE) ---
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