//components/features/profile/ProfileHeader.tsx
import React from 'react';
import { User, Sparkles } from 'lucide-react';

export function ProfileHeader() {
  return (
    <div className="mb-10 sm:mb-12 animate-enter text-center md:text-left" style={{animationDelay: '100ms'}}>
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-none bg-zinc-900 border border-white/10 text-[9px] font-mono font-bold uppercase tracking-widest text-white/50 mb-5">
        <User className="w-3 h-3 text-[#ff9e00]" /> Public Identity
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-mono font-bold tracking-tight text-white uppercase mb-3 flex items-center justify-center md:justify-start gap-3">
        Profile & Bio.
        <Sparkles className="w-5 h-5 md:w-7 md:h-7 text-[#ff9e00]/70 animate-pulse" />
      </h1>
      <p className="text-xs font-mono text-white/40 max-w-lg mx-auto md:mx-0">Manage your public identity and specialization information.</p>
    </div>
  );
}
