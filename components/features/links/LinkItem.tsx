import React from 'react';
import { LinkData } from '@/hooks/useLinks';

interface LinkItemProps {
  link: LinkData;
  index: number;
  actions: any;
}

export function LinkItem({ link, index, actions }: LinkItemProps) {
  const { updateLocalLink, setLinkToDelete } = actions;

  const getIconClass = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('instagram')) return 'fab fa-instagram';
    if (p.includes('behance')) return 'fab fa-behance';
    if (p.includes('whatsapp')) return 'fab fa-whatsapp';
    if (p.includes('github')) return 'fab fa-github';
    if (p.includes('linkedin')) return 'fab fa-linkedin-in';
    if (p.includes('youtube')) return 'fab fa-youtube';
    if (p.includes('x') || p.includes('twitter')) return 'fab fa-x-twitter';
    if (p.includes('tiktok')) return 'fab fa-tiktok';
    if (p.includes('dribbble')) return 'fab fa-dribbble';
    return 'fas fa-link';
  };

  const iconClass = getIconClass(link.platform);

  return (
    <div 
      className="group bg-white p-5 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/60 shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.06)] hover:border-slate-300 flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center transition-all duration-500 animate-enter"
      style={{animationDelay: `${index * 80}ms`, opacity: 0}}
    >
      <div className="flex w-full items-center gap-4 sm:gap-6">

        {/* Icon Box Premium */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-2xl sm:text-3xl shrink-0 group-hover:scale-105 group-hover:rotate-3 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-md transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] relative overflow-hidden ml-1 sm:ml-2">
          <i className={iconClass}></i>
          <div className="absolute inset-0 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-[20px]"></div>
        </div>

        {/* Input Fields */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5 sm:gap-2 relative">
          <input 
            type="text" 
            value={link.platform} 
            onChange={(e) => updateLocalLink(link.id, { platform: e.target.value })}
            className="w-full bg-transparent font-black text-slate-900 focus:outline-none focus:text-slate-700 text-lg sm:text-xl transition-colors placeholder:text-slate-300 tracking-tight relative z-10"
            placeholder="Nama Platform (cth: Instagram)"
          />
          <div className="flex items-center gap-2 text-slate-300 focus-within:text-slate-900 transition-colors relative z-10">
              <i className="fas fa-link text-[10px] sm:text-xs"></i>
              <input 
                type="url" 
                value={link.url} 
                onChange={(e) => updateLocalLink(link.id, { url: e.target.value })}
                className="w-full bg-transparent text-[11px] sm:text-xs font-semibold text-slate-500 focus:outline-none focus:text-slate-900 truncate placeholder:text-slate-300 transition-colors"
                placeholder="https://..."
              />
          </div>
        </div>
      </div>

      {/* ACTION BAR (Responsive) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        
        {/* Switch Status */}
        <div className="flex items-center gap-3">
            <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest transition-colors ${link.isActive ? 'text-slate-900' : 'text-slate-400'}`}>
              {link.isActive ? 'Visible' : 'Hidden'}
            </span>

          {/* Toggle Button iOS Style */}
          <button
            onClick={() => updateLocalLink(link.id, { isActive: !link.isActive })}
            className={`relative inline-flex h-6 w-11 sm:h-7 sm:w-12 items-center rounded-full transition-all duration-300 focus:outline-none shadow-inner ${
              link.isActive ? 'bg-slate-900' : 'bg-slate-200 hover:bg-slate-300'
            }`}
          >
            <span className={`inline-block h-4 w-4 sm:h-5 sm:w-5 transform rounded-full transition-transform duration-300 shadow-sm ${
                link.isActive ? 'translate-x-6 sm:translate-x-6 bg-white' : 'translate-x-1 bg-white'
            }`} />
          </button>
        </div>

        <div className="w-px h-8 bg-slate-200 hidden sm:block"></div>

        {/* Delete Button Monokrom */}
        <button 
          onClick={() => setLinkToDelete(link.id)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-white border border-slate-200 text-slate-400 hover:text-rose-500 hover:bg-rose-50 hover:border-rose-100 flex items-center justify-center active:scale-90 transition-all duration-300 shrink-0 shadow-sm"
          title="Hapus tautan"
        >
          <i className="fas fa-trash-alt text-[11px] sm:text-xs"></i>
        </button>
        
      </div>
    </div>
  );
}
