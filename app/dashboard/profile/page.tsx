"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile', { cache: 'no-store' });
        if (res.ok) {
          const data = await res.json();
          if (data) {
            const names = (data.fullName || session?.user?.name || "").split(" ");
            setFirstName(names[0] || "");
            setLastName(names.slice(1).join(" ") || "");
            setProfession(data.profession || "");
            setBio(data.bio || "");
            
            if (data.avatar) {
              setAvatarUrl(data.avatar);
            } else {
              setAvatarUrl((session?.user as any)?.avatar || session?.user?.image || "");
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        setIsLoadingData(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoadingData(false);
    }
  }, [status]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setIsSaving(true);
    const toastId = toast.loading('Menyimpan profil...');

    try {
      const response = await fetch('/api/profile/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName,
          lastName,
          profession,
          bio,
          avatar: avatarUrl 
        }),
      });

      if (response.ok) {
        toast.success("Profil berhasil disimpan!", {
          id: toastId,
          duration: 3000,
          style: { borderRadius: '12px', background: '#111827', color: '#fff' },
        });
        
        await update({
          ...session,
          user: {
            ...session?.user,
            image: avatarUrl, 
            avatar: avatarUrl, 
            name: `${firstName} ${lastName}`.trim()
          }
        });

      } else {
        toast.error("Gagal menyimpan profil.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan sistem.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  if (status === "loading" || isLoadingData) {
    return (
      <div className="max-w-3xl w-full mx-auto p-8 animate-pulse">
         <div className="w-24 h-24 bg-gray-200 rounded-full mb-10"></div>
         <div className="h-12 w-full bg-gray-100 rounded-xl mb-6"></div>
      </div>
    );
  }

  const fullName = session?.user?.name || "User Portfo";
  const userEmail = session?.user?.email || "";
  const username = userEmail.split('@')[0] || "user";
  
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  return (
    <div className="max-w-3xl bg-white p-8 md:p-10 rounded-[2.5rem] border border-gray-100 shadow-sm mx-auto relative">
      <Toaster position="top-center" reverseOrder={false} />

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-10 text-center sm:text-left">
        
        <CldUploadWidget 
          uploadPreset={cloudinaryPreset}
          options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "png", "webp"] }}
          onSuccess={(result) => {
            if (typeof result.info === 'object' && 'secure_url' in result.info) {
              setAvatarUrl(result.info.secure_url); 
              toast.success("Foto berhasil diunggah! Klik 'Simpan Profil' untuk menerapkan.");
            }
          }}
        >
          {({ open }) => (
            <>
              {/* --- PERBAIKAN WADAH BULAT (ABSOLUTE INSET) --- */}
              <div 
                className="relative shrink-0 w-24 h-24 md:w-32 md:h-32 group cursor-pointer" 
                onClick={() => open()}
              >
                {/* 1. Wadah Pemotong (Clipping Mask) */}
                <div className="w-full h-full rounded-full border-4 border-white shadow-md overflow-hidden relative z-10">
                  <img 
                    src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=random`} 
                    // Tambahan absolute inset-0 memaksa gambar menempel ke tepi wadah
                    className="absolute inset-0 w-full h-full object-cover" 
                    alt="Profile"
                  />
                </div>
                
                {/* 2. Overlay Kamera Transparan */}
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all z-20">
                  <i className="fas fa-camera text-xl"></i>
                </div>
              </div>
              {/* --------------------------------------------- */}
              
              <div>
                <h4 className="text-2xl font-bold mb-1">{firstName ? `${firstName} ${lastName}` : fullName}</h4>
                <p className="text-sm text-gray-500 mb-3 font-medium">paperions.com/{username}</p>
                <button 
                  type="button" 
                  onClick={() => open()} 
                  className="text-xs font-bold bg-gray-100 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Ubah Foto Profil
                </button>
              </div>
            </>
          )}
        </CldUploadWidget>

      </div>

      <form className="space-y-6" onSubmit={handleSave}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Depan</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Nama Belakang</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50" />
          </div>
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Profesi Utama</label>
          <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50" />
        </div>
        
        <div>
          <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Bio Lengkap</label>
          <textarea rows={4} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-5 py-3.5 rounded-xl border border-gray-200 bg-gray-50 resize-none" />
        </div>
        
        <div className="pt-4 border-t border-gray-100 flex justify-end gap-3">
          <button type="button" onClick={() => window.location.reload()} className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100">Batal</button>
          <button type="submit" disabled={isSaving} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold transition-all hover:bg-black">
            {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
          </button>
        </div>
      </form>
    </div>
  );
}