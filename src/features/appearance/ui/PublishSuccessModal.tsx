//components/features/appearance/PublishSuccessModal.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { X, ExternalLink, Check, Link as LinkIcon, QrCode, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

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
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
);

const InstagramIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

export function PublishSuccessModal({
  isOpen,
  onClose,
  subdomain,
  isLive = true
}: {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  isLive?: boolean;
}) {
  const [showQR, setShowQR] = useState(true); // Default to showing QR in new design
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = `https://portfo.be/${subdomain}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareFacebook = () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  const shareTwitter = () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check out my portfolio!`, '_blank');
  const shareLinkedIn = () => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  const shareWhatsapp = () => window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent('Check out my portfolio: ' + url)}`, '_blank');
  const shareInstagram = () => {
    copyToClipboard();
    toast.success('Link copied! Open Instagram to paste it.', {
      style: { background: '#111', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', fontSize: '13px' },
      iconTheme: { primary: '#E1306C', secondary: '#fff' }
    });
  };

  return (
    <div className="fixed inset-0 z-[999999] bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      
      {/* Scrollable Overlay Area */}
      <div className="absolute inset-0 overflow-y-auto" onClick={onClose}>
        <div className="min-h-full flex items-center justify-center p-4 sm:p-6">
          
          <div 
            className="relative w-full max-w-3xl bg-[#111111] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-500 ease-out flex flex-col md:flex-row"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
        
        {/* Glow effect in background */}
        <div className="absolute -top-[200px] -left-[200px] w-[400px] h-[400px] bg-[#0099ff]/20 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute -bottom-[200px] -right-[200px] w-[400px] h-[400px] bg-[#ff9e00]/10 rounded-full blur-[100px] pointer-events-none" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LEFT PANEL: Status & Link */}
        <div className="flex-1 p-6 md:p-8 lg:p-10 border-b md:border-b-0 md:border-r border-white/5 relative flex flex-col justify-center">
          
          {isLive ? (
            <>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-tight">Your Website is Live</h2>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-6 md:mb-8">
                Your latest design has been successfully published. Your portfolio is now ready to dazzle the world.
              </p>

              {/* URL Copier Box */}
              <div className="group flex items-center bg-black/40 border border-white/10 rounded-xl p-1.5 md:p-2 mb-5 md:mb-6 hover:border-white/20 transition-all">
                <div className="flex-1 px-3 md:px-4 overflow-hidden">
                  <p className="text-[#0099ff] text-xs md:text-sm font-medium truncate">{url}</p>
                </div>
                <button
                  onClick={copyToClipboard}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg transition-all ${
                    copied ? 'bg-green-500 text-black' : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                  title="Copy Link"
                >
                  {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
                </button>
              </div>

              {/* Call to Action */}
              <div className="flex gap-3">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl bg-[#0099ff] hover:bg-[#0077cc] text-white text-xs md:text-sm font-semibold transition-all shadow-[0_0_20px_rgba(0,153,255,0.3)] hover:shadow-[0_0_30px_rgba(0,153,255,0.5)]"
                >
                  Open Website <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </>
          ) : (
            // Inactive State
            <div className="flex flex-col items-start">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mb-5 md:mb-6 border border-red-500/20">
                <AlertTriangle className="w-6 h-6 md:w-7 md:h-7" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 md:mb-3 tracking-tight">Portfolio Inactive</h2>
              <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 max-w-sm">
                The latest design was successfully saved. However, your portfolio status is currently <strong className="text-white">hidden</strong> from the public.
              </p>
              
              <Link 
                href="/dashboard/settings" 
                className="w-full flex items-center justify-center gap-2 py-3 md:py-3.5 rounded-xl bg-white text-black hover:bg-white/90 text-xs md:text-sm font-semibold transition-all shadow-lg"
                onClick={onClose}
              >
                Open Settings
              </Link>
            </div>
          )}
        </div>

        {/* RIGHT PANEL: Share & QR */}
        <div className="w-full md:w-[320px] bg-zinc-900/50 p-6 md:p-8 lg:p-10 flex flex-col justify-center items-center relative z-10 backdrop-blur-xl">
          <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 md:mb-6 w-full text-center md:text-left">Quick Share</p>
          
          {/* Social Row */}
          <div className="flex justify-center gap-2 md:gap-3 w-full mb-5 md:mb-8">
            <button 
              onClick={shareWhatsapp}
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 hover:border-white/20 hover:bg-[#25D366]/20 text-white/60 hover:text-[#25D366] transition-all group"
            >
              <WhatsappIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={shareTwitter}
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 hover:border-white/20 hover:bg-white/5 text-white/60 hover:text-white transition-all group"
            >
              <TwitterIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={shareInstagram}
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 hover:border-white/20 hover:bg-[#E1306C]/20 text-white/60 hover:text-[#E1306C] transition-all group"
            >
              <InstagramIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={shareLinkedIn}
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 hover:border-white/20 hover:bg-[#0077b5]/20 text-white/60 hover:text-[#0077b5] transition-all group"
            >
              <LinkedinIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
            <button 
              onClick={shareFacebook}
              className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 flex items-center justify-center rounded-xl bg-black/40 border border-white/5 hover:border-white/20 hover:bg-[#1877f2]/20 text-white/60 hover:text-[#1877f2] transition-all group"
            >
              <FacebookIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-5 md:mb-8" />

          {/* QR Code Container */}
          <div className="relative group w-full max-w-[150px] md:max-w-full">
            <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative bg-white p-3 md:p-4 rounded-2xl border-4 border-black shadow-2xl transform group-hover:-translate-y-1 transition-transform duration-300">
              <QRCode value={url} size={100} style={{ width: '100%', height: 'auto' }} level="H" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 md:w-8 md:h-8 bg-white rounded-lg flex items-center justify-center shadow-md">
                <QrCode className="w-4 h-4 md:w-5 md:h-5 text-black" />
              </div>
            </div>
            <p className="text-[10px] font-medium text-white/30 uppercase tracking-widest text-center mt-4">Scan to open</p>
          </div>
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
