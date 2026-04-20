// app/dashboard/profile/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast, { Toaster } from 'react-hot-toast';
import { CldUploadWidget } from 'next-cloudinary';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [subdomain, setSubdomain] = useState(""); 
  const [initialSubdomain, setInitialSubdomain] = useState(""); // Menyimpan subdomain awal dari DB
  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  const [profession, setProfession] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState(""); 
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Validasi Form Dinamis (Tombol simpan mati jika subdomain 'taken')
  const isFormValid = firstName.trim() !== "" && profession.trim() !== "" && subdomainStatus !== 'taken';

  // 1. Fetch Data Awal
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
            
            const dbSubdomain = data.profile?.subdomain || data.subdomain;
            const emailPrefix = (session?.user?.email || "").split('@')[0] || "user";
            const finalSubdomain = dbSubdomain || emailPrefix;
            
            setSubdomain(finalSubdomain); 
            setInitialSubdomain(finalSubdomain); // Simpan untuk referensi perbandingan
            
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
        setIsLoadingData(false);
      }
    };

    if (status === "authenticated") {
      fetchProfile();
    } else if (status === "unauthenticated") {
      setIsLoadingData(false);
    }
  }, [status, session]);

  // 2. Real-Time Subdomain Checker (Debounce)
  useEffect(() => {
    // Jika kosong atau sama dengan punya user sendiri (initial), jangan cek ke DB
    if (!subdomain || subdomain === initialSubdomain) {
      setSubdomainStatus('idle');
      return;
    }

    // Tunggu user berhenti mengetik selama 500ms sebelum nembak API (biar server tidak jebol)
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
    toast.success("Foto dihapus. Klik Simpan untuk memperbarui database.", {
      icon: '🗑️',
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    if (!isFormValid) {
      toast.error("Formulir tidak valid. Periksa kembali isian Anda.", {
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
        setInitialSubdomain(subdomain); // Update acuan awal setelah simpan berhasil
        
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
    toast.success("Tautan berhasil disalin!", {
      icon: '🔗',
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
  };

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
  const defaultUsername = session?.user?.email?.split('@')[0] || "user";
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  // Penentu warna border & background form subdomain berdasarkan status pengecekan
  const getSubdomainStyle = () => {
    if (subdomainStatus === 'taken') return 'border-red-400 bg-red-50 ring-[3px] ring-red-400/20';
    if (subdomainStatus === 'available') return 'border-green-400 bg-green-50 ring-[3px] ring-green-400/20';
    return 'border-slate-200 bg-slate-50 hover:bg-white focus-within:bg-white focus-within:border-[#ff9e00] focus-within:ring-[3px] focus-within:ring-[#ff9e00]/15';
  };

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade { 0% { opacity: 0; transform: translateY(20px); } 100% { opacity: 1; transform: translateY(0); } }
      `}} />

      <Toaster position="top-center" reverseOrder={false} />

      <div className="mb-10 animate-enter text-center md:text-left">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2">
          Profil <span className="font-light text-slate-400">& Bio.</span>
        </h1>
        <p className="text-sm font-medium text-slate-500">Kelola identitas publik dan informasi spesialisasi Anda.</p>
      </div>

      <div className="bg-white p-8 sm:p-10 md:p-12 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_40px_rgba(0,0,0,0.03)] transition-all duration-500 relative animate-enter" style={{animationDelay: '100ms'}}>
        
        <div className="mb-12 border-b border-slate-100 pb-10 flex flex-col md:flex-row items-center md:items-start gap-8 text-center md:text-left animate-enter" style={{animationDelay: '200ms'}}>
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
                  window: "#ffffff",
                  windowBorder: "#f1f5f9",
                  tabIcon: "#64748b",
                  menuIcons: "#0f172a",
                  textDark: "#0f172a",
                  textLight: "#ffffff",
                  link: "#ff9e00",
                  action: "#0f172a",
                  inactiveTabIcon: "#94a3b8",
                  error: "#ef4444",
                  inProgress: "#ff9e00",
                  complete: "#22c55e",
                  sourceBg: "#f8fafc"
                },
                fonts: {
                  default: null,
                  "'Plus Jakarta Sans', sans-serif": {
                    url: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap",
                    active: true
                  }
                }
              }
            }}
            onSuccess={(result) => {
              if (typeof result.info === 'object' && 'secure_url' in result.info) {
                setAvatarUrl(result.info.secure_url); 
                toast.success("Foto terunggah! Jangan lupa klik Simpan.");
              }
            }}
          >
            {({ open }) => (
              <>
                <div className="relative shrink-0 w-32 h-32 md:w-36 md:h-36 group cursor-pointer" onClick={() => open()}>
                  <div className="absolute -inset-1 bg-[#ff9e00] rounded-full blur-md opacity-0 group-hover:opacity-20 transition duration-500"></div>
                  
                  <div className="relative w-full h-full rounded-full border-4 border-white shadow-[0_5px_15px_rgba(0,0,0,0.08)] overflow-hidden z-10 bg-slate-50">
                    <img 
                      src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=f8fafc&color=0f172a&bold=true`} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                      alt="Profile Avatar"
                    />
                    <div className="absolute inset-0 bg-slate-900/50 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                      <i className="fas fa-camera text-xl mb-1"></i>
                      <span className="text-[9px] font-bold uppercase tracking-widest mt-1">Ubah Foto</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col justify-center h-full pt-2 w-full md:w-auto relative">
                  <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 mb-2">
                    {firstName ? `${firstName} ${lastName}` : fullName}
                  </h2>
                  
                  {/* EDIT SUBDOMAIN DENGAN REAL-TIME VALIDATION */}
                  <div className="flex flex-col items-center justify-center md:justify-start mb-6 w-full md:w-auto relative">
                    <div className={`relative flex items-center gap-1 text-sm font-bold text-slate-600 pl-4 pr-12 py-2.5 rounded-full border transition-all overflow-hidden max-w-[280px] sm:max-w-md w-full md:w-auto ${getSubdomainStyle()}`}>
                       <i className="fas fa-link shrink-0 mr-1 opacity-50"></i>
                       <span className="opacity-50 select-none shrink-0 whitespace-nowrap">portfo.be/</span>
                       
                       <input
                         type="text"
                         value={subdomain} 
                         onChange={(e) => setSubdomain(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                         placeholder={defaultUsername}
                         className="bg-transparent outline-none text-slate-900 w-full min-w-[80px] p-0 border-none focus:ring-0 truncate"
                       />
                       
                       {/* Indikator Status (Kanan Dalam Input) */}
                       <div className="absolute right-[46px] top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none">
                         {subdomainStatus === 'checking' && <div className="w-3.5 h-3.5 border-2 border-slate-300 border-t-[#ff9e00] rounded-full animate-spin"></div>}
                         {subdomainStatus === 'available' && <i className="fas fa-check-circle text-green-500 text-sm"></i>}
                         {subdomainStatus === 'taken' && <i className="fas fa-times-circle text-red-500 text-sm"></i>}
                       </div>

                       {/* Batas Tipis */}
                       <div className="absolute right-9 top-1/2 -translate-y-1/2 w-px h-4 bg-slate-200"></div>
                       
                       <button 
                         type="button" 
                         onClick={handleCopyLink} 
                         className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center text-slate-400 hover:text-[#ff9e00] hover:bg-orange-50 rounded-full transition-all"
                         title="Salin Tautan"
                       >
                         <i className="far fa-copy text-[11px]"></i>
                       </button>
                    </div>
                    
                    {/* Pesan Error di Bawah Input jika Diambil */}
                    <div className="h-4 mt-1 w-full text-center md:text-left">
                       {subdomainStatus === 'taken' && (
                          <span className="text-[10px] font-bold text-red-500 animate-enter">
                            Subdomain ini sudah digunakan orang lain.
                          </span>
                       )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-center md:justify-start gap-3">
                    <button type="button" onClick={() => open()} className="text-[11px] font-extrabold uppercase tracking-widest text-slate-700 bg-white border border-slate-200 px-6 py-3 rounded-full hover:border-slate-400 hover:bg-slate-50 transition-all active:scale-95 shadow-sm flex items-center gap-2">
                      <i className="fas fa-cloud-upload-alt"></i> Unggah Baru
                    </button>
                    {avatarUrl && !avatarUrl.includes('ui-avatars.com') && (
                      <button type="button" onClick={handleRemoveAvatar} className="w-11 h-11 rounded-full bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all active:scale-95 flex items-center justify-center" title="Hapus Foto">
                        <i className="fas fa-trash-alt text-sm"></i>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </CldUploadWidget>
        </div>

        <form className="space-y-6" onSubmit={handleSave}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-enter" style={{animationDelay: '300ms'}}>
            <div className="group">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Nama Depan <span className="text-[#ff9e00]">*</span></label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-900" />
            </div>
            <div className="group">
              <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Nama Belakang</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-900" />
            </div>
          </div>
          
          <div className="group animate-enter" style={{animationDelay: '400ms'}}>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors flex justify-between items-end">
              <span>Profesi Utama <span className="text-[#ff9e00]">*</span></span>
              {!profession && <span className="text-[9px] text-slate-400 normal-case font-medium">Ditampilkan di bawah namamu</span>}
            </label>
            <input type="text" value={profession} onChange={(e) => setProfession(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-bold text-slate-900" />
          </div>
          
          <div className="group animate-enter" style={{animationDelay: '500ms'}}>
            <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2 group-focus-within:text-[#ff9e00] transition-colors">Bio Ringkas</label>
            <textarea rows={5} value={bio} onChange={(e) => setBio(e.target.value)} className="w-full px-5 py-4 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#ff9e00] focus:ring-[4px] focus:ring-[#ff9e00]/15 outline-none transition-all text-sm font-medium leading-relaxed text-slate-900 resize-none" />
          </div>
          
          <div className="pt-8 mt-10 border-t border-slate-100 flex flex-col-reverse sm:flex-row justify-end gap-3 animate-enter" style={{animationDelay: '600ms'}}>
            <button type="button" onClick={() => window.location.reload()} className="px-8 py-3.5 rounded-full font-bold text-slate-500 hover:bg-slate-100 w-full sm:w-auto text-sm">Batalkan</button>
            <button 
              type="submit" 
              disabled={isSaving || !isFormValid} 
              className={`relative px-10 py-3.5 rounded-full text-[13px] font-extrabold uppercase tracking-widest overflow-hidden transition-all duration-300 transform w-full sm:w-auto ${isSaving || !isFormValid ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 'bg-slate-900 text-white hover:bg-[#ff9e00] hover:text-black shadow-lg active:scale-95'}`}
            >
              <div className={`flex items-center justify-center gap-2 transition-opacity duration-300 ${isSaving ? 'opacity-0' : 'opacity-100'}`}>Simpan Perubahan <i className="fas fa-check ml-1 text-[10px]"></i></div>
              {isSaving && <div className="absolute inset-0 flex items-center justify-center"><div className="w-5 h-5 border-2 border-slate-400 border-t-slate-900 rounded-full animate-spin"></div></div>}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}