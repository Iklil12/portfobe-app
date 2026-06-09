"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Share2, Check, X, Mail, Link as LinkIcon, ExternalLink } from 'lucide-react';

const TwitterIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.603 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const WhatsappIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

interface ShareButtonProps {
  title: string;
  text: string;
  image?: string;
}

export function ShareButton({ title, text, image }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [url, setUrl] = useState('');

  useEffect(() => {
    setUrl(window.location.href);
    
    // Prevent scrolling when modal is open
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleInstagramShare = async () => {
    // Instagram does not support direct URL sharing via intent on web.
    // So we copy the link and redirect to instagram.
    await handleCopyLink();
    window.open('https://instagram.com', '_blank');
  };

  const shareLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' \n\n' + url)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
    linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(text)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    email: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(text + '\n\n' + url)}`
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="px-6 py-3 bg-white text-black font-bold font-display text-sm tracking-widest uppercase hover:bg-[#ff9e00] transition-colors rounded-full active:scale-95 flex items-center justify-center gap-2 w-full sm:w-auto group"
      >
        <Share2 className="w-4 h-4 group-hover:-rotate-12 transition-transform" /> Bagikan Artikel
      </button>

      {/* Enterprise Share Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal Box */}
          <div className="relative bg-zinc-950 border border-white/10 p-5 md:p-8 rounded-2xl w-full max-w-md shadow-2xl transform scale-100 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors z-10"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-display font-bold text-xl md:text-2xl text-white mb-1.5 md:mb-2 tracking-tight pr-8">Bagikan Artikel</h3>
            <p className="text-white/50 text-xs md:text-sm font-sans mb-5 md:mb-6">
              Pilih platform untuk membagikan wawasan teknikal ini kepada jaringan Anda.
            </p>

            {/* Link Preview Card */}
            <div className="mb-6 md:mb-8 rounded-xl overflow-hidden border border-white/10 bg-white/5 flex flex-col group/preview shrink-0">
              {image && (
                <div className="relative w-full h-24 md:h-32 overflow-hidden border-b border-white/10 bg-black">
                  <Image src={image} alt="Preview" fill className="object-cover group-hover/preview:scale-105 transition-transform duration-500" />
                </div>
              )}
              <div className="p-3 md:p-4 bg-zinc-900/50">
                <p className="text-[10px] md:text-xs font-mono text-white/40 uppercase tracking-widest mb-1 truncate">portfo.be</p>
                <h4 className="text-xs md:text-sm font-bold text-white leading-snug line-clamp-2 mb-1">{title}</h4>
                <p className="text-[10px] md:text-xs text-white/50 line-clamp-2">{text}</p>
              </div>
            </div>

            {/* Social Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
              <a href={shareLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group/social">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/social:bg-[#25D366] group-hover/social:border-[#25D366] group-hover/social:text-white text-white/70 transition-all duration-300">
                  <WhatsappIcon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover/social:text-white transition-colors">WA</span>
              </a>
              <button onClick={handleInstagramShare} className="flex flex-col items-center gap-2 group/social">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/social:bg-[#E1306C] group-hover/social:border-[#E1306C] group-hover/social:text-white text-white/70 transition-all duration-300">
                  <InstagramIcon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover/social:text-white transition-colors">IG</span>
              </button>
              <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group/social">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/social:bg-white group-hover/social:border-white group-hover/social:text-black text-white/70 transition-all duration-300">
                  <TwitterIcon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover/social:text-white transition-colors">X</span>
              </a>
              <a href={shareLinks.linkedin} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group/social">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/social:bg-[#0A66C2] group-hover/social:border-[#0A66C2] group-hover/social:text-white text-white/70 transition-all duration-300">
                  <LinkedinIcon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover/social:text-white transition-colors">In</span>
              </a>
              <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group/social">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/social:bg-[#1877F2] group-hover/social:border-[#1877F2] group-hover/social:text-white text-white/70 transition-all duration-300">
                  <FacebookIcon className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover/social:text-white transition-colors">FB</span>
              </a>
              <a href={shareLinks.email} className="flex flex-col items-center gap-2 group/social">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover/social:bg-white group-hover/social:text-black text-white/70 transition-all duration-300">
                  <Mail className="w-4 h-4" />
                </div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-white/50 group-hover/social:text-white transition-colors">Email</span>
              </a>
            </div>

            {/* Copy Link Box */}
            <div className="space-y-2 mt-6 pt-6 border-t border-white/10">
              <label className="text-[10px] font-mono uppercase tracking-widest text-white/50">Tautan Langsung</label>
              <div className="flex items-center gap-2 p-1.5 bg-white/5 border border-white/10 rounded-xl">
                <div className="flex-1 px-3 py-2 text-xs text-white/80 font-mono truncate bg-black/50 rounded-lg pointer-events-none">
                  {url}
                </div>
                <button 
                  onClick={handleCopyLink}
                  className={`px-4 py-2 flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase rounded-lg transition-all duration-300 ${copied ? 'bg-[#ff9e00] text-black' : 'bg-white text-black hover:bg-[#ff9e00]'}`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <LinkIcon className="w-3 h-3" />}
                  {copied ? 'Disalin' : 'Salin'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
