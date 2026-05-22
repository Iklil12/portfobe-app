"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import useSWR from 'swr';

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
      tagline: "Untuk memulai perjalanan karir digital Anda.",
      price: "Rp 0",
      period: "Selamanya",
      badge: "Free Plan",
      isPro: false,
      isSupreme: false,
      buttonText: "Mulai Gratis",
      link: "/register",
      features: [
        { text: "Maksimal 1 Proyek", active: true },
        { text: "Maksimal 2 Sertifikat", active: true },
        { text: "1 Tautan Publik (Bio)", active: true },
        { text: "Tema Dasar (3-5 Tema)", active: true },
        { text: "Watermark Portfobe", active: true },
        { text: "Analitik Dasar", active: true },
        { text: "Custom Domain", active: false },
        { text: "VIP Support", active: false },
      ]
    },
    ...(pricing && !pricing.pro ? [] : [{
      name: "Pro Creator",
      tagline: "Segala yang Anda butuhkan untuk tampil profesional.",
      originalPrice: pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].original) : "Rp 49.000",
      price: pricing && pricing.pro ? formatIDR(pricing.pro[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 39.000" : "Rp 30.000"),
      period: billingCycle === 'monthly' ? "/ bulan" : "/ bulan, ditagih tahunan",
      badge: "Paling Populer",
      isPro: true,
      isSupreme: false,
      buttonText: "Daftar Pro",
      link: "/checkout?plan=pro",
      features: [
        { text: "Proyek & Sertifikat Tanpa Batas", active: true },
        { text: "Semua Tema Premium", active: true },
        { text: "Tanpa Watermark", active: true },
        { text: "Analitik Mendalam & SEO", active: true },
        { text: "Hubungkan Custom Domain", active: true },
        { text: "GitHub & Penpot Widget", active: true },
        { text: "VIP Support", active: false },
      ]
    }]),
    ...(pricing && !pricing.supreme ? [] : [{
      name: "Supreme VIP",
      tagline: "Solusi maksimal untuk agensi & kreator besar.",
      originalPrice: pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].original) : "Rp 89.000",
      price: pricing && pricing.supreme ? formatIDR(pricing.supreme[billingCycle].price) : (billingCycle === 'monthly' ? "Rp 79.000" : "Rp 65.000"),
      period: billingCycle === 'monthly' ? "/ bulan" : "/ bulan, ditagih tahunan",
      badge: "Power User",
      isPro: true,
      isSupreme: true,
      buttonText: "Daftar Supreme",
      link: "/checkout?plan=supreme",
      features: [
        { text: "Semua Fitur Pro", active: true },
        { text: "Multiple Custom Domains", active: true },
        { text: "Custom CSS / HTML", active: true },
        { text: "Google/Meta Pixel Analytics", active: true },
        { text: billingCycle === 'yearly' ? "Gratis Domain 1 Tahun" : "Hubungkan Custom Domain", active: true, bonus: billingCycle === 'yearly' },
        { text: "Prioritas VIP Support", active: true },
        { text: "Fitur Akses Awal", active: true },
      ]
    }])
  ];

  return (
    <main className="min-h-screen bg-[#FAFAFA] pb-24 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-slate-200/30 to-transparent pointer-events-none z-0"></div>
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#ff9e00]/5 blur-[120px] rounded-full pointer-events-none z-0"></div>

      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(30px); filter: blur(4px); }
            100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
      `}} />

      <div className="max-w-6xl mx-auto px-6 pt-10 md:pt-20 relative z-10">
        
        {/* Navigation */}
        <div className="flex justify-between items-center mb-16">
          <Link href="/" className="flex items-center gap-2">
            <img src="/portfo.be.png" alt="Logo" className="h-6 w-auto" />
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-xs font-bold text-slate-600 hover:text-slate-900 transition-colors">Login</Link>
            <Link href="/register" className="text-xs font-bold text-white px-5 py-2.5 bg-slate-900 rounded-full hover:bg-slate-800 transition-all shadow-md">Daftar</Link>
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-16 animate-enter">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff9e00]/10 border border-[#ff9e00]/20 text-[#ff9e00] text-[10px] font-black uppercase tracking-[0.2em] mb-6">
            <i className="fas fa-crown"></i> Simple Pricing
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6">
            Pilih Paket <span className="text-slate-400 font-light">Terbaik</span><br/>Untuk Karir Anda.
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto text-sm md:text-base font-medium leading-relaxed mb-10">
            Mulai bangun portofolio profesional hari ini. Pilih paket gratis selamanya atau upgrade ke Pro untuk fitur tanpa batas.
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center gap-4">
            <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-slate-900' : 'text-slate-400'}`}>Bulanan</span>
            <button 
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                className="w-14 h-7 bg-slate-200 rounded-full p-1 relative transition-colors group"
            >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 transform ${billingCycle === 'yearly' ? 'translate-x-7' : 'translate-x-0'}`}></div>
            </button>
            <span className={`text-xs font-bold ${billingCycle === 'yearly' ? 'text-slate-900' : 'text-slate-400'}`}>Tahunan</span>
            <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-1 rounded-md animate-pulse">HEMAT 20%</span>
          </div>
        </div>

        {/* Plans Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, idx) => (
            <div 
              key={idx} 
              className={`relative bg-white rounded-[2.5rem] border ${plan.isSupreme ? 'border-[#ff9e00] shadow-[#ff9e00]/20 shadow-2xl' : plan.isPro ? 'border-slate-900 shadow-2xl' : 'border-slate-100'} p-8 md:p-10 animate-enter group transition-all hover:-translate-y-2`}
              style={{ animationDelay: `${idx * 150}ms` }}
            >
              {plan.isPro && (
                <div className={`absolute -top-4 left-1/2 -translate-x-1/2 ${plan.isSupreme ? 'bg-gradient-to-r from-[#ff9e00] to-amber-500' : 'bg-slate-900'} text-white text-[10px] font-black px-6 py-2 rounded-full uppercase tracking-widest shadow-xl whitespace-nowrap`}>
                    {plan.badge}
                </div>
              )}
              
              <div className="mb-10">
                <h3 className={`text-2xl font-black mb-2 ${plan.isPro ? 'text-slate-900' : 'text-slate-500'}`}>{plan.name}</h3>
                <p className="text-sm text-slate-400 font-medium leading-relaxed">{plan.tagline}</p>
              </div>

              <div className="mb-10">
                {plan.originalPrice && (
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-slate-400 line-through decoration-slate-300">{plan.originalPrice}</span>
                    <span className="text-[10px] font-black text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full uppercase tracking-wider border border-rose-100">DISKON</span>
                  </div>
                )}
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-black text-slate-900 tracking-tighter">{plan.price}</span>
                  <span className="text-sm font-bold text-slate-400">{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-12">
                {plan.features.map((feature, fidx) => (
                  <div key={fidx} className={`flex items-center gap-3 ${feature.active ? 'opacity-100' : 'opacity-30'}`}>
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${feature.active ? (plan.isPro ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900') : 'bg-slate-50 text-slate-300'}`}>
                      <i className={`fas ${feature.active ? 'fa-check' : 'fa-times'} text-[8px]`}></i>
                    </div>
                    <span className="text-[13px] font-bold text-slate-700 flex items-center gap-2">
                        {feature.text}
                        {(feature as any).soon && <span className="text-[8px] px-1.5 py-0.5 bg-slate-100 text-slate-400 rounded">SOON</span>}
                        {(feature as any).bonus && <span className="text-[8px] px-1.5 py-0.5 bg-emerald-100 text-emerald-600 rounded font-black animate-pulse">BONUS</span>}
                    </span>
                  </div>
                ))}
              </div>

              <Link 
                href={plan.link}
                className={`block w-full text-center py-5 rounded-2xl text-[11px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 shadow-lg ${
                    plan.isSupreme
                      ? 'bg-gradient-to-r from-[#ff9e00] to-amber-500 text-white hover:shadow-[#ff9e00]/40'
                      : plan.isPro 
                        ? 'bg-slate-900 text-white hover:bg-slate-800' 
                        : (isLoggedIn && userPlan === 'FREE' ? 'bg-slate-100 text-slate-400 cursor-default' : 'bg-white border border-slate-200 text-slate-900 hover:bg-slate-50')
                }`}
              >
                {plan.buttonText}
              </Link>
            </div>
          ))}
        </div>

        {/* Domain Advantages Section */}
        <div className="max-w-5xl mx-auto mt-24 p-8 md:p-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-xl animate-enter" style={{ animationDelay: '300ms' }}>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4">Keunggulan Langganan Tahunan 🎁</h2>
            <p className="text-slate-500 font-medium text-sm md:text-base">Inilah alasan mengapa kreator profesional selalu memilih paket tahunan.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-slate-50 rounded-3xl border border-slate-100 transition-all hover:bg-slate-100">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 text-2xl">🗓️</div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Langganan Bulanan</h3>
              <ul className="space-y-4 text-sm font-semibold text-slate-600">
                <li className="flex gap-4 items-start"><i className="fas fa-check text-emerald-500 mt-1"></i><span>Bisa menautkan ke Custom Domain.</span></li>
                <li className="flex gap-4 items-start"><i className="fas fa-times text-rose-500 mt-1"></i><span>Anda harus membeli domain sendiri secara terpisah.</span></li>
                <li className="flex gap-4 items-start"><i className="fas fa-times text-rose-500 mt-1"></i><span>Perlu mengatur DNS (Name Server) secara manual.</span></li>
              </ul>
            </div>
            
            <div className="p-8 bg-slate-900 rounded-3xl text-white shadow-2xl relative overflow-hidden transition-all hover:shadow-[#ff9e00]/20">
              <div className="absolute -right-10 -bottom-10 text-[120px] opacity-10 rotate-12">🎁</div>
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shadow-sm mb-6 text-2xl text-white border border-white/20">🌟</div>
              <h3 className="text-xl font-black text-white mb-4">Langganan Tahunan</h3>
              <ul className="space-y-4 text-sm font-semibold text-slate-300 relative z-10">
                <li className="flex gap-4 items-start"><i className="fas fa-check text-emerald-400 mt-1"></i><span><strong className="text-white text-base">Gratis 1 Custom Domain</strong> (.com/.net/.me) untuk tahun pertama.</span></li>
                <li className="flex gap-4 items-start"><i className="fas fa-check text-emerald-400 mt-1"></i><span>Tidak perlu repot membeli domain di tempat lain.</span></li>
                <li className="flex gap-4 items-start"><i className="fas fa-check text-emerald-400 mt-1"></i><span>Otomatis terhubung (1-Click Setup) tanpa pusing DNS.</span></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Trust Section */}
        <div className="mt-24 text-center animate-enter" style={{ animationDelay: '400ms' }}>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-10">Mulai Karir Digital Anda Sekarang</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-30 grayscale items-center">
                <i className="fab fa-google text-3xl"></i>
                <i className="fab fa-instagram text-3xl"></i>
                <i className="fab fa-spotify text-3xl"></i>
                <i className="fab fa-dribbble text-3xl"></i>
                <i className="fab fa-behance text-3xl"></i>
            </div>
        </div>

      </div>
    </main>
  );
}
