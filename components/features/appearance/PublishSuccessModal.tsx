//components/features/appearance/PublishSuccessModal.tsx
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';
import { X, ExternalLink, Check, Link as LinkIcon, QrCode } from 'lucide-react';

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

export function PublishSuccessModal({
  isOpen,
  onClose,
  subdomain
}: {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
}) {
  const [showQR, setShowQR] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const url = `https://portfo.be/${subdomain}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Kunjungi portofolio saya!`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-white/10 w-full max-w-2xl rounded-none shadow-none overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-white/5 flex items-center justify-between relative">
          <div className="flex-1 flex justify-center pr-8 sm:pr-0">
            <h2 className="text-xs font-mono font-bold text-white uppercase tracking-wider text-center">Website Anda telah diperbarui</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/50 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 sm:p-8">
          {/* URL Box */}
          <div className="border border-white/10 rounded-none p-5 sm:p-6 bg-zinc-950 mb-6 sm:mb-8 flex flex-col items-center">
            <a 
              href={url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-white hover:text-[#ff9e00] font-mono text-xs mb-4 sm:mb-6 transition-colors break-all text-center"
            >
              {url}
            </a>
            
            <div className="flex items-center justify-center w-full mt-2">
              <a 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-8 py-3 rounded-none border border-[#ff9e00]/20 text-[#ff9e00] bg-zinc-950 hover:bg-[#ff9e00]/10 hover:border-[#ff9e00] transition-colors font-mono font-bold text-xs uppercase tracking-wider"
              >
                <ExternalLink className="w-4 h-4" /> <span>Lihat Website</span>
              </a>
            </div>
          </div>

          {/* Share Section */}
          <div className="flex flex-col items-center">
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/40 mb-4">Bagikan website Anda</p>
            <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
              <button 
                onClick={shareFacebook}
                className="w-10 h-10 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all"
                title="Share to Facebook"
              >
                <FacebookIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={shareTwitter}
                className="w-10 h-10 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all"
                title="Share to X (Twitter)"
              >
                <TwitterIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={shareLinkedIn}
                className="w-10 h-10 rounded-none bg-zinc-950 border border-white/10 flex items-center justify-center text-white/70 hover:bg-white hover:text-black hover:border-white transition-all"
                title="Share to LinkedIn"
              >
                <LinkedinIcon className="w-4 h-4" />
              </button>
              <button 
                onClick={copyToClipboard}
                className={`w-10 h-10 rounded-none border flex items-center justify-center transition-all ${
                  copied 
                    ? 'bg-[#ff9e00] border-[#ff9e00] text-black' 
                    : 'bg-zinc-950 border-white/10 text-white/70 hover:bg-[#ff9e00] hover:text-black hover:border-[#ff9e00]'
                }`}
                title="Copy Link"
              >
                {copied ? <Check className="w-4 h-4" /> : <LinkIcon className="w-4 h-4" />}
              </button>
              <button 
                onClick={() => setShowQR(!showQR)}
                className={`px-4 h-10 rounded-none border flex items-center justify-center gap-2 transition-all font-mono font-bold text-xs uppercase tracking-wider ${
                  showQR
                    ? 'border-[#ff9e00] bg-[#ff9e00] text-black'
                    : 'border-white/10 text-white/60 hover:bg-zinc-950 hover:border-[#ff9e00] hover:text-[#ff9e00]'
                }`}
              >
                <QrCode className="w-4 h-4" /> <span>Kode QR</span>
              </button>
            </div>

            {/* QR Code Expansion */}
            {showQR && (
              <div className="mt-6 p-4 bg-white border border-white/10 rounded-none animate-in slide-in-from-top-2 duration-200">
                <QRCode value={url} size={150} level="H" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
