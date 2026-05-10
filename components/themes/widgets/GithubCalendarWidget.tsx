"use client";

import React from 'react';
import { GitHubCalendar } from 'react-github-calendar';

export type CalendarThemeVariant = 'monochrome' | 'classic' | 'acid' | 'aura' | 'noir' | 'bento' | 'brutalism' | 'cinematic' | 'editorial' | 'midnight' | 'monolith' | 'spatial' | 'split' | 'viewfinder' | 'minimalist';

interface GithubCalendarWidgetProps {
  username: string;
  variant?: CalendarThemeVariant;
  colorScheme?: 'light' | 'dark';
  themeColor?: string; // Menambahkan prop warna dinamis
}

// Utility: Konversi HEX ke RGB
function hexToRgb(hex: string) {
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
}

// Generator 5 level warna untuk kalender berdasarkan 1 warna utama
function generateDynamicTheme(baseColor: string | undefined, colorScheme: 'light' | 'dark') {
  // Jika tidak ada baseColor, gunakan hijau classic GitHub sebagai fallback
  const { r, g, b } = baseColor ? hexToRgb(baseColor) : { r: 57, g: 211, b: 83 }; 
  
  const level0 = colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';
  
  const palette = [
    level0,
    `rgba(${r}, ${g}, ${b}, 0.4)`,
    `rgba(${r}, ${g}, ${b}, 0.6)`,
    `rgba(${r}, ${g}, ${b}, 0.8)`,
    `rgba(${r}, ${g}, ${b}, 1)`
  ];

  return {
    light: palette,
    dark: palette,
  };
}

export function GithubCalendarWidget({ 
  username, 
  variant = 'monochrome',
  colorScheme = 'light',
  themeColor
}: GithubCalendarWidgetProps) {
  
  // Hasilkan palet dinamis!
  const dynamicTheme = generateDynamicTheme(themeColor, colorScheme);

  // Sesuaikan warna teks judul
  const getTitleColor = () => {
    if (themeColor) return themeColor; // Gunakan warna tema jika ada
    switch (variant) {
      case 'acid': return '#a3e635';
      case 'aura': return '#a78bfa';
      case 'classic': return '#64748b';
      case 'monochrome':
      default: return '#94a3b8';
    }
  };

  return (
    <div className="w-full font-sans relative">
      <div className="flex justify-between items-center mb-6">
        <span 
          className="text-[10px] font-bold uppercase tracking-widest block"
          style={{ color: getTitleColor() }}
        >
          Contributions
        </span>
        
        {/* Indikator Swipe (Hanya muncul di layar kecil) */}
        <div className="flex md:hidden items-center gap-1.5 opacity-60 animate-pulse">
          <span className="text-[8px] font-bold uppercase tracking-widest" style={{ color: getTitleColor() }}>
            Swipe
          </span>
          <i className="fas fa-arrow-right text-[8px]" style={{ color: getTitleColor() }}></i>
        </div>
      </div>
      
      <div className="w-full overflow-x-auto hide-scrollbar pb-2 relative group cursor-grab active:cursor-grabbing">
        <div className="min-w-max">
          <GitHubCalendar 
            username={username} 
            theme={dynamicTheme}
            colorScheme={colorScheme}
            blockSize={11}
            blockMargin={4}
            fontSize={11}
            labels={{
              totalCount: '{{count}} contributions in the last year',
            }}
          />
        </div>
      </div>
    </div>
  );
}
