"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { showToast } from '@/lib/customToast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  subdomain: string;
  avatarUrl?: string;
}

export function ShareModal({ isOpen, onClose, subdomain, avatarUrl }: ShareModalProps) {
  const [showQR, setShowQR] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const url = `https://portfo.be/${subdomain}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      showToast({ id: 'copy-success', message: 'Link copied to clipboard!', icon: 'fa-check' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showToast({ id: 'copy-error', message: 'Failed to copy link.', icon: 'fa-times' });
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Check%20out%20my%20professional%20portfolio%20on%20Portfo.be!`, '_blank');
  };

  const shareLinkedIn = () => {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[1000001] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[#050505] w-full max-w-xl rounded-none border border-white/10 shadow-[0_0_40px_rgba(255,158,0,0.05)] overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 md:p-6 border-b border-white/10 flex items-center justify-between relative bg-zinc-950">
              <div className="flex-1 flex justify-center pr-8 sm:pr-0">
                <h2 className="text-sm md:text-base font-mono font-bold text-white uppercase tracking-wider text-center">Share Portfolio</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-none border border-white/10 bg-zinc-900 flex items-center justify-center text-white/50 hover:text-white hover:bg-zinc-800 transition-colors active:scale-95"
              >
                <i className="fas fa-times text-sm"></i>
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
                  className="text-white hover:text-[#ff9e00] font-mono text-sm md:text-base mb-4 sm:mb-6 transition-colors break-all text-center underline decoration-white/20 underline-offset-4"
                >
                  {url}
                </a>

                <div className="flex items-center justify-center w-full mt-2">
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-none border border-[#ff9e00]/25 text-[#ff9e00] bg-[#ff9e00]/5 hover:bg-[#ff9e00]/10 transition-colors font-mono font-bold text-[10px] uppercase tracking-wider"
                  >
                    <i className="fas fa-external-link-alt"></i> View Website
                  </a>
                </div>
              </div>

              {/* Share Section */}
              <div className="flex flex-col items-center">
                <p className="text-[10px] font-mono font-bold text-white/40 mb-4 uppercase tracking-widest">Share to Social Media</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <button
                    onClick={shareFacebook}
                    className="w-10 h-10 rounded-none border border-white/10 bg-zinc-900 flex items-center justify-center text-white/70 hover:bg-zinc-800 hover:text-[#1877F2] transition-all hover:border-white/20"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button
                    onClick={shareTwitter}
                    className="w-10 h-10 rounded-none border border-white/10 bg-zinc-900 flex items-center justify-center text-white/70 hover:bg-zinc-800 hover:text-white transition-all hover:border-white/20"
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button
                    onClick={shareLinkedIn}
                    className="w-10 h-10 rounded-none border border-white/10 bg-zinc-900 flex items-center justify-center text-white/70 hover:bg-zinc-800 hover:text-[#0A66C2] transition-all hover:border-white/20"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button
                    onClick={handleCopy}
                    className={`w-10 h-10 rounded-none border flex items-center justify-center transition-all ${isCopied
                        ? 'border-[#ff9e00] bg-[#ff9e00] text-black'
                        : 'border-white/10 bg-zinc-900 text-white/70 hover:bg-zinc-800 hover:text-white hover:border-white/20'
                      }`}
                    title="Copy Link"
                  >
                    <i className={isCopied ? "fas fa-check" : "fas fa-link"}></i>
                  </button>
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className={`px-4 h-10 rounded-none border flex items-center justify-center gap-2 transition-colors font-mono text-[10px] font-bold uppercase tracking-wider ${showQR
                        ? 'border-[#ff9e00] bg-[#ff9e00] text-black'
                        : 'border-white/10 bg-zinc-900 text-white/70 hover:bg-zinc-800 hover:text-white hover:border-white/20'
                      }`}
                  >
                    <i className="fas fa-qrcode"></i> QR Code
                  </button>
                </div>

                {/* QR Code Expansion */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="p-4 bg-white border-4 border-zinc-800 rounded-none overflow-hidden"
                    >
                      <QRCode value={url} size={150} level="H" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
