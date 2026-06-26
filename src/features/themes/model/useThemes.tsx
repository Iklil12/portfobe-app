"use client";
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { THEMES_DATA } from '../config/themesData';

export function useThemes() {
  const router = useRouter();
  
  const [currentTheme, setCurrentTheme] = useState<string>('brutalism');
  const [subdomain, setSubdomain] = useState<string>(''); 
  const [userPlan, setUserPlan] = useState<string>('FREE');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<'all' | 'free' | 'pro' | 'favorites'>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const dataLoaded = React.useRef(false);

  // Sinkronisasi data saat mount
  useEffect(() => {
    const fetchCurrentTheme = async () => {
      try {
        const res = await fetch('/api/appearance?mode=lite');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.siteAppearance?.themeTemplate) setCurrentTheme(data.siteAppearance.themeTemplate);
            if (data.profile?.subdomain) setSubdomain(data.profile.subdomain);
            if (data.plan) setUserPlan(data.plan.toUpperCase());
            
            // Ambil favorit dari tabel ThemeFavorite
            try {
              const favRes = await fetch('/api/themes/favorite');
              if (favRes.ok) {
                const favData = await favRes.json();
                setFavorites(Array.isArray(favData.favorites) ? favData.favorites : []);
              }
            } catch {
              setFavorites([]);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load current data:", error);
      } finally {
        setIsLoading(false);
        // Tandai bahwa data awal sudah masuk, sekarang perubahan boleh disimpan ke DB
        setTimeout(() => {
            dataLoaded.current = true;
        }, 100);
      }
    };
    
    fetchCurrentTheme();
  }, []);

  // Toggle favorit via API baru (ThemeFavorite table)
  const toggleFavorite = async (themeId: string) => {
    // Optimistic update
    const isFav = favorites.includes(themeId);
    const updatedFavorites = isFav
      ? favorites.filter((id) => id !== themeId)
      : [...favorites, themeId];
    setFavorites(updatedFavorites);
    toast(isFav ? 'Removed from favorites' : 'Added to favorites ❤️', { id: `fav-${themeId}` });

    try {
      await fetch('/api/themes/favorite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeId }),
      });
    } catch {
      // Rollback jika gagal
      setFavorites(favorites);
    }
  }; 

  const handleUseTheme = async (themeId: string, themeName: string) => {
    const theme = THEMES_DATA.find(t => t.id === themeId);
    if (!theme) return;

    if (!theme.isAvailable) {
      toast(`${themeName} theme is coming soon!`, {
        id: `theme-coming-soon-${themeId}`,
        icon: '🔒'
      });
      return;
    }

    // SELALU arahkan ke Editor dengan query param untuk PREVIEW.
    // Jangan pernah auto-publish (simpan ke DB) dari halaman Tema, biarkan user preview dulu di Editor.
    toast.success(`Opening editor for ${themeName} theme...`, {
      id: `theme-preview-${themeId}`,
      icon: '✨',
      style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
    });
    
    router.push(`/dashboard/appearance?previewTheme=${themeId}`);
  };

  const handleProComingSoon = () => {
    toast('Pro Creator Editor is still under development.', {
      id: 'pro-editor-coming-soon',
      icon: '✨'
    });
  };



  const allThemes = THEMES_DATA;
  const themes = THEMES_DATA;

  return {
    state: {
      currentTheme,
      subdomain,
      userPlan,
      isLoading,
      activeFilter,
      favorites
    },
    actions: {
      handleUseTheme,
      handleProComingSoon,
      setActiveFilter,
      toggleFavorite
    },
    themes: allThemes
  };
}


export type ThemesState = ReturnType<typeof useThemes>['state'];
export type ThemesActions = ReturnType<typeof useThemes>['actions'];
