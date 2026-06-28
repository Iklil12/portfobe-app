import React from 'react';
import Link from 'next/link';
import { Check, X, Layers, Grid, Palette, Award, EyeOff, Globe, Gift, BarChart2, Code, Headphones, Sparkles, HelpCircle, Crown } from 'lucide-react';

export function PricingFeatureMatrix({ pricing, billingCycle, formatIDR }: { pricing: any, billingCycle: 'monthly' | 'yearly', formatIDR: (num: number) => string }) {
  return (
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[10px] font-sans uppercase tracking-[0.2em] mb-4">
              Feature Matrix
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-medium text-white tracking-tight mb-4">
              Compare <span className="text-white/40 italic font-light">Every Feature</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-xs md:text-sm font-medium leading-relaxed font-sans">
              Find the plan that matches your production, domain, and customization needs.
            </p>
          </div>

          <div className="w-full overflow-x-auto overflow-hidden border border-white/10 bg-zinc-950/60 backdrop-blur-sm rounded-2xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <table className="w-full border-collapse min-w-[850px] text-left">
              <thead>
                {/* Table Header with Plans info */}
                <tr className="border-b border-white/10">
                  <th className="p-6 w-[34%] bg-black/40">
                    <span className="text-xs font-sans font-medium uppercase tracking-widest text-white/40">Plan Features</span>
                  </th>
                  
                  {/* Starter Plan Column Header */}
                  <th className="p-6 w-[22%] text-center bg-black/20 border-l border-white/5">
                    <div className="flex flex-col items-center justify-between h-full min-h-[160px]">
                      <div>
                        <span className="text-lg font-sans font-medium text-white block">Starter</span>
                        <span className="text-sm font-sans font-medium text-white/40 mt-1 block">Rp 0</span>
                        <span className="text-[10px] font-sans text-white/30 mt-0.5 block">Forever</span>
                      </div>
                      <Link
                        href="/register"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all text-center rounded-lg active:scale-95"
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
                          <span className="text-lg font-sans font-medium text-white block">Pro Creator</span>
                        </div>
                        <span className="text-sm font-sans font-medium text-white mt-1 block">
                          {pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 39.000" : "Rp 30.000")}
                        </span>
                        <span className="text-[10px] font-sans text-white/50 mt-0.5 block">
                          {billingCycle === 'monthly' ? "Per month" : "Per month, billed annually"}
                        </span>
                      </div>
                      <Link
                        href="/checkout?plan=pro"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-black bg-[#ff9e00] hover:bg-[#ffaa22] transition-all text-center rounded-lg active:scale-95 shadow-[0_4px_20px_rgba(255,158,0,0.15)]"
                      >
                        Get Pro
                      </Link>
                    </div>
                  </th>

                  {/* Supreme VIP Plan Column Header */}
                  <th className="p-6 w-[22%] text-center bg-black/20 border-r border-white/5">
                    <div className="flex flex-col items-center justify-between h-full min-h-[160px]">
                      <div>
                        <span className="text-lg font-sans font-medium text-white block">Supreme VIP</span>
                        <span className="text-sm font-sans font-medium text-white mt-1 block">
                          {pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 79.000" : "Rp 65.000")}
                        </span>
                        <span className="text-[10px] font-sans text-white/50 mt-0.5 block">
                          {billingCycle === 'monthly' ? "Per month" : "Per month, billed annually"}
                        </span>
                      </div>
                      <Link
                        href="/checkout?plan=supreme"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all text-center rounded-lg active:scale-95"
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
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    Portfolio & Content
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Max Portfolio Pages</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          The number of active pages you can create under your portfolio web app.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">1 Page</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">3 Pages</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Grid className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Content Blocks per Page</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          The number of content blocks (text, images, links, projects, etc.) you can add to each page.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">Up to 12 Blocks</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">Unlimited</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">Unlimited</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Palette className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Design Themes & Layouts</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Access to professional, customizable templates and layout styles.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">Basic (3-5 Themes)</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">All Premium Themes</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">All Premium Themes</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Project & Cert Showcase</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Upload limits for showcasing projects and adding credentials/certificates.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">Max 4 Projects & 1 Cert</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">Unlimited</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">Unlimited</td>
                </tr>

                {/* Category 2: Branding & Domains */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    Branding & Custom Domains
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <EyeOff className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Remove Portfo.be Badge</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Remove the 'Made with Portfo.be' branding badge from your portfolio pages.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Globe className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Connect Custom Domain</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Link your own custom domain (e.g. yourname.com) instead of using our default domain prefix.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">
                    1-Click Auto Setup
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Free 1-Year Domain</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Get a free .com, .net, or .me domain registration for the first year. Requires yearly plan.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 rounded-md">Yearly Plan</span>
                  </td>
                </tr>

                {/* Category 3: Advanced Features & Integrations */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    Advanced Features & Integrations
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <BarChart2 className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Visitor Analytics</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Detailed visitor counts, location logs, referrer stats, and direct search engine indexing hooks.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">Basic Analytics</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">Deep Analytics & SEO</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">Deep Analytics & SEO</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Code className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Custom CSS & HTML Injection</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          Directly write custom styling or inject verification header/footer scripts (e.g. Google Analytics).
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>

                {/* Category 4: Support & Service */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    Support & Service
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Customer Support</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          The support channel speed and handling priority for issues.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">Community</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">VIP Support</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">Priority 24/7 Support</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">Early Access to Features</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans font-sans">
                          Test drive newer themes, widget integrations, and design blocks before the public release.
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <X className="w-4 h-4 text-zinc-600 mx-auto" />
                  </td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">
                    <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

  );
}
