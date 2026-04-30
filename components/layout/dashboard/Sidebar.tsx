"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isLoading: boolean;
  userPlan: string;
  isSidebarOpen: boolean;
}

export function Sidebar({ isLoading, userPlan, isSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Default: Tertutup (Collapsed)
  
  // Efek untuk memuat preferensi user dari localStorage
  useEffect(() => {
    const savedState = localStorage.getItem('sidebar-collapsed');
    if (savedState !== null) {
      setIsSidebarCollapsed(savedState === 'true');
    }
  }, []);

  // Fungsi wrapper untuk menyimpan ke localStorage
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebar-collapsed', String(newState));
  };
  
  const isDesignRoute = pathname === '/dashboard/projects' || pathname === '/dashboard/themes' || pathname === '/dashboard/links';
  const [isDesignMenuOpen, setIsDesignMenuOpen] = useState(isDesignRoute);
  
  const isActive = (path: string) => pathname === path;

  // LOGIK KRUSIAL: Jika isSidebarOpen (mobile) sedang aktif, maka JANGAN di-collapse.
  // Sidebar mengecil HANYA berlaku di desktop.
  const shouldCollapse = isSidebarCollapsed && !isSidebarOpen;

  return (
    <aside className={`animate-page-load fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-100 flex flex-col transition-all duration-300 ease-in-out
      ${isSidebarOpen ? 'translate-x-0 shadow-2xl w-72' : '-translate-x-full md:relative md:translate-x-0'} 
      ${shouldCollapse ? 'md:w-[88px]' : 'md:w-72'} 
    `}>
      <div className="flex flex-col h-full w-full">
        <div className="h-[88px] shrink-0 flex items-center justify-center border-b border-transparent px-6 transition-all relative">
          {isLoading ? (
            <div className="h-8 w-28 skeleton-premium rounded-lg"></div>
          ) : (
            <Link href="/" className="flex items-center group cursor-pointer w-full justify-center relative h-full">
               {/* Logo P - Dihapus efek berputar, hanya fade in/out */}
               <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ease-in-out ${shouldCollapse ? 'opacity-100 scale-100' : 'opacity-0 scale-75 pointer-events-none'}`}>
                 <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md group-hover:scale-105 transition-transform">P</div>
               </div>
               
               {/* Logo Teks Panjang - Dihapus efek berputar */}
               <img src="/portfo.be.png" alt="Portfo.be Logo" className={`h-7 w-auto object-contain transition-all duration-300 ease-in-out ${shouldCollapse ? 'opacity-0 scale-75 pointer-events-none absolute' : 'opacity-100 scale-100 group-hover:scale-105 mr-auto'}`} />
            </Link>
          )}
        </div>

        <nav className={`flex-1 space-y-1 mt-4 transition-all duration-300 ${shouldCollapse ? 'overflow-visible px-3' : 'overflow-y-auto hide-scrollbar px-4'}`}>
          {isLoading ? (
            <div className="space-y-3 py-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-11 w-full skeleton-premium rounded-2xl"></div>
              ))}
            </div>
          ) : (
            <>
              {/* Menu Overview */}
              <div className="relative group/tooltip">
                <Link href="/dashboard" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${shouldCollapse ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                  <i className={`fas fa-layer-group text-center transition-all duration-300 ${shouldCollapse ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>Overview</span>
                </Link>
                {shouldCollapse && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Overview</div>}
              </div>
              
              {/* Menu Desain (Dengan Submenu) */}
              <div className="pt-2 relative group/design">
                <button onClick={() => { if(!shouldCollapse) setIsDesignMenuOpen(!isDesignMenuOpen); }} className={`w-full flex items-center transition-all duration-300 group py-3.5 rounded-2xl ${isDesignRoute ? (shouldCollapse ? 'bg-slate-100 text-slate-900' : 'text-slate-900') : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${shouldCollapse ? 'justify-center px-0 cursor-default' : 'px-4 justify-between'}`}>
                  <div className={`flex items-center transition-all duration-300 ${shouldCollapse ? 'gap-0' : 'gap-4'}`}>
                    <i className={`fas fa-paint-roller text-center transition-all duration-300 ${shouldCollapse ? 'text-xl' : 'text-lg w-6'} ${isDesignRoute ? 'text-slate-900' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                    <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>Desain</span>
                  </div>
                  <i className={`fas fa-chevron-down text-[10px] text-slate-400 transition-all duration-300 ease-in-out overflow-hidden ${isDesignMenuOpen ? 'rotate-180' : ''} ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[20px] opacity-100'}`}></i>
                </button>

                {/* Submenu Melayang (Saat Collapsed) */}
                {shouldCollapse && (
                  <div className="absolute left-full top-0 w-56 pl-3 opacity-0 pointer-events-none group-hover/design:opacity-100 group-hover/design:pointer-events-auto transition-all duration-300 z-[100] -translate-x-2 group-hover/design:translate-x-0">
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2 px-1">
                      <div className="px-4 py-2 border-b border-slate-100 mb-1">
                        <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">Menu Desain</p>
                      </div>
                      <Link href="/dashboard/projects" className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${isActive('/dashboard/projects') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>Proyek & Karya</Link>
                      <Link href="/dashboard/themes" className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${isActive('/dashboard/themes') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>Koleksi Tema</Link>
                      <Link href="/dashboard/links" className={`w-full flex items-center px-4 py-3 rounded-xl font-bold text-[13px] transition-all ${isActive('/dashboard/links') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'}`}>Tautan (Links)</Link>
                    </div>
                  </div>
                )}
                
                {/* Submenu Inline (Saat Dibuka Lebar) - Diperbaiki logic hide-nya */}
                <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${(!shouldCollapse && isDesignMenuOpen) ? 'max-h-40 py-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
                  <Link href="/dashboard/projects" className={`w-full flex items-center px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${isActive('/dashboard/projects') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
                    {isActive('/dashboard/projects') && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>} Proyek & Karya
                  </Link>
                  <Link href="/dashboard/themes" className={`w-full flex items-center px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${isActive('/dashboard/themes') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
                    {isActive('/dashboard/themes') && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>} Koleksi Tema
                  </Link>
                  <Link href="/dashboard/links" className={`w-full flex items-center px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all relative ${isActive('/dashboard/links') ? 'text-slate-900 bg-slate-50' : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50/50'}`}>
                    {isActive('/dashboard/links') && <div className="absolute left-0 w-1 h-1/2 bg-[#ff9e00] rounded-r-full"></div>} Tautan (Links)
                  </Link>
                </div>
              </div>

              {/* Menu Lainnya */}
              <div className="relative group/tooltip">
                <Link href="/dashboard/analytics" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group mt-2 ${isActive('/dashboard/analytics') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${shouldCollapse ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                  <i className={`fas fa-chart-pie text-center transition-all duration-300 ${shouldCollapse ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/analytics') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>Metrics</span>
                </Link>
                {shouldCollapse && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Metrics</div>}
              </div>

              <div className={`px-5 transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-h-0 opacity-0 pt-0 pb-0' : 'max-h-[50px] opacity-100 pt-8 pb-3'}`}>
                <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest whitespace-nowrap">Pengaturan</p>
              </div>
              <div className={`w-full flex justify-center transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-h-[50px] opacity-100 pt-6 pb-2' : 'max-h-0 opacity-0 pt-0 pb-0'}`}>
                <div className="w-6 h-[2px] bg-slate-100 rounded-full"></div>
              </div>

              <div className="relative group/tooltip">
                <Link href="/dashboard/profile" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard/profile') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${shouldCollapse ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                  <i className={`fas fa-user-circle text-center transition-all duration-300 ${shouldCollapse ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/profile') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>Profil & Bio</span>
                </Link>
                {shouldCollapse && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Profil</div>}
              </div>
              
              <div className="relative group/tooltip">
                <Link href="/support" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/support') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${shouldCollapse ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                  <i className={`fas fa-headset text-center transition-all duration-300 ${shouldCollapse ? 'text-xl' : 'text-lg w-6'} ${isActive('/support') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>Bantuan</span>
                </Link>
                {shouldCollapse && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Bantuan</div>}
              </div>

              <div className="relative group/tooltip">
                <Link href="/dashboard/settings" className={`w-full flex items-center py-3.5 rounded-2xl transition-all duration-300 group ${isActive('/dashboard/settings') ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'} ${shouldCollapse ? 'justify-center px-0 gap-0' : 'px-4 gap-4'}`}>
                  <i className={`fas fa-cog text-center transition-all duration-300 ${shouldCollapse ? 'text-xl' : 'text-lg w-6'} ${isActive('/dashboard/settings') ? 'text-[#ff9e00]' : 'text-slate-400 group-hover:text-slate-600'}`}></i> 
                  <span className={`font-extrabold text-[13px] tracking-wide whitespace-nowrap transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-w-0 opacity-0' : 'max-w-[200px] opacity-100'}`}>Akun</span>
                </Link>
                {shouldCollapse && <div className="absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-1.5 bg-slate-900 text-white text-[11px] font-bold uppercase rounded-lg opacity-0 pointer-events-none group-hover/tooltip:opacity-100 transition-all duration-300 z-[100] whitespace-nowrap shadow-xl border border-slate-700 translate-x-2 group-hover/tooltip:translate-x-0">Pengaturan Akun</div>}
              </div>
            </>
          )}
        </nav>
        
        <div className={`shrink-0 border-t border-slate-100 bg-white z-10 p-4 transition-all duration-300 ease-in-out`}>
          <div className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${shouldCollapse ? 'max-h-0 opacity-0 mb-0' : 'max-h-[300px] opacity-100 mb-4'}`}>
            {isLoading ? (
               <div className="h-32 w-full skeleton-premium rounded-3xl"></div>
            ) : userPlan === 'FREE' ? (
              <div className="relative overflow-hidden bg-[#0a0a0a] p-5 rounded-3xl shadow-sm border border-white/10 group hover:border-white/20 transition-colors">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff9e00]/10 blur-[50px] group-hover:bg-[#ff9e00]/20 transition-colors duration-500"></div>
                <i className="fas fa-gem absolute -bottom-4 -right-3 text-7xl text-white opacity-[0.02] transform rotate-12 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6 pointer-events-none"></i>
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[9px] font-extrabold uppercase tracking-widest text-[#ff9e00] mb-3">
                    <i className="fas fa-crown"></i> PRO
                  </div>
                  <p className="text-xs font-bold text-white mb-4 leading-snug whitespace-nowrap">Metrik mendalam.</p>
                  <Link href="/pricing" className="block w-full text-center bg-white text-slate-900 text-[10px] font-extrabold tracking-widest uppercase py-3 px-2 rounded-xl shadow-lg hover:bg-slate-200 active:scale-95 transition-all">
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-slate-50 border border-slate-200 p-5 rounded-3xl group">
                <i className="fas fa-check-circle absolute -bottom-4 -right-3 text-7xl text-[#ff9e00] opacity-[0.05] transform -rotate-12 transition-transform duration-500 group-hover:scale-110 pointer-events-none"></i>
                <div className="relative z-10">
                  <p className="text-[9px] font-extrabold tracking-widest text-[#ff9e00] mb-2 uppercase whitespace-nowrap">Status Akun</p>
                  <p className="text-sm font-extrabold text-slate-900 mb-1 leading-snug whitespace-nowrap">Pro Creator</p>
                  <p className="text-[10px] text-slate-500 font-medium whitespace-nowrap">Fitur terbuka.</p>
                </div>
              </div>
            )}
          </div>

          <div className={`w-full flex transition-all duration-300 ease-in-out ${shouldCollapse ? 'justify-center' : 'justify-end'}`}>
            <button onClick={toggleSidebar} className="hidden md:flex w-10 h-10 rounded-xl bg-white border border-slate-200 text-slate-400 hover:bg-slate-50 hover:text-slate-900 hover:border-slate-300 items-center justify-center transition-all duration-300 ease-in-out active:scale-90 group shadow-sm" title={shouldCollapse ? "Perbesar Sidebar" : "Perkecil Sidebar"}>
              <i className={`fas fa-chevron-left text-[12px] transition-transform duration-300 ease-in-out ${shouldCollapse ? 'rotate-180' : ''}`}></i>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
