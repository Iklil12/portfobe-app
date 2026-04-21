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

  // --- GANTI FUNGSI INI DI app/dashboard/themes/page.tsx ---
  const handleUseTheme = async (themeId: string, themeName: string) => {
    
    // 1. Sekarang kita mengizinkan 'brutalism' DAN 'minimalist' untuk masuk
    if (themeId === 'brutalism' || themeId === 'minimalist') {
      const toastId = toast.loading(`Menerapkan tema ${themeName}...`);
      
      try {
        // 2. SIMPAN PILIHAN TEMA KE DATABASE SECARA INSTAN
        // Ini memastikan saat Editor terbuka, ia memuat tema yang benar
        await fetch('/api/appearance', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeTemplate: themeId })
        });

        toast.success('Tema berhasil diterapkan!', { id: toastId });
        
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
        preview: 'bg-slate-50',
        isAvailable: true, 
        content: (
            <div className="absolute inset-0 flex items-center justify-center p-6 scale-[0.85] group-hover:scale-95 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full h-full">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-3">
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-end p-4 opacity-40 group-hover:opacity-100 transition-all duration-500 delay-75 group-hover:-translate-y-1">
                        <div className="w-1/2 h-3 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center opacity-40 group-hover:opacity-100 transition-all duration-500 delay-100 group-hover:-translate-y-1">
                        <div className="w-6 h-6 rounded-full bg-orange-50 text-[#ff9e00] flex items-center justify-center"><i className="fas fa-bolt text-[8px]"></i></div>
                    </div>
                    <div className="col-span-1 row-span-2 bg-slate-900 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-slate-800 opacity-40 group-hover:opacity-100 transition-all duration-500 delay-150 group-hover:-translate-y-1"></div>
                    <div className="col-span-2 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center px-4 opacity-40 group-hover:opacity-100 transition-all duration-500 delay-200 group-hover:-translate-y-1">
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
        preview: 'bg-[#f4f4f2]',
        isAvailable: false, 
        img: 'https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=600&auto=format&fit=crop'
    }
  ];

  // =======================================================================
  // UI: SKELETON LOADING ANIMATION (TAMPILAN SAAT DATA SEDANG DIAMBIL)
  // =======================================================================
  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden pb-24">
        {/* CSS Tambahan agar animasi pulse lebih halus */}
        <style dangerouslySetInnerHTML={{__html: `
          .bg-grid-slate { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px); }
          .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        `}} />
        <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
          
          {/* Header Skeleton */}
          <div className="mb-16 flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
            <div>
              <div className="w-28 h-7 shimmer rounded-full mb-6"></div>
              <div className="w-64 md:w-80 h-12 shimmer rounded-lg mb-4"></div>
              <div className="w-full max-w-md h-4 shimmer rounded-full mb-2"></div>
              <div className="w-64 h-4 shimmer rounded-full"></div>
            </div>
            <div className="w-40 h-12 shimmer rounded-full hidden md:block"></div>
          </div>

          {/* Grid Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-[2rem] border border-slate-100 overflow-hidden flex flex-col h-[380px] shadow-[0_10px_30px_rgba(0,0,0,0.02)]">
                <div className="aspect-[4/3] shimmer"></div>
                <div className="p-8 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <div className="w-32 h-6 shimmer rounded-md"></div>
                      <div className="w-6 h-6 shimmer rounded-full"></div>
                    </div>
                    <div className="w-full h-2.5 shimmer rounded-full mt-3"></div>
                    <div className="w-2/3 h-2.5 shimmer rounded-full mt-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Banner Skeleton */}
          <div className="h-[250px] w-full shimmer rounded-[2.5rem]"></div>
        </div>
      </main>
    );
  }

  // =======================================================================
  // UI: TAMPILAN UTAMA SETELAH DATA BERHASIL DIAMBIL
  // =======================================================================
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-[#ff9e00]/30 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0;
            animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(40px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes float {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
        }
        .animate-float { animation: float 4s ease-in-out infinite; }

        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }
      `}} />

      <Toaster position="top-center" />

      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* HEADER SECTION */}
        <div className="mb-16 animate-enter flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-6">
              <i className="fas fa-layer-group text-slate-400"></i> Desain Visual
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
              Koleksi <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-300">Tema.</span>
            </h1>
            <p className="text-slate-500 font-medium text-base max-w-xl leading-relaxed">
              Tentukan fondasi estetika portofoliomu. Klik salah satu tema untuk mulai merakit dan mendesain.
            </p>
          </div>
          
          {subdomain && (
            <div className="flex justify-center md:justify-end">
              <a 
                href={`/${subdomain}`} 
                target="_blank" 
                rel="noreferrer"
                className="group inline-flex items-center gap-3 px-7 py-4 bg-white border border-slate-200 text-slate-900 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-[0_10px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_15px_30px_rgba(0,0,0,0.08)] active:scale-95"
              >
                <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#ff9e00]/10 transition-colors">
                  <i className="fas fa-external-link-alt text-slate-500 group-hover:text-[#ff9e00] transition-colors"></i>
                </div>
                Lihat Portofolio
              </a>
            </div>
          )}
        </div>

        {/* THEME GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          
          {themes.map((theme, index) => {
              const isActive = currentTheme === theme.id;

              return (
                <div 
                  key={theme.id} 
                  className={`animate-enter bg-white rounded-[2rem] overflow-hidden flex flex-col cursor-pointer transition-all duration-500 group relative
                    ${isActive ? 'border-2 border-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.12)] scale-[1.02] ring-4 ring-slate-900/5' : 
                    theme.isAvailable ? 'border border-slate-200 shadow-sm hover:shadow-[0_25px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:border-slate-300' : 
                    'border border-slate-200/60 opacity-90'} 
                  `}
                  style={{ animationDelay: `${(index + 1) * 150}ms` }}
                >
                    
                    {/* BADGE TEMA AKTIF (GLOWING) */}
                    {isActive && (
                      <div className="absolute top-4 right-4 z-20 animate-float">
                        <div className="relative">
                          <div className="absolute inset-0 bg-[#ff9e00] blur-md opacity-40 rounded-full"></div>
                          <span className="relative flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-slate-900 bg-[#ff9e00] px-3 py-1.5 rounded-full shadow-lg border border-[#ff9e00]/20">
                            <i className="fas fa-check-circle"></i> Terpilih
                          </span>
                        </div>
                      </div>
                    )}

                    {/* PREVIEW GAMBAR / KONTEN */}
                    <div className={`aspect-[4/3] ${theme.preview} relative overflow-hidden bg-slate-100`}>
                        {theme.img ? (
                            <img 
                              src={theme.img} 
                              className={`w-full h-full object-cover grayscale-[60%] opacity-90 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${!theme.isAvailable && 'blur-[2px] grayscale-[100%]'}`} 
                              alt={theme.name} 
                            />
                        ) : (
                            theme.content
                        )}
                        
                        {/* OVERLAY TOMBOL AKSI */}
                        <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center z-10">
                            <button 
                                onClick={() => handleUseTheme(theme.id, theme.name)}
                                className="bg-white text-slate-900 px-8 py-3.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-300 translate-y-6 group-hover:translate-y-0 border border-slate-100 flex items-center gap-2"
                            >
                                {theme.isAvailable ? (
                                  isActive ? (
                                    <> <i className="fas fa-cog text-[10px] text-[#ff9e00]"></i> Kustomisasi Tema </>
                                  ) : (
                                    <> <i className="fas fa-palette text-[10px] text-[#ff9e00]"></i> Gunakan Tema </>
                                  )
                                ) : (
                                  <> <i className="fas fa-lock text-[10px] text-slate-400"></i> Segera Hadir </>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* KETERANGAN TEKS */}
                    <div className="p-8 bg-white z-10 border-t border-slate-100 flex-1 flex flex-col justify-between relative">
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <h4 className={`font-extrabold text-xl tracking-tight transition-colors duration-300 ${theme.isAvailable ? 'text-slate-900 group-hover:text-[#ff9e00]' : 'text-slate-500'}`}>
                              {theme.name}
                            </h4>
                            {!isActive && !theme.isAvailable && (
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                                <i className="fas fa-lock text-[9px]"></i>
                              </span>
                            )}
                            {!isActive && theme.isAvailable && (
                              <span className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-50 text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <i className="fas fa-arrow-right text-[10px] -rotate-45"></i>
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.15em] leading-relaxed mt-1">{theme.desc}</p>
                        </div>
                    </div>
                </div>
              );
          })}

          {/* MORE THEMES PLACEHOLDER */}
          <div className="animate-enter border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-lg transition-all duration-500 group cursor-default" style={{ animationDelay: '600ms' }}>
              <div className="w-14 h-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 group-hover:bg-slate-900">
                  <i className="fas fa-paint-brush text-slate-400 group-hover:text-white transition-colors"></i>
              </div>
              <h4 className="font-extrabold text-slate-700 text-lg mb-1 group-hover:text-slate-900 transition-colors">More Themes</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Sedang dirancang oleh desainer.</p>
          </div>
        </div>

        {/* PRO CREATOR THEME EDITOR BANNER */}
        <div 
          onClick={handleProComingSoon}
          className="relative overflow-hidden bg-[#050505] p-10 md:p-16 rounded-[2.5rem] border border-white/10 cursor-pointer group hover:border-white/20 transition-all duration-500 shadow-[0_30px_60px_rgba(0,0,0,0.2)] animate-enter hover:-translate-y-1"
          style={{animationDelay: '700ms'}}
        >
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.04]"></div>
          
          {/* Animated Glow Background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-[300px] bg-gradient-to-r from-[#ff9e00]/10 to-purple-500/10 blur-[100px] rounded-full group-hover:opacity-100 opacity-50 transition-opacity duration-700"></div>

          <div className="absolute -top-10 -right-10 p-10 opacity-[0.03] group-hover:scale-110 group-hover:rotate-6 transition-all duration-1000 pointer-events-none">
              <i className="fas fa-swatchbook text-[20rem]"></i>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-8 group-hover:text-white transition-colors backdrop-blur-sm">
                <i className="fas fa-crown text-[#ff9e00]"></i> Pro Feature
              </div>

              <h4 className="text-3xl md:text-5xl font-extrabold text-white mb-5 tracking-tight">
                Live Theme <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-400 to-slate-600 font-light">Editor.</span>
              </h4>
              
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg group-hover:text-slate-300 transition-colors duration-500">
                  Kendalikan setiap piksel portofoliomu. Ubah tata letak, warna, tipografi, dan efek secara instan dengan editor visual kelas studio profesional.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-12">
                  {['Color Palettes', 'Typography', 'Grid Control', 'Dark Mode Switch'].map((tag) => (
                      <span key={tag} className="px-5 py-2.5 bg-white/5 text-slate-300 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default backdrop-blur-md">
                          {tag}
                      </span>
                  ))}
              </div>

              <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-[0_0_40px_rgba(255,255,255,0.1)] group-hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 active:scale-95 group-hover:bg-slate-100">
                  <i className="fas fa-lock text-slate-400"></i> Segera Hadir
              </div>
          </div>
        </div>

      </div>
    </main>
  );
}