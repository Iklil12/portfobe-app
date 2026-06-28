"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LazyImage } from '@/shared/ui/LazyImage';
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
  X,
  PanelLeftClose,
  PanelLeft
} from 'lucide-react';

interface SidebarProps {
  isLoading: boolean;
  userPlan: string;
  isSidebarOpen: boolean;
  projectsCount?: number;
  linksCount?: number;
  testimonialsCount?: number;
  userRole?: string;
  isDesktopSidebarOpen?: boolean;
  onToggleDesktopSidebar?: () => void;
}

export function Sidebar({ isLoading, userPlan, isSidebarOpen, projectsCount = 0, linksCount = 0, testimonialsCount = 0, userRole = 'USER', isDesktopSidebarOpen = true, onToggleDesktopSidebar }: SidebarProps) {
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
      {/* DESKTOP SIDEBAR (SINGLE PANE TREE LAYOUT)                      */}
      {/* ============================================================== */}
      <div className={`hidden md:flex h-full shrink-0 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-visible ${isDesktopSidebarOpen ? 'w-[240px]' : 'w-[72px]'}`}>
        <aside className="w-full bg-[#0a0a0a] border-r border-white/10 flex flex-col h-full z-20 shrink-0">
          <div className={`h-[72px] shrink-0 flex items-center relative border-b border-white/5 transition-all duration-300 ${isDesktopSidebarOpen ? 'justify-between px-6' : 'justify-center px-0'}`}>
            {!isDesktopSidebarOpen ? (
              <button onClick={onToggleDesktopSidebar} className="w-12 h-12 flex items-center justify-center text-white/60 hover:text-[#ff9e00] transition-colors">
                <PanelLeft className="w-5 h-5" />
              </button>
            ) : (
              <>
                <Link href="/dashboard" className="flex items-center group cursor-pointer">
                   <img src="/portfo.be.webp" alt="Portfo.be Logo" className="h-6 w-auto object-contain invert brightness-0 group-hover:opacity-80 transition-opacity" />
                </Link>
                <button onClick={onToggleDesktopSidebar} className="w-6 h-6 flex items-center justify-center text-white/60 hover:text-[#ff9e00] transition-colors">
                  <PanelLeftClose className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <nav className={`flex-1 py-2 hide-scrollbar space-y-0.5 ${isDesktopSidebarOpen ? 'px-3 overflow-y-auto' : 'px-2 overflow-visible'}`}>
            {isLoading ? (
               <div className="flex flex-col gap-1">
                  {[1,2,3,4,5].map(i => <div key={i} className={`w-full h-11 skeleton-premium rounded-md ${!isDesktopSidebarOpen && 'h-11'}`}></div>)}
               </div>
            ) : (
               <>
                  <PrimaryNavItem href="/dashboard" icon={<LayoutGrid className="w-[18px] h-[18px]" />} label="Overview" active={isActive('/dashboard')} isCollapsed={!isDesktopSidebarOpen} />
                  
                  <TreeAccordion 
                    id="tour-design-menu"
                    icon={<Palette className="w-[18px] h-[18px]" />} 
                    label="Design" 
                    isOpen={isMobileDesignMenuOpen} 
                    onToggle={() => {
                      if (!isDesktopSidebarOpen) {
                        onToggleDesktopSidebar?.();
                        if (!isMobileDesignMenuOpen) setIsMobileDesignMenuOpen(true);
                      } else {
                        setIsMobileDesignMenuOpen(!isMobileDesignMenuOpen);
                      }
                    }}
                    active={isDesignRoute}
                    isCollapsed={!isDesktopSidebarOpen}
                  >
                    <TreeChildItem id="tour-add-project" href="/dashboard/projects" label="Projects & Works" active={isActive('/dashboard/projects')} count={projectsCount} />
                    <TreeChildItem href="/dashboard/themes" label="Theme Collection" active={isActive('/dashboard/themes')} />
                    <TreeChildItem href="/dashboard/build-with-ai" label="Build with AI" active={isActive('/dashboard/build-with-ai')} countText="AI" countColor="bg-[#ff9e00]/20 text-[#ff9e00]" />
                    <TreeChildItem id="tour-links" href="/dashboard/links" label="Links" active={isActive('/dashboard/links')} count={linksCount} />
                    <TreeChildItem href="/dashboard/testimonials" label="Testimonials" active={isActive('/dashboard/testimonials')} count={testimonialsCount} />
                    <TreeChildItem href="/dashboard/integrations" label="Connected Works" active={isActive('/dashboard/integrations')} />
                    <TreeChildItem href="/dashboard/trash" label="Trash" active={isActive('/dashboard/trash')} isLast />
                  </TreeAccordion>

                  <PrimaryNavItem href="/dashboard/explore" icon={<Compass className="w-[18px] h-[18px]" />} label="Explore" active={isActive('/dashboard/explore')} isCollapsed={!isDesktopSidebarOpen} />
                  <PrimaryNavItem href="/dashboard/analytics" icon={<PieChart className="w-[18px] h-[18px]" />} label="Metrics" active={isActive('/dashboard/analytics')} isCollapsed={!isDesktopSidebarOpen} />
                  <PrimaryNavItem id="tour-profile-menu" href="/dashboard/profile" icon={<User className="w-[18px] h-[18px]" />} label="Profile" active={isActive('/dashboard/profile')} isCollapsed={!isDesktopSidebarOpen} />
               </>
            )}
          </nav>

          {/* Utility Nav */}
          <div className={`shrink-0 flex flex-col pt-2 pb-2 border-t border-white/5 space-y-0.5 mt-auto ${isDesktopSidebarOpen ? 'px-3' : 'px-2'}`}>
            {isLoading ? (
               <div className="flex flex-col gap-1">
                  {[1,2].map(i => <div key={i} className="w-full h-11 skeleton-premium rounded-md"></div>)}
               </div>
            ) : (
              <>
                <PrimaryNavItem href="/support" icon={<HelpCircle className="w-[18px] h-[18px]" />} label="Support" active={isActive('/support')} isCollapsed={!isDesktopSidebarOpen} />
                <PrimaryNavItem href="/dashboard/settings" icon={<Settings className="w-[18px] h-[18px]" />} label="Settings" active={isActive('/dashboard/settings')} isCollapsed={!isDesktopSidebarOpen} />
                
                {userRole === 'ADMIN' && (
                  <TreeAccordion 
                    icon={<Terminal className="w-[18px] h-[18px]" />} 
                    label="Developer Hub" 
                    isOpen={isMobileAdminMenuOpen} 
                    onToggle={() => {
                      if (!isDesktopSidebarOpen) {
                        onToggleDesktopSidebar?.();
                        if (!isMobileAdminMenuOpen) setIsMobileAdminMenuOpen(true);
                      } else {
                        setIsMobileAdminMenuOpen(!isMobileAdminMenuOpen);
                      }
                    }}
                    active={isAdminRoute}
                    isCollapsed={!isDesktopSidebarOpen}
                    popoverDirection="up"
                  >
                    <TreeChildItem href="/dashboard/admin/architecture" label="TDD Plan" active={isActive('/dashboard/admin/architecture')} />
                    <TreeChildItem href="/dashboard/admin/ideas" label="Feature Backlog" active={isActive('/dashboard/admin/ideas')} />
                    <TreeChildItem href="/dashboard/admin/errors" label="System Logs" active={isActive('/dashboard/admin/errors')} />
                    <TreeChildItem href="/dashboard/admin/features" label="Feature Flags" active={isActive('/dashboard/admin/features')} isLast />
                  </TreeAccordion>
                )}
              </>
            )}
          </div>
          
          {/* User Plan Indicator in Rail */}
          <div className={`shrink-0 pb-6 pt-2 flex justify-center ${isDesktopSidebarOpen ? 'px-3' : 'px-2'}`}>
             {isLoading ? (
                <div className="w-full h-11 skeleton-premium rounded-md"></div>
             ) : userPlan === 'FREE' ? (
               isDesktopSidebarOpen ? (
                 <Link href="/pricing" className="w-full py-3 px-3 bg-zinc-900 rounded-md flex items-center justify-between group shadow-sm border border-white/10 hover:bg-zinc-800 transition-colors" title="Upgrade to PRO">
                    <div className="flex items-center gap-2">
                      <Crown className="text-[#ff9e00] w-4 h-4 group-hover:scale-110 transition-transform" />
                      <span className="text-[10px] font-sans font-medium text-white">UPGRADE PRO</span>
                    </div>
                    <div className="text-[8px] font-sans text-[#ff9e00] border border-[#ff9e00]/30 bg-[#ff9e00]/10 px-1 py-0.5 ml-auto mr-1">TRIAL</div>
                    <div className="w-1.5 h-1.5 bg-red-500 rounded-md border border-black shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                 </Link>
               ) : (
                 <Link href="/pricing" className="w-full h-11 bg-zinc-900 rounded-md flex items-center justify-center group shadow-sm border border-white/10 hover:bg-zinc-800 transition-colors" title="Upgrade to PRO">
                    <Crown className="text-[#ff9e00] w-4 h-4 group-hover:scale-110 transition-transform" />
                 </Link>
               )
             ) : (
               isDesktopSidebarOpen ? (
                 <div className={`w-full py-3 px-3 rounded-md flex items-center gap-2 border ${userPlan === 'SUPREME' ? 'bg-violet-950/30 border-violet-500/30' : 'bg-zinc-900 border-white/10'}`}>
                    <Gem className={`w-4 h-4 shrink-0 ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`} />
                    <span className={`text-[10px] font-sans font-medium truncate ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`}>
                      {userPlan === 'SUPREME' ? 'Supreme' : 'Pro'}
                    </span>
                 </div>
               ) : (
                 <div className={`w-full h-11 rounded-md flex items-center justify-center border ${userPlan === 'SUPREME' ? 'bg-violet-950/30 border-violet-500/30' : 'bg-zinc-900 border-white/10'}`} title={userPlan === 'SUPREME' ? 'Supreme Plan' : 'Pro Plan'}>
                    <Gem className={`w-4 h-4 shrink-0 ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`} />
                 </div>
               )
             )}
          </div>
        </aside>
      </div>


      {/* ============================================================== */}
      {/* MOBILE SIDEBAR (SINGLE PANE LAYOUT WITH ACCORDION)             */}
      {/* ============================================================== */}
      <div className="flex md:hidden h-full w-[280px]">
        <aside className="w-full bg-black border-r border-white/10 flex flex-col h-full">
          <div className="h-[88px] shrink-0 flex items-center justify-between px-6 border-b border-white/5">
            {isLoading ? (
              <div className="h-8 w-28 skeleton-premium rounded-md"></div>
            ) : (
              <Link href="/" className="flex items-center group cursor-pointer">
                 <img src="/portfo.be.webp" alt="Portfo.be Logo" className="h-9 w-auto object-contain invert brightness-0" />
              </Link>
            )}
          </div>

          <nav className="flex-1 space-y-1 mt-4 overflow-y-auto hide-scrollbar px-4">
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-11 w-full skeleton-premium rounded-md"></div>
                ))}
              </div>
            ) : (
               <>
                 {/* Menu Overview */}
                 <MobileNavItem href="/dashboard" icon={<LayoutGrid className="w-5 h-5" />} label="Overview" active={isActive('/dashboard')} />
                 
                 {/* Menu Desain (Dengan Submenu Accordion) */}
                 <div className="pt-2">
                   <button id="tour-mobile-design-menu" onClick={() => setIsMobileDesignMenuOpen(!isMobileDesignMenuOpen)} className={`w-full flex items-center transition-all duration-300 group py-3 rounded-md px-4 justify-between ${isDesignRoute ? 'text-white' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                     <div className="flex items-center gap-4">
                       <Palette className={`w-5 h-5 ${isDesignRoute ? 'text-white' : 'text-white/60'}`} /> 
                       <span className="font-mono text-xs font-medium">Design</span>
                     </div>
                     <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isMobileDesignMenuOpen ? 'rotate-180' : ''}`} />
                   </button>

                   {/* Submenu Inline (Accordion) */}
                   <div className={`flex flex-col pl-[3.25rem] pr-2 space-y-1 overflow-hidden transition-all duration-300 ease-in-out ${isMobileDesignMenuOpen ? 'max-h-80 py-2 opacity-100' : 'max-h-0 py-0 opacity-0 pointer-events-none'}`}>
                     <MobileSubNavItem href="/dashboard/projects" label="Projects & Works" active={isActive('/dashboard/projects')} count={projectsCount} />
                     <MobileSubNavItem href="/dashboard/themes" label="Theme Collection" active={isActive('/dashboard/themes')} />
                     <MobileSubNavItem href="/dashboard/build-with-ai" label="Build with AI" active={isActive('/dashboard/build-with-ai')} highlightText="Soon" />
                     <MobileSubNavItem href="/dashboard/links" label="Links" active={isActive('/dashboard/links')} count={linksCount} />
                     <MobileSubNavItem href="/dashboard/testimonials" label="Testimonials" active={isActive('/dashboard/testimonials')} count={testimonialsCount} />
                     <MobileSubNavItem href="/dashboard/integrations" label="Connected Works" active={isActive('/dashboard/integrations')} />
                     <div className="h-px bg-white/10 my-2" />
                     <MobileSubNavItem href="/dashboard/trash" label="Trash" active={isActive('/dashboard/trash')} />
                   </div>
                 </div>

                 {/* Menu Lainnya */}
                 <MobileNavItem href="/dashboard/explore" icon={<Compass className="w-5 h-5" />} label="Explore" active={isActive('/dashboard/explore')} className="mt-2" />
                 <MobileNavItem href="/dashboard/analytics" icon={<PieChart className="w-5 h-5" />} label="Metrics" active={isActive('/dashboard/analytics')} />

                 <div className="px-5 pt-6 pb-2">
                   <p className="text-[9px] font-sans font-medium text-white/50 tracking-[0.25em]">Settings</p>
                 </div>

                 <MobileNavItem id="tour-mobile-profile-menu" href="/dashboard/profile" icon={<User className="w-5 h-5" />} label="Profile & Bio" active={isActive('/dashboard/profile')} />
                 <MobileNavItem href="/support" icon={<HelpCircle className="w-5 h-5" />} label="Support" active={isActive('/support')} />
                 <MobileNavItem href="/dashboard/settings" icon={<Settings className="w-5 h-5" />} label="Settings" active={isActive('/dashboard/settings')} />
                 
                 {/* Menu Admin (Dengan Submenu Accordion) */}
                 {userRole === 'ADMIN' && (
                   <div className="pt-2">
                     <button onClick={() => setIsMobileAdminMenuOpen(!isMobileAdminMenuOpen)} className={`w-full flex items-center transition-all duration-300 group py-3 rounded-md px-4 justify-between ${isAdminRoute ? 'text-violet-400' : 'text-white/50 hover:bg-white/5 hover:text-white'}`}>
                       <div className="flex items-center gap-4">
                         <Terminal className={`w-5 h-5 ${isAdminRoute ? 'text-violet-400' : 'text-white/60'}`} /> 
                         <span className="font-mono text-xs font-medium">Developer Hub</span>
                       </div>
                       <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isMobileAdminMenuOpen ? 'rotate-180' : ''}`} />
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
               <div className="h-28 w-full skeleton-premium rounded-md"></div>
            ) : userPlan === 'FREE' ? (
              <div className="relative overflow-hidden bg-zinc-950 p-4 rounded-md border border-white/10">
                <Crown className="absolute -bottom-4 -right-3 w-16 h-16 text-white opacity-[0.02] transform rotate-12" />
                <div className="relative z-10">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-[#ff9e00]/20 bg-[#ff9e00]/5 text-[9px] font-sans font-medium text-[#ff9e00] mb-3">
                    <Crown className="w-3 h-3" /> PRO
                  </div>
                  <Link href="/pricing" className="block w-full text-center bg-[#ff9e00] text-black text-[10px] font-sans font-medium py-2.5 px-2 rounded-md hover:bg-[#ffaa22] active:scale-95 transition-all">
                    Upgrade
                  </Link>
                </div>
              </div>
            ) : (
              <div className="relative overflow-hidden bg-zinc-900 border border-white/10 p-4 rounded-md group">
                <div className="relative z-10 flex items-center justify-between">
                  <div>
                    <p className={`text-[9px] font-sans font-medium mb-1 ${userPlan === 'SUPREME' ? 'text-violet-400' : 'text-[#ff9e00]'}`}>Status</p>
                    <p className="text-xs font-sans font-medium text-white">{userPlan === 'SUPREME' ? 'Supreme Creator' : 'Pro Creator'}</p>
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
function PrimaryNavItem({ href, icon, label, active, isCollapsed, id }: { href: string, icon: React.ReactNode, label: string, active: boolean, isCollapsed?: boolean, id?: string }) {
  return (
    <Link 
      id={id}
      href={href} 
      className={`flex items-center w-full py-2 rounded-md transition-all duration-300 group ${ active ? 'bg-zinc-900 border border-white/10 text-white shadow-sm' : 'text-white/60 hover:bg-white/5 hover:text-white' } ${isCollapsed ? 'px-0 justify-center' : 'px-3'}`}
      title={isCollapsed ? label : undefined}
    >
      <div className={`shrink-0 transition-transform duration-300 ${active ? 'scale-110 text-[#ff9e00]' : 'group-hover:scale-110'}`}>
        {icon}
      </div>
      {!isCollapsed && (
        <>
          <span className="ml-3 text-[13px] font-sans font-medium tracking-wide truncate">
            {label}
          </span>
          {active && (
            <div className="ml-auto w-6 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 bg-[#ff9e00] rounded-md border border-black shadow-[0_0_8px_rgba(255,158,0,0.5)]"></div>
            </div>
          )}
        </>
      )}
    </Link>
  );
}

function TreeAccordion({ 
  icon, label, isOpen, onToggle, active, isCollapsed, popoverDirection = 'down', children, id 
}: { 
  icon: React.ReactNode, label: string, isOpen: boolean, onToggle: () => void, active?: boolean, isCollapsed?: boolean, popoverDirection?: 'up' | 'down', children: React.ReactNode, id?: string 
}) {
  return (
    <div id={id} className="flex flex-col w-full relative group/accordion">
      <button 
        onClick={onToggle} 
        className={`flex items-center w-full py-2 transition-colors group rounded-md ${ isOpen || active ? 'text-white' : 'text-white/60 hover:bg-white/5 hover:text-white' } ${isCollapsed ? 'justify-center px-0' : 'justify-between px-3'}`}
        title={isCollapsed ? label : undefined}
      >
        <div className={`flex items-center ${isCollapsed ? '' : 'gap-3'}`}>
          <div className={`shrink-0 transition-transform duration-300 ${(isOpen || active) ? 'scale-110 text-[#ff9e00]' : 'group-hover:scale-110'}`}>{icon}</div>
          {!isCollapsed && <span className="text-[13px] font-sans font-medium tracking-wide">{label}</span>}
        </div>
        {!isCollapsed && (
          <div className="w-6 flex items-center justify-center shrink-0">
            <ChevronDown className={`w-4 h-4 text-white/60 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        )}
      </button>

      {!isCollapsed && (
        <div className={`overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'max-h-[500px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
          <div className="relative flex flex-col gap-0.5 pb-2">
            {children}
          </div>
        </div>
      )}

      {/* Floating Popover on Hover (Collapsed State) */}
      {isCollapsed && (
        <div className={`absolute left-[calc(100%+8px)] ${popoverDirection === 'up' ? 'bottom-0' : 'top-0'} w-52 bg-[#0a0a0a] border border-white/10 shadow-2xl opacity-0 invisible group-hover/accordion:opacity-100 group-hover/accordion:visible transition-all duration-200 z-50 rounded-md transform translate-x-[-10px] group-hover/accordion:translate-x-0`}>
          <div className="px-4 py-3 border-b border-white/5 bg-zinc-900/50">
            <span className="text-[10px] font-sans font-medium text-white/60">{label}</span>
          </div>
          <div className="flex flex-col p-1.5 gap-0.5">
            {React.Children.map(children, child => {
              if (React.isValidElement(child)) {
                return React.cloneElement(child, { isFloating: true } as any);
              }
              return child;
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function TreeChildItem({ href, label, active, count, countText, countColor, isLast, isFloating, id }: { href: string, label: string, active: boolean, count?: number, countText?: string, countColor?: string, isLast?: boolean, isFloating?: boolean, id?: string }) {
  return (
    <div className={`relative flex items-center w-full group ${isFloating ? 'px-0 py-0' : 'px-2 py-0.5'}`}>
      {/* Brutalist Sharp Connector Lines */}
      {!isFloating && (
        <>
          <div className={`absolute left-[18px] top-0 w-[14px] border-l border-b border-white/20 group-hover:border-white/40 transition-colors ${isLast ? 'bottom-1/2' : 'h-1/2'}`}></div>
          {!isLast && (
             <div className="absolute left-[18px] top-1/2 bottom-[-4px] border-l border-white/20 group-hover:border-white/40 transition-colors z-0"></div>
          )}
        </>
      )}
      
      {/* Clickable item */}
      <Link id={id} href={href} className={`${isFloating ? 'ml-0 px-3 py-1.5 w-full' : 'ml-[24px] flex-1 px-3 py-1.5'} flex items-center justify-between rounded-md transition-colors duration-200 z-10 border border-transparent ${ active ? 'bg-zinc-900 border-white/10 text-white' : 'text-white/50 hover:bg-white/5 hover:border-white/5 hover:text-white' }`}>
        <span className="text-[12px] font-sans font-medium">{label}</span>
        {(count !== undefined || countText) && (
          <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-sans leading-none flex items-center justify-center border ${ countColor ? countColor + ' border-transparent' : (active ? 'bg-[#ff9e00] text-black border-black font-medium' : 'bg-white/10 text-white/60 border-transparent') }`}>{countText || count}</span>
        )}
      </Link>
    </div>
  );
}

// --------------------------------------------------------
// MOBILE COMPONENTS
// --------------------------------------------------------
function MobileNavItem({ href, icon, label, active, className = "", id }: { href: string, icon: React.ReactNode, label: string, active: boolean, className?: string, id?: string }) {
  return (
    <Link id={id} href={href} className={`w-full flex items-center py-3.5 rounded-md transition-all duration-300 group px-4 gap-4 ${active ? 'bg-zinc-900 text-white border border-white/10' : 'text-white/50 hover:bg-white/5 hover:text-white'} ${className}`}>
      <span className={active ? 'text-[#ff9e00]' : 'text-white/40 group-hover:text-white/60'}>
        {icon}
      </span>
      <span className="font-mono text-xs font-medium">{label}</span>
    </Link>
  );
}

function MobileSubNavItem({ href, label, active, count, highlightText }: { href: string, label: string, active: boolean, count?: number, highlightText?: string }) {
  return (
    <Link href={href} className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md font-mono text-xs transition-all relative ${active ? 'text-white bg-white/5' : 'text-white/50 hover:text-white hover:bg-white/5'}`}>
      <div className="flex items-center">
        {active && <div className="absolute left-0 w-0.5 h-1/2 bg-[#ff9e00]"></div>} 
        <span className={active ? '' : 'pl-1'}>{label}</span>
      </div>
      {highlightText ? (
        <span className="text-[8px] px-1.5 py-0.5 font-medium tracking-wide bg-[#ff9e00]/10 text-[#ff9e00] border border-[#ff9e00]/20">
          {highlightText}
        </span>
      ) : count !== undefined ? (
        <span className={`text-[9px] px-1.5 py-0.5 transition-colors ${active ? 'bg-zinc-900 text-white border border-white/10' : 'bg-white/5 text-white/60'}`}>
          {count}
        </span>
      ) : null}
    </Link>
  );
}
