"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LazyImage } from '@/components/ui/LazyImage';
import { 
  LayoutGrid, 
  Palette, 
  Compass, 
  PieChart, 
  User, 
  HelpCircle, 
  Settings, 
  Terminal, 
  Crown, 
  Gem, 
  FolderOpen, 
  Link2, 
  MessageSquare, 
  Plug, 
  Sparkles, 
  Trash2, 
  ChevronDown, 
  Lightbulb, 
  CheckCircle,
  Menu,
  X
} from 'lucide-react';

interface SidebarProps {
  isLoading: boolean;
  userPlan: string;
  isSidebarOpen: boolean;
  projectsCount?: number;
  linksCount?: number;
  testimonialsCount?: number;
  userRole?: string;
}

export function Sidebar({ isLoading, userPlan, isSidebarOpen, projectsCount = 0, linksCount = 0, testimonialsCount = 0, userRole = 'USER' }: SidebarProps) {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  const isDesignRoute = pathname.includes('/dashboard/projects') || 
                        pathname.includes('/dashboard/themes') || 
                        pathname.includes('/dashboard/links') || 
                        pathname.includes('/dashboard/testimonials') ||
                        pathname.includes('/dashboard/build-with-ai') ||
                        pathname.includes('/dashboard/integrations') ||
                        pathname.includes('/dashboard/trash');
  
  const isAdminRoute = pathname.includes('/dashboard/admin');
  
  const [isMobileDesignMenuOpen, setIsMobileDesignMenuOpen] = useState(isDesignRoute);
  const [isMobileAdminMenuOpen, setIsMobileAdminMenuOpen] = useState(isAdminRoute);

  return (
    <div className={`fixed inset-y-0 left-0 z-50 flex transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full md:translate-x-0 md:relative md:shadow-none'}`}>
      
      {/* ============================================================== */}
      {/* DESKTOP SIDEBAR (TWO-PANE LAYOUT)                              */}
      {/* ============================================================== */}
      <div className="hidden md:flex h-full">
        {/* PRIMARY SIDEBAR (NAVIGATION RAIL) */}
        <aside className="w-[90px] bg-black border-r border-white/10 flex flex-col h-full flex-shrink-0 z-20">
          <div className="h-[88px] shrink-0 flex items-center justify-center relative">
            {isLoading ? (
               <div className="w-10 h-10 skeleton-premium rounded-none"></div>
            ) : (
              <Link href="/dashboard" className="flex items-center justify-center w-full h-full cursor-pointer hover:scale-105 transition-transform">
                 <LazyImage src="/portfobe.png" alt="Logo" className="w-9 h-9 object-contain invert brightness-0" />
              </Link>
            )}
          </div>

          <nav className="flex-1 flex flex-col gap-1 py-4 px-2 overflow-y-auto hide-scrollbar">
            {isLoading ? (
               <div className="flex flex-col gap-3 px-1">
                  {[1,2,3,4,5,6].map(i => <div key={i} className="w-full h-16 skeleton-premium rounded-none"></div>)}
               </div>
            ) : (
               <>
                  <RailItem href="/dashboard" icon={<LayoutGrid className="w-4 h-4" />} label="Overview" active={isActive('/dashboard')} />
                  <RailItem href="/dashboard/projects" icon={<Palette className="w-4 h-4" />} label="Desain" active={isDesignRoute} />
                  <RailItem href="/dashboard/explore" icon={<Compass className="w-4 h-4" />} label="Explore" active={isActive('/dashboard/explore')} />
                  <RailItem href="/dashboard/analytics" icon={<PieChart className="w-4 h-4" />} label="Metrics" active={isActive('/dashboard/analytics')} />
                  <RailItem href="/dashboard/profile" icon={<User className="w-4 h-4" />} label="Profil" active={isActive('/dashboard/profile')} />
                  <RailItem href="/support" icon={<HelpCircle className="w-4 h-4" />} label="Bantuan" active={isActive('/support')} />
                  <RailItem href="/dashboard/settings" icon={<Settings className="w-4 h-4" />} label="Settings" active={isActive('/dashboard/settings')} />
                  {userRole === 'ADMIN' && (
                    <RailItem href="/dashboard/admin/architecture" icon={<Terminal className="w-4 h-4" />} label="Dev Hub" active={isAdminRoute} />
                  )}
               </>
            )}
          </nav>
          
          {/* User Plan Indicator in Rail */}
          <div className="shrink-0 pb-6 pt-2 flex justify-center border-t border-white/10 mt-auto">
             {isLoading ? (
                <div className="w-12 h-12 skeleton-premium rounded-none mt-4"></div>
             ) : userPlan === 'FREE' ? (
               <Link href="/pricing" className="w-12 h-12 mt-4 bg-[#0a0a0a] rounded-none flex items-center justify-center relative group shadow-sm border border-white/10" title="Upgrade to PRO">
                  <Crown className="text-[#ff9e00] w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border border-black"></div>
               </Link>
             ) : (
               <div className={`w-12 h-12 mt-4 rounded-none flex items-center justify-center border ${userPlan === 'SUPREME' ? 'bg-violet-950/30 border-violet-500/30' : 'bg-zinc-900 border-white/10'}`} title={userPlan === 'SUPREME' ? 'Supreme Creator' : 'Pro Creator'}>
                  <Gem className={`w-5 h-5 ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`} />
               </div>
             )}
          </div>
        </aside>

        {/* SECONDARY SIDEBAR (KHUSUS UNTUK DESAIN & ADMIN) */}
        <aside className={`bg-zinc-950 border-r border-white/10 flex flex-col h-full flex-shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden z-10
          ${isDesignRoute || isAdminRoute ? 'w-[240px] opacity-100 border-r' : 'w-0 opacity-0 border-r-0'}
        `}>
          {isDesignRoute && (
             <div className="flex flex-col h-full w-[240px]">
               <div className="h-[88px] shrink-0 flex flex-col justify-center px-6 border-b border-white/5">
                 {isLoading ? (
                   <>
                     <div className="w-16 h-3 skeleton-premium rounded-none mb-2"></div>
                     <div className="w-32 h-5 skeleton-premium rounded-none"></div>
                   </>
                 ) : (
                   <h2 className="font-display font-bold text-sm text-white tracking-wider uppercase">Desain Portofolio</h2>
                 )}
               </div>
               
               <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto hide-scrollbar">
                 {isLoading ? (
                   <div className="flex flex-col gap-2">
                     {[1, 2, 3, 4].map(i => <div key={i} className="w-full h-11 skeleton-premium rounded-none"></div>)}
                   </div>
                 ) : (
                   <>
                     {/* KONTEN */}
                     <div className="space-y-1">
                       <p className="px-3 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Konten</p>
                       <SecondaryNavItem href="/dashboard/projects" icon={<FolderOpen className="w-4 h-4" />} label="Proyek & Karya" active={isActive('/dashboard/projects')} count={projectsCount} />
                       <SecondaryNavItem href="/dashboard/links" icon={<Link2 className="w-4 h-4" />} label="Tautan (Links)" active={isActive('/dashboard/links')} count={linksCount} />
                       <SecondaryNavItem href="/dashboard/testimonials" icon={<MessageSquare className="w-4 h-4" />} label="Testimoni" active={isActive('/dashboard/testimonials')} count={testimonialsCount} />
                     </div>

                     {/* TAMPILAN */}
                     <div className="space-y-1">
                       <p className="px-3 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Tampilan</p>
                       <SecondaryNavItem href="/dashboard/themes" icon={<Palette className="w-4 h-4" />} label="Koleksi Tema" active={isActive('/dashboard/themes')} />
                     </div>

                     {/* EKSTENSI */}
                     <div className="space-y-1">
                       <p className="px-3 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Ekstensi</p>
                       <SecondaryNavItem href="/dashboard/integrations" icon={<Plug className="w-4 h-4" />} label="Connected Works" active={isActive('/dashboard/integrations')} />
                     </div>

                     {/* EKSPERIMEN */}
                     <div className="space-y-1">
                       <p className="px-3 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Eksperimen</p>
                       <SecondaryNavItem href="/dashboard/build-with-ai" icon={<Sparkles className="w-4 h-4" />} label="Build with AI" active={isActive('/dashboard/build-with-ai')} highlightText="Segera" />
                     </div>

                     {/* DIVIDER + TRASH */}
                     <div className="pt-2">
                       <div className="h-px bg-white/10 mx-2 mb-4" />
                       <SecondaryNavItem href="/dashboard/trash" icon={<Trash2 className="w-4 h-4" />} label="Trash" active={isActive('/dashboard/trash')} />
                     </div>
                   </>
                 )}
               </nav>
               
               <div className="p-4 mt-auto border-t border-white/5">
                 {isLoading ? (
                   <div className="w-full h-24 skeleton-premium rounded-none"></div>
                 ) : (
                   <div className="bg-white/[0.02] border border-white/10 rounded-none p-4 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-[#ff9e00]/5 blur-2xl rounded-full translate-x-1/3 -translate-y-1/3 group-hover:bg-[#ff9e00]/10 transition-all duration-500"></div>
                       <Lightbulb className="text-[#ff9e00] w-5 h-5 mb-2 relative z-10" />
                       <p className="text-[10px] text-white/60 font-mono leading-relaxed relative z-10">Atur karya dan koleksi tema sesuai gayamu untuk menarik lebih banyak klien.</p>
                   </div>
                 )}
               </div>
             </div>
          )}

          {isAdminRoute && (
             <div className="flex flex-col h-full w-[240px]">
               <div className="h-[88px] shrink-0 flex flex-col justify-center px-6 border-b border-white/5">
                 {isLoading ? (
                   <>
                     <div className="w-16 h-3 skeleton-premium rounded-none mb-2"></div>
                     <div className="w-32 h-5 skeleton-premium rounded-none"></div>
                   </>
                 ) : (
                   <h2 className="font-display font-bold text-sm text-violet-400 tracking-wider uppercase flex items-center gap-2">
                     <Terminal className="w-4 h-4" /> Developer Hub
                   </h2>
                 )}
               </div>
               
               <nav className="flex-1 py-4 px-3 space-y-4 overflow-y-auto hide-scrollbar">
                 {isLoading ? (
                   <div className="flex flex-col gap-2">
                     {[1, 2, 3].map(i => <div key={i} className="w-full h-11 skeleton-premium rounded-none"></div>)}
                   </div>
                 ) : (
                   <>
                     <div className="space-y-1">
                       <p className="px-3 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Architecture</p>
                       <SecondaryNavItem href="/dashboard/admin/architecture" icon={<Terminal className="w-4 h-4" />} label="TDD Plan" active={isActive('/dashboard/admin/architecture')} />
                     </div>

                     <div className="space-y-1">
                       <p className="px-3 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em] mb-2">Maintenance</p>
                       <SecondaryNavItem href="/dashboard/admin/ideas" icon={<Lightbulb className="w-4 h-4" />} label="Feature Backlog" active={isActive('/dashboard/admin/ideas')} />
                       <SecondaryNavItem href="/dashboard/admin/errors" icon={<Terminal className="w-4 h-4" />} label="System Logs" active={isActive('/dashboard/admin/errors')} />
                       <SecondaryNavItem href="/dashboard/admin/features" icon={<Terminal className="w-4 h-4" />} label="Feature Flags" active={isActive('/dashboard/admin/features')} />
                     </div>
                   </>
                 )}
               </nav>
             </div>
          )}
        </aside>
      </div>


      {/* ============================================================== */}
      {/* MOBILE SIDEBAR (SINGLE PANE LAYOUT WITH ACCORDION)             */}
      {/* ============================================================== */}
      <div className="flex md:hidden h-full w-[280px]">
        <aside className="w-full bg-black border-r border-white/10 flex flex-col h-full">
          <div className="h-[88px] shrink-0 flex items-center justify-between px-6 border-b border-white/5">
            {isLoading ? (
              <div className="h-8 w-28 skeleton-premium rounded-none"></div>
            ) : (
              <Link href="/" className="flex items-center group cursor-pointer">
                 <LazyImage src="/portfo.be.png" alt="Portfo.be Logo" className="h-9 w-auto object-contain invert brightness-0" />
              </Link>
            )}
          </div>

          <nav className="flex-1 space-y-1 mt-4 overflow-y-auto hide-scrollbar px-4">
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-11 w-full skeleton-premium rounded-none"></div>
                ))}
              </div>
            ) : (
               <>
                 {/* Menu Overview */}
                 <MobileNavItem href="/dashboard" icon={<LayoutGrid className="w-5 h-5" />} label="Overview" active={isActive('/dashboard')} />
                 
                 {/* Menu Desain (Dengan Submenu Accordion) */}
                 <div className="pt-2">
                   <button onClick={() => setIsMobileDesignMenuOpen(!isMobileDesignMenuOpen)} className={`w-full flex items-center transition-all duration-300 group py-3 rounded-none px-4 justify-between ${isDesignRoute ? 'text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                     <div className="flex items-center gap-4">
                       <Palette className={`w-5 h-5 ${isDesignRoute ? 'text-white' : 'text-white/40'}`} /> 
                       <span className="font-mono text-xs font-bold tracking-wider uppercase">Desain</span>
                     </div>
                     <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isMobileDesignMenuOpen ? 'rotate-180' : ''}`} />
                   </button>

                   {/* Submenu Inline (Accordion) */}
                   <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMobileDesignMenuOpen ? 'max-h-80 py-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
                     <MobileSubNavItem href="/dashboard/projects" label="Proyek & Karya" active={isActive('/dashboard/projects')} count={projectsCount} />
                     <MobileSubNavItem href="/dashboard/themes" label="Koleksi Tema" active={isActive('/dashboard/themes')} />
                     <MobileSubNavItem href="/dashboard/build-with-ai" label="Build with AI" active={isActive('/dashboard/build-with-ai')} highlightText="Segera" />
                     <MobileSubNavItem href="/dashboard/links" label="Tautan (Links)" active={isActive('/dashboard/links')} count={linksCount} />
                     <MobileSubNavItem href="/dashboard/testimonials" label="Testimoni" active={isActive('/dashboard/testimonials')} count={testimonialsCount} />
                     <MobileSubNavItem href="/dashboard/integrations" label="Connected Works" active={isActive('/dashboard/integrations')} />
                     <div className="h-px bg-white/10 my-2" />
                     <MobileSubNavItem href="/dashboard/trash" label="Trash" active={isActive('/dashboard/trash')} />
                   </div>
                 </div>

                 {/* Menu Lainnya */}
                 <MobileNavItem href="/dashboard/explore" icon={<Compass className="w-5 h-5" />} label="Explore" active={isActive('/dashboard/explore')} className="mt-2" />
                 <MobileNavItem href="/dashboard/analytics" icon={<PieChart className="w-5 h-5" />} label="Metrics" active={isActive('/dashboard/analytics')} />

                 <div className="px-5 pt-6 pb-2">
                   <p className="text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.25em]">Pengaturan</p>
                 </div>

                 <MobileNavItem href="/dashboard/profile" icon={<User className="w-5 h-5" />} label="Profil & Bio" active={isActive('/dashboard/profile')} />
                 <MobileNavItem href="/support" icon={<HelpCircle className="w-5 h-5" />} label="Bantuan" active={isActive('/support')} />
                 <MobileNavItem href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={isActive('/dashboard/settings')} />
                 
                 {/* Menu Admin (Dengan Submenu Accordion) */}
                 {userRole === 'ADMIN' && (
                   <div className="pt-2">
                     <button onClick={() => setIsMobileAdminMenuOpen(!isMobileAdminMenuOpen)} className={`w-full flex items-center transition-all duration-300 group py-3 rounded-none px-4 justify-between ${isAdminRoute ? 'text-violet-400' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                       <div className="flex items-center gap-4">
                         <Terminal className={`w-5 h-5 ${isAdminRoute ? 'text-violet-400' : 'text-white/40'}`} /> 
                         <span className="font-mono text-xs font-bold tracking-wider uppercase">Developer Hub</span>
                       </div>
                       <ChevronDown className={`w-4 h-4 text-white/40 transition-transform duration-300 ${isMobileAdminMenuOpen ? 'rotate-180' : ''}`} />
                     </button>

                     {/* Submenu Inline (Accordion) */}
                     <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMobileAdminMenuOpen ? 'max-h-60 py-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
                       <MobileSubNavItem href="/dashboard/admin/architecture" label="TDD Plan" active={isActive('/dashboard/admin/architecture')} />
                       <MobileSubNavItem href="/dashboard/admin/ideas" label="Feature Backlog" active={isActive('/dashboard/admin/ideas')} />
                       <MobileSubNavItem href="/dashboard/admin/errors" label="System Logs" active={isActive('/dashboard/admin/errors')} />
                       <MobileSubNavItem href="/dashboard/admin/features" label="Feature Flags" active={isActive('/dashboard/admin/features')} />
                     </div>
                   </div>
                 )}
               </>
            )}
          </nav>
          
          <div className="shrink-0 border-t border-white/5 bg-black z-10 p-4">
            {isLoading ? (
               <div className="h-28 w-full skeleton-premium rounded-none"></div>
            ) : userPlan === 'FREE' ? (
              <div className="relative overflow-hidden bg-zinc-950 p-4 rounded-none border border-white/10">
                <Crown className="absolute -bottom-4 -right-3 w-16 h-16 text-white opacity-[0.02] transform rotate-12" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[9px] font-mono font-bold uppercase tracking-widest text-[#ff9e00] mb-3">
                    <Crown className="w-3 h-3" /> PRO
                  </div>
                  <Link href="/pricing" className="block w-full text-center bg-[#ff9e00] text-black text-[10px] font-mono font-bold tracking-widest uppercase py-2.5 px-2 rounded-none hover:bg-[#ffaa22] active:scale-95 transition-all">
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-zinc-900 border border-white/10 p-4 rounded-none group">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className={`text-[9px] font-mono font-bold tracking-widest uppercase mb-1 ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`}>Status</p>
                    <p className="text-xs font-mono font-bold text-white">{userPlan === 'SUPREME' ? 'Supreme Creator' : 'Pro Creator'}</p>
                  </div>
                  <CheckCircle className={`w-5 h-5 ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`} />
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>

    </div>
  );
}

// --------------------------------------------------------
// DESKTOP COMPONENTS
// --------------------------------------------------------
function RailItem({ href, icon, label, active }: { href: string, icon: React.ReactNode, label: string, active: boolean }) {
  return (
    <Link 
      href={href} 
      className="flex flex-col items-center justify-center py-2.5 w-full transition-all duration-300 group relative"
    >
      <div className={`relative flex items-center justify-center w-10 h-10 transition-all duration-300 ${
        active 
          ? 'bg-zinc-900 border border-white/10 text-white' 
          : 'bg-transparent hover:bg-white/5 text-white/40 group-hover:text-white/80 active:scale-95'
      }`}>
        {icon}
        
        {/* Orange Accent Dot */}
        {active && (
          <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#ff9e00] border border-black rounded-full shadow-sm"></div>
        )}
      </div>
      
      <span className={`mt-1.5 text-[8px] font-mono font-bold uppercase tracking-widest transition-all duration-300 ${
        active ? 'text-white' : 'text-white/40 group-hover:text-white/70'
      }`}>
        {label}
      </span>
    </Link>
  );
}

// Komponen Item untuk Secondary Sidebar
function SecondaryNavItem({ href, icon, label, active, count, highlightText }: { href: string, icon: React.ReactNode, label: string, active: boolean, count?: number, highlightText?: string }) {
  return (
    <Link href={href} className={`flex items-center justify-between px-3 py-2.5 font-mono text-[11px] uppercase tracking-wider transition-all duration-200 group relative ${active ? 'bg-white/5 text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
      
      {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 h-2/3 w-[2px] bg-[#ff9e00]"></div>}

      <div className="flex items-center transition-transform duration-200 group-hover:translate-x-1">
        <span className={`mr-2.5 transition-colors ${active ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}>
          {icon}
        </span>
        <span className="font-bold">{label}</span>
      </div>
      
      <div className="transition-transform duration-200 group-hover:-translate-x-0.5 shrink-0 ml-2">
        {highlightText ? (
          <span className="text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wide bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/25">
            {highlightText}
          </span>
        ) : count !== undefined ? (
          <span className={`text-[9px] px-1.5 py-0.5 transition-colors ${active ? 'bg-zinc-900 text-white border border-white/10' : 'bg-white/5 text-white/40 group-hover:bg-white/10'}`}>
            {count}
          </span>
        ) : null}
      </div>
    </Link>
  );
}

// --------------------------------------------------------
// MOBILE COMPONENTS
// --------------------------------------------------------
function MobileNavItem({ href, icon, label, active, className = "" }: { href: string, icon: React.ReactNode, label: string, active: boolean, className?: string }) {
  return (
    <Link href={href} className={`w-full flex items-center py-3.5 rounded-none transition-all duration-300 group px-4 gap-4 ${active ? 'bg-zinc-900 text-white border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'} ${className}`}>
      <span className={active ? 'text-[#ff9e00]' : 'text-white/40 group-hover:text-white/60'}>
        {icon}
      </span>
      <span className="font-mono text-xs font-bold tracking-wider uppercase">{label}</span>
    </Link>
  );
}

function MobileSubNavItem({ href, label, active, count, highlightText }: { href: string, label: string, active: boolean, count?: number, highlightText?: string }) {
  return (
    <Link href={href} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-none font-mono text-xs transition-all relative ${active ? 'text-white bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
      <div className="flex items-center">
        {active && <div className="absolute left-0 w-0.5 h-1/2 bg-[#ff9e00]"></div>} 
        <span className={active ? '' : 'pl-1'}>{label}</span>
      </div>
      {highlightText ? (
        <span className="text-[8px] px-1.5 py-0.5 font-bold uppercase tracking-wide bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20">
          {highlightText}
        </span>
      ) : count !== undefined ? (
        <span className={`text-[9px] px-1.5 py-0.5 transition-colors ${active ? 'bg-zinc-900 text-white border border-white/10' : 'bg-white/5 text-white/40'}`}>
          {count}
        </span>
      ) : null}
    </Link>
  );
}
