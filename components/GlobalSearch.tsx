// components/GlobalSearch.tsx
"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import toast from "react-hot-toast";
import useSWR from "swr";
import { useSession, signOut } from "next-auth/react";
import Fuse from "fuse.js";
import { useDebounce } from "use-debounce";
import { useTranslations } from "next-intl";
import { 
  Search, 
  Sparkles, 
  Link as LinkIcon, 
  Palette, 
  FolderOpen, 
  Award, 
  MessageSquare, 
  ShieldAlert, 
  Copy, 
  PlusCircle, 
  Ghost, 
  Info, 
  ChevronRight,
  Terminal,
  ArrowRight
} from "lucide-react";

// =========================================================================
// 1. DATA MENU STATIS
// =========================================================================
const APP_COMMANDS = [
  { id: "nav-1", title: "Dashboard Overview", group: "Navigation", icon: "folder", link: "/dashboard", type: "link", keywords: "beranda utama home" },
  { id: "nav-2", title: "Metrics & Analytics", group: "Navigation", icon: "metrics", link: "/dashboard/analytics", type: "link", keywords: "statistik grafik pengunjung views" },
  { id: "nav-3", title: "Visitor History", group: "Navigation", icon: "history", link: "/dashboard/analytics?tab=history", type: "link", keywords: "log riwayat history siapa yang lihat" },
  { id: "des-1", title: "Projects & Work", group: "Design & Content", icon: "folder", link: "/dashboard/projects", type: "link", keywords: "portfolio list karya desain" },
  { id: "des-2", title: "Theme Collection", group: "Design & Content", icon: "palette", link: "/dashboard/themes", type: "link", keywords: "warna tampilan baju warna-warni themes" },
  { id: "des-3", title: "Manage Links", group: "Design & Content", icon: "link", link: "/dashboard/links", type: "link", keywords: "sosmed sosial media url tautan" },
  { id: "des-4", title: "SEO Settings", group: "Design & Content", icon: "search", link: "/dashboard/settings?tab=seo", type: "link", keywords: "google pencarian meta tag seo" },
  { id: "app-1", title: "Change Button Shape", group: "Web Appearance", icon: "shapes", link: "/dashboard/themes?focus=buttonShape", type: "link", keywords: "button shape tombol kotak bulat pill" },
  { id: "app-2", title: "Change Main Color", group: "Web Appearance", icon: "fill", link: "/dashboard/themes?focus=themeColor", type: "link", keywords: "warna color theme aksen" },
  { id: "app-3", title: "Change Font (Typography)", group: "Web Appearance", icon: "font", link: "/dashboard/themes?focus=fonts", type: "link", keywords: "font huruf tulisan tipografi" },
  { id: "app-4", title: "Set Card Style", group: "Web Appearance", icon: "card", link: "/dashboard/themes?focus=cardStyle", type: "link", keywords: "card kartu kotak bayangan glass" },
  { id: "pro-1", title: "Change WhatsApp Number", group: "Account Settings", icon: "whatsapp", link: "/dashboard/profile?focus=whatsapp", type: "link", keywords: "wa whatsapp nomor kontak hp" },
  { id: "pro-2", title: "Status 'Available for Hire'", group: "Account Settings", icon: "hire", link: "/dashboard/profile?focus=hire", type: "link", keywords: "hire kerja open freelance buka" },
  { id: "set-1", title: "Edit Profile & Bio", group: "Account Settings", icon: "profile", link: "/dashboard/profile", type: "link", keywords: "deskripsi tentang saya bio profil" },
  { id: "set-2", title: "Security & Password", group: "Account Settings", icon: "key", link: "/dashboard/settings?tab=security", type: "link", keywords: "keamanan sandi kata kunci ubah password" },
  { id: "act-1", title: "Create New Project", group: "Quick Actions", icon: "plus", link: "/dashboard/projects?action=new", type: "link", keywords: "tambah bikin portofolio baru" },
  { id: "act-2", title: "Copy Portfolio Link", group: "Quick Actions", icon: "copy", action: "copy_link", type: "action", keywords: "copy share bagikan url salin" },
];

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function GlobalSearch() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [debouncedQuery] = useDebounce(query, 500);
  
  const [mounted, setMounted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); 
  
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const t = useTranslations('GlobalSearch');

  useEffect(() => { setMounted(true); }, []);

  const APP_COMMANDS_TRANSLATED = useMemo(() => [
  { id: "nav-1", title: t('navOverview'), group: t('grpNav'), icon: "folder", link: "/dashboard", type: "link", keywords: "beranda utama home" },
  { id: "nav-2", title: t('navMetrics'), group: t('grpNav'), icon: "metrics", link: "/dashboard/analytics", type: "link", keywords: "statistik grafik pengunjung views" },
  { id: "nav-3", title: t('navHistory'), group: t('grpNav'), icon: "history", link: "/dashboard/analytics?tab=history", type: "link", keywords: "log riwayat history siapa yang lihat" },
  { id: "des-1", title: t('desProjects'), group: t('grpDes'), icon: "folder", link: "/dashboard/projects", type: "link", keywords: "portfolio list karya desain" },
  { id: "des-2", title: t('desThemes'), group: t('grpDes'), icon: "palette", link: "/dashboard/themes", type: "link", keywords: "warna tampilan baju warna-warni themes" },
  { id: "des-3", title: t('desLinks'), group: t('grpDes'), icon: "link", link: "/dashboard/links", type: "link", keywords: "sosmed sosial media url tautan" },
  { id: "des-4", title: t('desSeo'), group: t('grpDes'), icon: "search", link: "/dashboard/settings?tab=seo", type: "link", keywords: "google pencarian meta tag seo" },
  { id: "app-1", title: t('appButton'), group: t('grpApp'), icon: "shapes", link: "/dashboard/themes?focus=buttonShape", type: "link", keywords: "button shape tombol kotak bulat pill" },
  { id: "app-2", title: t('appColor'), group: t('grpApp'), icon: "fill", link: "/dashboard/themes?focus=themeColor", type: "link", keywords: "warna color theme aksen" },
  { id: "app-3", title: t('appFont'), group: t('grpApp'), icon: "font", link: "/dashboard/themes?focus=fonts", type: "link", keywords: "font huruf tulisan tipografi" },
  { id: "app-4", title: t('appCard'), group: t('grpApp'), icon: "card", link: "/dashboard/themes?focus=cardStyle", type: "link", keywords: "card kartu kotak bayangan glass" },
  { id: "pro-1", title: t('proWa'), group: t('grpSet'), icon: "whatsapp", link: "/dashboard/profile?focus=whatsapp", type: "link", keywords: "wa whatsapp nomor kontak hp" },
  { id: "pro-2", title: t('proHire'), group: t('grpSet'), icon: "hire", link: "/dashboard/profile?focus=hire", type: "link", keywords: "hire kerja open freelance buka" },
  { id: "set-1", title: t('setProfile'), group: t('grpSet'), icon: "profile", link: "/dashboard/profile", type: "link", keywords: "deskripsi tentang saya bio profil" },
  { id: "set-2", title: t('setSecurity'), group: t('grpSet'), icon: "key", link: "/dashboard/settings?tab=security", type: "link", keywords: "keamanan sandi kata kunci ubah password" },
  { id: "act-1", title: t('actNew'), group: t('grpAct'), icon: "plus", link: "/dashboard/projects?action=new", type: "link", keywords: "tambah bikin portofolio baru" },
  { id: "act-2", title: t('actCopy'), group: t('grpAct'), icon: "copy", action: "copy_link", type: "action", keywords: "copy share bagikan url salin" },
], [t]);

  const fuse = useMemo(() => new Fuse(APP_COMMANDS_TRANSLATED, {
    keys: ["title", "keywords", "group"],
    threshold: 0.3,
  }), []);

  const { data: dbResults, isLoading: isSearchingDB } = useSWR(
    debouncedQuery.length >= 2 ? `/api/search?q=${debouncedQuery}` : null,
    fetcher
  );

  const filteredResults = useMemo(() => {
    if (!query) return APP_COMMANDS_TRANSLATED;

    const fuseResults = fuse.search(query).map(res => res.item);
    const remoteResults = dbResults && Array.isArray(dbResults) ? dbResults : [];
    
    return [...remoteResults, ...fuseResults];
  }, [query, dbResults, fuse]);

  const isCurrentlyWaiting = query !== debouncedQuery || isSearchingDB;

  useEffect(() => { setSelectedIndex(0); }, [query]);

  // Shortcut Keyboard
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen(true);
      }
      if (!isOpen) return;
      if (e.key === "Escape") setIsOpen(false);

      if (filteredResults.length > 0) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % filteredResults.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredResults.length) % filteredResults.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          handleItemClick(filteredResults[selectedIndex]);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredResults, selectedIndex]);

  useEffect(() => {
    if (isOpen && inputRef.current) setTimeout(() => inputRef.current?.focus(), 100);
    else setQuery("");
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && resultsRef.current) {
      const activeElement = resultsRef.current.querySelector('.selected-item') as HTMLElement;
      if (activeElement) activeElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [selectedIndex, isOpen]);

  const groupedResults = filteredResults.reduce((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {} as Record<string, any[]>);

  const handleItemClick = async (item: any) => {
    setIsOpen(false);
    if (item.type === "action") {
      switch (item.action) {
        case "copy_link":
          const userSubdomain = (session?.user as any)?.subdomain || "username";
          const portfolioUrl = `https://portfo.be/${userSubdomain}`;
          try {
            await navigator.clipboard.writeText(portfolioUrl);
            toast.success(t('toastCopySuccess', { subdomain: userSubdomain }));
          } catch (err) {
            toast.error(t('toastCopyFail'));
          }
          break;
        case "logout":
          toast.loading(t('toastLogout'));
          if (typeof window !== "undefined") sessionStorage.removeItem("hasSeenWelcomePromo");
          signOut({ redirect: true, callbackUrl: "/login" });
          break;
        default:
          toast.success(t('toastUnknown', { action: item.action }));
      }
    } else {
      router.push(item.link);
    }
  };

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "folder": return <FolderOpen className="w-4 h-4" />;
      case "palette": return <Palette className="w-4 h-4" />;
      case "link": return <LinkIcon className="w-4 h-4" />;
      case "metrics": return <Sparkles className="w-4 h-4" />;
      case "history": return <PlusCircle className="w-4 h-4" />;
      case "copy": return <Copy className="w-4 h-4" />;
      case "plus": return <PlusCircle className="w-4 h-4" />;
      default: return <ChevronRight className="w-4 h-4" />;
    }
  };

  let globalItemIndex = 0;

  return (
    <>
      <div className="hidden md:flex relative group max-w-md w-full cursor-pointer" onClick={() => setIsOpen(true)}>
        <div className="relative flex items-center w-full transition-all duration-300 bg-[#0a0a0a] border border-white/10 rounded-md px-4 py-2.5 group-hover:bg-zinc-900 group-hover:border-[#ff9e00]/30">
          <Search className="w-4 h-4 text-white/40 group-hover:text-[#ff9e00] transition-colors" />
          <div className="flex-1 text-[11px] font-sans font-medium text-white/40 px-3 text-left truncate">{t('placeholderShort')}</div>
          <div className="flex items-center gap-1 px-2 py-1 bg-zinc-900 border border-white/10 text-[9px] font-sans font-medium text-white/50 rounded-md">
            <span>⌘</span><span>K</span>
          </div>
        </div>
      </div>

      {mounted && isOpen && createPortal(
        <div className="fixed inset-0 z-[999999] flex items-start justify-center pt-[10vh] px-4 overflow-hidden">
          
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes searchPop { 0% { opacity: 0; transform: scale(0.98) translateY(-10px); } 100% { opacity: 1; transform: scale(1) translateY(0); } }
            @keyframes fadeInOverlay { 0% { opacity: 0; } 100% { opacity: 1; } }
            .animate-search-pop { animation: searchPop 0.15s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
          `}} />

          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-[fadeInOverlay_0.2s_forwards]" onClick={() => setIsOpen(false)}></div>

          <div className="relative z-10 w-full max-w-2xl bg-zinc-950 border border-white/10 rounded-md shadow-[0_45px_100px_rgba(0,0,0,0.9)] overflow-hidden animate-search-pop flex flex-col max-h-[80vh]">
            
            <div className="flex items-center px-6 py-5 border-b border-white/10 shrink-0 bg-zinc-950">
              {isCurrentlyWaiting ? (
                <div className="w-5 h-5 border-2 border-[#ff9e00] border-t-transparent rounded-md animate-spin shrink-0"></div>
              ) : (
                <Search className="w-5 h-5 text-[#ff9e00] shrink-0" />
              )}
              <input 
                ref={inputRef}
                type="text" 
                placeholder={t('placeholderLong')} 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent border-none outline-none px-4 text-base font-sans font-medium text-white placeholder:text-white/20"
              />
              <button onClick={() => setIsOpen(false)} className="px-3 py-1.5 bg-zinc-900 border border-white/10 text-white/70 rounded-md text-[9px] font-sans font-medium hover:bg-zinc-800 transition-colors">
                ESC
              </button>
            </div>

            <div ref={resultsRef} className="overflow-y-auto p-3 hide-scrollbar bg-[#050505] flex-1">
              {filteredResults.length === 0 ? (
                <div className="py-20 text-center flex flex-col items-center justify-center">
                  <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-md flex items-center justify-center mb-4 text-white/40">
                    <Ghost className="w-6 h-6" />
                  </div>
                  <p className="font-sans font-medium text-white/80 text-xs">{t('noResults', { query })}</p>
                  <p className="text-[10px] font-sans text-white/40 mt-1.5">{t('useKeywords')}</p>
                </div>
              ) : (
                <>
                  {!query && (
                    <div className="p-4 mb-4 mx-1.5 mt-1.5 bg-[#ff9e00]/5 border border-[#ff9e00]/25 rounded-md">
                      <p className="text-[10px] font-sans font-medium text-[#ff9e00] mb-2 flex items-center gap-1.5">
                        <Info className="w-3.5 h-3.5" /> What can be searched here?
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="px-2 py-1 bg-zinc-900 border border-white/10 text-white/80 rounded-md text-[9px] font-sans font-medium">{t('chipProjects')}</span>
                        <span className="px-2 py-1 bg-zinc-900 border border-white/10 text-white/80 rounded-md text-[9px] font-sans font-medium">{t('chipLinks')}</span>
                        <span className="px-2 py-1 bg-zinc-900 border border-white/10 text-white/80 rounded-md text-[9px] font-sans font-medium">{t('chipCerts')}</span>
                        <span className="px-2 py-1 bg-zinc-900 border border-white/10 text-white/80 rounded-md text-[9px] font-sans font-medium">{t('chipSystem')}</span>
                      </div>
                    </div>
                  )}
                  {Object.entries(groupedResults).map(([groupName, items]: [string, any]) => (
                    <div key={groupName} className="mb-4 last:mb-0">
                      <div className="px-3 py-2 text-[9px] font-sans font-medium text-white/30 tracking-[0.2em] flex items-center gap-3">
                        {groupName} <div className="h-px bg-white/10 flex-1"></div>
                      </div>
                      <div className="space-y-1">
                        {(items as any[]).map((item: any) => {
                          const currentIndex = globalItemIndex; 
                          const isSelected = currentIndex === selectedIndex;
                          globalItemIndex++; 
                          
                          return (
                            <button 
                              key={item.id} 
                              onClick={() => handleItemClick(item)}
                              onMouseEnter={() => setSelectedIndex(currentIndex)}
                              className={`w-full flex items-center justify-between p-3 rounded-md transition-all group border ${ isSelected ? 'bg-white/5 border-white/10 text-white selected-item' : 'border-transparent text-white/60 hover:bg-white/[0.01] hover:text-white' }`}
                            >
                              <div className="flex items-center gap-4">
                                <div className={`w-9 h-9 rounded-md flex items-center justify-center border border-white/10 bg-zinc-900 transition-colors ${ isSelected ? 'border-[#ff9e00]/30 text-[#ff9e00]' : 'text-white/50' }`}>
                                  {getIcon(item.icon)}
                                </div>
                                <div className="text-left">
                                  <p className="text-xs font-sans font-medium text-white">{item.title}</p>
                                  <p className="text-[9px] font-sans font-medium text-white/40 mt-0.5">
                                    {item.type === 'action' ? t('runCommand') : t('openLink', { link: item.link })}
                                  </p>
                                </div>
                              </div>
                              <div className={`transition-opacity flex items-center gap-1.5 ${isSelected ? 'opacity-100' : 'opacity-0'}`}>
                                 <span className="text-[8px] font-sans font-medium text-black bg-[#ff9e00] px-2 py-1">{t('select')}</span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>

            <div className="bg-zinc-950 px-6 py-4 border-t border-white/10 flex justify-between items-center text-[9px] font-sans font-medium text-white/30 shrink-0">
              <div className="flex gap-4">
                <span className="flex items-center gap-1.5">{t('shortcutSearch')}</span>
                <span className="flex items-center gap-1.5">{t('shortcutNav')}</span>
              </div>
              <span>{t('systemName')}</span>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
