"use client";

import React, { useState, useEffect } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function ThemesPage() {
  const router = useRouter();
  
  // STATE UNTUK MENYIMPAN TEMA & SUBDOMAIN
  const [currentTheme, setCurrentTheme] = useState<string>('brutalism');
  const [subdomain, setSubdomain] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentTheme = async () => {
      try {
        const res = await fetch('/api/appearance');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.themeTemplate) setCurrentTheme(data.themeTemplate);
            if (data.subdomain) setSubdomain(data.subdomain);
          }
        }
      } catch (error) {
        console.error("Gagal memuat data saat ini:", error);
      } finally {
        // Delay buatan 800ms agar Anda bisa menikmati animasi loading skeleton yang keren
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    
    fetchCurrentTheme();
  }, []);

  const handleUseTheme = async (themeId: string, themeName: string) => {
    // 1. Sekarang kita mengizinkan 'brutalism' DAN 'minimalist' untuk masuk
    if (themeId === 'brutalism' || themeId === 'minimalist') {
      const toastId = toast.loading(`Menerapkan tema ${themeName}...`, {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      });
      
      try {
        // 2. SIMPAN PILIHAN TEMA KE DATABASE SECARA INSTAN
        await fetch('/api/appearance', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeTemplate: themeId })
        });

        toast.success('Tema berhasil diterapkan!', { 
            id: toastId,
            style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
            iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' }
        });
        
        setCurrentTheme(themeId);

        // 3. Bawa user ke halaman Editor
        setTimeout(() => {
          router.push('/dashboard/appearance'); 
        }, 800);

      } catch (error) {
        toast.error('Gagal menerapkan tema.', { id: toastId });
      }

    } else {
      // Untuk tema lain yang isAvailable-nya masih false
      toast(`Tema ${themeName} akan segera hadir!`, {
        icon: '🔒',
        style: { 
          borderRadius: '16px', background: '#0a0a0a', color: '#fff',
          fontWeight: '600', fontSize: '13px', padding: '14px 24px',
          border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }
      });
    }
  };

  const handleProComingSoon = () => {
    toast('Fitur Pro Creator Editor masih dalam tahap pengembangan.', {
      icon: '✨',
      style: { borderRadius: '16px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  const themes = [
    {
        id: 'minimalist',
        name: 'Minimalist Clean',
        desc: 'Bento Grid, Startup Vibe, Clean Space.',
        preview: 'bg-slate-100',
        isAvailable: true, 
        content: (
            <div className="absolute inset-0 flex items-center justify-center p-6 scale-90 w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-3">
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-end p-4 transition-all duration-500 delay-75 group-hover:-translate-y-1">
                        <div className="w-1/2 h-3 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center transition-all duration-500 delay-100 group-hover:-translate-y-1">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><i className="fas fa-bolt text-[8px]"></i></div>
                    </div>
                    <div className="col-span-1 row-span-2 bg-slate-800 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-slate-700 transition-all duration-500 delay-150 group-hover:-translate-y-1"></div>
                    <div className="col-span-2 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center px-4 transition-all duration-500 delay-200 group-hover:-translate-y-1">
                        <div className="w-3/4 h-2 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'brutalism',
        name: 'Neo Brutalism',
        desc: 'Dark mode, Cinematic, Massive Type.',
        preview: 'bg-[#0a0a0a]',
        isAvailable: true, 
        img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'elegant',
        name: 'Elegant Serif',
        desc: 'Earth Tones, Fine Art, Elegant.',
        preview: 'bg-[#e5e5e5]',
        isAvailable: false, 
        img: 'https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=600&auto=format&fit=crop'
    }
  ];

  // =======================================================================
  // UI: SKELETON LOADING ANIMATION (Menyesuaikan Gaya Kartu Baru)
  // =======================================================================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden pb-24">
        <style dangerouslySetInnerHTML={{__html: `
          .bg-grid-slate { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px); }
          .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        `}} />
        <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
          
          {/* Header Skeleton */}
          <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
            <div>
              <div className="w-28 h-7 shimmer rounded-full mb-6"></div>
              <div className="w-64 md:w-80 h-12 shimmer rounded-lg mb-4"></div>
              <div className="w-full max-w-md h-4 shimmer rounded-full mb-2"></div>
              <div className="w-64 h-4 shimmer rounded-full"></div>
            </div>
            <div className="w-40 h-14 shimmer rounded-full hidden md:block"></div>
          </div>

          {/* Grid Skeleton (Immersive Style) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-slate-100 rounded-[2.5rem] border border-slate-200 h-[450px] relative overflow-hidden shadow-sm">
                <div className="absolute inset-0 shimmer"></div>
                <div className="absolute inset-x-3 bottom-3 h-[180px] bg-white/40 backdrop-blur-md rounded-[2rem] p-5 flex flex-col justify-end gap-3 border border-white/40">
                   <div className="w-2/3 h-6 bg-slate-300/50 rounded-md"></div>
                   <div className="w-full h-3 bg-slate-300/50 rounded-md"></div>
                   <div className="w-4/5 h-3 bg-slate-300/50 rounded-md mb-3"></div>
                   <div className="w-full h-12 bg-slate-300/50 rounded-2xl"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // =======================================================================
  // UI: TAMPILAN UTAMA SETELAH DATA BERHASIL DIAMBIL
  // =======================================================================
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px) scale(0.98); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        
        .animate-spin-slow { animation: spin 10s linear infinite; }

        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }
      `}} />

      {/* <Toaster /> DIHAPUS DARI SINI UNTUK MENCEGAH DOBEL NOTIFIKASI */}

      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      {/* Subtle Glow Monokrom di pojok */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="mb-12 animate-enter flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-6 shadow-sm">
              <i className="fas fa-layer-group text-slate-400"></i> Desain Visual
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 mb-4 flex items-center justify-center md:justify-start gap-3">
              Koleksi Tema.
              <i className="fas fa-palette text-slate-300 text-[1.5rem] md:text-[2rem] animate-spin-slow"></i>
            </h1>
            <p className="text-slate-500 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
              Tentukan fondasi estetika portofoliomu. Klik salah satu tema untuk mulai merakit dan mendesain.
            </p>
          </div>
          
          {subdomain && (
            <div className="flex justify-center md:justify-end">
              <a 
                href={`/${subdomain}`} 
                target="_blank" 
                rel="noreferrer"
                className="group inline-flex items-center gap-3 px-7 py-4 bg-white border border-slate-200 text-slate-900 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm hover:shadow-md active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                  <i className="fas fa-external-link-alt text-slate-500 group-hover:text-slate-800 transition-colors"></i>
                </div>
                Lihat Portofolio
              </a>
            </div>
          )}
        </div>

        {/* THEME GRID (IMMERSIVE CARD STYLE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          
          {themes.map((theme, index) => {
              const isActive = currentTheme === theme.id;

              return (
                <div 
                  key={theme.id} 
                  className={`animate-enter group relative rounded-[2.5rem] overflow-hidden transition-all duration-500 h-[450px] bg-slate-100
                    ${isActive ? 'border-2 border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] scale-[1.02] ring-4 ring-slate-900/5 z-10' : 
                    theme.isAvailable ? 'border border-slate-200/60 shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2' : 
                    'border border-slate-200/60 opacity-90'} 
                  `}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                    
                    {/* BACKGROUND IMAGE / CONTENT (FULL BLEED) */}
                    <div className="absolute inset-0 bg-slate-100">
                        {theme.img ? (
                            <img 
                              src={theme.img} 
                              className={`w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 ${!theme.isAvailable && 'blur-[2px] grayscale'}`} 
                              alt={theme.name} 
                            />
                        ) : (
                            theme.content
                        )}
                    </div>

                    {/* OVERLAY GRADIENT (Top to Bottom) */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/90 opacity-70 group-hover:opacity-80 transition-opacity duration-500"></div>
                    
                    {/* BADGE STATUS (Top Left) */}
                    <div className="absolute top-5 left-5 z-20">
                      {isActive ? (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 bg-white px-3 py-1.5 rounded-xl shadow-lg border border-white/20 backdrop-blur-md">
                          <i className="fas fa-check-circle"></i> Dipakai
                        </span>
                      ) : !theme.isAvailable && (
                        <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-white bg-slate-900/50 px-3 py-1.5 rounded-xl border border-white/10 backdrop-blur-md">
                          <i className="fas fa-lock"></i> Segera
                        </span>
                      )}
                    </div>

                    {/* BOTTOM GLASSMORPHISM PANEL */}
                    <div className="absolute inset-x-3 bottom-3 bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 sm:p-6 flex flex-col transform transition-all duration-500">
                        
                        <div className="flex justify-between items-start mb-2">
                          <h4 className={`font-extrabold text-xl sm:text-2xl tracking-tight text-white drop-shadow-sm`}>
                            {theme.name}
                          </h4>
                          {/* Indikator Panah saat Hover (Hanya jika tersedia & belum aktif) */}
                          {!isActive && theme.isAvailable && (
                            <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 shrink-0">
                              <i className="fas fa-arrow-right text-[10px] -rotate-45"></i>
                            </div>
                          )}
                        </div>
                        
                        <p className="text-[11px] sm:text-xs font-medium text-slate-300 leading-relaxed mb-6">
                          {theme.desc}
                        </p>

                        {/* TOMBOL AKSI DI DALAM KACA */}
                        <button 
                            onClick={() => handleUseTheme(theme.id, theme.name)}
                            className={`w-full py-3.5 rounded-xl text-[11px] font-extrabold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 border
                              ${isActive 
                                ? 'bg-white text-slate-900 border-white shadow-md hover:bg-slate-100' 
                                : theme.isAvailable 
                                  ? 'bg-slate-800/80 text-white border-slate-700 hover:bg-white hover:text-slate-900' 
                                  : 'bg-slate-800/50 text-slate-500 border-slate-700/50 cursor-not-allowed'
                              }
                            `}
                        >
                            {theme.isAvailable ? (
                              isActive ? (
                                <> <i className="fas fa-cog"></i> Kustomisasi </>
                              ) : (
                                <> <i className="fas fa-magic"></i> Gunakan </>
                              )
                            ) : (
                              <> <i className="fas fa-clock"></i> Tahap Desain </>
                            )}
                        </button>
                    </div>
                </div>
              );
          })}

          {/* MORE THEMES PLACEHOLDER (Monokrom Style) */}
          <div className="animate-enter border-2 border-dashed border-slate-200 rounded-[2.5rem] flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-500 group cursor-default" style={{ animationDelay: '600ms' }}>
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 group-hover:bg-slate-900">
                  <i className="fas fa-paint-brush text-slate-400 group-hover:text-white transition-colors"></i>
              </div>
              <h4 className="font-extrabold text-slate-700 text-lg mb-1 group-hover:text-slate-900 transition-colors">Tema Lainnya</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Sedang dirancang oleh desainer.</p>
          </div>
        </div>

        {/* PRO CREATOR THEME EDITOR BANNER (Dark Monokrom) */}
        <div 
          onClick={handleProComingSoon}
          className="relative overflow-hidden bg-[#0a0a0a] p-10 md:p-16 rounded-[2.5rem] border border-white/5 cursor-pointer group hover:border-white/10 transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.15)] animate-enter hover:-translate-y-1"
          style={{animationDelay: '700ms'}}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03]"></div>
          
          {/* Subtle White Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-slate-100/5 blur-[100px] rounded-full group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>

          <div className="absolute -top-10 -right-10 p-10 opacity-[0.02] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 pointer-events-none">
              <i className="fas fa-swatchbook text-[20rem] text-white"></i>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 group-hover:text-white transition-colors backdrop-blur-sm">
                <i className="fas fa-crown text-slate-300"></i> Pro Feature
              </div>

              <h4 className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                Live Theme <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 font-light">Editor.</span>
              </h4>
              
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg group-hover:text-slate-300 transition-colors duration-500">
                  Kendalikan setiap piksel portofoliomu. Ubah tata letak, warna, tipografi, dan efek secara instan dengan editor visual kelas studio profesional.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {['Color Palettes', 'Typography', 'Grid Control', 'Dark Mode Switch'].map((tag) => (
                      <span key={tag} className="px-5 py-2.5 bg-white/5 text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default backdrop-blur-md">
                          {tag}
                      </span>
                  ))}
              </div>

              <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.05)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.15)] transition-all duration-300 active:scale-95 group-hover:bg-slate-200">
                  <i className="fas fa-lock text-slate-400"></i> Segera Hadir
              </div>
          </div>
        </div>

      </div>
    </main>
  );
}