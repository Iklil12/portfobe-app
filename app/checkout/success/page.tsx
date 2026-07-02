"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Optional: if you want to automatically redirect to dashboard after a few seconds
    const timer = setTimeout(() => {
      setIsRedirecting(true);
      router.push('/dashboard');
    }, 10000); // 10 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen bg-[#050505] text-white antialiased selection:bg-[#ff9e00] selection:text-black flex flex-col">
      <Navbar isDarkBg={true} />

      <main className="flex-1 flex items-center justify-center relative p-6">
        {/* Background Decorative */}
        <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl opacity-50"></div>

        <div className="max-w-md w-full bg-zinc-950 border border-emerald-500/20 p-10 text-center relative z-10 animate-in fade-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-8 rounded-full">
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          </div>

          <h1 className="text-3xl font-display font-bold text-white tracking-tight mb-4 uppercase">Pembayaran Berhasil!</h1>
          
          <p className="text-sm font-mono text-white/60 leading-relaxed mb-10">
            Terima kasih! Transaksi Anda telah berhasil diproses oleh sistem. 
            Paket premium Portfobe Anda akan segera aktif dalam beberapa saat.
          </p>

          <div className="space-y-4">
            <Link 
              href="/dashboard"
              className="w-full py-4 bg-[#ff9e00] text-black font-mono font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2 hover:bg-[#ffaa22] transition-colors"
            >
              Ke Dashboard <ArrowRight className="w-4 h-4" />
            </Link>
            
            <p className="text-[10px] font-mono text-white/30 uppercase tracking-wider">
              {isRedirecting ? 'Mengalihkan otomatis...' : 'Otomatis dialihkan dalam 10 detik'}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
