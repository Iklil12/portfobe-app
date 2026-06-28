//app/dashboard/settings/page.tsx
"use client";

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { useSettings } from '@/features/settings';
import { PortfolioStatusCard } from '@/features/settings';
import { EmailCredentialCard } from '@/features/settings';
import { SecurityCard } from '@/features/settings';
import { DangerZoneCard } from '@/features/settings';
import { DeleteAccountModal } from '@/features/settings';
import { UpdateEmailModal } from '@/features/settings';
import { UpdatePasswordModal } from '@/features/settings';
import { BillingContent } from '@/features/settings';
import { Shield, CreditCard, Plug, Cog, Loader2 } from 'lucide-react';

const TABS = [
  { id: 'account', label: 'Account & Security', icon: Shield },
  { id: 'billing', label: 'Billing & Subscription', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Plug, comingSoon: true },
] as const;

type TabId = typeof TABS[number]['id'];

function SettingsContent() {
  const { state, actions } = useSettings();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const initialTab = (searchParams.get('tab') as TabId) || 'account';
  const [activeTab, setActiveTab] = useState<TabId>(initialTab);

  const [isTabLoading, setIsTabLoading] = useState(false);

  // Sync tab state with URL
  const handleTabChange = (tab: TabId) => {
    if (tab === activeTab) return;
    const target = TABS.find(t => t.id === tab);
    if (target && 'comingSoon' in target && target.comingSoon) return;
    
    setIsTabLoading(true);
    setActiveTab(tab);
    router.replace(`/dashboard/settings?tab=${tab}`, { scroll: false });
    
    // Fake loading for visual feedback
    setTimeout(() => {
      setIsTabLoading(false);
    }, 600);
  };

  if (!state.mounted || state.isLoadingStatus || !state.session) {
    return (
      <main className="min-h-screen relative overflow-hidden pb-24 bg-zinc-950">
        <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
          <div className="mb-8 sm:mb-10 text-center md:text-left animate-enter">
            <div className="h-5 w-24 bg-zinc-900 border border-white/10 shimmer rounded-md mb-5 inline-block md:block mx-auto md:mx-0"></div>
            <div className="h-8 w-48 bg-zinc-900 border border-white/10 shimmer rounded-md mb-3 mx-auto md:mx-0"></div>
            <div className="h-3 w-72 bg-zinc-900 border border-white/10 shimmer rounded-md mx-auto md:mx-0"></div>
          </div>
          <div className="flex gap-2 mb-8 animate-enter" style={{animationDelay: '100ms'}}>
            <div className="h-10 w-32 bg-zinc-900 border border-white/10 shimmer rounded-md"></div>
            <div className="h-10 w-40 bg-zinc-900 border border-white/10 shimmer rounded-md"></div>
            <div className="h-10 w-32 bg-zinc-900 border border-white/10 shimmer rounded-md hidden md:block"></div>
          </div>
          <div className="space-y-5 sm:space-y-6 max-w-4xl animate-enter" style={{animationDelay: '200ms'}}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-zinc-950 border border-white/10 p-5 sm:p-6 rounded-md">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="h-5 w-40 bg-zinc-900 shimmer rounded-md mb-3"></div>
                    <div className="h-3 w-64 bg-zinc-900 shimmer rounded-md"></div>
                  </div>
                  <div className="h-8 w-24 bg-zinc-900 shimmer rounded-md"></div>
                </div>
                <div className="h-12 w-full max-w-md bg-zinc-900 shimmer rounded-md mb-4"></div>
                <div className="h-8 w-32 bg-zinc-900 shimmer rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden pb-24 bg-zinc-950">
      
      <div className="max-w-5xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {state.mounted && createPortal(<DeleteAccountModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdateEmailModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdatePasswordModal state={state} actions={actions} />, document.body)}

        {/* PAGE HEADER */}
        <div className="mb-8 sm:mb-10 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-zinc-900 border border-white/10 text-[9px] font-sans font-medium text-[#ff9e00] mb-5 shadow-none">
            <Cog className="w-3.5 h-3.5" />
            <span>Settings</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-sans font-medium uppercase tracking-wider text-white mb-3">
            Settings
          </h1>
          <p className="text-xs font-sans text-white/60 max-w-lg mx-auto md:mx-0">Manage account, security, billing, and integrations from one place.</p>
        </div>

        {/* TAB NAVIGATION */}
        <div className="flex gap-1 p-1 bg-zinc-900 border border-white/10 rounded-md mb-8 overflow-x-auto hide-scrollbar animate-enter" style={{animationDelay: '200ms'}}>
          {TABS.map((tab) => {
            const TabIcon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                disabled={'comingSoon' in tab && tab.comingSoon}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-md text-[11px] font-sans font-medium transition-all duration-200 whitespace-nowrap relative ${activeTab === tab.id ? 'bg-zinc-950 border border-white/10 text-white shadow-sm' : 'comingSoon' in tab && tab.comingSoon ? 'text-white/20 cursor-not-allowed opacity-50' : 'text-white/60 hover:text-white hover:bg-zinc-950/40' }`}
              >
                <TabIcon className={`w-3.5 h-3.5 ${activeTab === tab.id ? 'text-[#ff9e00]' : ''}`} />
                <span>{tab.label}</span>
                {'comingSoon' in tab && tab.comingSoon && (
                  <span className="text-[8px] font-sans font-medium px-1.5 py-0.5 rounded-md ml-1 bg-zinc-950 border border-white/5 text-white/50">Soon</span>
                )}
              </button>
            );
          })}
        </div>

        {/* TAB CONTENT */}
        <div className="animate-enter" style={{animationDelay: '300ms'}}>
          
          {isTabLoading ? (
            <div className="space-y-5 sm:space-y-6 max-w-4xl animate-enter">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-zinc-950 border border-white/10 p-5 sm:p-6 rounded-md">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <div className="h-5 w-40 bg-zinc-900 shimmer rounded-md mb-3"></div>
                      <div className="h-3 w-64 bg-zinc-900 shimmer rounded-md"></div>
                    </div>
                    <div className="h-8 w-24 bg-zinc-900 shimmer rounded-md"></div>
                  </div>
                  <div className="h-12 w-full max-w-md bg-zinc-900 shimmer rounded-md mb-4"></div>
                  <div className="h-8 w-32 bg-zinc-900 shimmer rounded-md"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* ACCOUNT & SECURITY TAB */}
              {activeTab === 'account' && (
                <div className="space-y-5 sm:space-y-6 max-w-4xl">
                  <PortfolioStatusCard state={state} actions={actions} />
                  <EmailCredentialCard state={state} actions={actions} />
                  <SecurityCard state={state} actions={actions} />
                  <DangerZoneCard state={state} actions={actions} />
                </div>
              )}

              {/* BILLING TAB */}
              {activeTab === 'billing' && (
                <BillingContent />
              )}

              {/* INTEGRATIONS TAB (COMING SOON) */}
              {activeTab === 'integrations' && (
                <div className="flex flex-col items-center justify-center py-24 text-center border border-dashed border-white/10 rounded-md bg-zinc-900/10">
                  <div className="w-16 h-16 rounded-md bg-zinc-950 border border-white/5 flex items-center justify-center mb-6 text-white/20 animate-pulse">
                    <Plug className="w-6 h-6 text-white/50" />
                  </div>
                  <h3 className="text-xs font-sans font-medium text-white mb-2">Coming Soon</h3>
                  <p className="text-[10px] font-sans text-white/60 max-w-md leading-relaxed">Connect third-party services like Google Analytics, Calendly, and Webhooks to empower your portfolio.</p>
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </main>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center font-mono text-xs text-white/60 bg-zinc-950">Loading settings...</div>}>
      <SettingsContent />
    </Suspense>
  );
}
