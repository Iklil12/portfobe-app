"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Check, X, Layers, Grid, Palette, Award, EyeOff, Globe, Gift, BarChart2, Cpu, Code, Headphones, Sparkles, HelpCircle, Crown } from 'lucide-react';

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

        {/* Detailed Plan Comparison Table */}
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[10px] font-mono uppercase tracking-[0.2em] mb-4">
              Feature Matrix
            </div>
            <h2 className="text-3xl md:text-5xl font-display font-bold text-white tracking-tight mb-4">
              Compare <span className="text-white/40 italic font-light">Every Feature</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-xs md:text-sm font-medium leading-relaxed font-mono">
              Find the plan that matches your production, domain, and customization needs.
            </p>
          </div>

          <div className="w-full overflow-x-auto overflow-hidden border border-white/10 bg-zinc-950/60 backdrop-blur-sm rounded-2xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <table className="w-full border-collapse min-w-[850px] text-left">
              <thead>
                {/* Table Header with Plans info */}
                <tr className="border-b border-white/10">
                  <th className="p-6 w-[34%] bg-black/40">
                    <span className="text-xs font-mono font-bold uppercase tracking-widest text-white/40">Plan Features</span>
                  </th>
                  
                  {/* Starter Plan Column Header */}
                  <th className="p-6 w-[22%] text-center bg-black/20 border-l border-white/5">
                    <div className="flex flex-col items-center justify-between h-full min-h-[160px]">
                      <div>
                        <span className="text-lg font-display font-bold text-white block">Starter</span>
                        <span className="text-sm font-mono font-bold text-white/40 mt-1 block">Rp 0</span>
                        <span className="text-[10px] font-mono text-white/30 mt-0.5 block">Forever</span>
                      </div>
                      <Link
                        href="/register"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all text-center rounded-lg active:scale-95"
                      >
                        Start Free
                      </Link>
                    </div>
                  </th>

                  {/* Pro Creator Plan Column Header */}
                  <th className="p-6 w-[22%] text-center bg-zinc-900/40 relative border-x border-white/5">
                    {/* Crown icon badge above plan name, similar to QuilBot Premium crown badge */}
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff9e00] to-amber-600"></div>
                    <div className="flex flex-col items-center justify-between h-full min-h-[160px]">
                      <div>
                        <div className="flex items-center justify-center gap-1.5 text-[#ff9e00] mb-0.5">
                          <Crown className="w-4.5 h-4.5 fill-[#ff9e00]/25 text-[#ff9e00]" />
                          <span className="text-lg font-display font-bold text-white block">Pro Creator</span>
                        </div>
                        <span className="text-sm font-mono font-bold text-white mt-1 block">
                          {pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 39.000" : "Rp 30.000")}
                        </span>
                        <span className="text-[10px] font-mono text-white/50 mt-0.5 block">
                          {billingCycle === 'monthly' ? "Per month" : "Per month, billed annually"}
                        </span>
                      </div>
                      <Link
                        href="/checkout?plan=pro"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-black bg-[#ff9e00] hover:bg-[#ffaa22] transition-all text-center rounded-lg active:scale-95 shadow-[0_4px_20px_rgba(255,158,0,0.15)]"
                      >
                        Get Pro
                      </Link>
                    </div>
                  </th>

                  {/* Supreme VIP Plan Column Header */}
                  <th className="p-6 w-[22%] text-center bg-black/20 border-r border-white/5">
                    <div className="flex flex-col items-center justify-between h-full min-h-[160px]">
                      <div>
                        <span className="text-lg font-display font-bold text-white block">Supreme VIP</span>
                        <span className="text-sm font-mono font-bold text-white mt-1 block">
                          {pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 79.000" : "Rp 65.000")}
                        </span>
                        <span className="text-[10px] font-mono text-white/50 mt-0.5 block">
                          {billingCycle === 'monthly' ? "Per month" : "Per month, billed annually"}
                        </span>
                      </div>
                      <Link
                        href="/checkout?plan=supreme"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-mono font-bold uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all text-center rounded-lg active:scale-95"
                      >
                        Get Supreme
                      </Link>
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Category 1: Portfolio & Content */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-display font-bold text-sm tracking-wide border-y border-white/5">
                    Portfolio & Content
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Max Portfolio Pages</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          The number of active pages you can create under your portfolio web app.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">1 Page</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">3 Pages</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Grid className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Content Blocks per Page</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          The number of content blocks (text, images, links, projects, etc.) you can add to each page.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">Up to 12 Blocks</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">Unlimited</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Palette className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Design Themes & Layouts</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Access to professional, customizable templates and layout styles.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">Basic (3-5 Themes)</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">All Premium Themes</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">All Premium Themes</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Project & Cert Showcase</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Upload limits for showcasing projects and adding credentials/certificates.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">Max 2 Certificates</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">Unlimited</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">Unlimited</td>
                </tr>

                {/* Category 2: Branding & Domains */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-display font-bold text-sm tracking-wide border-y border-white/5">
                    Branding & Custom Domains
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <EyeOff className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Remove Portfo.be Badge</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Remove the 'Made with Portfo.be' branding badge from your portfolio pages.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Connect Custom Domain</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Link your own custom domain (e.g. yourname.com) instead of using our default domain prefix.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">
                    1-Click Auto Setup
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Free 1-Year Domain</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Get a free .com, .net, or .me domain registration for the first year. Requires yearly plan.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 rounded-md">Yearly Plan</span>
                  </td>
                </tr>

                {/* Category 3: Advanced Features & Integrations */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-display font-bold text-sm tracking-wide border-y border-white/5">
                    Advanced Features & Integrations
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <BarChart2 className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Visitor Analytics</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Detailed visitor counts, location logs, referrer stats, and direct search engine indexing hooks.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">Basic Analytics</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">Deep Analytics & SEO</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">Deep Analytics & SEO</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Code className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Custom CSS & HTML Injection</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Directly write custom styling or inject verification header/footer scripts (e.g. Google Analytics).
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>

                {/* Category 4: Support & Service */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-display font-bold text-sm tracking-wide border-y border-white/5">
                    Support & Service
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Customer Support</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          The support channel speed and handling priority for issues.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">Community</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">VIP Support</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">Priority 24/7 Support</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-mono text-white/90 font-medium">Early Access to Features</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-mono text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans font-sans">
                          Test drive newer themes, widget integrations, and design blocks before the public release.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-mono text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-mono text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
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
