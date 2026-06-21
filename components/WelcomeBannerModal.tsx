// components/WelcomeBannerModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { X, Gift, Crown, Sun, CloudSun, Coffee, Moon, ArrowRight, Sparkles } from "lucide-react";

interface AdminPromoData {
  isActive: boolean;
  type: "promo" | "info" | "greeting";
  title: string;
  desc: string;
  btnText?: string;
  btnLink?: string;
}

interface WelcomeBannerModalProps {
  userName: string;
  userPlan?: string; 
  adminData?: AdminPromoData | null; 
  canClaimTrial?: boolean;
  isGracePeriod?: boolean;
  remainingGraceDays?: number;
}

export default function WelcomeBannerModal({ 
  userName, 
  userPlan = "FREE", 
  adminData, 
  canClaimTrial = false,
  isGracePeriod = false,
  remainingGraceDays = 0
}: WelcomeBannerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [greeting, setGreeting] = useState<{
    text: string;
    icon: React.ReactNode;
    color: string;
  }>({
    text: "Halo",
    icon: <Sun className="w-12 h-12 text-[#ff9e00]" />,
    color: "from-zinc-950 to-zinc-900"
  });

  useEffect(() => {
    // 1. Logika Jam
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 11) {
      setGreeting({ text: "Selamat Pagi", icon: <Sun className="w-12 h-12 text-[#ff9e00]" />, color: "from-zinc-950 to-zinc-900" });
    } else if (hour >= 11 && hour < 15) {
      setGreeting({ text: "Selamat Siang", icon: <CloudSun className="w-12 h-12 text-[#ff9e00]" />, color: "from-zinc-950 to-zinc-900" });
    } else if (hour >= 15 && hour < 18) {
      setGreeting({ text: "Selamat Sore", icon: <Coffee className="w-12 h-12 text-[#ff9e00]" />, color: "from-zinc-950 to-zinc-900" });
    } else {
      setGreeting({ text: "Selamat Malam", icon: <Moon className="w-12 h-12 text-slate-400" />, color: "from-zinc-950 to-zinc-900" });
    }

    // 2. Cek Session
    const hasSeenPromo = sessionStorage.getItem("hasSeenWelcomePromo");
    if (!hasSeenPromo) {
      const timer = setTimeout(() => setIsOpen(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("hasSeenWelcomePromo", "true");
  };

  if (!isOpen) return null;

  const firstName = userName.split(" ")[0] || "Kreator";

  // LOGIK PRIORITAS KONTEN
  let displayTitle = "";
  let displayDesc = "";
  let displayBg = "from-zinc-950 to-zinc-900";
  let displayIcon: React.ReactNode = null;
  let btnText = "";
  let btnLink = "";
  let badgeLabel = "";

  if (isGracePeriod) {
    displayTitle = "Masa Tenggang PRO ⚠️";
    displayDesc = `Halo ${firstName}! Paket PRO kamu sudah kedaluwarsa. Sistem memberikan tambahan masa tenggang selama ${remainingGraceDays} hari sebelum akun kamu dikembalikan ke paket FREE.`;
    displayBg = "from-zinc-950 to-zinc-900 border-amber-500/20";
    displayIcon = <Crown className="w-12 h-12 text-amber-500 animate-pulse" />;
    btnText = "Perpanjang PRO";
    btnLink = "/dashboard/billing";
    badgeLabel = "⚠️ Peringatan";
  } else if (adminData && adminData.isActive) {
    displayTitle = adminData.title;
    displayDesc = adminData.desc;
    displayBg = "from-zinc-950 to-zinc-900";
    displayIcon = <Sparkles className="w-12 h-12 text-[#ff9e00]" />;
    btnText = adminData.btnText || "Lihat Detail";
    btnLink = adminData.btnLink || "#";
    badgeLabel = adminData.type === 'promo' ? '🔥 Penawaran Spesial' : '💡 Informasi Penting';
  } else if (canClaimTrial) {
    displayTitle = "Klaim Trial PRO 14 Hari! 🎁";
    displayDesc = `Halo ${firstName}! Kesempatan emas untukmu! Buka akses seluruh fitur premium tanpa batas. 100% Gratis, tanpa kartu kredit.`;
    displayBg = "from-zinc-950 to-zinc-900";
    displayIcon = <Gift className="w-12 h-12 text-[#ff9e00] animate-bounce" />;
    btnText = "Klaim Trial Sekarang";
    btnLink = "/dashboard/billing";
    badgeLabel = "🔥 Penawaran Spesial";
  } else if (userPlan === "FREE") {
    displayTitle = "Waktunya Naik Level! 🚀";
    displayDesc = `Halo ${firstName}! Saat ini kamu pakai paket FREE. Upgrade ke PRO untuk custom domain & fitur eksklusif lainnya.`;
    displayBg = "from-zinc-950 to-zinc-900";
    displayIcon = <Crown className="w-12 h-12 text-[#ff9e00] animate-pulse" />;
    btnText = "Upgrade ke Pro";
    btnLink = "/pricing";
    badgeLabel = "💎 Rekomendasi";
  } else {
    displayTitle = `${greeting.text}, ${firstName}!`;
    displayDesc = "Semoga harimu produktif. Apa mahakarya yang ingin kamu bagikan hari ini?";
    displayBg = greeting.color;
    displayIcon = greeting.icon;
    btnText = "Mulai Berkarya";
    btnLink = "/dashboard/projects";
    badgeLabel = "✨ Dashboard Aktif";
  }

  return (
    <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      
      {/* ANIMASI CSS UNTUK BACKDROP & MODAL */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes blurIn { 
          from { opacity: 0; backdrop-filter: blur(0px); -webkit-backdrop-filter: blur(0px); background: rgba(0, 0, 0, 0); } 
          to { opacity: 1; backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); background: rgba(0, 0, 0, 0.85); } 
        }
        @keyframes modalShow { 
          from { opacity: 0; transform: translateY(15px) scale(0.98); } 
          to { opacity: 1; transform: translateY(0) scale(1); } 
        }
        .backdrop-blur-global { 
          animation: blurIn 0.4s ease-out forwards; 
        }
        .modal-animate-in { 
          animation: modalShow 0.5s cubic-bezier(0.22, 1, 0.36, 1) 0.05s forwards; 
          opacity: 0;
        }
      `}} />

      {/* BACKDROP */}
      <div 
        className="fixed inset-0 backdrop-blur-global cursor-pointer"
        onClick={handleClose}
      ></div>

      {/* KONTAINER MODAL */}
      <div className={`relative w-full max-w-2xl bg-gradient-to-br ${displayBg} rounded-none shadow-none overflow-hidden modal-animate-in text-white border border-white/10 z-10`}>
        
        {/* Tombol Close */}
        <button 
          onClick={handleClose} 
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center bg-zinc-950 border border-white/10 text-white/50 hover:text-white rounded-none transition-colors z-20"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Dekorasi Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none"></div>

        <div className="relative z-10 p-8 sm:p-12 flex flex-col sm:flex-row items-center sm:items-start gap-8">
          
          {/* Visual Icon */}
          <div className="shrink-0 w-28 h-28 sm:w-32 sm:h-32 flex items-center justify-center bg-zinc-950 border border-white/10 rounded-none shadow-none">
            {displayIcon}
          </div>

          {/* Konten Teks */}
          <div className="flex-1 text-center sm:text-left">
            <div className="inline-flex items-center px-4 py-1.5 rounded-none bg-zinc-950 border border-white/10 text-[9px] font-mono font-bold uppercase tracking-widest mb-4 text-[#ff9e00]">
              {badgeLabel}
            </div>
            
            <h2 className="text-xl sm:text-2xl font-mono font-bold mb-3 leading-tight tracking-wider uppercase">
              {displayTitle}
            </h2>
            <p className="text-white/60 text-xs sm:text-sm font-mono leading-relaxed mb-8">
              {displayDesc}
            </p>

            <div className="flex justify-center sm:justify-start">
              <Link 
                href={btnLink} 
                onClick={handleClose}
                className="px-8 py-4 bg-[#ff9e00] text-black font-mono font-bold rounded-none text-xs hover:bg-[#ffaa22] transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
              >
                <span>{btnText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}