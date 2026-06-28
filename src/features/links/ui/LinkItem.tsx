import React, { useState, useRef, useEffect } from 'react';
import { LinkData } from '@/features/links';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, 
  Video, 
  Link as LinkIcon, 
  ChevronDown, 
  Check,
  Trash2,
  PhoneCall
} from 'lucide-react';
import {
  InstagramIcon,
  LinkedinIcon,
  YoutubeIcon,
  TwitterIcon,
  GithubIcon
} from '@/shared/ui/Icons';
import { LinksState, LinksActions } from '../model/useLinks';

interface LinkItemProps {
  link: LinkData;
  index: number;
  actions: LinksActions;
}

const PLATFORMS = [
  { id: 'instagram', name: 'Instagram', icon: InstagramIcon, placeholder: 'https://instagram.com/username' },
  { id: 'whatsapp', name: 'WhatsApp', icon: PhoneCall, placeholder: 'https://wa.me/628...' },
  { id: 'tiktok', name: 'TikTok', icon: Video, placeholder: 'https://tiktok.com/@username' },
  { id: 'linkedin', name: 'LinkedIn', icon: LinkedinIcon, placeholder: 'https://linkedin.com/in/username' },
  { id: 'youtube', name: 'YouTube', icon: YoutubeIcon, placeholder: 'https://youtube.com/@channel' },
  { id: 'x', name: 'X / Twitter', icon: TwitterIcon, placeholder: 'https://x.com/username' },
  { id: 'github', name: 'GitHub', icon: GithubIcon, placeholder: 'https://github.com/username' },
  { id: 'custom', name: 'Website / Custom', icon: LinkIcon, placeholder: 'https://yourwebsite.com' },
];

export function LinkItem({ link, index, actions }: LinkItemProps) {
  const { updateLocalLink, setLinkToDelete } = actions;
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentPlatform = PLATFORMS.find(p => p.id === link.platform) || PLATFORMS[PLATFORMS.length - 1];
  const IconComponent = currentPlatform.icon;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUrlChange = (val: string) => {
    if (link.platform === 'whatsapp' && val.length > 8 && !val.includes('wa.me')) {
      toast('WhatsApp format should ideally use wa.me', {
        id: 'wa-hint',
        icon: '💡',
        style: { borderRadius: '0px', background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '11px', fontFamily: 'monospace' },
        duration: 2000
      });
    }
    updateLocalLink(link.id, { url: val });
  };

  const selectPlatform = (id: string) => {
    updateLocalLink(link.id, { platform: id });
    setIsOpen(false);
  };

  return (
    <div 
      className={`group bg-zinc-950 p-5 sm:p-6 rounded-md border border-white/10 shadow-none hover:border-white/20 hover:bg-white/[0.01] flex flex-col sm:flex-row gap-5 sm:gap-6 items-start sm:items-center transition-all duration-300 animate-enter relative ${isOpen ? 'z-[110]' : 'z-10'}`}
      style={{animationDelay: `${index * 80}ms`, opacity: 0}}
    >
      <div className="flex w-full items-center gap-4 sm:gap-6">

        {/* Icon Box Premium */}
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-md bg-zinc-900 border border-white/10 text-white/50 flex items-center justify-center shrink-0 group-hover:bg-[#ff9e00]/10 group-hover:border-[#ff9e00]/30 group-hover:text-[#ff9e00] transition-all duration-300 ml-1 sm:ml-2">
          <IconComponent className="w-6 h-6" />
        </div>

        {/* Input Fields */}
        <div className="flex-1 min-w-0 flex flex-col gap-1.5 relative">
          
          {/* CUSTOM DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-1.5 w-full text-left font-sans font-medium text-white hover:text-[#ff9e00] transition-colors text-sm uppercase tracking-wider group/btn"
            >
              {currentPlatform.name}
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }}>
                <ChevronDown className="w-3.5 h-3.5 text-white/30" />
              </motion.div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.98 }}
                  className="absolute left-0 top-full mt-2 w-64 bg-zinc-950 border border-white/10 rounded-md shadow-[0_10px_30px_rgba(0,0,0,0.8)] z-[100] overflow-hidden p-1.5"
                >
                  <div className="max-h-60 overflow-y-auto custom-scrollbar">
                    {PLATFORMS.map((p) => {
                      const PIcon = p.icon;
                      const isSel = link.platform === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => selectPlatform(p.id)}
                          className={`w-full flex items-center gap-3 px-4 py-3 rounded-md text-xs font-sans font-medium uppercase tracking-wider transition-all ${
                            isSel 
                              ? 'bg-[#ff9e00] text-black shadow-none' 
                              : 'text-white/50 hover:bg-white/5 hover:text-white'
                          }`}
                        >
                          <PIcon className="w-4 h-4" />
                          {p.name}
                          {isSel && <Check className="w-3.5 h-3.5 ml-auto stroke-[2.5]" />}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* URL INPUT */}
          <div className="flex items-center gap-2 text-white/20 focus-within:text-white/50 transition-colors relative z-10">
              <LinkIcon className="w-3.5 h-3.5 shrink-0" />
              <input 
                type="url" 
                value={link.url} 
                onChange={(e) => handleUrlChange(e.target.value)}
                className="w-full bg-transparent text-xs font-sans font-medium text-white/40 focus:outline-none focus:text-white truncate placeholder:text-white/10 transition-colors"
                placeholder={currentPlatform.placeholder}
              />
          </div>
        </div>
      </div>

      {/* ACTION BAR (Responsive) */}
      <div className="flex items-center justify-between sm:justify-end gap-4 sm:gap-6 w-full sm:w-auto pt-4 sm:pt-0 border-t sm:border-t-0 border-white/5">
        
        {/* Switch Status */}
        <div className="flex items-center gap-3">
            <span className={`text-[9px] font-sans font-medium uppercase tracking-wider transition-colors ${link.isActive ? 'text-white' : 'text-white/30'}`}>
              {link.isActive ? 'Visible' : 'Hidden'}
            </span>

          {/* Toggle Button iOS Style */}
          <button
            onClick={() => updateLocalLink(link.id, { isActive: !link.isActive })}
            className={`relative inline-flex h-6 w-11 items-center rounded-md transition-all duration-300 focus:outline-none ${
              link.isActive ? 'bg-[#ff9e00]' : 'bg-zinc-900 border border-white/10'
            }`}
          >
            <span className={`inline-block h-4 w-4 transform rounded-md transition-transform duration-300 ${
                link.isActive ? 'translate-x-6 bg-black' : 'translate-x-1 bg-white/50'
            }`} />
          </button>
        </div>

        <div className="w-px h-8 bg-white/10 hidden sm:block"></div>

        {/* Delete Button Monokrom */}
        <button 
          onClick={() => setLinkToDelete(link.id)}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-md bg-zinc-900 border border-white/10 text-white/50 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 flex items-center justify-center active:scale-95 transition-all duration-300 shrink-0"
          title="Delete link"
        >
          <Trash2 className="w-4 h-4" />
        </button>
        
      </div>
    </div>
  );
}
