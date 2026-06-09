//app/providers.tsx
"use client";

import { SessionProvider } from "next-auth/react";
import { SWRConfig } from "swr";
import { Toaster, resolveValue, toast } from 'react-hot-toast';
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SystemErrorUI } from "@/components/errors/SystemErrorUI";
import { Check, X, Loader2, AlertTriangle, Info } from 'lucide-react';

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

  const swrAndToastContent = (
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
        {(t) => {
          const message = resolveValue(t.message, t) as React.ReactNode;
          
          let title = "Info";
          let IconComponent = Info;
          let borderClass = "border-white/10";
          let iconBgClass = "bg-white/5 text-white/70 border border-white/10";
          
          if (t.type === 'success') {
            title = "Berhasil!";
            IconComponent = Check;
            borderClass = "border-emerald-500/30";
            iconBgClass = "bg-emerald-500/10 text-emerald-400 border border-emerald-500/25";
          } else if (t.type === 'error') {
            title = "Kesalahan!";
            IconComponent = X;
            borderClass = "border-rose-500/30";
            iconBgClass = "bg-rose-500/10 text-rose-400 border border-rose-500/25";
          } else if (t.type === 'loading') {
            title = "Memproses...";
            IconComponent = Loader2;
            borderClass = "border-white/10";
            iconBgClass = "bg-white/5 text-white/40 border border-white/10";
          } else if (t.className === 'warning') {
            title = "Peringatan!";
            IconComponent = AlertTriangle;
            borderClass = "border-[#ff9e00]/30";
            iconBgClass = "bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/25";
          }

          const renderIcon = () => {
            if (typeof t.icon === 'string') {
              return <span className="text-[11px] font-mono font-bold leading-none">{t.icon}</span>;
            }
            if (t.type === 'loading') {
              return <IconComponent className="w-3.5 h-3.5 animate-spin" />;
            }
            return <IconComponent className="w-3.5 h-3.5" />;
          };

          return (
            <div 
              className={`transition-all duration-300 ease-out flex items-start gap-3 w-[290px] md:w-[340px] max-w-full p-3 bg-zinc-950/95 border ${borderClass} rounded-none shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md pointer-events-auto origin-top font-mono
              ${t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-6 scale-95'}`}
            >
              <div className={`transition-colors duration-300 w-7 h-7 rounded-none flex shrink-0 items-center justify-center ${iconBgClass}`}>
                {renderIcon()}
              </div>
              
              <div className="flex flex-col flex-1 mt-[2px]">
                <p className="text-[11px] font-bold text-white uppercase tracking-wider leading-none mb-1">{title}</p>
                <p className="text-[10px] text-white/50 leading-relaxed font-mono">{message}</p>
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
        }}
        </Toaster>
      </SWRConfig>
  );

  if (isPublicPage) {
    return swrAndToastContent;
  }

  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={false}>
      {swrAndToastContent}
    </SessionProvider>
  );
}