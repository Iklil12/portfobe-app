// File: components/PortfolioView.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation'; 

// 1. IMPORT SEMUA TEMA DARI FOLDER THEMES
import BrutalismTheme from './themes/BrutalismTheme';
import MinimalistTheme from './themes/MinimalistTheme';

// 2. DAFTARKAN TEMA KE DALAM "THEME REGISTRY"
const THEME_MAP: Record<string, React.FC<any>> = {
  'brutalism': BrutalismTheme,
  'minimalist': MinimalistTheme,
  // Nanti tinggal tambah: 'elegant': ElegantTheme, dst...
};

export default function PortfolioView({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const pathname = usePathname();
  const isEditor = pathname?.includes('/dashboard');
  const subdomain = data?.subdomain || "";

  // 3. CEK TEMA APA YANG SEDANG DIPILIH USER DI DATABASE
  // Jika tidak ada data, kita jadikan brutalism sebagai default/fallback
  const activeThemeName = theme?.themeTemplate || 'brutalism';
  
  // 4. PILIH KOMPONEN YANG SESUAI DARI REGISTRY
  const SelectedThemeComponent = THEME_MAP[activeThemeName] || THEME_MAP['brutalism'];

  return (
    <div className="relative w-full h-full">
      {/* FLOATING BUTTON (Selalu muncul di semua tema saat di Editor) */}
      {isEditor && subdomain && (
        <a 
          href={`/${subdomain}`} 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 z-[99999] px-6 py-3.5 bg-[#ff9e00] text-black font-black uppercase text-[10px] tracking-widest rounded-full shadow-[0_10px_30px_rgba(255,158,0,0.4)] hover:scale-105 hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 border-[2px] border-black"
        >
          <i className="fas fa-external-link-alt"></i> Live Preview
        </a>
      )}

      {/* RENDER TEMA YANG DIPILIH SECARA DINAMIS */}
      <SelectedThemeComponent data={data} theme={theme} isMobileView={isMobileView} />
    </div>
  );
}