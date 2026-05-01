import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { THEMES_DATA } from '@/lib/themes';

export function useThemes() {
  const router = useRouter();
  
  const [currentTheme, setCurrentTheme] = useState<string>('brutalism');
  const [subdomain, setSubdomain] = useState<string>(''); 
  const [userPlan, setUserPlan] = useState<string>('FREE');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCurrentTheme = async () => {
      try {
        const res = await fetch('/api/appearance');
        if (res.ok) {
          const data = await res.json();
          if (data) {
            if (data.siteAppearance?.themeTemplate) setCurrentTheme(data.siteAppearance.themeTemplate);
            if (data.profile?.subdomain) setSubdomain(data.profile.subdomain);
            if (data.plan) setUserPlan(data.plan.toUpperCase());
          }
        }
      } catch (error) {
        console.error("Gagal memuat data saat ini:", error);
      } finally {
        setTimeout(() => setIsLoading(false), 800);
      }
    };
    
    fetchCurrentTheme();
  }, []);

  const handleUseTheme = async (themeId: string, themeName: string) => {
    const theme = THEMES_DATA.find(t => t.id === themeId);
    if (!theme) return;

    if (!theme.isAvailable) {
      toast(`Tema ${themeName} akan segera hadir!`, {
        id: `theme-coming-soon-${themeId}`,
        icon: '🔒'
      });
      return;
    }

    // LOGIKA TEASER: Jika tema adalah PRO dan user adalah FREE, jangan simpan ke DB.
    // Langsung arahkan ke Editor dengan query param untuk PREVIEW.
    if (theme.isPro && userPlan === 'FREE') {
      toast.success(`Pratinjau tema ${themeName} aktif!`, {
        id: `theme-preview-${themeId}`,
        icon: '✨'
      });
      
      router.push(`/dashboard/appearance?previewTheme=${themeId}`);
      return;
    }

    // Jika tema FREE atau user sudah PRO, simpan ke database seperti biasa
    const toastId = toast.loading(`Menerapkan tema ${themeName}...`, {
      id: 'apply-theme-loading'
    });
    
    try {
      const res = await fetch('/api/appearance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ themeTemplate: themeId })
      });

      if (res.ok) {
        toast.success('Tema berhasil diterapkan!', { 
            id: toastId
        });
        
        setCurrentTheme(themeId);
        setTimeout(() => {
          router.push('/dashboard/appearance'); 
        }, 800);
      } else {
        throw new Error('Gagal');
      }

    } catch (error) {
      toast.error('Gagal menerapkan tema.', { id: toastId });
    }
  };

  const handleProComingSoon = () => {
    toast('Fitur Pro Creator Editor masih dalam tahap pengembangan.', {
      id: 'pro-editor-coming-soon',
      icon: '✨'
    });
  };

  const themes = THEMES_DATA;

  return {
    state: {
      currentTheme,
      subdomain,
      userPlan,
      isLoading
    },
    actions: {
      handleUseTheme,
      handleProComingSoon
    },
    themes
  };
}
