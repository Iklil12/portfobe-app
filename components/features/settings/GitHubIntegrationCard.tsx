'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

export function GitHubIntegrationCard() {
  const { data: session } = useSession();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Ambil data integrasi GitHub saat ini
  useEffect(() => {
    const fetchIntegration = async () => {
      try {
        const res = await fetch('/api/settings/integrations');
        if (res.ok) {
          const data = await res.json();
          const github = data?.integrations?.find((i: any) => i.provider === 'GITHUB');
          if (github) {
            setGithubUsername(github.providerId);
            setLastRefresh(github.updatedAt ? new Date(github.updatedAt) : null);
          }
        }
      } catch (e) {
        // Silently fail
      } finally {
        setIsLoading(false);
      }
    };

    if (session?.user?.id) fetchIntegration();
    else setIsLoading(false);
  }, [session]);

  // Paksa refresh cache GitHub stats
  const handleRefresh = async () => {
    if (!session?.user?.id || isRefreshing) return;
    setIsRefreshing(true);
    const toastId = toast.loading('Mengambil data terbaru dari GitHub...');

    try {
      const res = await fetch(`/api/github/stats?userId=${session.user.id}&bust=1`);
      if (res.ok) {
        setLastRefresh(new Date());
        toast.success('Data GitHub berhasil diperbarui! Refresh halaman portofolio untuk melihat perubahan.', {
          id: toastId,
          duration: 5000,
        });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Gagal memperbarui data.', { id: toastId });
      }
    } catch (e) {
      toast.error('Terjadi kesalahan. Coba lagi.', { id: toastId });
    } finally {
      setIsRefreshing(false);
    }
  };

  if (isLoading || !githubUsername) return null;

  const timeAgo = lastRefresh
    ? (() => {
        const diff = Math.floor((Date.now() - lastRefresh.getTime()) / 1000 / 60);
        if (diff < 1) return 'Baru saja';
        if (diff < 60) return `${diff} menit lalu`;
        return `${Math.floor(diff / 60)} jam lalu`;
      })()
    : null;

  return (
    <div
      className="bg-white p-6 sm:p-8 md:p-10 rounded-[1.5rem] sm:rounded-[2.5rem] border border-slate-100 shadow-[0_2px_10px_rgba(0,0,0,0.01)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)] hover:border-slate-200 transition-all duration-300 animate-enter"
      style={{ animationDelay: '200ms' }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shrink-0">
          <i className="fab fa-github text-white text-lg"></i>
        </div>
        <div>
          <h4 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">Integrasi GitHub</h4>
          <p className="text-xs text-slate-400 font-medium">
            Terhubung sebagai{' '}
            <a
              href={`https://github.com/${githubUsername}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-slate-700 font-bold hover:underline"
            >
              @{githubUsername}
            </a>
          </p>
        </div>
        {/* Badge Terhubung */}
        <span className="ml-auto px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-700 text-[9px] font-extrabold uppercase tracking-widest flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Aktif
        </span>
      </div>

      {/* Info & Tombol Refresh */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="flex-1">
          <p className="text-sm font-bold text-slate-800 mb-1">Cache Data GitHub</p>
          <p className="text-xs text-slate-500 font-medium leading-relaxed max-w-md">
            Data repositori otomatis diperbarui setiap <strong>15 menit</strong>. Jika Anda baru mengubah repositori dari <em>Private</em> ke <em>Public</em>, klik tombol di bawah untuk langsung memperbarui.
          </p>
          {timeAgo && (
            <p className="text-[10px] text-slate-400 font-medium mt-2 flex items-center gap-1.5">
              <i className="fas fa-clock text-[9px]"></i>
              Terakhir diperbarui: {timeAgo}
            </p>
          )}
        </div>

        <button
          onClick={handleRefresh}
          disabled={isRefreshing}
          className={`shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold border transition-all duration-200
            ${isRefreshing
              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
              : 'bg-white text-slate-700 border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300 active:scale-95'
            }`}
        >
          <i className={`fas fa-arrows-rotate text-sm ${isRefreshing ? 'animate-spin' : ''}`}></i>
          {isRefreshing ? 'Memperbarui...' : 'Refresh Data'}
        </button>
      </div>
    </div>
  );
}
