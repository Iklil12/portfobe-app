//app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster, resolveValue, toast } from 'react-hot-toast';
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SystemErrorUI } from "@/components/errors/SystemErrorUI";
import { 
  Check, 
  X, 
  Loader2, 
  AlertTriangle, 
  Info, 
  Image, 
  Undo2, 
  Wifi, 
  Trash2, 
  Globe, 
  Link, 
  UploadCloud, 
  AlertCircle,
  Lock,
  Hand
} from 'lucide-react';

const iconMap: Record<string, React.ComponentType<any>> = {
  'fa-exclamation-triangle': AlertTriangle,
  'fa-exclamation': AlertCircle,
  'fa-exclamation-circle': AlertCircle,
  'fa-image': Image,
  'fa-undo': Undo2,
  'fa-wifi': Wifi,
  'fa-trash-alt': Trash2,
  'fa-trash': Trash2,
  'fa-check-circle': Check,
  'fa-check': Check,
  'fa-times': X,
  'fa-times-circle': X,
  'fa-globe': Globe,
  'fa-link': Link,
  'fa-cloud-upload-alt': UploadCloud,
  'fa-lock': Lock,
  'fa-hand-paper': Hand,
};


const globalFetcher = (url: string) =>
  fetch(url, { cache: 'no-store' }).then((res) => {
    if (!res.ok) {
      const error: any = new Error("API Error");
      error.status = res.status;
      throw error;
    }
    return res.json();
  });

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [swrError, setSwrError] = useState<Error | null>(null);

  if (swrError) {
    // Jangan 'throw' karena berada di Root Layout (tidak tertangkap error.tsx).
    // Render saja komponen UI-nya secara langsung untuk menggantikan layar.
    return <SystemErrorUI error={swrError} reset={() => window.location.reload()} />;
  }

  const isPublicPage = pathname === "/" || 
                       pathname === "/pricing" || 
                       pathname === "/privacy" || 
                       pathname === "/terms";

  // Toast renderer (diekstrak agar JSX lebih bersih)
  const toastRenderer = (t: any) => {
    const message = resolveValue(t.message, t) as React.ReactNode;
    
    let title = "Info";
    let IconComponent = Info;
    let borderClass = "border-white/30";
    let iconBgClass = "bg-white/10 text-white border border-white/20";
    let shadowClass = "shadow-[0_20px_50px_rgba(255,255,255,0.05)]";
    
    if (t.type === 'success') {
      title = "Berhasil!";
      IconComponent = Check;
      borderClass = "border-emerald-500/60";
      iconBgClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
      shadowClass = "shadow-[0_20px_50px_rgba(16,185,129,0.18)]";
    } else if (t.type === 'error') {
      title = "Kesalahan!";
      IconComponent = X;
      borderClass = "border-rose-500/60";
      iconBgClass = "bg-rose-500/20 text-rose-300 border border-rose-500/30";
      shadowClass = "shadow-[0_20px_50px_rgba(244,63,94,0.18)]";
    } else if (t.type === 'loading') {
      title = "Memproses...";
      IconComponent = Loader2;
      borderClass = "border-white/30";
      iconBgClass = "bg-white/10 text-white/50 border border-white/20";
      shadowClass = "shadow-[0_20px_50px_rgba(255,255,255,0.05)]";
    } else if (t.className === 'warning') {
      title = "Peringatan!";
      IconComponent = AlertTriangle;
      borderClass = "border-[#ff9e00]/70";
      iconBgClass = "bg-[#ff9e00]/20 text-[#ffb633] border border-[#ff9e00]/30";
      shadowClass = "shadow-[0_20px_50px_rgba(255,158,0,0.18)]";
    } else if (typeof t.icon === 'string') {
      if (t.icon.includes('exclamation') || t.icon.includes('warning') || t.icon.includes('hand-paper')) {
        title = "Peringatan!";
        IconComponent = AlertTriangle;
        borderClass = "border-[#ff9e00]/70";
        iconBgClass = "bg-[#ff9e00]/20 text-[#ffb633] border border-[#ff9e00]/30";
        shadowClass = "shadow-[0_20px_50px_rgba(255,158,0,0.18)]";
      } else if (t.icon.includes('check') || t.icon.includes('success') || t.icon.includes('ok')) {
        title = "Berhasil!";
        IconComponent = Check;
        borderClass = "border-emerald-500/60";
        iconBgClass = "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30";
        shadowClass = "shadow-[0_20px_50px_rgba(16,185,129,0.18)]";
      } else if (t.icon.includes('times') || t.icon.includes('err') || t.icon.includes('fail')) {
        title = "Kesalahan!";
        IconComponent = X;
        borderClass = "border-rose-500/60";
        iconBgClass = "bg-rose-500/20 text-rose-300 border border-rose-500/30";
        shadowClass = "shadow-[0_20px_50px_rgba(244,63,94,0.18)]";
      }
    }

    const renderIcon = () => {
      if (typeof t.icon === 'string') {
        const LucideIcon = iconMap[t.icon];
        if (LucideIcon) {
          return <LucideIcon className="w-3.5 h-3.5" />;
        }
        return <span className="text-[11px] font-mono font-bold leading-none">{t.icon}</span>;
      }
      if (t.type === 'loading') {
        return <IconComponent className="w-3.5 h-3.5 animate-spin" />;
      }
      return <IconComponent className="w-3.5 h-3.5" />;
    };

    return (
      <div 
        className={`transition-all duration-300 ease-out flex items-start gap-3 w-[290px] md:w-[340px] max-w-full p-3 bg-zinc-800 border ${borderClass} rounded-none ${shadowClass} backdrop-blur-md pointer-events-auto origin-top font-mono
        ${t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
      >
        <div className={`transition-colors duration-300 w-7 h-7 rounded-none flex shrink-0 items-center justify-center ${iconBgClass}`}>
          {renderIcon()}
        </div>
        
        <div className="flex flex-col flex-1 mt-[2px]">
          <p className="text-[11px] font-bold text-white uppercase tracking-wider leading-none mb-1">{title}</p>
          <p className="text-[10px] text-zinc-300 leading-relaxed font-mono">{message}</p>
        </div>
        
        {t.type !== 'loading' && (
          <button 
            onClick={() => toast.dismiss(t.id)}
            className="w-7 h-7 rounded-none border border-transparent hover:border-white/10 flex shrink-0 items-center justify-center text-white/40 hover:text-white hover:bg-white/5 active:scale-95 transition-all"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  };

  // Konten inti: SWR + Toast (dipakai di kedua cabang)
  const coreContent = (
    <SWRConfig
      value={{
        fetcher: globalFetcher,
        revalidateOnFocus: true,
        focusThrottleInterval: 10000,
        dedupingInterval: 10000,
        revalidateOnReconnect: true,
        onError: (error) => {
          // Hanya tangkap error 500 (Server Error) atau jaringan terputus (tanpa status)
          if (error.status >= 500 || !error.status) {
            setSwrError(error);
          }
        }
      }}
    >
      {children}
      <Toaster position="top-center" containerStyle={{ zIndex: 1000000, marginTop: '20px' }}>
        {toastRenderer}
      </Toaster>
    </SWRConfig>
  );

  // Halaman publik: tanpa SessionProvider (tidak butuh autentikasi)
  if (isPublicPage) {
    return coreContent;
  }

  // Halaman privat (dashboard, editor, dll.): bungkus dengan SessionProvider
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {coreContent}
    </SessionProvider>
  );
}