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
      
      <div className="flex w-full md:w-auto items-center gap-2 md:gap-3">
        {subdomain && (
            <a 
                href={`/${subdomain}`} 
                target="_blank" 
                rel="noreferrer"
                className="flex-1 md:flex-none animate-enter group inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-white border border-slate-200 text-slate-900 rounded-2xl md:rounded-full text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest hover:border-slate-300 hover:bg-slate-50 transition-all duration-500 shadow-sm active:scale-95"
            >
                <i className="fas fa-external-link-alt text-slate-400 group-hover:text-[#ff9e00] transition-colors"></i>
                <span className="whitespace-nowrap">Lihat Web</span>
            </a>
        )}
        <Link 
            href="/dashboard/projects" 
            className="flex-1 md:flex-none animate-enter inline-flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-slate-900 text-white text-[10px] md:text-[11px] font-extrabold uppercase tracking-widest rounded-2xl md:rounded-full hover:bg-slate-800 transition-all active:scale-95 shadow-md"
            style={{ animationDelay: '100ms' }}
        >
            <i className="fas fa-plus text-[10px]"></i> <span className="whitespace-nowrap">New Project</span>
        </Link>
      </div>
    </div>
  );
}
