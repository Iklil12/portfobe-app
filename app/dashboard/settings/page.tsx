"use client";

import React from 'react';
import { createPortal } from 'react-dom';
import { useSettings } from '@/hooks/useSettings';
import { SettingsHeader } from '@/components/features/settings/SettingsHeader';
import { PortfolioStatusCard } from '@/components/features/settings/PortfolioStatusCard';
import { EmailCredentialCard } from '@/components/features/settings/EmailCredentialCard';
import { SecurityCard } from '@/components/features/settings/SecurityCard';
import { DangerZoneCard } from '@/components/features/settings/DangerZoneCard';
import { DeleteAccountModal } from '@/components/features/settings/DeleteAccountModal';
import { UpdateEmailModal } from '@/components/features/settings/UpdateEmailModal';
import { UpdatePasswordModal } from '@/components/features/settings/UpdatePasswordModal';

export default function SettingsPage() {
  const { state, actions } = useSettings();

  return (
    <main className="min-h-screen font-sans relative overflow-hidden selection:bg-slate-200 selection:text-slate-900 pb-24">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { opacity: 0; animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px) scale(0.98); filter: blur(3px); }
            100% { opacity: 1; transform: translateY(0) scale(1); filter: blur(0); }
        }
        .animate-spin-slow { animation: spin 10s linear infinite; }
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />

      {/* ELEMEN DEKORASI BACKGROUND DIHAPUS (Dipindah ke layout.tsx) */}

      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">

        {state.mounted && createPortal(<DeleteAccountModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdateEmailModal state={state} actions={actions} />, document.body)}
        {state.mounted && createPortal(<UpdatePasswordModal state={state} actions={actions} />, document.body)}

        <SettingsHeader />

        <div className="space-y-5 sm:space-y-6">
          <PortfolioStatusCard state={state} actions={actions} />
          <EmailCredentialCard state={state} actions={actions} />
          <SecurityCard state={state} actions={actions} />
          <DangerZoneCard state={state} actions={actions} />
        </div>
      </div>
    </main>
  );
}