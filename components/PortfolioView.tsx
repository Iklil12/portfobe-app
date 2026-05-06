
// components/PortfolioView.tsx
"use client";

import React from 'react';
import { usePathname } from 'next/navigation'; 

// 1. IMPORT SEMUA TEMA DARI FOLDER THEMES
import BrutalismTheme from './themes/BrutalismTheme';
import MinimalistTheme from './themes/MinimalistTheme';
import CinematicTheme from './themes/CinematicTheme';
import AcidTheme from './themes/AcidTheme';
import BentoTheme from './themes/BentoGrid';
import ViewfinderTheme from './themes/ViewfinderTheme';
import SpatialTheme from './themes/SpatialTheme';
import MonolithTheme from './themes/MonolithTheme';
import SplitTheme from './themes/SplitTheme';
import EditorialTheme from './themes/EditorialTheme';

// 2. DAFTARKAN TEMA KE DALAM "THEME REGISTRY"
const THEME_MAP: Record<string, React.FC<any>> = {
  'brutalism': BrutalismTheme,
  'minimalist': MinimalistTheme,
  'cinematic': CinematicTheme,
  'acid': AcidTheme,
  'bentogrid': BentoTheme,
  'viewfinder': ViewfinderTheme,
  'spatial': SpatialTheme,
  'monolith': MonolithTheme,
  'split': SplitTheme,
  'editorial': EditorialTheme,
  
  // Nanti tinggal tambah: 'elegant': ElegantTheme, dst...
};

export default function PortfolioView({ data, theme, isMobileView = false }: { data: any, theme: any, isMobileView?: boolean }) {
  const pathname = usePathname();
  const isEditor = pathname?.includes('/dashboard');
  
  // PENYESUAIAN BARU: Ambil subdomain dari dalam objek profile
  const subdomain = data?.profile?.subdomain || data?.subdomain || "";

  // 3. CEK TEMA APA YANG SEDANG DIPILIH USER DI DATABASE
  // Jika tidak ada data, kita jadikan brutalism sebagai default/fallback
  const activeThemeName = theme?.themeTemplate || 'brutalism';
  
  // 4. PILIH KOMPONEN YANG SESUAI DARI REGISTRY
  const SelectedThemeComponent = THEME_MAP[activeThemeName] || THEME_MAP['brutalism'];

  return (
    <div className="relative w-full h-full" style={{ containerType: 'inline-size' }}>
      {/* RENDER TEMA YANG DIPILIH SECARA DINAMIS */}
      <SelectedThemeComponent data={data} theme={theme} isMobileView={isMobileView} />
    </div>
  );
}
