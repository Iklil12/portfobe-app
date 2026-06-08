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
      showToast({ id: 'copy-success', message: 'Tautan disalin ke clipboard!', icon: 'fa-check' });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      showToast({ id: 'copy-error', message: 'Gagal menyalin tautan.', icon: 'fa-times' });
    }
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Lihat%20portofolio%20profesional%20saya%20di%20Portfo.be!`, '_blank');
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
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-sm"
            onClick={onClose}
          ></motion.div>

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-neutral-100 flex items-center justify-between relative">
              <div className="flex-1 flex justify-center pr-8 sm:pr-0">
                <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight text-center">Bagikan Portofolio</h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors active:scale-95"
              >
                <i className="fas fa-times text-sm"></i>
              </button>
            </div>

            {/* Content */}
            <div className="p-5 sm:p-8">
              {/* URL Box */}
              <div className="border border-neutral-200 rounded-2xl p-5 sm:p-6 bg-neutral-50/50 mb-6 sm:mb-8 flex flex-col items-center">
                <a 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-neutral-900 hover:text-blue-600 font-medium text-base sm:text-lg mb-4 sm:mb-6 transition-colors break-all text-center"
                >
                  {url}
                </a>
                
                <div className="flex items-center justify-center w-full mt-2">
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-8 py-3 rounded-full border border-orange-200 text-orange-600 bg-orange-50 hover:bg-orange-100 transition-colors font-bold text-sm"
                  >
                    <i className="fas fa-external-link-alt"></i> Lihat Website
                  </a>
                </div>
              </div>

              {/* Share Section */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-neutral-900 mb-4">Bagikan ke Media Sosial</p>
                <div className="flex items-center justify-center gap-2 sm:gap-3 flex-wrap">
                  <button 
                    onClick={shareFacebook}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#1877F2] hover:bg-[#1877F2] hover:text-white transition-all hover:border-[#1877F2]"
                  >
                    <i className="fab fa-facebook-f"></i>
                  </button>
                  <button 
                    onClick={shareTwitter}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-neutral-900 hover:bg-neutral-900 hover:text-white transition-all hover:border-neutral-900"
                  >
                    <i className="fab fa-twitter"></i>
                  </button>
                  <button 
                    onClick={shareLinkedIn}
                    className="w-10 h-10 rounded-full border border-neutral-200 flex items-center justify-center text-[#0A66C2] hover:bg-[#0A66C2] hover:text-white transition-all hover:border-[#0A66C2]"
                  >
                    <i className="fab fa-linkedin-in"></i>
                  </button>
                  <button 
                    onClick={handleCopy}
                    className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                      isCopied 
                        ? 'border-orange-500 bg-orange-500 text-white' 
                        : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                    }`}
                    title="Copy Link"
                  >
                    <i className={isCopied ? "fas fa-check" : "fas fa-link"}></i>
                  </button>
                  <button 
                    onClick={() => setShowQR(!showQR)}
                    className={`px-4 h-10 rounded-full border flex items-center justify-center gap-2 transition-all font-semibold text-sm ${
                      showQR
                        ? 'border-orange-500 bg-orange-500 text-white'
                        : 'border-neutral-200 text-orange-600 hover:bg-orange-50 hover:border-orange-200'
                    }`}
                  >
                    <i className="fas fa-qrcode"></i> Kode QR
                  </button>
                </div>

                {/* QR Code Expansion */}
                <AnimatePresence>
                  {showQR && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="p-4 bg-white border border-neutral-200 rounded-2xl overflow-hidden"
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
