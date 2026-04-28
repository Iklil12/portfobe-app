import React from 'react';
import { CldUploadWidget } from 'next-cloudinary';
import { showToast } from '@/lib/customToast';

interface AvatarUploadProps {
  state: any;
  actions: any;
}

export function AvatarUpload({ state, actions }: AvatarUploadProps) {
  const { session, firstName, lastName, subdomain, subdomainStatus, avatarUrl } = state;
  const { setSubdomain, setAvatarUrl, handleRemoveAvatar } = actions;

  const fullName = session?.user?.name || "User Portfo";
  const defaultUsername = session?.user?.email?.split('@')[0] || "user";
  const cloudinaryPreset = process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "paperions_preset";

  const handleCopyLink = () => {
    const linkToCopy = `portfo.be/${subdomain}`;
    navigator.clipboard.writeText(linkToCopy);
    showToast({
      message: "Tautan berhasil disalin!",
      id: "copy-link-toast",
      icon: "fa-link"
    });
  };

  const getSubdomainStyle = () => {
    if (subdomainStatus === 'taken') return 'border-rose-400 bg-rose-50 ring-[3px] ring-rose-400/20';
    if (subdomainStatus === 'available') return 'border-emerald-400 bg-emerald-50 ring-[3px] ring-emerald-400/20';
    return 'border-slate-200 bg-slate-50/50 hover:bg-white focus-within:bg-white focus-within:border-slate-900 focus-within:ring-[3px] focus-within:ring-slate-900/10';
  };

  return (
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
                     maxLength={15}
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
  );
}
