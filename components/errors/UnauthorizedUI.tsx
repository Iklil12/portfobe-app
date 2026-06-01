import Link from 'next/link';
import { BaseErrorLayout } from './BaseErrorLayout';

export function UnauthorizedUI() {
  return (
    <BaseErrorLayout>
      <div className="w-16 h-16 mb-8 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        Akses Ditolak
      </h1>
      
      <p className="text-lg text-white/50 mb-12 leading-relaxed max-w-md">
        Anda tidak memiliki izin untuk melihat halaman ini. Sesi Anda mungkin telah berakhir atau Anda mencoba mengakses area terlarang.
      </p>

      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-8 py-3 bg-white hover:bg-slate-200 transition-colors text-black font-medium rounded-full"
        >
          Masuk Kembali
        </Link>
      </div>
    </BaseErrorLayout>
  );
}
