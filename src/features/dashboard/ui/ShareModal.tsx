"use client";

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { showToast } from '@/shared/lib/customToast';
import { Copy, ExternalLink, QrCode, X, Check } from 'lucide-react';

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
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          ></motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-[#1a1a1a] w-full max-w-[480px] rounded-xl border border-white/5 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b border-white/5 flex items-center justify-between relative bg-[#111111]">
              <div>
                <h2 className="text-base font-sans font-bold text-white tracking-wide">Share Portfolio</h2>
                <p className="text-[11px] font-sans text-white/50 mt-0.5">Share your amazing work with the world.</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 rounded-lg border border-white/5 bg-[#1a1a1a] flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-colors active:scale-95"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* URL Input Box */}
              <div className="mb-6">
                <label className="text-[10px] font-sans font-bold text-[#ff9e00] tracking-wider uppercase mb-2 block">Your Portfolio Link</label>
                <div className="flex items-center bg-[#111111] border border-white/5 rounded-lg overflow-hidden group hover:border-white/10 transition-colors">
                  <div className="px-4 py-3 flex-1 overflow-hidden">
                    <p className="text-sm font-mono text-white/80 truncate select-all">{url}</p>
                  </div>
                  <button
                    onClick={handleCopy}
                    className={`h-full px-4 py-3 border-l flex items-center justify-center transition-all ${isCopied ? 'border-[#ff9e00] bg-[#ff9e00] text-black' : 'border-white/5 bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'}`}
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* View Website Button */}
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-lg bg-[#ff9e00] text-black font-sans font-bold text-sm hover:bg-[#ffaa22] hover:shadow-[0_0_20px_rgba(255,158,0,0.4)] active:scale-95 transition-all duration-300 mb-8"
              >
                <ExternalLink className="w-4 h-4" /> View Website
              </a>

              {/* Social Share Section */}
              <div className="border-t border-white/5 pt-6 flex flex-col items-center">
                <p className="text-[10px] font-sans font-bold text-white/40 uppercase tracking-wider mb-4">Or Share Via</p>
                
                <div className="flex items-center justify-center gap-3 w-full">
                  <button
                    onClick={shareFacebook}
                    className="flex-1 h-11 rounded-lg border border-white/5 bg-[#111111] flex flex-col items-center justify-center text-white/60 hover:border-[#1877F2] hover:bg-[#1877F2]/10 hover:text-[#1877F2] transition-all group"
                  >
                    <i className="fab fa-facebook-f text-base"></i>
                  </button>
                  <button
                    onClick={shareTwitter}
                    className="flex-1 h-11 rounded-lg border border-white/5 bg-[#111111] flex flex-col items-center justify-center text-white/60 hover:border-[#1DA1F2] hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2] transition-all group"
                  >
                    <i className="fab fa-twitter text-base"></i>
                  </button>
                  <button
                    onClick={shareLinkedIn}
                    className="flex-1 h-11 rounded-lg border border-white/5 bg-[#111111] flex flex-col items-center justify-center text-white/60 hover:border-[#0A66C2] hover:bg-[#0A66C2]/10 hover:text-[#0A66C2] transition-all group"
                  >
                    <i className="fab fa-linkedin-in text-base"></i>
                  </button>
                  <button
                    onClick={() => setShowQR(!showQR)}
                    className={`flex-1 h-11 rounded-lg border flex items-center justify-center transition-all ${showQR ? 'border-[#ff9e00] bg-[#ff9e00]/10 text-[#ff9e00]' : 'border-white/5 bg-[#111111] text-white/60 hover:border-[#ff9e00] hover:bg-[#ff9e00]/10 hover:text-[#ff9e00]'}`}
                  >
                    <QrCode className="w-5 h-5" />
                  </button>
                </div>

                {/* QR Code Expansion */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 20 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="w-full flex justify-center overflow-hidden"
                    >
                      <div className="p-4 bg-white rounded-xl shadow-[0_0_30px_rgba(255,158,0,0.2)] border-2 border-[#ff9e00]">
                        <QRCode value={url} size={140} level="H" />
                      </div>
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
