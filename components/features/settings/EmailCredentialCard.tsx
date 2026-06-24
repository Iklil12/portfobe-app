//components/features/settings/EmailCredentialCard.tsx
import React from 'react';
import { Mail, Globe } from 'lucide-react';

interface EmailCredentialCardProps {
  state: any;
  actions: any;
}

export function EmailCredentialCard({ state, actions }: EmailCredentialCardProps) {
  const { session, isOAuthLinked } = state;
  const { setShowEmailModal } = actions;

  return (
    <div className="bg-zinc-900/40 p-6 sm:p-8 md:p-10 rounded-none border border-white/10 shadow-none hover:border-[#ff9e00]/30 transition-all duration-300 animate-enter" style={{animationDelay: '250ms'}}>
      <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">Email Credential</h4>
      <p className="text-xs font-mono text-white/40 mb-6 sm:mb-8 leading-relaxed max-w-md">The primary email address linked to your Portfo.be account.</p>
      
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <Mail className="text-white/20 w-4 h-4" />
          </div>
          <input type="email" value={session?.user?.email || "Loading..."} disabled className="w-full pl-12 pr-5 py-3.5 sm:py-4 rounded-none border border-white/5 bg-zinc-950 text-white/40 font-mono text-xs outline-none cursor-not-allowed" />
        </div>
        <button 
          onClick={() => setShowEmailModal(true)} 
          disabled={isOAuthLinked}
          className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-mono font-bold uppercase tracking-widest rounded-none transition-all flex items-center justify-center shrink-0
            ${isOAuthLinked 
              ? 'bg-zinc-950 text-white/20 border border-white/5 cursor-not-allowed' 
              : 'bg-zinc-950 text-white border border-white/10 hover:border-white/20 hover:bg-zinc-900 active:scale-95'
            }
          `}
        >
          {isOAuthLinked ? (
            <>
              <Globe className="w-3.5 h-3.5 mr-2 text-[#ff9e00]" />
              <span>Locked (Google)</span>
            </>
          ) : (
            'Change Email'
          )}
        </button>
      </div>
      {isOAuthLinked && (
        <p className="text-[10px] text-white/30 font-mono mt-3 italic">
          *This account is linked with Google OAuth credentials. The email cannot be changed.
        </p>
      )}
    </div>
  );
}
