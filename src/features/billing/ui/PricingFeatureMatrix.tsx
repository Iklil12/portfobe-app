import React from 'react';
import Link from 'next/link';
import { Check, X, Layers, Grid, Palette, Award, EyeOff, Globe, Gift, BarChart2, Code, Headphones, Sparkles, HelpCircle, Crown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function PricingFeatureMatrix({ pricing, billingCycle, formatIDR, isAdmin = false }: { pricing: any, billingCycle: 'monthly' | 'yearly', formatIDR: (num: number) => string, isAdmin?: boolean }) {
  const t = useTranslations('Pricing');
  return (
        <div className="mt-32 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[10px] font-sans uppercase tracking-[0.2em] mb-4">
              {t('matrixBadge')}
            </div>
            <h2 className="text-3xl md:text-5xl font-sans font-medium text-white tracking-tight mb-4">
              {t('matrixTitlePrefix')} <span className="text-white/40 italic font-light">{t('matrixTitleHighlight')}</span>
            </h2>
            <p className="text-white/50 max-w-xl mx-auto text-xs md:text-sm font-medium leading-relaxed font-sans">
              {t('matrixDesc')}
            </p>
          </div>

          <div className="w-full overflow-x-auto overflow-hidden border border-white/10 bg-zinc-950/60 backdrop-blur-sm rounded-2xl scrollbar-thin scrollbar-thumb-zinc-800 scrollbar-track-transparent">
            <table className="w-full border-collapse min-w-[850px] text-left">
              <thead>
                {/* Table Header with Plans info */}
                <tr className="border-b border-white/10">
                  <th className="p-6 w-[34%] bg-black/40">
                    <span className="text-xs font-sans font-medium uppercase tracking-widest text-white/40">{t('planFeatures')}</span>
                  </th>
                  
                  {/* Starter Plan Column Header */}
                  <th className="p-6 w-[22%] text-center bg-black/20 border-l border-white/5">
                    <div className="flex flex-col items-center justify-between h-full min-h-[160px]">
                      <div>
                        <span className="text-lg font-sans font-medium text-white block">Starter</span>
                        <span className="text-sm font-sans font-medium text-white/40 mt-1 block">Rp 0</span>
                        <span className="text-[10px] font-sans text-white/30 mt-0.5 block">{t('forever')}</span>
                      </div>
                      <Link
                        href="/register"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all text-center rounded-lg active:scale-95"
                      >
                        {t('startFree')}
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
                          {billingCycle === 'monthly' ? t('perMonth') : t('perMonthYearly')}
                        </span>
                      </div>
                      <Link
                        href="/checkout?plan=pro"
                        className="mt-6 w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-black bg-[#ff9e00] hover:bg-[#ffaa22] transition-all text-center rounded-lg active:scale-95 shadow-[0_4px_20px_rgba(255,158,0,0.15)]"
                      >
                        {t('getPro')}
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
                          {billingCycle === 'monthly' ? t('perMonth') : t('perMonthYearly')}
                        </span>
                      </div>
                      {isAdmin ? (
                        <Link
                          href="/checkout?plan=supreme"
                          className="mt-6 w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-white border border-white/20 hover:bg-white/5 hover:border-white/30 transition-all text-center rounded-lg active:scale-95"
                        >
                          {t('getSupreme')}
                        </Link>
                      ) : (
                        <span className="mt-6 block w-full py-2.5 px-4 text-[10px] font-sans font-medium uppercase tracking-widest text-white/50 border border-white/10 text-center rounded-lg cursor-not-allowed bg-zinc-800">
                          DITUTUP
                        </span>
                      )}
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Category 1: Portfolio & Content */}
                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    {t('catPortfolio')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Layers className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mMaxPages')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mMaxPagesDesc')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">{t('val1Page')}</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">{t('val3Pages')}</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valUnlimited')}</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Grid className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mBlocks')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mBlocksDesc')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">{t('val12Blocks')}</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valUnlimited')}</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valUnlimited')}</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Palette className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mThemes')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mThemesDesc')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">{t('valBasicThemes')}</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valAllThemes')}</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valAllThemes')}</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Award className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mShowcase')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mShowcaseDesc')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">{t('val4Proj1Cert')}</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valUnlimited')}</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valUnlimited')}</td>
                </tr>

                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    {t('catBranding')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <EyeOff className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mBadge')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mBadgeDesc')}
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
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mDomain')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mDomainDesc')}
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
                    {t('val1ClickSetup')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Gift className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mFreeDomain')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mFreeDomainDesc')}
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
                    <span className="text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 border border-emerald-500/20 rounded-md">{t('valYearlyPlan')}</span>
                  </td>
                </tr>

                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    {t('catAdvanced')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <BarChart2 className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mAnalytics')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mAnalyticsDesc')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">{t('valBasicAnalytics')}</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valDeepAnalytics')}</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valDeepAnalytics')}</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Code className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mInjection')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mInjectionDesc')}
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

                <tr>
                  <td colSpan={4} className="py-4 px-6 bg-zinc-900/60 text-[#ff9e00] font-sans font-medium text-sm tracking-wide border-y border-white/5">
                    {t('catSupport')}
                  </td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors bg-white/[0.015]">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Headphones className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mCustomerSupport')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans">
                          {t('mCustomerSupportDesc')}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-center border-l border-white/5 text-xs font-sans text-white/60">{t('valCommunity')}</td>
                  <td className="p-4 text-center bg-zinc-900/20 border-x border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valVipSupport')}</td>
                  <td className="p-4 text-center border-r border-white/5 text-xs font-sans text-white/80 font-semibold">{t('valPriorityVip')}</td>
                </tr>
                <tr className="border-b border-white/5 hover:bg-white/[0.01] transition-colors">
                  <td className="p-4 px-6 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-4 h-4 text-[#ff9e00]" />
                    </div>
                    <div className="flex items-center gap-1.5 group relative">
                      <span className="text-xs font-sans text-white/90 font-medium">{t('mEarlyAccess')}</span>
                      <div className="relative inline-block group/tooltip">
                        <HelpCircle className="w-3.5 h-3.5 text-white/30 hover:text-white cursor-help transition-colors" />
                        <div className="absolute bottom-full left-0 mb-2 w-56 p-2.5 bg-zinc-950 border border-white/10 rounded-lg text-[10px] font-sans text-zinc-300 opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-opacity duration-150 z-30 shadow-xl leading-normal whitespace-normal font-sans font-sans">
                          {t('mEarlyAccessDesc')}
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
