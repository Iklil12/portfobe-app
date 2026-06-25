"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableText } from '@/shared/ui/EditableText';

export function ViewfinderHeroBlock({ data, theme, isEditor, isCardPreview }: any) {
  

  const getBtnShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-md';
      return 'rounded-full';
  };
  const btnShape = getBtnShapeClass(theme?.buttonShape);

  const getCardShapeClass = (shape?: string) => {
      if (shape === 'hard' || shape === 'square') return 'rounded-none';
      if (shape === 'rounded') return 'rounded-xl';
      return 'rounded-2xl';
  };
  const cardShape = getCardShapeClass(theme?.buttonShape);

  const getCardStyleClass = (style?: string) => {
      if (style === 'hard' || style === 'hard-shadow') return 'border border-white/20 bg-[#050505] shadow-[4px_4px_0_0_rgba(255,255,255,0.2)]';
      if (style === 'flat') return 'border border-white/20 bg-transparent';
      if (style === 'soft-shadow' || style === 'soft') return 'border border-white/5 bg-[#0a0a0a] shadow-2xl';
      return 'border border-white/10 bg-[#050505]';
  };
  const cardStyleClass = getCardStyleClass(theme?.cardStyle);

const animationTrigger = (isCardPreview || isEditor) ? "animate" : "whileInView";

  const fullName = data?.profile?.fullName || data?.fullName || "JAMAL ARIFIN";
  const profession = data?.profile?.profession || data?.profession || "Cinematographer & Editor";
  const bio = data?.profile?.bio || data?.bio || "Weaving light, shadow, and sound to capture the human experience. Specializing in high-end commercial and narrative films.";
  const links = data?.links?.filter((l: any) => l.isActive !== false) || data?.user?.links?.filter((l: any) => l.isActive !== false) || [];

  const nameParts = fullName.split(' ');
  const firstName = nameParts[0]?.toUpperCase() || "VISUAL";
  const lastName = nameParts.slice(1).join(' ').toUpperCase() || "STORYTELLER";

  const cinematicEase = [0.16, 1, 0.3, 1] as any;

  // Interactive camera states
  const [aperture, setAperture] = useState<'f1.4' | 'f2.8' | 'f5.6' | 'f16'>('f2.8');
  const [isFlashing, setIsFlashing] = useState(false);

  // Map aperture value to CSS blur amounts
  const blurMap = {
    'f1.4': 'blur-[16px] scale-110',
    'f2.8': 'blur-[8px] scale-105',
    'f5.6': 'blur-[3px] scale-102',
    'f16': 'blur-0 scale-100'
  };

  const triggerShutter = () => {
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
  };

  // Custom cinematic background
  const rawBg = theme?.customImages?.vf_hero_bg || "";
  const displayBg = rawBg || "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop";

  return (
    <section className="relative bg-[#050505] vf-crosshair overflow-hidden border-b border-white/10 shrink-0 select-none" style={{ minHeight: '100svh' }}>

      {/* Shutter White Flash Effect Overlay */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="absolute inset-0 bg-white z-[99] pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="vf-scanline"></div>

      {/* Atmospheric Cinematic Backdrop with interactive blur */}
      <div className="absolute inset-0 z-0">
        <img
          src={displayBg}
          alt="Cinematic background"
          className={`w-full h-full object-cover opacity-20 grayscale transition-all duration-1000 ease-out select-none pointer-events-none ${blurMap[aperture]}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/45 to-[#050505]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(0,0,0,0.85)_100%)]" />
      </div>

      {/* Telemetry metadata left column (PC only) */}
      <div className="absolute left-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 text-[8px] font-mono tracking-[0.2em] text-slate-500 z-10 hidden @lg:flex pointer-events-none">
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold mb-0.5">SHUTTER SPEED</span>
          <span>1/180 SEC</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold mb-0.5">APERTURE DIAL</span>
          <span className="text-white font-bold">{aperture.replace('f', 'F/').toUpperCase()}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold mb-0.5">FOCAL</span>
          <span>85.0 MM</span>
        </div>
      </div>

      {/* Telemetry metadata right column (PC only) */}
      <div className="absolute right-12 top-1/2 -translate-y-1/2 flex flex-col gap-6 text-[8px] font-mono tracking-[0.2em] text-slate-500 z-10 text-right hidden @lg:flex pointer-events-none">
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold mb-0.5">WHITE BAL</span>
          <span>5600 KELVIN</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold mb-0.5">GAMMA PROFILE</span>
          <span>S-LOG3 CINE</span>
        </div>
        <div className="flex flex-col">
          <span className="text-slate-600 font-bold mb-0.5">RECORD CODEC</span>
          <span>RAW 12-BIT</span>
        </div>
      </div>

      {/* Interactive Aperture Control Dial */}
      <div className="absolute bottom-24 @md:bottom-8 left-6 flex items-center gap-3 bg-black/60 border border-white/10 px-4 py-2 ${btnShape} backdrop-blur-md z-30 font-mono text-[9px] tracking-wider text-slate-400">
        <span className="text-white/40 mr-1 text-[8px]">APERTURE:</span>
        {(['f1.4', 'f2.8', 'f5.6', 'f16'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setAperture(f)}
            className={`hover:text-white transition-all duration-300 uppercase px-1 ${aperture === f
                ? 'text-[var(--primary)] font-bold border-b border-[var(--primary)]'
                : 'text-slate-500'
              }`}
          >
            {f.replace('f', 'f/')}
          </button>
        ))}
      </div>

      {/* Interactive Shutter Trigger Button */}
      <div className="absolute bottom-24 @md:bottom-8 right-6 z-30 flex items-center gap-3">
        <span className="font-mono text-[8px] text-slate-500 uppercase tracking-widest hidden @md:inline pointer-events-none">TRIGGER SHUTTER:</span>
        <button
          onClick={triggerShutter}
          className="w-9 h-9 ${btnShape} border border-white/20 flex items-center justify-center bg-black/40 hover:bg-white hover:text-black hover:border-white text-white transition-all duration-300 group shadow-lg active:scale-90"
          title="Ambil Foto (Shutter Flash)"
        >
          <i className="fas fa-camera text-xs group-hover:scale-110 transition-transform" />
        </button>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center px-6 py-24 mix-blend-difference" style={{ minHeight: '100svh' }}>

        {/* Central Camera Autofocus Bracket Box */}
        <div className="absolute w-[260px] h-[190px] @md:w-[540px] @md:h-[320px] border border-white/5 pointer-events-none flex items-center justify-center rounded-sm">
          {/* Corner brackets */}
          <div className="absolute top-0 left-0 w-4 h-4 border-t border-l border-white/30"></div>
          <div className="absolute top-0 right-0 w-4 h-4 border-t border-r border-white/30"></div>
          <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-white/30"></div>
          <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-white/30"></div>

          {/* Status dots inside AF box */}
          <div className="absolute top-2 right-3 font-mono text-[7px] text-white/40 tracking-[0.15em] flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-red-600 animate-ping"></span>
            AF-C
          </div>
          <div className="absolute bottom-2 left-3 font-mono text-[7px] text-white/40 tracking-[0.15em]">
            A: AREA SELECT
          </div>
        </div>

        <motion.div
          initial="hidden"
          {...{ [animationTrigger]: "visible" }}
          viewport={{ once: true, amount: 0 }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { duration: 1.2, ease: cinematicEase, staggerChildren: 0.25 }
            }
          }}
          className="flex flex-col items-center justify-center text-center w-full max-w-4xl mx-auto"
        >
          {/* Tagline / Profession */}
          <motion.p
            variants={{
              hidden: { opacity: 0, letterSpacing: '0.8em', y: -10 },
              visible: { opacity: 1, letterSpacing: '0.4em', y: 0, transition: { duration: 1.5, ease: cinematicEase } }
            }}
            className="text-gray-400 mb-4 uppercase vf-hud-text text-[10px] md:text-xs font-bold"
          >
            <EditableText value={profession} field="profession" entity="profile" isEditor={isEditor} as="span" maxLength={40} />
          </motion.p>

          {/* Heading with "Lens Focus Pull" Animation */}
          <motion.h1
            variants={{
              hidden: { opacity: 0, filter: 'blur(20px)', scale: 1.05 },
              visible: { opacity: 1, filter: 'blur(0px)', scale: 1, transition: { duration: 1.8, ease: cinematicEase } }
            }}
            className="font-cinema leading-none tracking-wider text-[#F3F3F1] text-[clamp(44px,14cqw,64px)] @md:text-[clamp(80px,16cqw,160px)] uppercase select-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
          >
            <EditableText value={firstName} field="firstName" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
            <br />
            <span className="opacity-80">
              <EditableText value={lastName} field="lastName" entity="profile" isEditor={isEditor} as="span" maxLength={20} />
            </span>
          </motion.h1>

          {/* Bio Description */}
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 15 },
              visible: { opacity: 1, y: 0, transition: { duration: 1.2, ease: cinematicEase } }
            }}
            className="text-gray-400 max-w-md mx-auto leading-relaxed mt-6 vf-hud-text text-xs md:text-sm text-center font-medium italic px-4"
          >
            "<EditableText value={bio} field="bio" entity="profile" isEditor={isEditor} as="span" maxLength={250} />"
          </motion.p>

          {/* Social Links / Icons */}
          <motion.div
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
            className="flex justify-center gap-6 mt-8 text-xl text-gray-500 z-10"
          >
            {links.map((link: any, idx: number) => (
              <motion.a
                variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.25, color: "var(--primary)" }}
                whileTap={{ scale: 0.9 }}
                key={idx} href={link.url} target="_blank" rel="noreferrer"
                className="transition-colors duration-300"
              >
                <i className={`fab fa-${link.platform.toLowerCase()}`}></i>
              </motion.a>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
