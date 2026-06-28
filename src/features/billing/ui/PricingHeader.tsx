import React from 'react';

export function PricingHeader({ billingCycle, setBillingCycle }: { billingCycle: 'monthly' | 'yearly', setBillingCycle: (cycle: 'monthly' | 'yearly') => void }) {
  return (
    <div className="text-center mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[10px] font-sans uppercase tracking-[0.2em] mb-6">
        Simple Pricing
      </div>
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-sans font-medium text-white tracking-tight leading-[1.15] mb-6">
        Choose the <span className="text-white/40 italic font-light">Best Plan</span><br/>For Your Career.
      </h1>
      <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed mb-10">
        Start building your professional portfolio today. Choose a free forever plan or upgrade to Pro for unlimited features.
      </p>

      {/* Billing Toggle (Wireframe style) */}
      <div className="flex items-center justify-center gap-4 max-w-xs mx-auto mb-16">
        <span className={`text-xs font-medium font-sans uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-white/40'}`}>Monthly</span>
        <button 
          onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
          className="w-14 h-7 bg-zinc-900 border border-white/10 rounded-full p-1 relative transition-colors group"
        >
          <div className={`w-5 h-5 bg-white transition-all duration-300 rounded-full shadow-md transform ${billingCycle === 'yearly' ? 'translate-x-7 bg-[#ff9e00]' : 'translate-x-0'}`}></div>
        </button>
        <span className={`text-xs font-medium font-sans uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-white/40'}`}>Yearly</span>
        <span className="bg-emerald-500 text-black text-[9px] font-sans font-medium px-2 py-0.5 animate-pulse">SAVE 20%</span>
      </div>
    </div>
  );
}
