import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

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

  const themes = [
    {
        id: 'minimalist',
        name: 'Minimalist Clean',
        desc: 'Bento Grid, Startup Vibe, Clean Space.',
        preview: 'bg-slate-100',
        isAvailable: true, 
        content: (
            <div className="absolute inset-0 flex items-center justify-center p-6 scale-90 w-full h-full opacity-80 group-hover:opacity-100 group-hover:scale-100 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-3">
                    <div className="col-span-2 row-span-2 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-end p-4 transition-all duration-500 delay-75 group-hover:-translate-y-1">
                        <div className="w-1/2 h-3 bg-slate-200 rounded-full"></div>
                    </div>
                    <div className="col-span-1 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center transition-all duration-500 delay-100 group-hover:-translate-y-1">
                        <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center"><i className="fas fa-bolt text-[8px]"></i></div>
                    </div>
                    <div className="col-span-1 row-span-2 bg-slate-800 rounded-2xl shadow-[0_10px_20px_rgba(0,0,0,0.1)] border border-slate-700 transition-all duration-500 delay-150 group-hover:-translate-y-1"></div>
                    <div className="col-span-2 row-span-1 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center px-4 transition-all duration-500 delay-200 group-hover:-translate-y-1">
                        <div className="w-3/4 h-2 bg-slate-200 rounded-full"></div>
                    </div>
                </div>
            </div>
        )
    },
    {
        id: 'brutalism',
        name: 'Neo Brutalism',
        desc: 'Dark mode, Cinematic, Massive Type.',
        preview: 'bg-[#0a0a0a]',
        isAvailable: true, 
        img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'cinematic',
        name: 'Cinematic Dark',
        desc: 'Editorial, High-end, Director Vibe.',
        preview: 'bg-[#0a0a0a]',
        isAvailable: true, 
        img: 'https://images.unsplash.com/photo-1580234797602-22c37b4a6230?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'acid',
        name: 'Acid Tech',
        desc: 'Cyberpunk, Brutalism, Neon Vibes.',
        preview: 'bg-[#09090b]',
        isAvailable: true, 
        img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=600&auto=format&fit=crop'
    },
    {
        id: 'elegant',
        name: 'Elegant Serif',
        desc: 'Earth Tones, Fine Art, Elegant.',
        preview: 'bg-[#e5e5e5]',
        isAvailable: false, 
        img: 'https://images.unsplash.com/photo-1613521140785-e85e427f8002?q=80&w=600&auto=format&fit=crop'
    }
  ];

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
