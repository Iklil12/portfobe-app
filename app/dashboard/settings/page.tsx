//app/dashboard/settings/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useSettings } from '@/hooks/useSettings';
import { PortfolioStatusCard } from '@/components/features/settings/PortfolioStatusCard';
import { EmailCredentialCard } from '@/components/features/settings/EmailCredentialCard';
import { SecurityCard } from '@/components/features/settings/SecurityCard';
import { DangerZoneCard } from '@/components/features/settings/DangerZoneCard';
import { DeleteAccountModal } from '@/components/features/settings/DeleteAccountModal';
import { UpdateEmailModal } from '@/components/features/settings/UpdateEmailModal';
import { UpdatePasswordModal } from '@/components/features/settings/UpdatePasswordModal';
import BillingContent from '@/components/features/settings/BillingContent';
import { Shield, CreditCard, Plug, Cog, Loader2 } from 'lucide-react';

const TABS = [
  { id: 'account', label: 'Akun & Keamanan', icon: Shield },
  { id: 'billing', label: 'Billing & Langganan', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Plug, comingSoon: true },
] as const;

type TabId = typeof TABS[number]['id'];

function SettingsContent() {
  const { state, actions } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = (searchParams.get('tab') as TabId) || 'account';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const [isMinimumLoadTimeMet, setIsMinimumLoadTimeMet] = useState(false);

  useEffect(() => {
    setIsMinimumLoadTimeMet(false);
    const timeout = setTimeout(() => setIsMinimumLoadTimeMet(true), 1200);
    return () => clearTimeout(timeout);
  }, []);

  // Sync tab state with URL
  const handleTabChange = (tab: TabId) => {
    const target = TABS.find(t => t.id === tab);
    if (target && 'comingSoon' in target && target.comingSoon) return;
    setActiveTab(tab);
    router.replace(`/dashboard/settings?tab=${tab}`, { scroll: false });
  };

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 bg-zinc-950">
      
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {state.mounted && createPortal(<DeleteAccountModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdateEmailModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdatePasswordModal state={state} actions={actions} />, document.body)}

        {/* PAGE HEADER */}
        <div className="mb-8 sm:mb-10 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-none bg-zinc-900 border border-white/10 text-[9px] font-mono font-bold uppercase tracking-widest text-[#ff9e00] mb-5 shadow-none">
            <Cog className="w-3.5 h-3.5" />
            <span>Pengaturan</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-mono font-bold uppercase tracking-wider text-white mb-3">
            Settings
          </h1>
          <p className="text-xs font-mono text-white/40 max-w-lg mx-auto md:mx-0">Kelola akun, keamanan, billing, dan integrasi dari satu tempat.</p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-1 p-1 bg-zinc-900 border border-white/10 rounded-none mb-8 overflow-x-auto hide-scrollbar animate-enter" style={{animationDelay: '200ms'}}>
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={'comingSoon' in tab && tab.comingSoon}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-none text-[11px] font-mono font-bold uppercase tracking-wider transition-all duration-200 whitespace-nowrap relative
                  ${activeTab === tab.id 
                    ? 'bg-zinc-950 border border-white/10 text-white shadow-sm' 
                    : 'comingSoon' in tab && tab.comingSoon 
                      ? 'text-white/20 cursor-not-allowed opacity-50' 
                      : 'text-white/40 hover:text-white hover:bg-zinc-950/40'
                  }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-[#ff9e00]' : ''}`} />
                <span>{tab.label}</span>
                {'comingSoon' in tab && tab.comingSoon && (
                  <span className="text-[8px] font-mono font-bold px-1.5 py-0.5 rounded-none uppercase tracking-wider ml-1 bg-zinc-950 border border-white/5 text-white/30">Soon</span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div className="animate-enter" style={{animationDelay: '300ms'}}>
          
          {/* ACCOUNT & SECURITY TAB */}
          {activeTab === 'account' && (
            !isMinimumLoadTimeMet ? (
              <div className="space-y-5 sm:space-y-6 max-w-4xl animate-billing-fade">
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
                  .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
                `}} />
                <div className="h-[180px] w-full shimmer-dark rounded-none" />
                <div className="h-[200px] w-full shimmer-dark rounded-none" />
                <div className="h-[200px] w-full shimmer-dark rounded-none" />
                <div className="h-[180px] w-full shimmer-dark rounded-none" />
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6 max-w-4xl">
                <PortfolioStatusCard state={state} actions={actions} />
                <EmailCredentialCard state={state} actions={actions} />
                <SecurityCard state={state} actions={actions} />
                <DangerZoneCard state={state} actions={actions} />
              </div>
            )
          )}

          {/* BILLING TAB */}
          {activeTab === 'billing' && (
            <BillingContent />
          )}

          {/* INTEGRATIONS TAB (COMING SOON) */}
          {activeTab === 'integrations' && (
            <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-none bg-zinc-900/10">
              <div className="w-16 h-16 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center mb-6 text-white/20 animate-pulse">
                <Plug className="w-6 h-6 text-white/30" />
              </div>
              <h3 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-2">Segera Hadir</h3>
              <p className="text-[10px] font-mono text-white/40 max-w-md leading-relaxed">Hubungkan layanan pihak ketiga seperti Google Analytics, Calendly, dan Webhook untuk memperkuat portofoliomu.</p>
            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-mono text-xs text-white/40 bg-zinc-950">Memuat pengaturan...</div>}>
      <SettingsContent />
    </Suspense>
  );
}