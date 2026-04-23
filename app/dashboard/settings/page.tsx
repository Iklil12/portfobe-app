"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast'; 
import { showToast } from '@/lib/customToast';
import { mutate } from 'swr';

export default function SettingsPage() {
  const { data: session, update } = useSession();
  
  const [mounted, setMounted] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [isLive, setIsLive] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/account/status');
        if (res.ok) {
          const data = await res.json();
          setIsLive(data.isLive);
        }
      } catch (error) {
        console.error("Gagal mengambil status portofolio");
      } finally {
        setTimeout(() => setIsLoadingStatus(false), 400); // Sedikit delay agar skeleton premium terlihat
      }
    };
    fetchStatus();
  }, []);

  const toggleStatus = async () => {
    const newStatus = !isLive;
    setIsLive(newStatus); 
    
    const loadingToast = toast.loading(
      newStatus ? 'Mempublikasikan portofolio...' : 'Menyembunyikan portofolio...', 
      {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      }
    );

    mutate('/api/layout-sync', (currentData: any) => {
      return { ...currentData, isLive: newStatus };
    }, { revalidate: false });

    try {
      const res = await fetch('/api/account/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive: newStatus })
      });

      if (res.ok) {
        toast.success(newStatus ? 'Portofolio kini Live!' : 'Portofolio disembunyikan.', { id: loadingToast });
        
        mutate('/api/layout-sync');
        
        await update({
          ...session,
          user: {
            ...session?.user,
            isLive: newStatus
          }
        });

      } else {
        throw new Error();
      }
    } catch (error) {
      setIsLive(!newStatus); 
      mutate('/api/layout-sync', (currentData: any) => {
        return { ...currentData, isLive: !newStatus };
      }, { revalidate: true });

      toast.error('Gagal mengubah status.', { id: loadingToast });
    }
  };

  const handleComingSoon = () => {
    showToast({
      message: "Fitur ini sedang dalam pengembangan.",
      id: "coming-soon-settings", 
      icon: "fa-tools"
    });
  };

  const confirmDeletion = async () => {
    setIsDeleting(true);
    const toastId = toast.loading('Sedang memusnahkan akun...', {
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Akun berhasil dihapus. Selamat tinggal!", { 
          id: toastId, 
          duration: 4000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' }
        });
        setTimeout(() => {
          signOut({ callbackUrl: '/register' }); 
        }, 2000);
      } else {
        const data = await response.json();
        toast.error(data.error || "Gagal menghapus akun.", { id: toastId });
        setIsDeleting(false);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan jaringan.", { id: toastId });
      setIsDeleting(false);
    }
  };

  const deleteModalContent = showDeleteModal ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={() => !isDeleting && setShowDeleteModal(false)}
      ></div>
      
      <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 animate-enter z-10">
        <div className="w-16 h-16 bg-slate-100 border border-slate-200 shadow-inner text-slate-800 rounded-full flex items-center justify-center mx-auto mb-6 relative">
          <i className="fas fa-exclamation-triangle text-xl"></i>
        </div>
        
        <h3 className="text-2xl font-black text-center text-slate-900 mb-3 tracking-tight">
          Hapus Permanen?
        </h3>
        
        <p className="text-center text-slate-500 mb-10 text-sm font-medium leading-relaxed px-2">
          Tindakan ini <span className="font-bold text-slate-900">tidak dapat dibatalkan</span>. Semua portofolio dan pengaturan URL akan dimusnahkan.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button
            onClick={() => setShowDeleteModal(false)}
            disabled={isDeleting}
            className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-sm disabled:opacity-50"
          >
            Batalkan
          </button>
          <button
            onClick={confirmDeletion}
            disabled={isDeleting}
            className="w-full sm:flex-1 py-3.5 rounded-xl font-bold text-white bg-slate-900 hover:bg-rose-600 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm shadow-lg disabled:opacity-50"
          >
            {isDeleting ? <i className="fas fa-circle-notch fa-spin text-white"></i> : 'Ya, Hapus'}
          </button>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }

        .animate-spin-slow { animation: spin 10s linear infinite; }

        .bg-grid-slate {
            background-size: 40px 40px;
            background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px),
                              linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px);
        }

        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND MONOKROM */}
      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] left-[-10%] w-[30vw] h-[30vw] bg-slate-200/30 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {/* --- PORTAL MODAL --- */}
        {mounted && createPortal(deleteModalContent, document.body)}

        {/* --- HEADER SECTION --- */}
        <div className="mb-10 sm:mb-12 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-5 shadow-sm">
            <i className="fas fa-shield-alt text-slate-400"></i> Akun & Privasi
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3 flex items-center justify-center md:justify-start gap-3">
            Keamanan.
            <i className="fas fa-asterisk text-slate-300 text-[1.2rem] md:text-[1.8rem] animate-spin-slow"></i>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg mx-auto md:mx-0">Kelola kredensial login dan status visibilitas situs portofolio Anda.</p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          
          {/* CARD 1: Status Web */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all duration-300 animate-enter" style={{animationDelay: '150ms'}}>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                {isLoadingStatus ? (
                  <div className="w-48 h-6 shimmer rounded-md"></div>
                ) : (
                  <>
                    <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Status Portofolio</h4>
                    {isLive ? (
                      <span className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative before:absolute before:inset-0 before:bg-emerald-500 before:rounded-full before:animate-ping"></span> Live
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-400 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                         <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Offline
                      </span>
                    )}
                  </>
                )}
              </div>
              
              {isLoadingStatus ? (
                <div className="w-full max-w-sm h-4 shimmer rounded-md mt-3"></div>
              ) : (
                <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-sm">
                  {isLive 
                    ? "Website portofolio Anda saat ini dapat dikunjungi oleh publik." 
                    : "Website Anda saat ini sedang disembunyikan dari publik."}
                </p>
              )}
            </div>
            
            {isLoadingStatus ? (
              <div className="w-14 h-8 shimmer rounded-full shrink-0"></div>
            ) : (
              <button 
                onClick={toggleStatus}
                disabled={isLoadingStatus}
                className={`shrink-0 w-14 h-8 rounded-full p-1 relative shadow-inner transition-colors duration-300 ${isLive ? 'bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'} ${isLoadingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
              >
                 <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isLive ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </button>
            )}
          </div>

          {/* CARD 2: Akun Email */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 animate-enter" style={{animationDelay: '250ms'}}>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">Email Kredensial</h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed max-w-md">Alamat email utama yang tertaut dengan akun Portfo.be Anda.</p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <i className="fas fa-envelope text-slate-400 text-sm"></i>
                </div>
                <input 
                  type="email" 
                  value={session?.user?.email || "Memuat..."} 
                  disabled 
                  className="w-full pl-12 pr-5 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-600 font-bold text-sm outline-none cursor-not-allowed"
                />
              </div>
              <button 
                onClick={handleComingSoon} 
                className="w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-xl sm:rounded-2xl hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 shrink-0 shadow-sm"
              >
                Ubah Email
              </button>
            </div>
          </div>

          {/* CARD 3: Keamanan */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 animate-enter" style={{animationDelay: '350ms'}}>
            <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2">Keamanan Kata Sandi</h4>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mb-6 sm:mb-8 leading-relaxed max-w-md">Ubah kata sandi Anda secara berkala untuk mencegah akses yang tidak sah.</p>
            <button 
              onClick={handleComingSoon} 
              className="w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-extrabold uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-xl sm:rounded-2xl hover:border-slate-300 hover:text-slate-900 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center sm:justify-start gap-2 shadow-sm"
            >
              <i className="fas fa-lock"></i> Perbarui Sandi
            </button>
          </div>

          {/* CARD 4: Zona Berbahaya */}
          <div className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-8 mt-10 relative overflow-hidden group shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:border-rose-100 transition-colors animate-enter" style={{animationDelay: '450ms'}}>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/0 rounded-full blur-3xl group-hover:bg-rose-500/10 transition-colors duration-500 pointer-events-none"></div>
            
            <div className="relative z-10">
              <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
                 Zona Berbahaya
              </h4>
              <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
                Tindakan ini akan menghapus akun dan semua karya di dalamnya secara permanen.
              </p>
            </div>
            
            <button 
              onClick={() => setShowDeleteModal(true)} 
              disabled={isDeleting}
              className={`relative z-10 shrink-0 font-extrabold text-[11px] uppercase tracking-widest bg-white text-rose-500 border border-rose-100 px-6 sm:px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-2xl hover:bg-rose-50 hover:border-rose-200 transition-all active:scale-95 w-full sm:w-auto shadow-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}