//app/dashboard/admin/errors/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDashboardLayout } from '@/features/dashboard';
import { Lock, Radio, RefreshCw, Terminal, Loader2 } from 'lucide-react';

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
            <span className="bg-zinc-900 border border-white/10 text-white/50 text-[9px] font-sans font-medium px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Radio className="w-3 h-3 text-rose-500 animate-pulse" />
              <span>Live</span>
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-medium text-white tracking-tight">System Logs</h1>
          <p className="text-white/60 mt-1 text-xs">Pemantauan error dan aktivitas teknis pada server secara real-time.</p>
        </div>
        <button className="w-full md:w-auto px-4 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white/70 hover:text-white text-xs font-medium rounded-md transition-colors flex items-center justify-center gap-2">
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      {/* Content */}
      <div className="p-6 md:p-8 pb-24">
        <div className="max-w-5xl mx-auto space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-zinc-900/40 p-5 rounded-md border border-white/10 shadow-none">
              <p className="text-[10px] font-medium text-white/60 mb-1">Total Errors (24h)</p>
              <h3 className="text-xl font-medium text-white">0</h3>
            </div>
            <div className="bg-zinc-900/40 p-5 rounded-md border border-white/10 shadow-none">
              <p className="text-[10px] font-medium text-white/60 mb-1">API Latency</p>
              <h3 className="text-xl font-medium text-white">42<span className="text-xs font-sans text-white/50 ml-1">ms</span></h3>
            </div>
            <div className="bg-zinc-900/40 p-5 rounded-md border border-white/10 shadow-none">
              <p className="text-[10px] font-medium text-white/60 mb-1">Database Health</p>
              <h3 className="text-xl font-medium text-emerald-400">100%</h3>
            </div>
          </div>

          <div className="bg-zinc-950 rounded-md overflow-hidden border border-white/10 shadow-none">
            <div className="bg-zinc-900 px-4 py-3 text-xs font-sans text-white/60 border-b border-white/5 flex justify-between items-center">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#ff9e00]" />
                <span>production.log</span>
              </span>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 rounded-md bg-rose-500/80"></div>
                <div className="w-2 h-2 rounded-md bg-amber-500/80"></div>
                <div className="w-2 h-2 rounded-md bg-emerald-500/80"></div>
              </div>
            </div>
            <div className="p-4 text-xs font-sans text-white/70 overflow-y-auto leading-relaxed h-[400px] bg-zinc-950/80">
              <div className="text-emerald-400 mb-2">[INFO] 2026-06-02 14:00:00 - Server started successfully.</div>
              <div className="text-white/60 mb-2">[DEBUG] 2026-06-02 14:05:12 - Database connection pool initialized (10 connections).</div>
              <div className="text-emerald-400 mb-2">[INFO] 2026-06-02 14:15:33 - New user registered: portfobee@gmail.com</div>
              <div className="text-white/60 mb-2">[DEBUG] 2026-06-02 14:20:01 - Sync API called by user_id: clxyz123 (Latency: 24ms)</div>
              <div className="mt-8 text-[#ff9e00]/50 animate-pulse">Waiting for new logs...</div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
