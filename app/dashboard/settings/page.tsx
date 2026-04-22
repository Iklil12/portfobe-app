"use client";

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // STATE BARU: Untuk fitur Toggle Live/Offline
  const [isLive, setIsLive] = useState(true);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  // FUNGSI BARU: Mengambil status dari database saat halaman dimuat
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
        setIsLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  // FUNGSI BARU: Menangani klik pada tombol toggle
  const toggleStatus = async () => {
    const newStatus = !isLive;
    setIsLive(newStatus); // Update UI seketika (Optimistic UI) agar terasa cepat
    
    const loadingToast = toast.loading(
      newStatus ? 'Mempublikasikan portofolio...' : 'Menyembunyikan portofolio...', 
      {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      }
    );

    try {
      const res = await fetch('/api/account/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isLive: newStatus })
      });

      if (res.ok) {
        toast.success(newStatus ? 'Portofolio kini Live!' : 'Portofolio disembunyikan.', { id: loadingToast });
      } else {
        throw new Error();
      }
    } catch (error) {
      setIsLive(!newStatus); // Kembalikan posisi toggle jika API gagal
      toast.error('Gagal mengubah status.', { id: loadingToast });
    }
  };

  const handleComingSoon = () => {
    toast('Fitur ini sedang dalam pengembangan.', {
      icon: '🛠️',
      style: { 
        borderRadius: '12px', 
        background: '#0a0a0a', 
        color: '#fff', 
        fontWeight: 'bold',
        fontSize: '13px',
        padding: '12px 20px',
        border: '1px solid #27272a'
      }
    });
  };

  const confirmDeletion = async () => {
    setShowDeleteModal(false); 
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

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      {/* Global Styles Injected for Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }

        .animate-enter-modal { 
            animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes modalEnter {
          0% { opacity: 0; transform: scale(0.95) translateY(10px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}} />

      <Toaster position="top-center" />

      {/* --- HEADER SECTION --- */}
      <div className="mb-10 animate-enter text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Akun & <span className="font-light text-slate-400">Keamanan.</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">Kelola kredensial login dan status situs portofolio Anda.</p>
      </div>

      {/* --- CUSTOM POPUP MODAL HAPUS AKUN --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setShowDeleteModal(false)}
          ></div>
          
          <div className="relative bg-white rounded-[2rem] p-8 md:p-10 max-w-sm w-full shadow-[0_20px_60px_rgba(0,0,0,0.1)] border border-slate-100 animate-enter-modal z-10">
            
            <div className="w-16 h-16 bg-white border border-slate-100 shadow-sm text-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 relative group">
              <i className="fas fa-exclamation-triangle text-xl group-hover:text-red-500 transition-colors"></i>
            </div>
            
            <h3 className="text-2xl font-extrabold text-center text-slate-900 mb-3 tracking-tight">
              Hapus Permanen?
            </h3>
            
            <p className="text-center text-slate-500 mb-10 text-sm font-medium leading-relaxed px-2">
              Tindakan ini <span className="font-bold text-slate-900">tidak dapat dibatalkan</span>. Semua portofolio dan pengaturan URL akan dimusnahkan.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-1/2 px-6 py-3.5 rounded-2xl font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 active:scale-95 transition-all text-sm"
              >
                Batalkan
              </button>
              <button
                onClick={confirmDeletion}
                className="w-full sm:w-1/2 px-6 py-3.5 rounded-2xl font-bold text-white bg-slate-900 hover:bg-red-600 active:scale-95 transition-all group flex items-center justify-center gap-2 text-sm shadow-lg"
              >
                Ya, Hapus <i className="fas fa-trash-alt text-[10px]"></i>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MAIN CONTENT CONTAINERS */}
      <div className="space-y-6">
        
        {/* CARD 1: Status Web */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] animate-enter" style={{animationDelay: '100ms'}}>
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-xl font-extrabold text-slate-900 tracking-tight">Status Portofolio</h4>
              
              {/* Badge berubah dinamis menyesuaikan state isLive */}
              {isLive ? (
                <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse relative before:absolute before:inset-0 before:bg-emerald-500 before:rounded-full before:animate-ping"></span> Live
                </span>
              ) : (
                <span className="px-2 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-400 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                   <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span> Offline
                </span>
              )}
            </div>
            
            <p className="text-sm text-slate-500 font-medium">
              {isLive 
                ? "Website portofolio Anda saat ini dapat dikunjungi oleh publik." 
                : "Website Anda saat ini sedang disembunyikan dari publik."}
            </p>
          </div>
          
          {/* Toggle Switch Aktif */}
          <button 
            onClick={toggleStatus}
            disabled={isLoadingStatus}
            className={`shrink-0 w-14 h-8 rounded-full p-1 relative shadow-inner transition-colors duration-300 ${isLive ? 'bg-slate-900' : 'bg-slate-300'} ${isLoadingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:opacity-90'}`}
          >
             <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${isLive ? 'translate-x-6' : 'translate-x-0'}`}></div>
          </button>
        </div>

        {/* CARD 2: Akun Email */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] animate-enter" style={{animationDelay: '200ms'}}>
          <h4 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Email Kredensial</h4>
          <p className="text-sm text-slate-500 font-medium mb-8">Alamat email utama yang tertaut dengan akun Portfo.be Anda.</p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-full">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <i className="fas fa-envelope text-slate-400 text-sm"></i>
              </div>
              <input 
                type="email" 
                value={session?.user?.email || "Memuat..."} 
                disabled 
                className="w-full pl-12 pr-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 text-slate-600 font-bold text-sm outline-none cursor-not-allowed"
              />
            </div>
            <button 
              onClick={handleComingSoon} 
              className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 shrink-0"
            >
              Ubah Email
            </button>
          </div>
        </div>

        {/* CARD 3: Keamanan */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] animate-enter" style={{animationDelay: '300ms'}}>
          <h4 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Keamanan Kata Sandi</h4>
          <p className="text-sm text-slate-500 font-medium mb-8">Ubah kata sandi Anda secara berkala untuk mencegah akses yang tidak sah.</p>
          <button 
            onClick={handleComingSoon} 
            className="w-full sm:w-auto px-8 py-4 text-xs font-extrabold uppercase tracking-widest text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 flex items-center justify-center sm:justify-start gap-2"
          >
            <i className="fas fa-lock"></i> Perbarui Sandi
          </button>
        </div>

        {/* CARD 4: Zona Berbahaya (Danger Zone) */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-8 mt-12 relative overflow-hidden group shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:border-red-100 transition-colors animate-enter" style={{animationDelay: '400ms'}}>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/0 rounded-full blur-3xl group-hover:bg-red-500/5 transition-colors duration-500 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h4 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2 flex items-center gap-2">
               Zona Berbahaya
            </h4>
            <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
              Tindakan ini akan menghapus akun dan semua karya di dalamnya secara permanen.
            </p>
          </div>
          
          <button 
            onClick={() => setShowDeleteModal(true)} 
            disabled={isDeleting}
            className={`relative z-10 shrink-0 font-extrabold text-xs uppercase tracking-widest bg-white text-red-500 border-2 border-red-100 px-8 py-4 rounded-2xl hover:bg-red-50 hover:border-red-200 transition-all active:scale-95 w-full sm:w-auto ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
          </button>
        </div>

      </div>
    </main>
  );
}