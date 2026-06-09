//components/features/settings/SecurityCard.tsx
import React from 'react';
import { Key, Lock } from 'lucide-react';

interface SecurityCardProps {
  state: any;
  actions: any;
}

export function SecurityCard({ state, actions }: SecurityCardProps) {
  const { isStrictlyGoogle } = state;
  const { setShowPasswordModal } = actions;

  return (
    <div className="bg-zinc-900/40 p-6 sm:p-8 md:p-10 rounded-none border border-white/10 shadow-none hover:border-[#ff9e00]/30 transition-all duration-300 animate-enter" style={{animationDelay: '350ms'}}>
      <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider mb-2">Keamanan Kata Sandi</h4>
      <p className="text-xs font-mono text-white/40 mb-6 sm:mb-8 leading-relaxed max-w-md">
          {isStrictlyGoogle ? "Buat kata sandi agar Anda bisa login manual tanpa harus selalu menggunakan Google." : "Ubah kata sandi Anda secara berkala untuk mencegah akses yang tidak sah."}
      </p>
      <button 
        onClick={() => setShowPasswordModal(true)} 
        className={`w-full sm:w-auto px-8 py-3.5 sm:py-4 text-[11px] font-mono font-bold uppercase tracking-widest rounded-none transition-all active:scale-95 flex items-center justify-center gap-2
          ${isStrictlyGoogle 
            ? 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]' 
            : 'bg-zinc-950 text-white border border-white/10 hover:border-white/20 hover:bg-zinc-900'
          }
        `}
      >
        {isStrictlyGoogle ? <Key className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />} 
        {isStrictlyGoogle ? 'Buat Sandi Lokal' : 'Perbarui Sandi'}
      </button>
    </div>
  );
}
