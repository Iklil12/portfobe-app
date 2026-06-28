import Link from 'next/link';
import { BaseErrorLayout } from './BaseErrorLayout';
import { ShieldAlert } from 'lucide-react';

export function RateLimitedUI() {
  return (
    <BaseErrorLayout>
      <div className="w-16 h-16 mb-8 rounded-md bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <h1 className="text-xl md:text-2xl font-sans font-medium tracking-wider uppercase mb-4 text-white">
        Too Many Requests
      </h1>
      
      <p className="text-xs font-sans text-white/40 mb-12 leading-relaxed max-w-md">
        Sistem kami mendeteksi terlalu banyak aktivitas dari perangkat Anda dalam waktu singkat. Silakan tunggu sekitar 1 menit sebelum mencoba kembali.
      </p>

      <div className="flex gap-4">
        <Link 
          href="/" 
          className="px-8 py-4 bg-[#ff9e00] hover:bg-[#ffaa22] transition-colors text-black font-sans font-medium uppercase tracking-widest text-[11px] rounded-md active:scale-95"
        >
          Ke Beranda
        </Link>
      </div>
    </BaseErrorLayout>
  );
}
