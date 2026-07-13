import React from 'react';
import Link from 'next/link';
import { Check, X } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PricingPlansGrid({ plans }: { plans: any[] }) {
  const t = useTranslations('Pricing');
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
      {plans.map((plan, idx) => (
        <div 
          key={idx} 
          className={`relative bg-zinc-950 border ${plan.isSupreme ? 'border-[#ff9e00]' : 'border-white/10'} p-8 md:p-10 flex flex-col justify-between transition-all hover:border-white/20`}
        >
          {plan.isPro && (
            <div className={`absolute top-0 left-0 right-0 ${plan.isSupreme ? 'bg-[#ff9e00]' : 'bg-white'} text-black text-[10px] font-sans font-medium py-1 text-center uppercase tracking-widest`}>
              {plan.badge}
            </div>
          )}
          
          <div className={plan.isPro ? 'mt-4' : ''}>
            <div className="mb-6">
              <h3 className="text-2xl font-sans font-medium text-white mb-2">{plan.name}</h3>
              <p className="text-xs text-white/50 font-sans tracking-wide leading-relaxed min-h-[32px]">{plan.tagline}</p>
            </div>

            {/* Price block */}
            <div className="mb-8 border-y border-white/10 py-6">
              {plan.originalPrice && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-sans text-white/30 line-through">{plan.originalPrice}</span>
                  <span className="text-[9px] font-sans font-medium text-red-400 bg-red-400/10 px-2 py-0.5 border border-red-400/20">{t('off')}</span>
                </div>
              )}
              <div className="flex items-baseline gap-1.5">
                <span className="text-4xl md:text-5xl font-sans font-medium text-white tracking-tight">{plan.price}</span>
                <span className="text-xs font-sans text-white/40">{plan.period}</span>
              </div>
            </div>

            {/* Features list */}
            <div className="space-y-4 mb-8">
              {plan.features.map((feature: any, fidx: number) => (
                <div key={fidx} className={`flex items-start gap-3 text-xs leading-relaxed ${feature.active ? 'text-white/80' : 'text-white/30'}`}>
                  <span className={`mt-0.5 shrink-0 ${feature.active ? 'text-[#ff9e00]' : 'text-white/20'}`}>
                    {feature.active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                  </span>
                  <span className="font-sans tracking-wide">
                    {feature.text}
                    {feature.soon && <span className="ml-2 text-[8px] px-1.5 py-0.5 bg-white/10 text-white/60 font-sans">{t('soon')}</span>}
                    {feature.bonus && <span className="ml-2 text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-sans border border-emerald-500/30">{t('bonus')}</span>}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link 
            href={plan.link}
            className={`block w-full text-center py-4 text-xs font-sans font-medium uppercase tracking-widest transition-all active:scale-95 ${
              plan.isSupreme || plan.isPro
                ? 'bg-[#ff9e00] text-black hover:bg-[#ffaa22]'
                : 'bg-transparent border border-white/20 text-white hover:bg-white/5'
            }`}
          >
            {plan.buttonText}
          </Link>
        </div>
      ))}
    </div>
  );
}
