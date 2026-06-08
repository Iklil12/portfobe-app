"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import QRCode from 'react-qr-code';

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
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-xl overflow-hidden animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between relative">
          <div className="flex-1 flex justify-center pr-8 sm:pr-0">
            <h2 className="text-lg sm:text-xl font-bold text-neutral-900 tracking-tight text-center">Website Anda telah diperbarui</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors"
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
            <p className="text-sm font-semibold text-neutral-900 mb-4">Bagikan website Anda</p>
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
                onClick={copyToClipboard}
                className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                  copied 
                    ? 'border-orange-500 bg-orange-500 text-white' 
                    : 'border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
                title="Copy Link"
              >
                <i className={copied ? "fas fa-check" : "fas fa-link"}></i>
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
            {showQR && (
              <div className="mt-6 p-4 bg-white border border-neutral-200 rounded-2xl animate-in slide-in-from-top-2 duration-200">
                <QRCode value={url} size={150} level="H" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
