"use client";

import React, { useState } from 'react';
import useSWR from 'swr';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PricingHeader } from '@/features/billing';
import { PricingPlansGrid } from '@/features/billing';
import { PricingFeatureMatrix } from '@/features/billing';
import { PricingDomainAdvantages } from '@/features/billing';

const fetcher = (url: string) => fetch(url).then(res => res.json());

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('yearly');

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
        { text: "Max 4 Projects", active: true },
        { text: "Max 1 Certificate", active: true },
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
        
        <PricingHeader billingCycle={billingCycle} setBillingCycle={setBillingCycle} />

        <PricingPlansGrid plans={plans} />

        <PricingFeatureMatrix pricing={pricing} billingCycle={billingCycle} formatIDR={formatIDR} />

        <PricingDomainAdvantages />

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
