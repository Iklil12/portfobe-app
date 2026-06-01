import Link from 'next/link';
import { BaseErrorLayout } from './BaseErrorLayout';

interface NotFoundUIProps {
  subdomain?: string;
}

export function NotFoundUI({ subdomain }: NotFoundUIProps) {
  return (
    <BaseErrorLayout>
      <h1 className="text-[8rem] md:text-[15rem] font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-900 leading-none tracking-tighter">
        404
      </h1>
      
      {subdomain ? (
        <>
          <h2 className="text-xl md:text-2xl font-bold text-slate-200 tracking-tight mb-3">
            Destinasi Tidak Diketahui
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 px-4 leading-relaxed">
            Portofolio dengan subdomain <span className="text-white px-2 py-0.5 bg-white/10 rounded-md font-mono text-sm border border-white/20 shadow-sm mx-1">{subdomain}</span> tidak ditemukan.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-xl md:text-2xl font-bold text-slate-200 tracking-tight mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto mb-10 px-4 leading-relaxed">
            Sepertinya Anda tersesat di ruang hampa. Halaman atau URL yang Anda tuju tidak tersedia di sistem kami.
          </p>
        </>
      )}
      
      <Link 
        href={subdomain ? "/" : "/dashboard"} 
        className="px-8 py-4 bg-white hover:bg-slate-200 transition-colors text-black font-bold uppercase tracking-widest text-[11px] rounded-full shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
      >
        {subdomain ? "Kembali ke Beranda" : "Kembali ke Keselamatan"}
      </Link>
    </BaseErrorLayout>
  );
}
