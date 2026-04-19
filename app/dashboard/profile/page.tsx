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

  // Fitur Validasi Form Dinamis
  const isFormValid = firstName.trim() !== "" && profession.trim() !== "";

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
  }, [status, session]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!isFormValid) {
      toast.error("Nama Depan dan Profesi Utama wajib diisi.", {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
        iconTheme: { primary: '#ef4444', secondary: '#0a0a0a' }
      });
      return;
    }

    setIsSaving(true);
    const toastId = toast.loading('Menyimpan profil...', {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });

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
        toast.success("Profil berhasil diperbarui!", {
          id: toastId,
          duration: 3000,
          style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
          iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' }
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
        toast.error("Gagal menyimpan perubahan.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Kesalahan jaringan. Coba lagi.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  // Modern Skeleton Loading State (Monochrome Slate)
  if (status === "loading" || isLoadingData) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 pb-32">
        <div className="h-10 w-48 bg-slate-200 rounded-lg animate-pulse mb-3"></div>
        <div className="h-4 w-72 bg-slate-100 rounded-full animate-pulse mb-12"></div>
        
        <div className="bg-white p-8 sm:p-12 md:p-16 rounded-[2.5rem] border border-slate-100 shadow-sm animate-pulse">
            <div className="flex items-center gap-8 mb-12">
              <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-200 rounded-full shrink-0"></div>
              <div className="flex-1 space-y-4">
                <div className="h-8 w-1/3 bg-slate-200 rounded-lg"></div>
                <div className="h-4 w-1/4 bg-slate-100 rounded-full"></div>
                <div className="h-10 w-32 bg-slate-100 rounded-full mt-4"></div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
               <div className="h-14 w-full bg-slate-50 rounded-2xl"></div>
               <div className="h-14 w-full bg-slate-50 rounded-2xl"></div>
            </div>
            <div className="h-14 w-full bg-slate-50 rounded-2xl mb-8"></div>
            <div className="h-32 w-full bg-slate-50 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  const fullName = session?.user?.name || "User Portfo";
  const userEmail = session?.user?.email || "";
  const username = userEmail.split('@')[0] || "user";
  
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      {/* Global Styles Injected for Animations & Fonts */}
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
      `}} />

      <Toaster position="top-center" reverseOrder={false} />

      {/* HEADER SECTION */}
      <div className="mb-10 animate-enter text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Profil <span className="font-light text-slate-400">& Bio.</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">Kelola identitas publik dan informasi spesialisasi Anda.</p>
      </div>

      {/* MAIN CARD CONTAINER */}
      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-500 relative animate-enter" style={{animationDelay: '100ms'}}>
        
        {/* AVATAR UPLOAD SECTION */}
        <div className="mb-12 border-b border-slate-100 pb-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left animate-enter" style={{animationDelay: '200ms'}}>
          
          <CldUploadWidget 
            uploadPreset={cloudinaryPreset}
            options={{ maxFiles: 1, resourceType: "image", clientAllowedFormats: ["jpg", "png", "webp"] }}
            onSuccess={(result) => {
              if (typeof result.info === 'object' && 'secure_url' in result.info) {
                setAvatarUrl(result.info.secure_url); 
                toast.success("Foto terunggah! Jangan lupa klik Simpan.", {
                  style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
                  icon: '📸'
                });
              }
            }}
          >
            {({ open }) => (
              <>
                {/* Photo Avatar Area */}
                <div 
                  className="relative shrink-0 w-32 h-32 md:w-36 md:h-36 group cursor-pointer" 
                  onClick={() => open()}
                >
                  {/* Subtle Orange Glow behind avatar */}
                  <div className="absolute -inset-1 bg-[#ff9e00] rounded-full blur-md opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  <div className="relative w-full h-full rounded-full border-4 border-white shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden z-10 bg-slate-50">
                    <img 
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=f8fafc&color=0f172a&bold=true`} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt="Profile Avatar"
                    />
                    {/* Dark Overlay on Hover */}
                    <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      <i className="fas fa-camera text-xl mb-1"></i>
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Ubah Foto</span>
                    </div>
                  </div>
                </div>
                
                {/* User Identity Info */}
                <div className="flex flex-col justify-center h-full pt-2">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-2">
                    {firstName ? `${firstName} ${lastName}` : fullName}
                  </h2>
                  <div className="flex items-center justify-center md:justify-start gap-2 text-sm font-bold text-slate-500 mb-6 px-4 py-1.5 rounded-full border border-slate-200 bg-slate-50 w-max mx-auto md:mx-0">
                     <i className="fas fa-link text-slate-400"></i> portfo.be/{username}
                  </div>
                  
                  <button 
                    type="button" 
                    onClick={() => open()} 
                    className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700 bg-white border border-slate-200 px-6 py-3 rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 shadow-sm w-max mx-auto md:mx-0 flex items-center gap-2"
                  >
                    <i className="fas fa-cloud-upload-alt"></i> Unggah Foto Baru
                  </button>
                </div>
              </>
            )}
          </CldUploadWidget>
        </div>

        {/* FORM SECTION */}
        <form className="space-y-6" onSubmit={handleSave}>
          
          {/* Nama Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter" style={{animationDelay: '300ms'}}>
            <div className="group">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">
                Nama Depan <span className="text-[#ff9e00]">*</span>
              </label>
              <input 
                type="text" 
                value={firstName} 
                onChange={(e) => setFirstName(e.target.value)} 
                placeholder="Cth: Iklil"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-300" 
              />
            </div>
            <div className="group">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">
                Nama Belakang
              </label>
              <input 
                type="text" 
                value={lastName} 
                onChange={(e) => setLastName(e.target.value)} 
                placeholder="Cth: Uyun"
                className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-300" 
              />
            </div>
          </div>
          
          {/* Profesi */}
          <div className="group animate-enter" style={{animationDelay: '400ms'}}>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors flex justify-between items-end">
              <span>Profesi Utama <span className="text-[#ff9e00]">*</span></span>
              {!profession && <span className="text-[9px] text-slate-400 normal-case tracking-normal font-medium">Ditampilkan di bawah namamu</span>}
            </label>
            <input 
              type="text" 
              value={profession} 
              onChange={(e) => setProfession(e.target.value)} 
              placeholder="Cth: Videografer & 3D Artist"
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-900 placeholder:font-medium placeholder:text-slate-300" 
            />
          </div>
          
          {/* Bio */}
          <div className="group animate-enter" style={{animationDelay: '500ms'}}>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">
              Bio Ringkas
            </label>
            <textarea 
              rows={5} 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Ceritakan sedikit tentang dirimu, spesialisasi, dan pengalamanmu secara profesional..."
              className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-medium leading-relaxed text-slate-900 placeholder:font-medium placeholder:text-slate-300 resize-none" 
            />
          </div>
          
          {/* ACTION BUTTONS */}
          <div className="pt-8 mt-10 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 animate-enter" style={{animationDelay: '600ms'}}>
            <button 
              type="button" 
              onClick={() => window.location.reload()} 
              className="px-8 py-3.5 rounded-full font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 transition-colors w-full sm:w-auto text-sm active:scale-95"
            >
              Batalkan
            </button>
            
            <button 
              type="submit" 
              disabled={isSaving || !isFormValid} 
              className={`relative px-10 py-3.5 rounded-full text-[13px] font-extrabold uppercase tracking-widest overflow-hidden transition-all duration-300 transform active:scale-95 w-full sm:w-auto shadow-lg
                ${isSaving || !isFormValid 
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none' 
                  : 'bg-slate-900 text-white hover:bg-[#ff9e00] hover:text-black hover:shadow-[0_10px_20px_rgba(255,158,0,0.3)] hover:-translate-y-0.5'
                }
              `}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>
                 Simpan Perubahan <i className="fas fa-check ml-1 text-[10px]"></i>
              </div>
              
              {/* Loading Spinner */}
              {isSaving && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}