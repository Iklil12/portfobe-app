"use client";

import React, { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function SettingsPage() {
  const { data: session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  
  // STATE BARU: Untuk mengontrol muncul/hilangnya Popup buatan kita
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleComingSoon = () => {
    toast('Fitur ini akan segera hadir!', {
      icon: '🚧',
      style: { borderRadius: '10px', background: '#333', color: '#fff' }
    });
  };

  // FUNGSI BARU: Eksekusi hapus yang dipanggil DARI DALAM popup
  const confirmDeletion = async () => {
    setShowDeleteModal(false); // Tutup popup-nya
    setIsDeleting(true);
    const toastId = toast.loading('Sedang memusnahkan akun...');

    try {
      const response = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success("Akun berhasil dihapus. Selamat tinggal!", { id: toastId, duration: 4000 });
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
    <div className="max-w-3xl mx-auto space-y-6 relative">
      <Toaster position="top-center" />

      {/* --- CUSTOM POPUP MODAL (Hanya muncul jika showDeleteModal == true) --- */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          {/* Animasi muncul dari bawah (zoom in) */}
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl transform transition-all">
            
            <div className="w-20 h-20 bg-red-50 border-8 border-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <i className="fas fa-exclamation-triangle text-3xl"></i>
            </div>
            
            <h3 className="text-2xl font-black text-center text-gray-900 mb-3">
              Hapus Akun Permanen?
            </h3>
            
            <p className="text-center text-gray-500 mb-8 text-sm leading-relaxed px-4">
              Peringatan Kritis! Semua data portofolio, desain, dan foto Anda akan dimusnahkan secara permanen dan <b className="text-red-500">tidak dapat dikembalikan</b>.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={confirmDeletion}
                className="w-full sm:w-1/2 px-6 py-3.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
              >
                Ya, Hapus!
              </button>
            </div>
            
          </div>
        </div>
      )}
      {/* --------------------------------------------------------------------- */}

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-bold text-gray-900 mb-1">Status Web Portofolio</h4>
          <p className="text-sm text-gray-500">Saat aktif, website bisa dikunjungi melalui link paperions.com kamu.</p>
        </div>
        <label className="switch shrink-0 cursor-not-allowed opacity-70" onClick={handleComingSoon}>
          <input type="checkbox" defaultChecked disabled />
          <span className="slider shadow-inner"></span>
        </label>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-1">Email Akun</h4>
        <p className="text-sm text-gray-500 mb-6">Email yang digunakan untuk login dan menerima pesan klien.</p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input 
            type="email" 
            value={session?.user?.email || "Memuat..."} 
            disabled 
            className="w-full px-5 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 text-sm"
          />
          <button onClick={handleComingSoon} className="w-full sm:w-auto px-6 py-3 font-bold text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors shrink-0">
            Ubah Email
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
        <h4 className="font-bold text-gray-900 mb-1">Keamanan</h4>
        <p className="text-sm text-gray-500 mb-6">Ubah kata sandi akunmu secara berkala untuk keamanan.</p>
        <button onClick={handleComingSoon} className="px-6 py-3 font-bold text-gray-900 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          Ubah Kata Sandi
        </button>
      </div>

      <div className="bg-red-50/50 p-8 rounded-[2rem] border border-red-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mt-12">
        <div>
          <h4 className="font-bold text-red-700 mb-1">Zona Berbahaya</h4>
          <p className="text-sm text-red-500/80">Menghapus akun akan memusnahkan portofolio dan URL secara permanen.</p>
        </div>
        <button 
          // UBAH: Sekarang tombol ini hanya memunculkan popup, bukan langsung menghapus
          onClick={() => setShowDeleteModal(true)} 
          disabled={isDeleting}
          className={`shrink-0 bg-white text-red-600 font-bold border border-red-200 px-6 py-3 rounded-xl hover:bg-red-50 hover:border-red-300 transition-all shadow-sm ${isDeleting ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isDeleting ? 'Menghapus...' : 'Hapus Akun'}
        </button>
      </div>

    </div>
  );
}