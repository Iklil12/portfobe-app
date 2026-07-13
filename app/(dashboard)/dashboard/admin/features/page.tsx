//app/dashboard/admin/features/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useDashboardLayout } from '@/features/dashboard';
import { useRouter } from 'next/navigation';
import { Lock, Save, Layers, Wand2, TrendingUp, Loader2 } from 'lucide-react';

export default function FeaturesPage() {
  const { userRole, isLoading } = useDashboardLayout();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (isLoading) return;
    if (userRole !== 'ADMIN') {
      setIsAuthorized(false);
      router.push('/dashboard');
    } else {
      setIsAuthorized(true);
    }
  }, [userRole, isLoading, router]);

  if (isAuthorized === null || !isAuthorized) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-zinc-950">
        <Loader2 className="w-8 h-8 text-[#ff9e00] animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-zinc-950 font-sans">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-sans font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Lock className="w-3 h-3 text-[#ff9e00]" />
              <span>Admin Only</span>
            </span>
            <span className="bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-sans font-medium px-2.5 py-1 rounded-md">
              Beta Testing
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-medium text-white tracking-tight">Feature Flags</h1>
          <p className="text-white/60 mt-1 text-xs">Sakelar untuk mengaktifkan/menonaktifkan fitur secara global tanpa deploy ulang.</p>
        </div>
        <button className="w-full md:w-auto px-4 py-2 bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2">
          <Save className="w-3.5 h-3.5" />
          <span>Simpan Pengaturan</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-zinc-900/40 rounded-md border border-white/10 shadow-none overflow-hidden">
            <div className="divide-y divide-white/5">
              
              {/* Feature 1 */}
              <div className="p-6 md:p-8 flex items-center justify-between hover:bg-zinc-950/20 transition-colors">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-md bg-zinc-950 border border-white/5 text-white/60 flex items-center justify-center shrink-0">
                    <Layers className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs font-sans font-medium text-white">Hybrid Modular Builder</h3>
                      <span className="px-2 py-0.5 rounded-md text-[8px] font-sans font-medium bg-amber-950/20 text-amber-400 border border-amber-500/20">In Development</span>
                    </div>
                    <p className="text-[11px] font-sans text-white/60 max-w-lg leading-relaxed">Sistem drag-and-drop baru yang mengizinkan user menggeser urutan seksi portofolio secara bebas.</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-zinc-950 border border-white/10 peer-focus:outline-none rounded-md peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-950 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-white/10 after:rounded-md after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ff9e00] peer-checked:after:bg-black peer-checked:after:opacity-100"></div>
                  </label>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 md:p-8 flex items-center justify-between hover:bg-zinc-950/20 transition-colors">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-md bg-zinc-950 border border-white/5 text-white/60 flex items-center justify-center shrink-0">
                    <Wand2 className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs font-sans font-medium text-white">AI Auto-Writer</h3>
                      <span className="px-2 py-0.5 rounded-md text-[8px] font-sans font-medium bg-emerald-950/20 text-emerald-400 border border-emerald-500/20">Live</span>
                    </div>
                    <p className="text-[11px] font-sans text-white/60 max-w-lg leading-relaxed">Fitur untuk menghasilkan teks bio dan deskripsi proyek menggunakan kecerdasan buatan.</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-zinc-950 border border-white/10 peer-focus:outline-none rounded-md peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-950 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-white/10 after:rounded-md after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ff9e00] peer-checked:after:bg-black peer-checked:after:opacity-100"></div>
                  </label>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 md:p-8 flex items-center justify-between hover:bg-zinc-950/20 transition-colors">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-md bg-zinc-950 border border-white/5 text-white/60 flex items-center justify-center shrink-0">
                    <TrendingUp className="w-5 h-5 text-white/50" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-xs font-sans font-medium text-white">Advanced Analytics V2</h3>
                      <span className="px-2 py-0.5 rounded-md text-[8px] font-sans font-medium bg-zinc-950 text-white/20 border border-white/5">Disabled</span>
                    </div>
                    <p className="text-[11px] font-sans text-white/60 max-w-lg leading-relaxed">Versi terbaru dari sistem analitik yang melacak asal negara pengunjung dan durasi sesi per halaman.</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-zinc-950 border border-white/10 peer-focus:outline-none rounded-md peer peer-checked:after:translate-x-full peer-checked:after:border-zinc-950 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white/40 after:border-white/10 after:rounded-md after:h-6 after:w-6 after:transition-all peer-checked:bg-[#ff9e00] peer-checked:after:bg-black peer-checked:after:opacity-100"></div>
                  </label>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
