"use client";

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import useSWR from 'swr';
import { Check, X, Shield, Info, Tag, ArrowRight, Star, ChevronDown, Rocket, Crown, AlertTriangle } from 'lucide-react';

const fetcher = (url: string) => fetch(url).then(res => res.json());

function CheckoutContent() {
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') === 'supreme' ? 'supreme' : 'pro';
  
  const [plan, setPlan] = useState<'pro' | 'supreme'>(initialPlan);
  const [duration, setDuration] = useState<'monthly' | 'yearly'>('yearly');
  const [isDurationDropdownOpen, setIsDurationDropdownOpen] = useState(false);
  const [isRecalculating, setIsRecalculating] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<{ 
    code: string; 
    discountType: string; 
    discountValue: number; 
    minPurchase?: number | null; 
    allowedPlan?: string | null; 
  } | null>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');
  const [showCouponInput, setShowCouponInput] = useState(false);

  const handleApplyCoupon = async () => {
    if (!coupon.trim()) return;
    setIsApplyingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          code: coupon.trim(),
          plan: plan,
          subtotal: baseTotal
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(data.coupon);
        setShowCouponInput(false);
        setCouponError('');
      } else {
        setCouponError(data.error || 'Kupon tidak valid');
      }
    } catch (err) {
      setCouponError('Terjadi kesalahan jaringan');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCoupon('');
  };

  const handleDurationChange = (newDuration: 'monthly' | 'yearly') => {
    if (newDuration === duration) return;
    setIsRecalculating(true);
    setDuration(newDuration);
    setTimeout(() => {
      setIsRecalculating(false);
    }, 600);
  };

  const { data: session, status } = useSession();
  const router = useRouter();
  const [minLoadingDone, setMinLoadingDone] = useState(false);

  const { data: pricing, isLoading: pricingLoading } = useSWR('/api/pricing', fetcher);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMinLoadingDone(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/login?callbackUrl=/checkout?plan=${initialPlan}`);
    }
  }, [status, router, initialPlan]);

  const formatIDR = (num: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);
  };

  const selectedPricing = pricing?.[plan]?.[duration];
  const baseTotal = selectedPricing?.total || 0;

  // Reactive validation for minimum purchase & allowed plan when subtotal or plan changes
  useEffect(() => {
    if (appliedCoupon) {
      if (appliedCoupon.minPurchase !== null && appliedCoupon.minPurchase !== undefined && baseTotal < appliedCoupon.minPurchase) {
        setAppliedCoupon(null);
        setCouponError(`Kupon "${appliedCoupon.code}" dilepas karena minimal belanja Rp ${appliedCoupon.minPurchase.toLocaleString('id-ID')} belum terpenuhi.`);
      } else if (appliedCoupon.allowedPlan && appliedCoupon.allowedPlan !== 'ALL' && plan !== appliedCoupon.allowedPlan) {
        setAppliedCoupon(null);
        setCouponError(`Kupon "${appliedCoupon.code}" dilepas karena hanya berlaku untuk paket ${appliedCoupon.allowedPlan.toUpperCase()}`);
      }
    }
  }, [baseTotal, plan, appliedCoupon]);

  if (status === 'loading' || status === 'unauthenticated' || !minLoadingDone || pricingLoading || !pricing) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-white relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        {/* Background decorative blobs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[#ff9e00]/5 rounded-full blur-3xl animate-pulse"></div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <div className="bg-zinc-950 p-6 border border-white/10 mb-8 relative">
            <img src="/portfo.be.png" alt="Portfo.be" className="h-7 w-auto relative z-10 invert brightness-0 animate-pulse" />
          </div>
          
          <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-[#ff9e00] animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-[#ff9e00] animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 rounded-full bg-[#ff9e00] animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Check if the plan is valid and exists in pricing (is active)
  const isPlanActive = pricing && pricing[plan];
  
  if (!isPlanActive) {
    const activePlans = pricing ? Object.keys(pricing) : [];
    
    return (
      <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Grid background */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        
        <div className="bg-zinc-950 border border-white/10 p-10 max-w-md w-full text-center space-y-8 animate-in fade-in zoom-in-95 relative z-10">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8 animate-bounce" />
          </div>
          <div className="space-y-3">
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Paket Tidak Tersedia</h2>
            <p className="text-xs font-mono text-white/50 leading-relaxed">
              Maaf, paket layanan <span className="font-bold text-white uppercase">"{plan}"</span> saat ini sedang tidak diaktifkan oleh administrator atau tidak tersedia untuk dibeli.
            </p>
          </div>
          
          {activePlans.length > 0 ? (
            <div className="space-y-4 pt-2 text-left">
              <p className="text-[10px] font-mono font-bold text-white/30 uppercase tracking-widest text-center">Silakan pilih paket lain yang tersedia:</p>
              <div className="flex flex-col gap-2.5">
                {activePlans.map((pCode) => (
                  <button 
                    key={pCode}
                    onClick={() => setPlan(pCode as any)}
                    className="w-full bg-black border border-white/10 hover:border-white/20 py-4 px-5 text-xs font-mono font-bold uppercase tracking-wider text-white flex items-center justify-between transition-all active:scale-[0.98]"
                  >
                    <span>Paket {pricing[pCode].name}</span>
                    <ArrowRight className="w-4 h-4 text-white/40" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="pt-2">
              <Link href="/" className="inline-flex w-full bg-[#ff9e00] text-black font-mono font-bold uppercase tracking-widest py-4 justify-center text-xs hover:bg-[#ffaa22] transition-all active:scale-95">
                Kembali ke Beranda
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  }

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discountType === 'PERCENTAGE') {
      discountAmount = (baseTotal * appliedCoupon.discountValue) / 100;
    } else {
      discountAmount = appliedCoupon.discountValue;
    }
  }

  const grandTotal = Math.max(0, baseTotal - discountAmount);

  // Calculate total savings (from original prices)
  const savings = (duration === 'yearly' 
    ? (selectedPricing?.originalTotal - selectedPricing?.total) 
    : (selectedPricing?.original - selectedPricing?.price)) + discountAmount;

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans pb-24 selection:bg-[#ff9e00] selection:text-black relative">
      {/* Grid background */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>

      {/* Navbar */}
      <nav className="bg-black/60 backdrop-blur-md border-b border-white/10 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <Link href="/" className="flex items-center gap-2">
          <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-6 w-auto invert brightness-0" />
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs font-mono font-bold text-white/50 hidden md:block">{session?.user?.email}</span>
          {session?.user?.image ? (
            <img src={session.user.image} alt="Profile" className="w-8 h-8 rounded-none border border-white/10" />
          ) : (
            <div className="w-8 h-8 bg-zinc-950 border border-white/10 flex items-center justify-center text-white text-xs font-mono font-bold uppercase">
              {session?.user?.name?.[0] || session?.user?.email?.[0] || 'U'}
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 pt-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start animate-in fade-in slide-in-from-bottom-4 duration-75 relative z-10">
        
        {/* Left Column - Configurations */}
        <div className="lg:col-span-8 space-y-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[#ff9e00] text-[9px] font-mono uppercase tracking-[0.2em] mb-4">
              Premium Subscription
            </div>
            <h1 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Keranjang Belanja</h1>
          </div>
          
          {/* Info Banner */}
          <div className="bg-[#ff9e00]/5 border border-[#ff9e00]/20 p-5 flex gap-4 items-start rounded-none">
            <Info className="w-5 h-5 text-[#ff9e00] shrink-0 mt-0.5" />
            <p className="text-xs font-mono text-white/70 leading-relaxed">
              Anda diarahkan ke halaman checkout aman Portfo.be. Harga layanan yang dipilih telah disesuaikan dengan diskon promosi aktif saat ini.
            </p>
          </div>

          {/* Main Plan Card */}
          <div className="bg-zinc-950 border border-white/10 rounded-none relative">
            <div className={`p-6 md:p-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 ${duration === 'yearly' ? 'border-b border-white/10' : ''}`}>
              
              <div className="flex-1 w-full">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-white/5 border border-white/10 flex items-center justify-center text-white">
                    {plan === 'supreme' ? <Crown className="w-5 h-5 text-[#ff9e00]" /> : <Rocket className="w-5 h-5 text-[#ff9e00]" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-bold text-white uppercase tracking-wider">Paket {pricing[plan].name}</h2>
                    <p className="text-xs font-mono text-white/40 mt-0.5">Lisensi Portofolio Kreator Professional</p>
                  </div>
                </div>

                <div className="space-y-2 relative max-w-md">
                  <label className="text-[9px] font-mono font-bold text-white/40 uppercase tracking-widest">Durasi Tagihan</label>
                  <div className="relative">
                    <button 
                      onClick={() => setIsDurationDropdownOpen(!isDurationDropdownOpen)}
                      className={`w-full text-left bg-black border ${isDurationDropdownOpen ? 'border-[#ff9e00]' : 'border-white/10 hover:border-white/20'} text-white font-mono font-bold text-xs uppercase tracking-wider px-4 py-4 pr-10 transition-all cursor-pointer`}
                    >
                      {duration === 'yearly' 
                        ? `12 Bulan - ${formatIDR(pricing[plan].yearly.price)}/bln (Hemat 20%)` 
                        : `1 Bulan - ${formatIDR(pricing[plan].monthly.price)}/bln`}
                      <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-white/40">
                        {isRecalculating ? (
                          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                        ) : (
                          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDurationDropdownOpen ? 'rotate-180' : ''}`} />
                        )}
                      </div>
                    </button>

                    {isDurationDropdownOpen && (
                      <>
                        {/* Overlay */}
                        <div className="fixed inset-0 z-40" onClick={() => setIsDurationDropdownOpen(false)}></div>
                        
                        {/* Dropdown Menu */}
                        <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-950 border border-white/10 rounded-none shadow-2xl z-50 overflow-hidden py-1 animate-in fade-in slide-in-from-top-2 duration-200">
                          <button 
                            onClick={() => { handleDurationChange('monthly'); setIsDurationDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${duration === 'monthly' ? 'bg-white/5 text-[#ff9e00]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span>1 Bulan - {formatIDR(pricing[plan].monthly.price)}/bln</span>
                            {duration === 'monthly' && <Check className="w-4 h-4 text-[#ff9e00]" />}
                          </button>
                          
                          <button 
                            onClick={() => { handleDurationChange('yearly'); setIsDurationDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-3.5 text-xs font-mono font-bold uppercase tracking-wider transition-colors flex items-center justify-between ${duration === 'yearly' ? 'bg-[#ff9e00]/5 text-[#ff9e00]' : 'text-white/60 hover:bg-white/5 hover:text-white'}`}
                          >
                            <span>
                              12 Bulan - {formatIDR(pricing[plan].yearly.price)}/bln 
                              <span className="ml-2 text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-none uppercase font-bold tracking-wider border border-emerald-500/20">HEMAT 20%</span>
                            </span>
                            {duration === 'yearly' && <Check className="w-4 h-4 text-[#ff9e00]" />}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Price Display */}
              <div className="text-left md:text-right shrink-0">
                {isRecalculating ? (
                  <div className="flex flex-col items-start md:items-end gap-2 animate-pulse w-32 md:ml-auto">
                    <div className="h-3 w-16 bg-white/5 rounded-none"></div>
                    <div className="h-8 w-28 bg-white/5 rounded-none"></div>
                    <div className="h-5 w-32 bg-white/5 rounded-none mt-1"></div>
                  </div>
                ) : (
                  <>
                    <div className="text-[10px] font-mono font-bold text-white/30 line-through mb-1">
                      {formatIDR(selectedPricing.original)}/bulan
                    </div>
                    <div className="flex items-baseline gap-1 md:justify-end">
                      <span className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight animate-in fade-in zoom-in duration-300">{formatIDR(selectedPricing.price)}</span>
                      <span className="text-xs font-mono text-white/40">/bln</span>
                    </div>
                    {duration === 'yearly' && (
                      <div className="mt-3 inline-block bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold px-2.5 py-1 border border-emerald-500/20 animate-in fade-in slide-in-from-bottom-2">
                        HEMAT {formatIDR(selectedPricing.original - selectedPricing.price)}/BLN
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Free Domain Notice */}
            {duration === 'yearly' && (
              <div className="bg-emerald-500/[0.02] p-4 md:px-8 border-t border-emerald-500/10 flex gap-3 items-center rounded-none">
                <div className="w-5 h-5 rounded-none bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                  <Check className="w-3 h-3" />
                </div>
                <p className="text-xs font-mono text-emerald-400">
                  Bonus: Halaman tahunan mengaktifkan <strong className="text-white font-bold">Domain Kustom GRATIS</strong> (.com/.net/.me) untuk 1 tahun pertama.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:col-span-4">
          <div className="bg-zinc-950 border border-white/10 p-6 md:p-8 sticky top-24 min-h-[500px] flex flex-col justify-between">
            {isRecalculating ? (
              <div className="animate-pulse flex-1 flex flex-col w-full">
                <div className="h-6 w-32 bg-white/5 rounded-none mb-6"></div>
                <div className="space-y-4 mb-6">
                  <div className="h-12 w-full bg-white/5 rounded-none"></div>
                  <div className="h-10 w-full bg-white/5 rounded-none"></div>
                </div>
                <div className="mt-auto border-t border-white/5 pt-6">
                  <div className="flex justify-between items-end mb-3">
                    <div className="h-4 w-24 bg-white/5 rounded-none"></div>
                    <div className="h-8 w-32 bg-white/5 rounded-none"></div>
                  </div>
                  <div className="h-3 w-32 bg-white/5 rounded-none ml-auto mb-6"></div>
                  <div className="h-14 w-full bg-white/5 rounded-none mb-6"></div>
                  <div className="h-20 w-full bg-white/5 rounded-none"></div>
                </div>
              </div>
            ) : (
              <>
                <div>
                  <h2 className="text-sm font-mono font-bold text-white/30 uppercase tracking-widest mb-6">Detail Tagihan</h2>
                  
                  <div className="space-y-6 mb-8">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Paket {pricing[plan].name}</h4>
                        <p className="text-[10px] font-mono text-white/40">Durasi {duration === 'yearly' ? '12 bulan' : '1 bulan'}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-mono text-white/30 line-through mb-0.5">
                          {formatIDR(duration === 'yearly' ? selectedPricing.originalTotal! : selectedPricing.original)}
                        </p>
                        <p className="text-sm font-mono font-bold text-white animate-in fade-in zoom-in duration-300">{formatIDR(baseTotal)}</p>
                      </div>
                    </div>

                    {duration === 'yearly' && (
                      <div className="flex justify-between items-start animate-in fade-in slide-in-from-bottom-2">
                        <div>
                          <h4 className="text-xs font-mono font-bold text-white uppercase tracking-wider mb-1">Domain Kustom</h4>
                          <p className="text-[10px] font-mono text-white/40">Tahun Pertama</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-mono font-bold text-emerald-400">Rp 0</p>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="border-t border-white/10 pt-6 mb-8">
                    {appliedCoupon && (
                      <div className="flex justify-between items-end mb-2 text-white/40">
                        <span className="text-xs font-mono font-bold uppercase">Subtotal</span>
                        <span className="text-xs font-mono line-through">{formatIDR(baseTotal)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end mb-1">
                      <span className="text-xs font-mono font-bold uppercase tracking-wider text-white/40">Total Tagihan</span>
                      <span className="text-xl md:text-2xl font-display font-bold text-white tracking-tight animate-in fade-in zoom-in duration-300">{formatIDR(grandTotal)}</span>
                    </div>
                    <p className="text-right text-[10px] font-mono font-bold text-emerald-400">
                      Hemat {formatIDR(savings)}!
                    </p>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between bg-emerald-500/5 border border-emerald-500/20 px-4 py-3.5 mb-6 animate-in fade-in zoom-in duration-300">
                      <div className="flex items-center gap-2">
                        <Tag className="w-4 h-4 text-emerald-400" />
                        <div>
                          <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-wider">{appliedCoupon.code}</p>
                          <p className="text-[9px] font-mono text-emerald-400/80 mt-0.5">Diskon {appliedCoupon.discountType === 'PERCENTAGE' ? `${appliedCoupon.discountValue}%` : formatIDR(appliedCoupon.discountValue)} diterapkan</p>
                        </div>
                      </div>
                      <button onClick={removeCoupon} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : !showCouponInput ? (
                    <button 
                      onClick={() => setShowCouponInput(true)}
                      className="text-[10px] font-mono font-bold text-[#ff9e00] hover:text-[#ffaa22] uppercase tracking-wider mb-6 flex items-center gap-1.5 transition-colors"
                    >
                      <Tag className="w-3.5 h-3.5" /> Punya Kode Kupon?
                    </button>
                  ) : (
                    <div className="mb-6 animate-in fade-in slide-in-from-top-2">
                      <div className="flex gap-2">
                        <input 
                          type="text" 
                          placeholder="KODE KUPON" 
                          value={coupon}
                          onChange={(e) => setCoupon(e.target.value.toUpperCase())}
                          onKeyDown={(e) => e.key === 'Enter' && handleApplyCoupon()}
                          className="flex-1 bg-black border border-white/10 rounded-none px-4 py-2.5 text-xs font-mono font-bold text-white uppercase focus:outline-none focus:border-[#ff9e00] transition-colors"
                        />
                        <button 
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !coupon.trim()}
                          className="bg-white text-black hover:bg-zinc-200 rounded-none px-4 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors disabled:opacity-50 flex items-center gap-2"
                        >
                          {isApplyingCoupon ? (
                            <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black rounded-full animate-spin"></div>
                          ) : 'Terapkan'}
                        </button>
                      </div>
                      {couponError && <p className="text-[9px] font-mono font-bold text-rose-400 mt-2">{couponError}</p>}
                    </div>
                  )}
                </div>

                <div>
                  <button className="w-full bg-[#ff9e00] hover:bg-[#ffaa22] text-black font-mono font-bold uppercase tracking-widest text-[11px] py-4.5 rounded-none transition-all active:scale-[0.98] flex items-center justify-center gap-2">
                    Lanjutkan Pembayaran <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* Trust Badges */}
                  <div className="mt-8 space-y-6 border-t border-white/5 pt-6">
                    <div className="flex items-center justify-center gap-2 text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider">
                      <Shield className="w-4 h-4 text-white/30" /> Jaminan 30 Hari Uang Kembali
                    </div>
                    
                    <div className="flex flex-col items-center gap-1.5">
                      <div className="flex items-center gap-1">
                        <span className="text-[10px] font-mono font-bold text-white/50 mr-1 uppercase">Excellent</span>
                        <div className="flex gap-0.5 text-[#ff9e00]">
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current" />
                          <Star className="w-3 h-3 fill-current opacity-50" />
                        </div>
                      </div>
                      <div className="text-[9px] font-mono text-white/30">
                        <span className="font-bold text-white/40">4.8/5</span> dari 1,024 ulasan di <span className="font-bold text-white/50">Trustpilot</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-widest">
        Memuat keranjang...
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}
