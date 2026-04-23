"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast'; 
import { CldUploadWidget } from 'next-cloudinary';
import { showToast } from '@/lib/customToast'; 
import { mutate } from 'swr'; 

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subdomain, setSubdomain] = useState(""); 
  const [initialSubdomain, setInitialSubdomain] = useState(""); 
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const isFormValid = firstName.trim() !== "" && profession.trim() !== "" && subdomainStatus !== 'taken';

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
            
            const dbSubdomain = data.profile?.subdomain || data.subdomain || "";
            const emailPrefix = (session?.user?.email || "").split('@')[0] || "user";
            const finalSubdomain = dbSubdomain || emailPrefix;
            
            setSubdomain(finalSubdomain); 
            setInitialSubdomain(finalSubdomain); 
            
            setProfession(data.profession || data.profile?.profession || "");
            setBio(data.bio || data.profile?.bio || "");
            
            if (data.avatarUrl || data.avatar || data.profile?.avatarUrl) {
              setAvatarUrl(data.avatarUrl || data.avatar || data.profile?.avatarUrl);
            } else {
              setAvatarUrl((session?.user as any)?.avatar || session?.user?.image || "");
            }
          }
        }
      } catch (error) {
        console.error("Gagal mengambil profil:", error);
      } finally {
        // Delay tipis agar skeleton shimmer terlihat elegan
        setTimeout(() => setIsLoadingData(false), 500);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoadingData(false);
    }
  }, [status, session]);

  useEffect(() => {
    if (!subdomain || subdomain === initialSubdomain) {
      setSubdomainStatus('idle');
      return;
    }

    const timeoutId = setTimeout(async () => {
      setSubdomainStatus('checking');
      try {
        const res = await fetch(`/api/profile/check-subdomain?subdomain=${subdomain}`);
        const data = await res.json();
        if (data.available) {
          setSubdomainStatus('available');
        } else {
          setSubdomainStatus('taken');
        }
      } catch (error) {
        setSubdomainStatus('idle');
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [subdomain, initialSubdomain]);


  const handleRemoveAvatar = () => {
    setAvatarUrl(""); 
    showToast({
      message: "Foto dihapus. Klik Simpan untuk memperbarui database.",
      id: "remove-avatar-toast",
      icon: "fa-trash-alt"
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!isFormValid) {
      showToast({
        message: "Formulir tidak valid. Periksa kembali isian Anda.",
        id: "invalid-form-toast",
        icon: "fa-exclamation-triangle"
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
          subdomain, 
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
        setInitialSubdomain(subdomain); 
        
        mutate('/api/layout-sync');

        await update({
          ...session,
          user: {
            ...session?.user,
            image: avatarUrl, 
            avatar: avatarUrl, 
            name: `${firstName} ${lastName}`.trim(),
            subdomain: subdomain,      
            profession: profession,    
            bio: bio                   
          }
        });

      } else {
        const errorData = await response.json();
        toast.error(errorData.error || "Gagal menyimpan perubahan.", { id: toastId });
      }
    } catch (error) {
      console.error(error);
      toast.error("Kesalahan jaringan. Coba lagi.", { id: toastId });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyLink = () => {
    const linkToCopy = `portfo.be/${subdomain}`;
    navigator.clipboard.writeText(linkToCopy);
    showToast({
      message: "Tautan berhasil disalin!",
      id: "copy-link-toast",
      icon: "fa-link"
    });
  };

  const fullName = session?.user?.name || "User Portfo";
  const defaultUsername = session?.user?.email?.split('@')[0] || "user";
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  const getSubdomainStyle = () => {
    if (subdomainStatus === 'taken') return 'border-rose-400 bg-rose-50 ring-[3px] ring-rose-400/20';
    if (subdomainStatus === 'available') return 'border-emerald-400 bg-emerald-50 ring-[3px] ring-emerald-400/20';
    return 'border-slate-200 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-slate-900 focus-within:ring-[3px] focus-within:ring-slate-900/10';
  };

  if (status === "loading" || isLoadingData) {
    return (
      <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden pb-20">
        <style dangerouslySetInnerHTML={{__html: `
          .bg-grid-slate { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px); }
          .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
          @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        `}} />
        <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
        <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
          
          <div className="mb-12 mt-4">
            <div className="w-32 h-6 shimmer rounded-full mb-6"></div>
            <div className="w-64 md:w-80 h-10 shimmer rounded-lg mb-4"></div>
            <div className="w-full max-w-md h-4 shimmer rounded-full"></div>
          </div>
          
          <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] border border-slate-100 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-10 pb-10 border-b border-slate-100">
                <div className="w-24 h-24 md:w-32 md:h-32 rounded-full shimmer shrink-0"></div>
                <div className="flex-1 space-y-4 w-full">
                  <div className="h-8 w-2/3 sm:w-1/3 shimmer rounded-lg"></div>
                  <div className="h-10 w-full sm:w-2/3 shimmer rounded-xl"></div>
                  <div className="flex gap-3 pt-2">
                     <div className="h-10 w-28 shimmer rounded-full"></div>
                     <div className="h-10 w-10 shimmer rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
                 <div className="h-14 w-full shimmer rounded-2xl"></div>
                 <div className="h-14 w-full shimmer rounded-2xl"></div>
              </div>
              <div className="h-14 w-full shimmer rounded-2xl mb-8"></div>
              <div className="h-32 w-full shimmer rounded-2xl"></div>
          </div>
        </div>
      </main>
    );
  }

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
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND MONOKROM DENGAN GLOW PREMIUM */}
      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-slate-200/50 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {/* HEADER SECTION */}
        <div className="mb-10 sm:mb-12 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[10px] font-extrabold uppercase tracking-widest text-slate-500 mb-5 shadow-sm">
            <i className="fas fa-id-card text-slate-400"></i> Identitas Publik
          </div>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 mb-3 flex items-center justify-center md:justify-start gap-3">
            Profil & Bio.
            <i className="fas fa-asterisk text-slate-300 text-[1.2rem] md:text-[1.8rem] animate-spin-slow"></i>
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 max-w-lg mx-auto md:mx-0">Kelola identitas publik dan informasi spesialisasi Anda.</p>
        </div>

        {/* MAIN CARD */}
        <div className="bg-white p-6 sm:p-10 md:p-12 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.04)] transition-all duration-500 relative animate-enter" style={{animationDelay: '200ms'}}>
          
          {/* UPLOAD AVATAR SECTION */}
          <div className="mb-10 sm:mb-12 border-b border-slate-100 pb-8 sm:pb-10 flex flex-col md:flex-row items-center md:items-start gap-6 sm:gap-8 text-center md:text-left">
            <CldUploadWidget 
              uploadPreset={cloudinaryPreset}
              options={{ 
                maxFiles: 1, 
                resourceType: "image", 
                clientAllowedFormats: ["jpg", "png", "webp"],
                sources: ["local", "camera", "url"], 
                showPoweredBy: false,
                styles: {
                  palette: {
                    window: "#ffffff", windowBorder: "#f1f5f9", tabIcon: "#64748b", menuIcons: "#0f172a",
                    textDark: "#0f172a", textLight: "#ffffff", link: "#0f172a", action: "#0f172a",
                    inactiveTabIcon: "#94a3b8", error: "#ef4444", inProgress: "#0f172a", complete: "#22c55e", sourceBg: "#f8fafc"
                  },
                  fonts: {
                    default: null,
                    "'Plus Jakarta Sans', sans-serif": { url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap", active: true }
                  }
                }
              }}
              onSuccess={(result) => {
                if (typeof result.info === 'object' && 'secure_url' in result.info) {
                  setAvatarUrl(result.info.secure_url); 
                  showToast({ message: "Foto terunggah! Jangan lupa klik Simpan.", id: "upload-success-toast", icon: "fa-cloud-upload-alt" });
                }
              }}
            >
              {({ open }) => (
                <>
                  <div className="relative shrink-0 w-28 h-28 sm:w-32 sm:h-32 md:w-36 md:h-36 group cursor-pointer" onClick={() => open()}>
                    {/* Efek Glow Monokrom saat hover */}
                    <div className="absolute -inset-1 bg-slate-900 rounded-full blur-lg opacity-0 group-hover:opacity-10 transition duration-500"></div>
                    
                    <div className="relative w-full h-full rounded-full border-[5px] border-white shadow-[0_5px_20px_rgba(0,0,0,0.06)] overflow-hidden z-10 bg-slate-50">
                      <img 
                        src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=f8fafc&color=0f172a&bold=true`} 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110" 
                        alt="Profile Avatar"
                      />
                      <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                        <i className="fas fa-camera text-xl mb-1"></i>
                        <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Ubah Foto</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col justify-center h-full pt-2 w-full md:w-auto relative">
                    <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mb-3">
                      {firstName ? `${firstName} ${lastName}` : fullName}
                    </h2>
                    
                    <div className="flex flex-col items-center justify-center md:justify-start mb-5 sm:mb-6 w-full md:w-auto relative">
                      <div className={`relative flex items-center gap-1 text-[13px] sm:text-sm font-bold text-slate-600 pl-4 pr-12 py-3 sm:py-2.5 rounded-xl sm:rounded-full border transition-all overflow-hidden max-w-[280px] sm:max-w-md w-full md:w-auto shadow-sm ${getSubdomainStyle()}`}>
                         <i className="fas fa-link shrink-0 mr-1 opacity-50"></i>
                         <span className="opacity-50 select-none shrink-0 whitespace-nowrap">portfo.be/</span>
                         
                         <input
                           type="text"
                           value={subdomain} 
                           onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                           placeholder={defaultUsername}
                           className="bg-transparent outline-none text-slate-900 w-full min-w-[80px] p-0 border-none focus:ring-0 truncate"
                         />
                         
                         <div className="absolute right-[46px] top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                           {subdomainStatus === 'checking' && <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-slate-900 rounded-full animate-spin"></div>}
                           {subdomainStatus === 'available' && <i className="fas fa-check-circle text-emerald-500 text-sm"></i>}
                           {subdomainStatus === 'taken' && <i className="fas fa-times-circle text-rose-500 text-sm"></i>}
                         </div>

                         <div className="absolute right-9 top-1/2 -translate-y-1/2 w-px h-4 bg-slate-200"></div>
                         
                         <button 
                           type="button" 
                           onClick={handleCopyLink} 
                           className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg sm:rounded-full transition-all"
                           title="Salin Tautan"
                         >
                           <i className="far fa-copy text-[11px]"></i>
                         </button>
                      </div>
                      
                      <div className="h-4 mt-1.5 w-full text-center md:text-left">
                         {subdomainStatus === 'taken' && (
                            <span className="text-[10px] font-bold text-rose-500 animate-enter">
                              Subdomain ini sudah digunakan orang lain.
                            </span>
                         )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center md:justify-start gap-2.5 sm:gap-3">
                      <button type="button" onClick={() => open()} className="text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-700 bg-white border border-slate-200 px-5 sm:px-6 py-3 rounded-xl sm:rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 shadow-sm flex items-center gap-2">
                        <i className="fas fa-cloud-upload-alt"></i> Unggah Baru
                      </button>
                      {avatarUrl && !avatarUrl.includes('ui-avatars.com') && (
                        <button type="button" onClick={handleRemoveAvatar} className="w-11 h-11 rounded-xl sm:rounded-full bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:border-rose-200 hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center shadow-sm" title="Hapus Foto">
                          <i className="fas fa-trash-alt text-[13px]"></i>
                        </button>
                      )}
                    </div>
                  </div>
                </>
              )}
            </CldUploadWidget>
          </div>

          <form className="space-y-5 sm:space-y-6" onSubmit={handleSave}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6 animate-enter" style={{animationDelay: '300ms'}}>
              <div className="group">
                <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Nama Depan <span className="text-rose-500">*</span></label>
                <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-bold text-slate-900" />
              </div>
              <div className="group">
                <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Nama Belakang</label>
                <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-bold text-slate-900" />
              </div>
            </div>
            
            <div className="group animate-enter" style={{animationDelay: '400ms'}}>
              <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors flex justify-between items-end">
                <span>Profesi Utama <span className="text-rose-500">*</span></span>
                {!profession && <span className="text-[9px] text-slate-400 normal-case font-medium">Ditampilkan di bawah namamu</span>}
              </label>
              <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-bold text-slate-900" />
            </div>
            
            <div className="group animate-enter" style={{animationDelay: '500ms'}}>
              <label className="block text-[10px] sm:text-[11px] font-extrabold uppercase tracking-widest text-slate-500 mb-2 group-focus-within:text-slate-900 transition-colors">Bio Ringkas</label>
              <textarea rows={5} maxLength={250} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:border-slate-900 focus:ring-[4px] focus:ring-slate-900/5 outline-none transition-all text-sm font-medium leading-relaxed text-slate-900 resize-none" />
            </div>
            
            <div className="pt-8 mt-10 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 animate-enter" style={{animationDelay: '600ms'}}>
              <button type="button" onClick={() => window.location.reload()} className="w-full sm:w-auto px-8 py-3.5 sm:py-4 rounded-xl sm:rounded-full font-bold text-slate-600 bg-white border border-slate-200 hover:bg-slate-50 transition-colors text-[13px]">Batalkan</button>
              <button 
                type="submit" 
                disabled={isSaving || !isFormValid} 
                className={`relative px-10 py-3.5 sm:py-4 rounded-xl sm:rounded-full text-[12px] sm:text-[13px] font-extrabold uppercase tracking-widest overflow-hidden transition-all duration-300 transform w-full sm:w-auto shadow-md
                  ${isSaving || !isFormValid 
                    ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-transparent' 
                    : 'bg-slate-900 text-white hover:bg-slate-800 hover:shadow-lg active:scale-95 border border-slate-900'
                  }`}
              >
                <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>Simpan Perubahan <i className="fas fa-check ml-1 text-[10px]"></i></div>
                {isSaving && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-400 border-t-white rounded-full animate-spin"></div></div>}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}