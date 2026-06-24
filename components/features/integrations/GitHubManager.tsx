"use client";

import React, { useState, useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import useSWR, { mutate } from 'swr';
import toast from 'react-hot-toast';
import { 
  RefreshCw, 
  ExternalLink,
  Lock,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { GithubIcon } from '@/components/ui/Icons';

const fetcher = (url: string) => fetch(url).then(r => r.json());

export function GitHubManager() {
  const { data: session } = useSession();
  const { data: integrationsData } = useSWR('/api/settings/integrations', fetcher);

  const [isDisconnectingGithub, setIsDisconnectingGithub] = useState(false);
  const [confirmDisconnect, setConfirmDisconnect] = useState<'github' | null>(null);
  const [isRefreshingGithub, setIsRefreshingGithub] = useState(false);
  const [lastGithubRefresh, setLastGithubRefresh] = useState<Date | null>(null);

  const integrations: any[] = integrationsData?.integrations || [];
  const githubIntegration = integrations.find((i) => i.provider === 'GITHUB');
  const isGithubConnected = !!githubIntegration;
  const githubUsername = githubIntegration?.providerId || null;

  useEffect(() => {
    if (githubIntegration?.updatedAt && !lastGithubRefresh) {
      setLastGithubRefresh(new Date(githubIntegration.updatedAt));
    }
  }, [githubIntegration]);

  const timeAgo = (date: Date | null) => {
    if (!date) return null;
    const diff = Math.floor((Date.now() - date.getTime()) / 1000 / 60);
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff} minutes ago`;
    return `${Math.floor(diff / 60)} hours ago`;
  };

  const handleRefreshGithub = async () => {
    if (!session?.user?.id || isRefreshingGithub) return;
    setIsRefreshingGithub(true);
    const toastId = toast.loading('Syncing GitHub data...');
    try {
      const res = await fetch(`/api/github/stats?userId=${session.user.id}&bust=1`);
      if (res.ok) {
        setLastGithubRefresh(new Date());
        toast.success('GitHub sync successful!', { id: toastId });
      } else {
        const err = await res.json();
        toast.error(err.error || 'Sync failed.', { id: toastId });
      }
    } catch {
      toast.error('Network error during sync.', { id: toastId });
    } finally {
      setIsRefreshingGithub(false);
    }
  };

  const handleDisconnectGithub = async () => {
    setIsDisconnectingGithub(true);
    const toastId = toast.loading('Disconnecting GitHub...');
    try {
      const res = await fetch('/api/settings/integrations/disconnect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: 'GITHUB' }),
      });
      if (res.ok) {
        mutate('/api/settings/integrations');
        setConfirmDisconnect(null);
        toast.success('GitHub disconnected.', { id: toastId });
      } else {
        toast.error('Failed to disconnect.', { id: toastId });
      }
    } catch {
      toast.error('Network error.', { id: toastId });
    } finally {
      setIsDisconnectingGithub(false);
    }
  };

  return (
    <div className="bg-zinc-950 p-6 md:p-8 border border-white/10 rounded-none relative z-40">
      <div className="space-y-8">
        {isGithubConnected ? (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 rounded-none border border-white/5 bg-[#0a0a0a]">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-[#ff9e00]">
                  <GithubIcon className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-base font-mono font-bold text-white tracking-wide">@{githubUsername}</p>
                  <div className="flex items-center gap-1.5 mt-1.5">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <p className="text-[9px] text-[#86efac] font-mono font-bold uppercase tracking-wider">Connected</p>
                  </div>
                </div>
              </div>
              <a 
                href={`https://github.com/${githubUsername}`} 
                target="_blank" 
                rel="noreferrer" 
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-none border border-white/10 bg-zinc-900 text-white/70 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-zinc-800 transition-colors shadow-none text-center"
              >
                Profile <ExternalLink className="w-3.5 h-3.5 text-white/40" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-none border border-white/5 bg-[#0a0a0a]">
                <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-4">Sync Management</p>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <span className="block text-xs text-white/70 font-mono font-bold">
                      {timeAgo(lastGithubRefresh) ? `Last synced ${timeAgo(lastGithubRefresh)}` : 'Never synced'}
                    </span>
                    <p className="text-[9px] text-white/40 font-mono italic">Auto-sync every 15 minutes</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleRefreshGithub}
                    disabled={isRefreshingGithub}
                    className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 text-white hover:bg-zinc-800 transition-colors disabled:opacity-30 flex items-center justify-center focus:outline-none"
                  >
                    <RefreshCw className={`w-4 h-4 ${isRefreshingGithub ? 'animate-spin text-[#ff9e00]' : ''}`} />
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-none border border-white/5 bg-[#0a0a0a]">
                <p className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest mb-4">Danger Zone</p>
                {confirmDisconnect === 'github' ? (
                  <div className="flex gap-3">
                    <button type="button" onClick={() => setConfirmDisconnect(null)} className="flex-1 py-2.5 rounded-none bg-zinc-900 border border-white/10 text-white/70 text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-zinc-800 transition-all">Cancel</button>
                    <button type="button" onClick={handleDisconnectGithub} disabled={isDisconnectingGithub} className="flex-1 py-2.5 rounded-none bg-rose-600 text-white text-[9px] font-mono font-bold uppercase tracking-widest hover:bg-rose-700 active:scale-95 transition-all">Disconnect</button>
                  </div>
                ) : (
                  <button 
                    type="button"
                    onClick={() => setConfirmDisconnect('github')}
                    className="w-full py-3 rounded-none border border-rose-900/30 bg-rose-950/20 text-rose-400 text-[10px] font-mono font-bold uppercase tracking-widest hover:bg-rose-900/30 transition-all"
                  >
                    Disconnect Account
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-6">
            <div className="w-20 h-20 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center text-white/30">
              <GithubIcon className="w-9 h-9" />
            </div>
            <div className="max-w-[280px]">
              <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">GitHub Not Connected</h4>
              <p className="text-xs text-white/40 mt-2 font-mono leading-relaxed">Connect your account to display repositories and code activity on your portfolio.</p>
            </div>
            <button
              type="button"
              onClick={() => signIn('github', { callbackUrl: '/dashboard/integrations' })}
              className="px-6 py-3.5 bg-[#ff9e00] hover:bg-[#ffaa22] text-black text-[10px] font-mono font-bold uppercase tracking-widest transition-all active:scale-95 shadow-md"
            >
              Connect GitHub Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
