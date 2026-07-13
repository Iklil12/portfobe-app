import React from 'react';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PricingDomainAdvantages() {
  const t = useTranslations('Pricing');
  return (
    <div className="max-w-5xl mx-auto mt-24 p-8 md:p-12 border border-white/10 bg-zinc-950">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-sans font-medium text-white mb-3">{t('advTitle')}</h2>
        <p className="text-white/50 font-mono text-xs md:text-sm">{t('advDesc')}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-white/10 bg-black/40">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-xl">🗓️</div>
          <h3 className="text-lg font-sans font-medium text-white mb-4">{t('advMonthlyTitle')}</h3>
          <ul className="space-y-4 text-xs font-sans text-white/60">
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-white/40 mt-0.5" /><span>{t('advMonthly1')}</span></li>
            <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500/60 mt-0.5" /><span>{t('advMonthly2')}</span></li>
            <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500/60 mt-0.5" /><span>{t('advMonthly3')}</span></li>
          </ul>
        </div>
        
        <div className="p-8 border border-[#ff9e00]/20 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-[80px] opacity-5 rotate-12 pointer-events-none select-none">🎁</div>
          <div className="w-12 h-12 bg-[#ff9e00]/10 border border-[#ff9e00]/20 flex items-center justify-center mb-6 text-xl text-[#ff9e00]">🌟</div>
          <h3 className="text-lg font-sans font-medium text-white mb-4">{t('advYearlyTitle')}</h3>
          <ul className="space-y-4 text-xs font-sans text-white/80 relative z-10">
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-[#ff9e00] mt-0.5" /><span dangerouslySetInnerHTML={{ __html: t('advYearly1').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }}></span></li>
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-[#ff9e00] mt-0.5" /><span>{t('advYearly2')}</span></li>
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-[#ff9e00] mt-0.5" /><span>{t('advYearly3')}</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
