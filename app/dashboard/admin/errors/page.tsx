"use client";

import React, { useEffect, useState } from 'react';
import { useDashboardLayout } from '@/hooks/useDashboardLayout';
import { useRouter } from 'next/navigation';

export default function ErrorsPage() {
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
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest border border-red-200">
              <i className="fas fa-circle-dot text-[8px] animate-pulse"></i> Live
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">System Logs</h1>
          <p className="text-slate-500 mt-1 text-sm md:text-base">Pemantauan error dan aktivitas teknis pada server secara real-time.</p>
        </div>
        <button className="w-full md:w-auto px-4 py-2.5 md:py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-2">
          <i className="fas fa-sync-alt"></i> Refresh Logs
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Errors (24h)</p>
              <h3 className="text-2xl font-black text-slate-900">0</h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">API Latency</p>
              <h3 className="text-2xl font-black text-slate-900">42<span className="text-sm font-bold text-slate-400 ml-1">ms</span></h3>
            </div>
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Database Health</p>
              <h3 className="text-2xl font-black text-emerald-500">100%</h3>
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-sm border border-slate-800">
            <div className="bg-slate-800/80 px-4 py-3 text-xs font-mono text-slate-400 border-b border-slate-700/50 flex justify-between items-center">
              <span className="flex items-center gap-2"><i className="fas fa-terminal"></i> production.log</span>
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
              </div>
            </div>
            <div className="p-4 text-xs font-mono text-slate-300 overflow-x-auto leading-relaxed h-[400px]">
              <div className="text-emerald-400 mb-2">[INFO] 2026-06-02 14:00:00 - Server started successfully.</div>
              <div className="text-slate-400 mb-2">[DEBUG] 2026-06-02 14:05:12 - Database connection pool initialized (10 connections).</div>
              <div className="text-emerald-400 mb-2">[INFO] 2026-06-02 14:15:33 - New user registered: portfobee@gmail.com</div>
              <div className="text-slate-400 mb-2">[DEBUG] 2026-06-02 14:20:01 - Sync API called by user_id: clxyz123 (Latency: 24ms)</div>
              <div className="mt-8 text-slate-500 animate-pulse">Waiting for new logs...</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
