import Link from 'next/link';
import { BaseErrorLayout } from './BaseErrorLayout';
import { ShieldX } from 'lucide-react';

export function UnauthorizedUI() {
  return (
    <BaseErrorLayout>
      <div className="w-16 h-16 mb-8 rounded-none bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center text-yellow-500">
        <ShieldX className="w-8 h-8" />
      </div>

      <h1 className="text-xl md:text-2xl font-mono font-bold tracking-wider uppercase mb-4 text-white">
        Akses Ditolak
      </h1>
      
      <p className="text-xs font-mono text-white/40 mb-12 leading-relaxed max-w-md">
        Anda tidak memiliki izin untuk melihat halaman ini. Sesi Anda mungkin telah berakhir atau Anda mencoba mengakses area terlarang.
      </p>

      <div className="flex gap-4">
        <Link 
          href="/login" 
          className="px-8 py-4 bg-[#ff9e00] hover:bg-[#ffaa22] transition-colors text-black font-mono font-bold uppercase tracking-widest text-[11px] rounded-none active:scale-95"
        >
          Masuk Kembali
        </Link>
      </div>
    </BaseErrorLayout>
  );
}
