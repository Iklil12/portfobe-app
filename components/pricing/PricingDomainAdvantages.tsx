import React from 'react';
import { Check, X } from 'lucide-react';

export function PricingDomainAdvantages() {
  return (
    <div className="max-w-5xl mx-auto mt-24 p-8 md:p-12 border border-white/10 bg-zinc-950">
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-3">Subscription Details & Advantages 🎁</h2>
        <p className="text-white/50 font-mono text-xs md:text-sm">Compare benefits between monthly and yearly billing cycle subscriptions.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 border border-white/10 bg-black/40">
          <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-xl">🗓️</div>
          <h3 className="text-lg font-display font-bold text-white mb-4">Monthly Subscription</h3>
          <ul className="space-y-4 text-xs font-mono text-white/60">
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-white/40 mt-0.5" /><span>Allows linking custom domains.</span></li>
            <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500/60 mt-0.5" /><span>You must purchase your domain separately.</span></li>
            <li className="flex gap-3 items-start"><X className="w-4 h-4 text-red-500/60 mt-0.5" /><span>Requires manual DNS settings configuration.</span></li>
          </ul>
        </div>
        
        <div className="p-8 border border-[#ff9e00]/20 bg-white/[0.02] relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-[80px] opacity-5 rotate-12 pointer-events-none select-none">🎁</div>
          <div className="w-12 h-12 bg-[#ff9e00]/10 border border-[#ff9e00]/20 flex items-center justify-center mb-6 text-xl text-[#ff9e00]">🌟</div>
          <h3 className="text-lg font-display font-bold text-white mb-4">Yearly Subscription</h3>
          <ul className="space-y-4 text-xs font-mono text-white/80 relative z-10">
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-[#ff9e00] mt-0.5" /><span><strong className="text-white">Free 1 Custom Domain</strong> (.com/.net/.me) for the first year.</span></li>
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-[#ff9e00] mt-0.5" /><span>No need to buy a domain elsewhere.</span></li>
            <li className="flex gap-3 items-start"><Check className="w-4 h-4 text-[#ff9e00] mt-0.5" /><span>Connected automatically (1-Click Setup) with zero DNS hassle.</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
