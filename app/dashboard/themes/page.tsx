"use client";

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ThemesPage() {
  
  const handleComingSoon = () => {
    toast('Kustomisasi tema akan segera hadir!', {
      icon: '✨',
      style: { 
        borderRadius: '12px', 
        background: '#0a0a0a', 
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '13px',
        padding: '12px 20px',
        border: '1px solid #27272a',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
      }
    });
  };

  const themes = [
    {
        id: 'minimalist',
        name: 'The Minimalist',
        desc: 'Bento Grid, Startup Vibe, Clean Space.',
        preview: 'bg-slate-50',
        // Pure CSS Interactive Preview: Monokromatik & Sangat Profesional
        content: (
            <div className="absolute inset-0 flex items-center justify-center p-6 scale-[0.85] group-hover:scale-95 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] w-full h-full">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-3">
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-end p-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-75">
                        <div className="w-1/2 h-3 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                        {/* Aksen oranye tunggal yang sangat halus */}
                        <div className="w-6 h-6 rounded-full bg-orange-50 text-[#ff9e00] flex items-center justify-center"><i className="fas fa-bolt text-[8px]"></i></div>
                    </div>
                    <div className="col-span-1 row-span-2 bg-slate-900 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-slate-800 opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-150"></div>
                    <div className="col-span-2 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center px-4 opacity-50 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                        <div className="w-3/4 h-2 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'director',
        name: 'The Director',
        desc: 'Dark mode, Cinematic, Massive Type.',
        preview: 'bg-[#0a0a0a]',
        img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'gallery',
        name: 'The Boutique',
        desc: 'Earth Tones, Fine Art, Elegant.',
        preview: 'bg-[#f4f4f2]',
        img: 'https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=600&auto=format&fit=crop'
    }
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-[#ff9e00]/30 selection:text-slate-900 pb-24">
      
      {/* INJEKSI CSS GLOBAL KHUSUS HALAMAN INI */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { animation: slideUpFade 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        /* Latar belakang Grid yang halus dan profesional */
        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }
      `}} />

      <Toaster position="top-center" />

      {/* Latar Belakang Grid (Tanpa warna-warni pelangi) */}
      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* HEADER SECTION - Clean Typography */}
        <div className="mb-14 animate-enter text-center md:text-left mt-4">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-3">
            Koleksi <span className="font-light text-slate-400">Tema.</span>
          </h1>
          <p className="text-slate-500 font-medium text-lg max-w-xl">Pilih fondasi portofoliomu. Setiap tema dirancang dengan presisi piksel oleh desainer top kami.</p>
        </div>

        {/* THEME GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 animate-enter" style={{animationDelay: '100ms', opacity: 0}}>
          
          {themes.map((theme) => (
              <div key={theme.id} className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:border-slate-300 transition-all duration-500 group flex flex-col cursor-pointer hover:-translate-y-1">
                  
                  {/* Preview Image/Content Area */}
                  <div className={`aspect-[4/3] ${theme.preview} relative overflow-hidden`}>
                      
                      {theme.img ? (
                          // Efek gambar grayscale yang elegan saat diam, berubah berwarna saat di-hover
                          <img 
                            src={theme.img} 
                            className="w-full h-full object-cover grayscale-[80%] opacity-80 group-hover:grayscale-0 group-hover:opacity-100 group-hover:scale-105 transition-all duration-[1s] ease-[cubic-bezier(0.22,1,0.36,1)]" 
                            alt={theme.name} 
                          />
                      ) : (
                          theme.content
                      )}
                      
                      {/* Hover Overlay Gelap & Tombol yang Sangat Minimalis */}
                      <div className="absolute inset-0 bg-slate-900/10 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center">
                          <button 
                              onClick={handleComingSoon}
                              className="bg-white text-slate-900 px-8 py-3.5 rounded-full text-xs font-extrabold tracking-widest uppercase shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-300 translate-y-4 group-hover:translate-y-0 border border-slate-100"
                          >
                              Gunakan Tema
                          </button>
                      </div>
                  </div>

                  {/* Keterangan Tema (Typography Presisi) */}
                  <div className="p-8 bg-white z-10 border-t border-slate-100">
                      <div className="flex justify-between items-center mb-1.5">
                        <h4 className="font-extrabold text-slate-900 text-xl tracking-tight">{theme.name}</h4>
                        {/* Indikator Titik Hitam yang Profesional */}
                        {theme.id === 'minimalist' && (
                          <span className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-slate-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-900"></span> Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{theme.desc}</p>
                  </div>
              </div>
          ))}

          {/* PLACEHOLDER: THEME YANG AKAN DATANG */}
          <div className="border border-dashed border-slate-300 rounded-[2rem] flex flex-col items-center justify-center p-8 bg-slate-50/50 hover:bg-slate-50 transition-colors duration-300 group cursor-default">
              <div className="w-14 h-14 bg-white border border-slate-100 rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500">
                  <i className="fas fa-lock text-slate-300 group-hover:text-slate-900 transition-colors"></i>
              </div>
              <h4 className="font-extrabold text-slate-700 text-lg mb-1">More Themes</h4>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">Dikurasi oleh desainer kelas dunia.</p>
          </div>
        </div>

        {/* VISUAL COMING SOON: PRO CREATOR THEME EDITOR - HIGH-END DARK MODE */}
        <div 
          onClick={handleComingSoon}
          className="relative overflow-hidden bg-[#050505] p-10 md:p-16 rounded-[2.5rem] border border-white/10 cursor-pointer group hover:border-white/20 transition-all duration-500 shadow-2xl animate-enter"
          style={{animationDelay: '200ms', opacity: 0}}
        >
          {/* Noise Texture untuk Kesan Mewah */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03]"></div>
          
          {/* Pendaran Aksent Oranye yang Sangat Sangat Tipis & Eksklusif */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[200px] bg-[#ff9e00]/5 blur-[120px] rounded-full group-hover:bg-[#ff9e00]/10 transition-colors duration-700"></div>

          {/* Ikon Latar Belakang Tipis */}
          <div className="absolute top-0 right-10 p-10 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-all duration-700 pointer-events-none">
              <i className="fas fa-swatchbook text-[15rem]"></i>
          </div>

          <div className="relative z-10 flex flex-col items-center text-center max-w-2xl mx-auto">
              
              {/* Badge Pro */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-white/70 mb-8 group-hover:text-white transition-colors">
                <i className="fas fa-crown text-[#ff9e00]"></i> Pro Feature
              </div>

              <h4 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                Live Theme <span className="font-light text-slate-500">Editor.</span>
              </h4>
              
              <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10 max-w-lg">
                  Kendalikan setiap piksel portofoliomu. Ubah tata letak, warna, tipografi, dan efek secara instan dengan editor visual kelas studio.
              </p>
              
              <div className="flex flex-wrap justify-center gap-3 mb-10">
                  {['Color Palettes', 'Typography', 'Grid Control', 'Dark Mode Switch'].map((tag, i) => (
                      <span key={tag} className="px-5 py-2 bg-[#111] text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default" style={{animationDelay: `${i*100}ms`}}>
                          {tag}
                      </span>
                  ))}
              </div>

              {/* Tombol yang sangat kontras */}
              <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg group-hover:bg-slate-200 transition-all duration-300 active:scale-95">
                  <i className="fas fa-lock text-slate-500"></i> Segera Hadir
              </div>
          </div>
        </div>

      </div>
    </main>
  );
}