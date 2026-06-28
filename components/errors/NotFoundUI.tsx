import Link from 'next/link';
import { BaseErrorLayout } from './BaseErrorLayout';

interface NotFoundUIProps {
  subdomain?: string;
}

export function NotFoundUI({ subdomain }: NotFoundUIProps) {
  return (
    <BaseErrorLayout>
      <h1 className="text-[6rem] md:text-[10rem] font-sans font-medium text-white/20 leading-none tracking-tighter mb-4 selection:text-white selection:bg-white/10">
        404
      </h1>
      
      {subdomain ? (
        <>
          <h2 className="text-sm font-sans font-medium text-slate-200 tracking-wider uppercase mb-3">
            Destinasi Tidak Diketahui
          </h2>
          <p className="text-xs font-sans text-white/40 max-w-md mx-auto mb-10 px-4 leading-relaxed">
            Portofolio dengan subdomain <span className="text-white px-2 py-0.5 bg-white/5 rounded-md font-mono text-xs border border-white/10 shadow-sm mx-1">{subdomain}</span> tidak ditemukan.
          </p>
        </>
      ) : (
        <>
          <h2 className="text-sm font-sans font-medium text-slate-200 tracking-wider uppercase mb-3">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-xs font-sans text-white/40 max-w-md mx-auto mb-10 px-4 leading-relaxed">
            Sepertinya Anda tersesat di ruang hampa. Halaman atau URL yang Anda tuju tidak tersedia di sistem kami.
          </p>
        </>
      )}
      
      <Link 
        href={subdomain ? "/" : "/dashboard"} 
        className="px-8 py-4 bg-[#ff9e00] hover:bg-[#ffaa22] transition-colors text-black font-sans font-medium uppercase tracking-widest text-[11px] rounded-md active:scale-95"
      >
        {subdomain ? "Back to Home" : "Back to Dashboard"}
      </Link>
    </BaseErrorLayout>
  );
}
