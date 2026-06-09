"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Check, X } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

  const isLoggedIn = false;
  const userPlan = 'FREE';

  const { data: pricing } = useSWR('/api/pricing', fetcher);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const plans = [
    {
      name: "Starter",
      tagline: "To kickstart your digital career journey.",
      price: "Rp 0",
      period: "Forever",
      badge: "Free Plan",
      isPro: false,
      isSupreme: false,
      buttonText: "Start Free",
      link: "/register",
      features: [
        { text: "Max 1 Project", active: true },
        { text: "Max 2 Certificates", active: true },
        { text: "1 Public Bio Link", active: true },
        { text: "Basic Themes (3-5 Themes)", active: true },
        { text: "Portfobe Watermark", active: true },
        { text: "Basic Analytics", active: true },
        { text: "Custom Domain", active: false },
        { text: "VIP Support", active: false },
      ]
    },
    ...(pricing && !pricing.pro ? [] : [{
      name: "Pro Creator",
      tagline: "Everything you need to showcase yourself professionally.",
      originalPrice: pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].original) : "Rp 49.000",
      price: pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 39.000" : "Rp 30.000"),
      period: billingCycle === 'monthly' ? "/ mo" : "/ mo, billed yearly",
      badge: "Most Popular",
      isPro: true,
      isSupreme: false,
      buttonText: "Get Pro",
      link: "/checkout?plan=pro",
      features: [
        { text: "Unlimited Projects & Certs", active: true },
        { text: "All Premium Themes", active: true },
        { text: "No Watermark", active: true },
        { text: "Deep Analytics & SEO", active: true },
        { text: "GitHub & Penpot Widgets", active: true },
        { text: "Connect Custom Domain", active: false },
        { text: "VIP Support", active: false },
      ]
    }]),
    ...(pricing && !pricing.supreme ? [] : [{
      name: "Supreme VIP",
      tagline: "Ultimate solution for agencies & power creators.",
      originalPrice: pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].original) : "Rp 89.000",
      price: pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 79.000" : "Rp 65.000"),
      period: billingCycle === 'monthly' ? "/ mo" : "/ mo, billed yearly",
      badge: "Power User",
      isPro: true,
      isSupreme: true,
      buttonText: "Get Supreme",
      link: "/checkout?plan=supreme",
      features: [
        { text: "All Pro Features", active: true },
        { text: "Larger Storage", active: true },
        ...(billingCycle === 'yearly' ? [{ text: "Free 1-Year Domain", active: true, bonus: true }] : []),
        { text: "Early Access Features", active: true },
        { text: "Priority VIP Support", active: true },
        { text: "Connect Custom Domain", active: billingCycle === 'yearly' },
      ]
    }])
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-[#ff9e00] selection:text-black">
      <Navbar isDarkBg={true} />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[10px] font-mono uppercase tracking-[0.2em] mb-6">
            Simple Pricing
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-bold text-white tracking-tight leading-[1.15] mb-6">
            Choose the <span className="text-white/40 italic font-light">Best Plan</span><br/>For Your Career.
          </h1>
          <p className="text-white/60 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed mb-10">
            Start building your professional portfolio today. Choose a free forever plan or upgrade to Pro for unlimited features.
          </p>

          {/* Billing Toggle (Wireframe style) */}
          <div className="flex items-center justify-center gap-4 max-w-xs mx-auto mb-16">
            <span className={`text-xs font-bold font-mono uppercase tracking-widest ${billingCycle === 'monthly' ? 'text-white' : 'text-white/40'}`}>Monthly</span>
            <button 
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className="w-14 h-7 bg-zinc-900 border border-white/10 rounded-full p-1 relative transition-colors group"
            >
              <div className={`w-5 h-5 bg-white transition-all duration-300 rounded-full shadow-md transform ${billingCycle === 'yearly' ? 'translate-x-7 bg-[#ff9e00]' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-xs font-bold font-mono uppercase tracking-widest ${billingCycle === 'yearly' ? 'text-white' : 'text-white/40'}`}>Yearly</span>
            <span className="bg-emerald-500 text-black text-[9px] font-mono font-bold px-2 py-0.5 animate-pulse">SAVE 20%</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto items-stretch">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-zinc-950 border ${plan.isSupreme ? 'border-[#ff9e00]' : 'border-white/10'} p-8 md:p-10 flex flex-col justify-between transition-all hover:border-white/20`}
            >
              {plan.isPro && (
                <div className={`absolute top-0 left-0 right-0 ${plan.isSupreme ? 'bg-[#ff9e00]' : 'bg-white'} text-black text-[10px] font-mono font-bold py-1 text-center uppercase tracking-widest`}>
                  {plan.badge}
                </div>
              )}
              
              <div className={plan.isPro ? 'mt-4' : ''}>
                <div className="mb-6">
                  <h3 className="text-2xl font-display font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-xs text-white/50 font-mono tracking-wide leading-relaxed min-h-[32px]">{plan.tagline}</p>
                </div>

                {/* Price block */}
                <div className="mb-8 border-y border-white/10 py-6">
                  {plan.originalPrice && (
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm font-mono text-white/30 line-through">{plan.originalPrice}</span>
                      <span className="text-[9px] font-mono font-bold text-red-400 bg-red-400/10 px-2 py-0.5 border border-red-400/20">OFF</span>
                    </div>
                  )}
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-4xl md:text-5xl font-display font-bold text-white tracking-tight">{plan.price}</span>
                    <span className="text-xs font-mono text-white/40">{plan.period}</span>
                  </div>
                </div>

                {/* Features list */}
                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, fidx) => (
                    <div key={fidx} className={`flex items-start gap-3 text-xs leading-relaxed ${feature.active ? 'text-white/80' : 'text-white/30'}`}>
                      <span className={`mt-0.5 shrink-0 ${feature.active ? 'text-[#ff9e00]' : 'text-white/20'}`}>
                        {feature.active ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                      </span>
                      <span className="font-mono tracking-wide">
                        {feature.text}
                        {(feature as any).soon && <span className="ml-2 text-[8px] px-1.5 py-0.5 bg-white/10 text-white/60 font-mono">SOON</span>}
                        {(feature as any).bonus && <span className="ml-2 text-[8px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-400 font-mono border border-emerald-500/30">BONUS</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link 
                href={plan.link}
                className={`block w-full text-center py-4 text-xs font-mono font-bold uppercase tracking-widest transition-all active:scale-95 ${
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

        {/* Domain Advantages Section */}
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

        {/* Trust Section */}
        <div className="mt-24 text-center">
          <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.3em] mb-10">Kickstart Your Digital Career Now</p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale items-center text-white/50">
            <span className="font-mono tracking-widest text-xs">GOOGLE</span>
            <span className="font-mono tracking-widest text-xs">INSTAGRAM</span>
            <span className="font-mono tracking-widest text-xs">SPOTIFY</span>
            <span className="font-mono tracking-widest text-xs">DRIBBBLE</span>
            <span className="font-mono tracking-widest text-xs">BEHANCE</span>
          </div>
        </div>

      </main>

      <Footer />
    </div>
  );
}
