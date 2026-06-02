"use client";

import React, { useEffect, useState } from 'react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useRouter } from 'next/navigation';

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
      <div className="flex h-full w-full items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto bg-slate-50">
      {/* Header */}
      <div className="px-6 md:px-8 pt-6 md:pt-8 max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between md:items-end gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-violet-100 text-violet-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-violet-200">
              <i className="fas fa-lock mr-1"></i> Admin Only
            </span>
            <span className="bg-amber-100 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-amber-200">
              Beta Testing
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">Feature Flags</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Sakelar untuk mengaktifkan/menonaktifkan fitur secara global tanpa deploy ulang.</p>
        </div>
        <button className="w-full md:w-auto px-4 py-2.5 md:py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md">
          <i className="fas fa-save"></i> Simpan Pengaturan
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-5xl mx-auto">
          
          <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="divide-y divide-slate-100">
              
              {/* Feature 1 */}
              <div className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-layer-group text-xl"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900">Hybrid Modular Builder</h3>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-amber-100 text-amber-700">In Development</span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-lg leading-relaxed">Sistem drag-and-drop baru yang mengizinkan user menggeser urutan seksi portofolio secara bebas.</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-wand-magic-sparkles text-xl"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900">AI Auto-Writer</h3>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-emerald-100 text-emerald-700">Live</span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-lg leading-relaxed">Fitur untuk menghasilkan teks bio dan deskripsi proyek menggunakan kecerdasan buatan.</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="p-6 md:p-8 flex items-center justify-between hover:bg-slate-50 transition-colors">
                <div className="flex gap-5">
                  <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                    <i className="fas fa-chart-line text-xl"></i>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-bold text-slate-900">Advanced Analytics V2</h3>
                      <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-widest bg-slate-100 text-slate-500">Disabled</span>
                    </div>
                    <p className="text-sm text-slate-500 max-w-lg leading-relaxed">Versi terbaru dari sistem analitik yang melacak asal negara pengunjung dan durasi sesi per halaman.</p>
                  </div>
                </div>
                <div className="shrink-0 ml-4">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-violet-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
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
