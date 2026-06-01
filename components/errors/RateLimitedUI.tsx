import Link from 'next/link';
import { BaseErrorLayout } from './BaseErrorLayout';

export function RateLimitedUI() {
  return (
    <BaseErrorLayout>
      <div className="w-16 h-16 mb-8 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        Too Many Requests
      </h1>
      
      <p className="text-lg text-white/50 mb-12 leading-relaxed max-w-md">
        Sistem kami mendeteksi terlalu banyak aktivitas dari perangkat Anda dalam waktu singkat. Silakan tunggu sekitar 1 menit sebelum mencoba kembali.
      </p>

      <div className="flex gap-4">
        <Link 
          href="/" 
          className="px-8 py-3 bg-white hover:bg-slate-200 transition-colors text-black font-medium rounded-full"
        >
          Ke Beranda
        </Link>
      </div>
    </BaseErrorLayout>
  );
}
