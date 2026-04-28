import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { THEMES_DATA } from '@/lib/themes';

export function useThemes() {
  const router = useRouter();
  
  const [currentTheme, setCurrentTheme] = useState<string>('brutalism');
  const [subdomain, setSubdomain] = useState<string>(''); 
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
    if (themeId === 'brutalism' || themeId === 'minimalist' || themeId === 'cinematic' || themeId === 'acid') {
      const toastId = toast.loading(`Menerapkan tema ${themeName}...`, {
        style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' }
      });
      
      try {
        await fetch('/api/appearance', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ themeTemplate: themeId })
        });

        toast.success('Tema berhasil diterapkan!', { 
            id: toastId,
            style: { borderRadius: '12px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: 'bold' },
            iconTheme: { primary: '#22c55e', secondary: '#0a0a0a' }
        });
        
        setCurrentTheme(themeId);

        setTimeout(() => {
          router.push('/dashboard/appearance'); 
        }, 800);

      } catch (error) {
        toast.error('Gagal menerapkan tema.', { id: toastId });
      }

    } else {
      toast(`Tema ${themeName} akan segera hadir!`, {
        icon: '🔒',
        style: { 
          borderRadius: '16px', background: '#0a0a0a', color: '#fff',
          fontWeight: '600', fontSize: '13px', padding: '14px 24px',
          border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }
      });
    }
  };

  const handleProComingSoon = () => {
    toast('Fitur Pro Creator Editor masih dalam tahap pengembangan.', {
      icon: '✨',
      style: { borderRadius: '16px', background: '#0a0a0a', color: '#fff', fontSize: '13px', fontWeight: '600', border: '1px solid rgba(255,255,255,0.1)' }
    });
  };

  const themes = THEMES_DATA;

  return {
    state: {
      currentTheme,
      subdomain,
      isLoading
    },
    actions: {
      handleUseTheme,
      handleProComingSoon
    },
    themes
  };
}
