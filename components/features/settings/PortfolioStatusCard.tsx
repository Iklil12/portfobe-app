//components/features/settings/PortfolioStatusCard.tsx
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { resendVerificationEmail } from '@/app/actions/auth';
import { AlertTriangle, Loader2 } from 'lucide-react';

interface PortfolioStatusCardProps {
  state: any;
  actions: any;
}

export function PortfolioStatusCard({ state, actions }: PortfolioStatusCardProps) {
  const { isLive, isLoadingStatus, session } = state;
  const { toggleStatus } = actions;
  const [isResending, setIsResending] = useState(false);

  // Check verification status from NextAuth Session
  const isVerified = session?.user?.isEmailVerified;

  const handleResend = async () => {
    if (!session?.user?.email) return;
    setIsResending(true);
    const toastId = toast.loading("Mengirim ulang email...");
    
    try {
      const result = await resendVerificationEmail(session.user.email);
      if (result?.error) {
        toast.error(result.error, { id: toastId });
      } else {
        toast.success("Email verifikasi terkirim! Silakan cek kotak masuk/spam Anda.", { id: toastId, duration: 6000 });
      }
    } catch (e) {
      toast.error("Gagal mengirim email.", { id: toastId });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="bg-zinc-900/40 p-6 sm:p-8 md:p-10 rounded-none border border-white/10 shadow-none transition-all duration-300 animate-enter" style={{animationDelay: '150ms'}}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          {isLoadingStatus ? (
            <div className="w-48 h-6 shimmer-dark rounded-none"></div>
          ) : (
            <>
              <h4 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Status Portofolio</h4>
              {isLive ? (
                <span className="px-2.5 py-1 rounded-none bg-zinc-950 border border-white/10 text-white/50 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                   <span className="w-1.5 h-1.5 rounded-none bg-emerald-500 animate-pulse relative before:absolute before:inset-0 before:bg-emerald-500 before:rounded-none before:animate-ping"></span> Live
                </span>
              ) : (
                <span className="px-2.5 py-1 rounded-none bg-zinc-950 border border-white/10 text-white/30 text-[9px] font-mono font-bold uppercase tracking-widest flex items-center gap-1.5 transition-all">
                   <span className="w-1.5 h-1.5 rounded-none bg-zinc-700"></span> Offline
                </span>
              )}
            </>
          )}
        </div>
        
        {isLoadingStatus ? (
          <div className="w-full max-w-sm h-4 shimmer-dark rounded-none mt-3"></div>
        ) : (
          <p className="text-xs font-mono text-white/40 leading-relaxed max-w-sm">
            {isLive ? "Website portofolio Anda saat ini dapat dikunjungi oleh publik." : "Website Anda saat ini sedang disembunyikan dari publik."}
          </p>
        )}
      </div>
      
      {isLoadingStatus ? (
        <div className="w-14 h-8 shimmer-dark rounded-none shrink-0"></div>
      ) : (
        <button 
          onClick={toggleStatus} 
          disabled={isLoadingStatus} 
          className={`shrink-0 w-14 h-8 rounded-none p-1 relative bg-zinc-950 border border-white/10 hover:border-white/20 transition-colors duration-300 ${isLoadingStatus ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
           <div className={`w-5 h-5 rounded-none shadow-sm transition-all duration-300 ${isLive ? 'translate-x-6 bg-[#ff9e00]' : 'translate-x-0 bg-zinc-700'}`}></div>
        </button>
      )}
      </div>

      {/* WARNING VERIFIKASI */}
      {!isLoadingStatus && isVerified === false && (
        <div className="mt-6 p-4 sm:p-5 bg-orange-950/20 border border-orange-500/20 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-all">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-none bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
              <AlertTriangle className="text-[#ff9e00] w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-mono font-bold text-white uppercase">Email Belum Diverifikasi</p>
              <p className="text-[10px] font-mono text-white/40 max-w-sm mt-0.5 leading-relaxed">Anda tidak dapat menyalakan portofolio (Live) ke publik sebelum memverifikasi email Anda.</p>
            </div>
          </div>
          <button 
            onClick={handleResend}
            disabled={isResending}
            className="shrink-0 w-full sm:w-auto px-5 py-2.5 bg-zinc-950 border border-white/10 rounded-none text-[11px] font-mono font-bold uppercase tracking-wider text-white hover:bg-zinc-900 transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            {isResending ? (
              <>
                <Loader2 className="w-3 h-3 animate-spin text-white/50" />
                <span>Mengirim...</span>
              </>
            ) : (
              'Kirim Ulang Email'
            )}
          </button>
        </div>
      )}
    </div>
  );
}
