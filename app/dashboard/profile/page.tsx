"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status } = useSession();

  // State untuk menyimpan isian form
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  
  // State untuk melacak status proses
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // FUNGSI INTI 1: MENGAMBIL DATA DARI DATABASE SAAT HALAMAN DIBUKA
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const data = await res.json();
          // Jika ada data di database, masukkan ke dalam kotak isian
          if (data) {
            const names = (data.fullName || session?.user?.name || "").split(" ");
            setFirstName(names[0] || "");
            setLastName(names.slice(1).join(" ") || "");
            setProfession(data.profession || "");
            setBio(data.bio || "");
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data profil:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoadingData(false);
    }
  }, [status, session]);

  // FUNGSI INTI 2: MENYIMPAN KE DATABASE DENGAN TOAST NOTIFICATION
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSaving(true);
    
    // Memunculkan notifikasi loading
    const toastId = toast.loading('Menyimpan profil...');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          profession,
          bio
        }),
      });

      if (response.ok) {
        toast.success("Profil berhasil disimpan!", {
          id: toastId,
          duration: 3000,
          style: {
            borderRadius: '12px',
            background: '#111827',
            color: '#fff',
          },
        });
      } else {
        toast.error("Gagal menyimpan profil. Cek koneksi Anda.", {
          id: toastId,
          duration: 4000,
        });
      }
    } catch (error) {
      console.error("Error saat menyimpan:", error);
      toast.error("Terjadi kesalahan sistem.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Efek Skeleton Loading
  if (status === "loading" || isLoadingData) {
    return (
      <div className="max-w-3xl w-full mx-auto p-8 md:p-10 rounded-[2.5rem] border border-gray-100 bg-white shadow-sm animate-pulse">
         <div className="flex items-center gap-6 mb-10">
            <div className="w-24 h-24 md:w-32 md:h-32 bg-gray-200 rounded-full"></div>
            <div className="space-y-3">
               <div className="h-6 w-40 bg-gray-200 rounded"></div>
               <div className="h-4 w-24 bg-gray-200 rounded"></div>
            </div>
         </div>
         <div className="space-y-6">
            <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            <div className="h-12 w-full bg-gray-100 rounded-xl"></div>
            <div className="h-32 w-full bg-gray-100 rounded-xl"></div>
         </div>
      </div>
    );
  }

  // Variabel untuk tampilan Visual
  const fullName = session?.user?.name || "User Portfo";
  const userEmail = session?.user?.email || "";
  const username = userEmail.split('@')[0] || "user";

  return (
    <div className="max-w-3xl bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm mx-auto relative">
      
      {/* Komponen Toaster untuk memunculkan notifikasi melayang */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER PROFIL */}
      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 text-center sm:text-left">
        <div className="relative group cursor-pointer shrink-0">
          <img 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=random`} 
            className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-md object-cover" 
            alt="Profile Picture"
          />
          <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all">
            <i className="fas fa-camera text-xl"></i>
          </div>
        </div>
        <div>
          <h4 className="text-2xl font-bold mb-1">{firstName ? `${firstName} ${lastName}` : fullName}</h4>
          <p className="text-sm text-gray-500 mb-3 font-medium">portfo.be/{username}</p>
          <button className="text-xs font-bold bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors">
            Ubah Foto Profil
          </button>
        </div>
      </div>

      {/* FORM PROFIL */}
      <form className="space-y-6" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Depan</label>
            <input 
              type="text" 
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white text-sm" 
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Belakang</label>
            <input 
              type="text" 
              value={lastName} 
              onChange={(e) => setLastName(e.target.value)}
              className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white text-sm" 
            />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Profesi Utama</label>
          <input 
            type="text" 
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white text-sm" 
          />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bio Lengkap </label>
          <textarea 
            rows={4} 
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full px-5 py-3.5 rounded-xl border border-gray-200 focus:border-gray-900 outline-none transition-all bg-gray-50 focus:bg-white text-sm leading-relaxed resize-none"
          />
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors">
            Batal
          </button>
          
          <button 
            type="submit" 
            disabled={isSaving}
            className={`px-8 py-3 bg-gray-900 text-white rounded-xl font-bold shadow-md transition-all active:scale-95 ${isSaving ? 'opacity-50 cursor-not-allowed' : 'hover:bg-black hover:shadow-lg'}`}
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
}