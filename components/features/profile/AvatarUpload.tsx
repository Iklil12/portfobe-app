//components/features/profile/AvatarUpload.tsx
import React, { useRef, useState } from 'react';
import { showToast } from '@/lib/customToast';
import Link from 'next/link';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { LazyImage } from '@/components/ui/LazyImage';
import { Camera, Check, Mail, FolderArchive, Loader2 } from 'lucide-react';

interface AvatarUploadProps {
  state: any;
  actions: any;
}

export function AvatarUpload({ state, actions }: AvatarUploadProps) {
  const { session, firstName, lastName, avatarUrl } = state;
  const { setAvatarUrl } = actions;

  // Ambil userPlan langsung dari layout hook (sinkron dengan Topbar)
  const { userPlan } = useDashboardLayout();

  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = session?.user?.name || "User Portfo";
  const email = session?.user?.email || "user@example.com";

  // Deteksi status PRO
  const isPro = userPlan !== 'FREE';
  const isSupreme = userPlan === 'SUPREME';

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // limit format
    const validMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validMimeTypes.includes(file.type)) {
      showToast({ message: "Format tidak didukung. Harap unggah JPG, PNG, atau WEBP.", id: "err-avatar-type", icon: "fa-exclamation" });
      return;
    }

    // size limit
    const maxImageSize = userPlan === 'SUPREME' ? 15 * 1024 * 1024 : userPlan === 'PRO' ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    const maxImageLabel = userPlan === 'SUPREME' ? '15MB' : userPlan === 'PRO' ? '10MB' : '5MB';
    if (file.size > maxImageSize) {
      showToast({ message: `Maksimal ukuran gambar adalah ${maxImageLabel}`, id: "err-avatar-size", icon: "fa-exclamation" });
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/projects/upload-image', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.secure_url) {
        setAvatarUrl(data.secure_url);
        showToast({ message: "Foto terunggah! Jangan lupa klik Simpan.", id: "upload-success-toast", icon: "fa-check-circle" });
      } else {
        showToast({ message: data.error || "Gagal mengunggah foto", id: "upload-avatar-fail", icon: "fa-times" });
      }
    } catch (err) {
      showToast({ message: "Terjadi kesalahan jaringan", id: "upload-avatar-err", icon: "fa-wifi" });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="relative mb-8 border-b border-white/10 pb-8 sm:pb-10 pt-32 sm:pt-40">
      {/* Banner / Cover Image - Gap tipis 6px dari dinding luar dan melingkar di semua sudut */}
      <div className="absolute -top-[25px] -left-[25px] -right-[25px] sm:-top-[41px] sm:-left-[41px] sm:-right-[41px] md:-top-[43px] md:-left-[43px] md:-right-[43px] h-40 sm:h-48 bg-zinc-900 border-b border-white/10 flex items-center justify-center group rounded-none">

        {/* Efek Pola Grid Tipis (Desain Kreatif) */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,0.08) 0.5px, transparent 0.5px)', backgroundSize: '20px 20px', opacity: 0.3 }}></div>

        {/* Cahaya Latar Berpendar (Glow) */}
        <div className="absolute -bottom-12 -left-12 w-56 h-56 bg-[#ff9e00]/5 rounded-full blur-3xl group-hover:bg-[#ff9e00]/10 transition-colors duration-700"></div>
        <div className="absolute -top-12 -right-12 w-56 h-56 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors duration-700"></div>

        {/* Logo Tengah */}
        <div className="relative z-10 p-4">
          <div className="absolute inset-0 bg-white/5 rounded-none blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <LazyImage
            src="/portfo.be.png"
            className="relative h-8 sm:h-10 w-auto object-contain opacity-40 group-hover:opacity-70 transition-opacity duration-300 drop-shadow-sm"
            alt="Portfo.be Cover"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-end justify-between gap-4 relative z-10">
        {/* Avatar & Info Area */}
        <div className="flex flex-col items-center sm:items-start w-full sm:w-auto">
          <input 
            type="file" 
            accept="image/png,image/jpeg,image/jpg,image/webp" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
          />
          <div 
            className="relative w-28 h-28 sm:w-32 sm:h-32 group cursor-pointer -mt-16 sm:-mt-20 mb-4 z-20" 
            onClick={() => !isUploading && fileInputRef.current?.click()}
          >
            <div className="absolute -inset-1 bg-white/10 rounded-none blur-md opacity-0 group-hover:opacity-10 transition duration-500"></div>
            <div className="relative w-full h-full rounded-none border-2 border-zinc-950 overflow-hidden bg-zinc-900">
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center z-30">
                  <Loader2 className="w-5 h-5 animate-spin text-[#ff9e00]" />
                </div>
              )}
              <LazyImage
                src={avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + ' ' + lastName || fullName)}&background=18181b&color=ff9e00&bold=true`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                alt="Profile Avatar"
              />
              <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px]">
                <Camera className="w-5 h-5 text-white/80" />
              </div>
            </div>
            {/* Verified Badge - HANYA MUNCUL JIKA PRO/SUPREME */}
            {isPro && (
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-none border border-zinc-950 flex items-center justify-center text-black z-40 ${isSupreme ? 'bg-purple-400' : 'bg-[#ff9e00]'}`}>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            )}
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mb-1.5">
              <h2 className="text-xl sm:text-2xl font-mono font-bold text-white uppercase tracking-tight">
                {firstName ? `${firstName} ${lastName}` : fullName}
              </h2>
              {/* Creator Tag - HANYA MUNCUL JIKA PRO/SUPREME */}
              {isPro && (
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-none flex items-center gap-1 uppercase tracking-wider ${isSupreme ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20'}`}>
                  <span className={`w-1.5 h-1.5 rounded-none animate-pulse ${isSupreme ? 'bg-purple-400' : 'bg-[#ff9e00]'}`}></span> {isSupreme ? 'Supreme Creator' : 'Pro Creator'}
                </span>
              )}
            </div>
            <p className="text-xs font-mono text-white/40 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-white/30" /> {email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-center sm:justify-end gap-3 w-full sm:w-auto mt-6 sm:mt-0">
          <Link href="/dashboard/projects" className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-none border border-white/10 bg-zinc-900/50 hover:bg-[#ff9e00]/10 hover:border-[#ff9e00]/30 hover:text-[#ff9e00] text-white/70 text-[11px] font-mono font-bold transition-all active:scale-95">
            <FolderArchive className="w-3.5 h-3.5 text-[#ff9e00]" /> Archive
          </Link>
        </div>
      </div>
    </div>
  );
}
