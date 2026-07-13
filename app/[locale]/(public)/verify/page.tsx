import prisma from '@/shared/lib/prisma';
import Link from "next/link";
import { Check, X, Clock, ArrowRight } from "lucide-react";
import { getTranslations } from 'next-intl/server';

export default async function VerifyPage(props: { searchParams: Promise<{ token?: string }> }) {
  const t = await getTranslations('Verify');
  const searchParams = await props.searchParams;
  const token = searchParams.token;

  const containerStyles = "min-h-screen flex items-center justify-center bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#ff9e00] selection:text-black";
  const gridBackground = "absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none";

  if (!token) {
    return (
      <div className={containerStyles}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}} />
        <div className={gridBackground}></div>
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative bg-zinc-950 border border-white/10 p-8 md:p-10 max-w-md w-full shadow-2xl text-center z-10 rounded-none animate-enter-modal">
          <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/20 rounded-none flex items-center justify-center mx-auto mb-6">
            <X className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">{t('invalidTitle')}</h1>
          <p className="text-white/40 mb-8 text-xs font-mono leading-relaxed">
            {t('invalidDesc')}
          </p>
          <Link 
            href="/dashboard" 
            className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-mono font-bold uppercase tracking-widest text-[11px] rounded-none hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            {t('goToDashboard')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const verification = await prisma.verificationToken.findUnique({
    where: { token: token }
  });

  if (!verification || new Date() > verification.expires) {
    return (
      <div className={containerStyles}>
        <style dangerouslySetInnerHTML={{__html: `
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
          * { font-family: 'Plus Jakarta Sans', sans-serif; }
        `}} />
        <div className={gridBackground}></div>
        
        {/* Glow effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="relative bg-zinc-950 border border-white/10 p-8 md:p-10 max-w-md w-full shadow-2xl text-center z-10 rounded-none animate-enter-modal">
          <div className="w-16 h-16 bg-amber-500/10 text-[#ff9e00] border border-[#ff9e00]/20 rounded-none flex items-center justify-center mx-auto mb-6">
            <Clock className="w-8 h-8" />
          </div>
          <h1 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">{t('expiredTitle')}</h1>
          <p className="text-white/40 mb-8 text-xs font-mono leading-relaxed">
            {t('expiredDesc')}
          </p>
          <Link 
            href="/dashboard" 
            className="w-full py-4 bg-zinc-900 border border-white/10 text-white font-mono font-bold uppercase tracking-widest text-[11px] rounded-none hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2 active:scale-95"
          >
            {t('goToDashboard')} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  // Update status verifikasi
  await prisma.user.update({
    where: { email: verification.identifier },
    data: {
      emailVerified: new Date(),
    }
  });

  await prisma.verificationToken.delete({
    where: { token: token }
  });

  return (
    <div className={containerStyles}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
      `}} />
      <div className={gridBackground}></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative bg-zinc-950 border border-white/10 p-8 md:p-10 max-w-md w-full shadow-2xl text-center z-10 rounded-none animate-enter-modal">
        <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-none flex items-center justify-center mx-auto mb-6">
          <Check className="w-8 h-8" />
        </div>
        <h1 className="text-xl font-display font-bold text-white mb-2 uppercase tracking-wider">{t('verifiedTitle')}</h1>
        <p className="text-white/40 mb-8 text-xs font-mono leading-relaxed">
          {t('verifiedDesc')}
        </p>
        <Link 
          href="/dashboard" 
          className="w-full py-4 bg-[#ff9e00] text-black font-mono font-bold uppercase tracking-widest text-[11px] rounded-none hover:bg-[#ffaa22] transition-colors flex items-center justify-center gap-2 active:scale-95"
        >
          {t('launchPortfolio')} <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
