"use client";

import Link from 'next/link';

interface OverviewHeaderProps {
  subdomain: string;
}

export function OverviewHeader({ subdomain }: OverviewHeaderProps) {
  return (
    <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 animate-enter">
      <div>
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 mb-2 flex items-center gap-3">
          Overview. 
          <i className="fas fa-certificate text-[#ff9e00] text-[1.2rem] md:text-[1.5rem] animate-spin-slow opacity-80"></i>
        </h1>
        <p className="text-sm font-medium text-slate-500">Ringkasan performa dan data portofolio Anda saat ini.</p>
      </div>
      
      <div className="flex flex-wrap items-center gap-3">
        {subdomain && (
            <a 
                href={`/${subdomain}`} 
                target="_blank" 
                rel="noreferrer"
                className="animate-enter group inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-full text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm active:scale-95"
            >
                <i className="fas fa-external-link-alt text-slate-400 group-hover:text-[#ff9e00] transition-colors"></i>
                Lihat Portofolio
            </a>
        )}
        <Link 
            href="/dashboard/projects" 
            className="animate-enter inline-flex items-center gap-2 px-6 py-3 bg-slate-900 text-white text-[11px] font-extrabold uppercase tracking-widest rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-md"
            style={{ animationDelay: '100ms' }}
        >
            <i className="fas fa-plus text-[10px]"></i> New Project
        </Link>
      </div>
    </div>
  );
}
