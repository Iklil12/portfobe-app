//components/features/appearance/OfflineModal.tsx
"use client";

import React from 'react';
import Link from 'next/link';
import { EyeOff, Globe } from 'lucide-react';

export function OfflineModal({ setShowOfflineModal }: { setShowOfflineModal: (show: boolean) => void }) {
  return (
    <div className="fixed inset-0 z-[9999999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md transition-opacity animate-in fade-in duration-500" onClick={() => setShowOfflineModal(false)}></div>
      <div className="relative bg-zinc-900 border border-white/10 rounded-none p-8 md:p-10 max-w-sm w-full animate-in zoom-in-95 fade-in duration-300 flex flex-col items-center text-center overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="w-16 h-16 bg-zinc-950 border border-white/5 text-rose-500 rounded-none flex items-center justify-center mb-6 relative">
          <EyeOff className="w-6 h-6" />
        </div>
        <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">Desain Disimpan</h3>
        <p className="text-white/40 mb-8 text-[11px] font-mono leading-relaxed">
          Namun, web portofolio Anda saat ini sedang berstatus <span className="font-bold text-rose-400">Offline</span>.
        </p>
        <div className="flex flex-col gap-3 w-full">
          <Link href="/dashboard/settings" className="w-full py-3 rounded-none font-mono font-bold text-black bg-[#ff9e00] hover:bg-[#ffaa22] active:scale-95 transition-all text-xs uppercase tracking-wider flex items-center justify-center gap-2">
            <Globe className="w-4 h-4" /> <span>Aktifkan Web Sekarang</span>
          </Link>
          <button onClick={() => setShowOfflineModal(false)} className="w-full py-3 rounded-none font-mono font-bold text-white/40 bg-zinc-950 border border-white/10 hover:bg-zinc-900 hover:text-white active:scale-95 transition-all text-xs uppercase tracking-wider">
            Nanti Saja
          </button>
        </div>
      </div>
    </div>
  );
}
