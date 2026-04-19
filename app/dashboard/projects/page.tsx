"use client";

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProjectsPage() {
  
  // Fungsi Coming Soon yang dipercantik (Ala SaaS)
  const handleComingSoon = () => {
    toast('Fitur ini sedang dirakit oleh tim kami!', {
      icon: '🚀',
      style: { 
        borderRadius: '16px', 
        background: '#0f172a', // Slate 900
        color: '#fff',
        fontSize: '13px',
        fontWeight: 'bold',
        padding: '12px 20px',
        border: '1px solid #1e293b',
        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
      }
    });
  };

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-[#ff9e00]/30 selection:text-slate-900 pb-20">
      
      {/* INJEKSI CSS GLOBAL KHUSUS HALAMAN INI */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .bg-blueprint {
            background-size: 30px 30px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }

        .animate-enter {
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* Latar Belakang Kertas Cetak Biru (Blueprint) */}
      <div className="absolute inset-0 bg-blueprint pointer-events-none z-0"></div>
      
      {/* Latar Belakang Cahaya Halus */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-400/5 blur-[100px] rounded-full pointer-events-none z-0"></div>

      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        <Toaster position="top-center" reverseOrder={false} />

        {/* HEADER SECTION */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 animate-enter">
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
              Projects <span className="font-light text-slate-400">Library</span>
            </h1>
            <p className="text-sm md:text-base text-slate-500 font-medium">
              Kanvas kosong Anda. Mulai pamerkan mahakarya terbaikmu ke dunia.
            </p>
          </div>

          {/* Tombol Utama (Primary CTA) */}
          <button 
            onClick={handleComingSoon}
            className="group shrink-0 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[13px] font-bold uppercase tracking-widest flex items-center gap-3 shadow-xl hover:bg-[#ff9e00] hover:text-black hover:shadow-[0_15px_40px_rgba(255,158,0,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-300"
          >
            <i className="fas fa-plus text-xs group-hover:rotate-90 transition-transform duration-300"></i>
            Tambah Proyek
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="grid grid-cols-1 gap-6 animate-enter" style={{animationDelay: '100ms', opacity: 0}}>
          
          {/* EMPTY STATE YANG SANGAT INTERAKTIF (HIGH-END DESIGN) */}
          <div 
            onClick={handleComingSoon}
            className="group relative col-span-full py-24 md:py-32 px-6 flex flex-col items-center justify-center text-center bg-white rounded-[2.5rem] border border-slate-200 shadow-[0_10px_40px_rgba(0,0,0,0.02)] cursor-pointer overflow-hidden transition-all duration-500 hover:border-[#ff9e00]/50 hover:shadow-[0_20px_60px_rgba(255,158,0,0.08)]"
          >
            
            {/* Animasi Latar Belakang (Ghost Cards) yang muncul saat Hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg flex justify-center items-center gap-4 opacity-[0.03] group-hover:opacity-20 pointer-events-none transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] scale-90 group-hover:scale-100 z-0">
              <div className="w-24 h-32 md:w-32 md:h-40 bg-slate-400 rounded-2xl -rotate-12 translate-y-8 group-hover:-translate-x-4 transition-all duration-700"></div>
              <div className="w-32 h-40 md:w-40 md:h-48 bg-slate-500 rounded-2xl z-10 shadow-2xl"></div>
              <div className="w-24 h-32 md:w-32 md:h-40 bg-slate-400 rounded-2xl rotate-12 translate-y-8 group-hover:translate-x-4 transition-all duration-700"></div>
            </div>

            {/* Lingkaran Ikon Tengah */}
            <div className="relative z-10 w-20 h-20 bg-slate-50 border-4 border-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-2 group-hover:scale-110 transition-all duration-500 ease-out">
              <div className="absolute inset-0 bg-[#ff9e00] rounded-full blur-md opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
              <i className="fas fa-layer-group text-2xl text-slate-300 group-hover:text-[#ff9e00] transition-colors duration-500 relative z-10"></i>
            </div>
            
            <h3 className="relative z-10 text-2xl font-extrabold text-slate-900 mb-3 tracking-tight">
              Belum ada mahakarya di sini.
            </h3>
            
            <p className="relative z-10 text-slate-500 font-medium max-w-sm mx-auto leading-relaxed mb-8">
              Ruang pameran Anda masih kosong. Unggah gambar, video, atau tautan desain pertama Anda untuk mulai memikat klien.
            </p>
            
            <div className="relative z-10 bg-slate-100 text-slate-600 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 group-hover:bg-slate-900 group-hover:text-white transition-colors duration-300">
              Mulai Unggah Sekarang <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
            </div>

          </div>

          {/* TIPS SECTION BAWAH */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 animate-enter" style={{animationDelay: '200ms', opacity: 0}}>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0"><i className="fas fa-image text-sm"></i></div>
               <div>
                 <h4 className="font-bold text-slate-900 text-sm mb-1">Kualitas Tinggi</h4>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed">Unggah aset dengan resolusi terbaik. Sistem kami akan mengompresinya secara otomatis tanpa pecah.</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0"><i className="fas fa-video text-sm"></i></div>
               <div>
                 <h4 className="font-bold text-slate-900 text-sm mb-1">Mendukung Video</h4>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed">Tautkan karya dari YouTube atau Vimeo untuk performa tayangan portofolio yang secepat kilat.</p>
               </div>
            </div>
            <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex items-start gap-4">
               <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0"><i className="fas fa-grip-horizontal text-sm"></i></div>
               <div>
                 <h4 className="font-bold text-slate-900 text-sm mb-1">Auto-Masonry</h4>
                 <p className="text-xs font-medium text-slate-500 leading-relaxed">Tidak perlu repot menata. Semua proyek akan otomatis tersusun rapi berapapun ukuran orientasinya.</p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}