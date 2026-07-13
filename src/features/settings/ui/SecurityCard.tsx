//components/features/settings/SecurityCard.tsx
import React from 'react';
import { Key, Lock } from 'lucide-react';
import { SettingsState, SettingsActions } from '../model/useSettings';
import { useTranslations } from 'next-intl';


interface SecurityCardProps {
  state: SettingsState;
  actions: SettingsActions;
}

export function SecurityCard({ state, actions }: SecurityCardProps) {
  const t = useTranslations('DashboardSettings');
  const { isStrictlyGoogle } = state;
  const { setShowPasswordModal } = actions;

  return (
    <div className="bg-zinc-900/40 p-6 sm:p-8 md:p-10 rounded-md border border-white/10 shadow-none hover:border-[#ff9e00]/30 transition-all duration-300 animate-enter" style={{animationDelay: '350ms'}}>
      <h4 className="text-sm font-sans font-medium text-white uppercase tracking-wider mb-2">{t('passwordSecurity')}</h4>
      <p className="text-xs font-sans text-white/40 mb-6 sm:mb-8 leading-relaxed max-w-md">
          {isStrictlyGoogle ? t('securityDescGoogle') : t('securityDescNormal')}
      </p>
      <button 
        onClick={() => setShowPasswordModal(true)} 
        className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-sans font-medium uppercase tracking-widest rounded-md transition-all active:scale-95 flex items-center justify-center gap-2
          ${isStrictlyGoogle 
            ? 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]' 
            : 'bg-zinc-950 text-white border border-white/10 hover:border-white/20 hover:bg-zinc-900'
          }
        `}
      >
        {isStrictlyGoogle ? <Key className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} 
        {isStrictlyGoogle ? t('createLocalPassword') : t('updatePassword')}
      </button>
    </div>
  );
}
