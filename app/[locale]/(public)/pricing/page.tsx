"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PricingHeader } from '@/features/billing';
import { PricingPlansGrid } from '@/features/billing';
import { PricingFeatureMatrix } from '@/features/billing';
import { PricingDomainAdvantages } from '@/features/billing';
import { useTranslations } from 'next-intl';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');
  const t = useTranslations('Pricing');

  const { data: pricing } = useSWR('/api/pricing', fetcher);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const plans = [
    {
      name: "Starter",
      tagline: t('starterTagline'),
      price: "Rp 0",
      period: t('forever'),
      badge: t('freePlan'),
      isPro: false,
      isSupreme: false,
      buttonText: t('startFree'),
      link: "/register",
      features: [
        { text: t('fMaxProjects'), active: true },
        { text: t('fMaxCerts'), active: true },
        { text: t('fPublicBio'), active: true },
        { text: t('fBasicThemes'), active: true },
        { text: t('fWatermark'), active: true },
        { text: t('fBasicAnalytics'), active: true },
        { text: t('fCustomDomain'), active: false },
        { text: t('fVipSupport'), active: false },
      ]
    },
    ...(pricing && !pricing.pro ? [] : [{
      name: "Pro Creator",
      tagline: t('proTagline'),
      originalPrice: pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].original) : "Rp 49.000",
      price: pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 39.000" : "Rp 30.000"),
      period: billingCycle === 'monthly' ? t('perMo') : t('perMoYearly'),
      badge: t('mostPopular'),
      isPro: true,
      isSupreme: false,
      buttonText: t('getPro'),
      link: "/checkout?plan=pro",
      features: [
        { text: t('fUnlProjects'), active: true },
        { text: t('fAllThemes'), active: true },
        { text: t('fNoWatermark'), active: true },
        { text: t('fDeepAnalytics'), active: true },
        { text: t('fWidgets'), active: true },
        { text: t('fConnectDomain'), active: false },
        { text: t('fVipSupport'), active: false },
      ]
    }]),
    ...(pricing && !pricing.supreme ? [] : [{
      name: "Supreme VIP",
      tagline: t('supremeTagline'),
      originalPrice: pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].original) : "Rp 89.000",
      price: pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 79.000" : "Rp 65.000"),
      period: billingCycle === 'monthly' ? t('perMo') : t('perMoYearly'),
      badge: t('powerUser'),
      isPro: true,
      isSupreme: true,
      buttonText: t('getSupreme'),
      link: "/checkout?plan=supreme",
      features: [
        { text: t('fAllPro'), active: true },
        { text: t('fLargerStorage'), active: true },
        ...(billingCycle === 'yearly' ? [{ text: t('fFreeDomain'), active: true, bonus: true }] : []),
        { text: t('fEarlyAccess'), active: true },
        { text: t('fPriorityVip'), active: true },
        { text: t('fConnectDomain'), active: billingCycle === 'yearly' },
      ]
    }])
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-[#ff9e00] selection:text-black">
      <Navbar isDarkBg={true} />

      <main className="max-w-6xl mx-auto px-6 pt-32 pb-24 relative z-10">
        
        <PricingHeader billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

        <PricingPlansGrid plans={plans} />

        <PricingFeatureMatrix pricing={pricing} billingCycle={billingCycle} formatIDR={formatIDR} />

        <PricingDomainAdvantages />

        {/* Trust Section */}
        <div className="mt-24 text-center">
          <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-[0.3em] mb-10">{t('trustBadge')}</p>
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
