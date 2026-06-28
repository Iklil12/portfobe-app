"use client";

import React, { useEffect, useRef, useState } from 'react';
import { 
  PenTool, 
  Layers, 
  Globe, 
  SearchCode, 
  Wand2, 
  ArrowRight, 
  CheckCircle,
  Clock 
} from 'lucide-react';

export default function BuildWithAIPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    const el = containerRef.current;
    if (el) el.addEventListener('mousemove', handleMouseMove);
    return () => { if (el) el.removeEventListener('mousemove', handleMouseMove); };
  }, []);

  const features = [
    {
      icon: PenTool,
      label: 'Auto-Write',
      desc: 'AI generates engaging bios & project descriptions from your simple bullet points',
      delay: 0,
    },
    {
      icon: Layers,
      label: 'Smart Theme',
      desc: 'Best theme & color recommendations based on in-depth analysis of your portfolio works',
      delay: 100,
    },
    {
      icon: Globe,
      label: 'Translate+',
      desc: 'Translate your entire portfolio to English with precise grammar in one click',
      delay: 200,
    },
    {
      icon: SearchCode,
      label: 'SEO Boost',
      desc: 'Keyword optimization so your portfolio is easily found on Google and other search engines',
      delay: 300,
    },
  ];

  const words = ['Profesional', 'Berkesan', 'Unik', 'Memukau', 'Kelas Dunia'];
  const [wordIndex, setWordIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setWordIndex(prev => (prev + 1) % words.length);
        setFade(true);
      }, 300);
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      ref={containerRef}
      className="ai-page relative flex-1 w-full h-full overflow-y-auto overflow-x-hidden"
      style={{ background: '#050505' }}
    >
      <style>{`
        @keyframes ai-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-12px) rotate(1deg); }
          66% { transform: translateY(-6px) rotate(-1deg); }
        }
        @keyframes ai-pulse-ring {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 0.3; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
        @keyframes ai-rotate-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes ai-slide-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ai-shimmer {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes ai-grid-flash {
          0%, 100% { opacity: 0.02; }
          50% { opacity: 0.05; }
        }
        @keyframes ai-badge-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(255,158,0,0.15); }
          50% { box-shadow: 0 0 35px rgba(255,158,0,0.3); }
        }
        @keyframes ai-scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }

        .ai-float { animation: ai-float 6s ease-in-out infinite; }
        .ai-pulse-ring { animation: ai-pulse-ring 3s ease-in-out infinite; }
        .ai-rotate-slow { animation: ai-rotate-slow 20s linear infinite; }
        .ai-shimmer-text {
          background: linear-gradient(90deg, #ff9e00 0%, #fff 50%, #ff9e00 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ai-shimmer 4s linear infinite;
        }
        .ai-card-hover {
          transition: all 0.3s ease;
        }
        .ai-card-hover:hover {
          transform: translateY(-4px);
        }
        .ai-slide-up { animation: ai-slide-up 0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .ai-delay-0 { animation-delay: 0ms; }
        .ai-delay-100 { animation-delay: 100ms; }
        .ai-delay-200 { animation-delay: 200ms; }
        .ai-delay-300 { animation-delay: 300ms; }
        .ai-delay-400 { animation-delay: 400ms; }
        .ai-delay-500 { animation-delay: 500ms; }
        .ai-delay-600 { animation-delay: 600ms; }
        .ai-grid-flash { animation: ai-grid-flash 4s ease-in-out infinite; }
        .ai-badge-glow { animation: ai-badge-glow 2.5s ease-in-out infinite; }
        .ai-word { transition: opacity 0.3s ease, transform 0.3s ease; }
        .ai-word-visible { opacity: 1; transform: translateY(0); }
        .ai-word-hidden { opacity: 0; transform: translateY(8px); }
        .ai-input {
          background: rgba(255,255,255,0.02);
          border: 1px solid rgba(255,255,255,0.1);
          color: #fff;
          transition: all 0.3s;
        }
        .ai-input:focus {
          outline: none;
          border-color: rgba(255,158,0,0.4);
          background: rgba(255,158,0,0.02);
          box-shadow: none;
        }
        .ai-input::placeholder { color: rgba(255,255,255,0.2); }
        .ai-cta-btn {
          background: #ff9e00;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        .ai-cta-btn:hover { background: #ffaa22; }
        .ai-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(255,158,0,0.5), transparent);
          animation: ai-scan-line 3s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── RADIAL MOUSE-FOLLOW GLOW ───────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,158,0,0.04), transparent 70%)`,
        }}
      />

      {/* ── ANIMATED GRID ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 ai-grid-flash"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── AMBIENT ORBS ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[#ff9e00]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-[#ff9e00]/2 rounded-full blur-[120px]" />
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center min-h-full px-6 py-20 max-w-4xl mx-auto">

        {/* ── BADGE ─────────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-0 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-md border border-[#ff9e00]/20 bg-[#ff9e00]/5 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff9e00] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff9e00]"></span>
            </span>
            <span className="text-[10px] font-sans font-medium text-[#ff9e00]">Coming Soon · In Development</span>
          </div>
        </div>

        {/* ── HERO ICON ─────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-100 mb-10 relative">
          <div className="absolute inset-0 rounded-md ai-pulse-ring"
            style={{ background: 'rgba(255,158,0,0.1)', transform: 'scale(1.3)' }} />
          <div className="absolute inset-0 rounded-md ai-rotate-slow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 60%, rgba(255,158,0,0.5), transparent 80%)',
              padding: '1px',
              scale: '1.1',
            }} />

          <div className="relative w-20 h-20 bg-zinc-900 border border-white/10 rounded-md flex items-center justify-center ai-float">
            <Wand2 className="w-8 h-8 text-[#ff9e00]" />
            <div className="ai-scan-line" />
          </div>
        </div>

        {/* ── HEADLINE ──────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-200 text-center mb-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-sans font-medium uppercase  text-white leading-tight">
            Portofolio yang{' '}
            <span
              className={`inline-block ai-shimmer-text ai-word ${fade ? 'ai-word-visible' : 'ai-word-hidden'}`}
              style={{ minWidth: '230px', display: 'inline-block' }}
            >
              {words[wordIndex]}
            </span>
            <br />
            <span className="text-white/60 font-sans font-medium text-lg sm:text-xl md:text-2xl mt-2 block">Built by AI</span>
          </h1>
        </div>

        {/* ── SUBHEADLINE ─────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-300 text-center mb-14 max-w-lg">
          <p className="text-white/60 font-mono text-xs leading-relaxed">
            Just tell us who you are — our AI will generate a stunning, SEO-optimized portfolio ready to attract your dream clients.
          </p>
        </div>

        {/* ── FEATURE CARDS ─────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-400 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.label}
                className="ai-card-hover rounded-md p-6 bg-[#0a0a0a] border border-white/10 hover:border-[#ff9e00]/40 transition-colors cursor-default"
              >
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-md bg-[#ff9e00]/10 border border-[#ff9e00]/25 text-[#ff9e00] flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-sans font-medium text-xs text-white mb-1.5">{f.label}</p>
                    <p className="text-white/60 font-mono text-[10px] leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── NOTIFY ME FORM ────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-500 w-full max-w-md mb-16">
          <div className="bg-zinc-950 border border-white/10 rounded-md p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12"
              style={{ background: 'radial-gradient(circle, rgba(255,158,0,0.08), transparent 70%)' }} />
            <p className="text-[9px] font-sans font-medium text-[#ff9e00] mb-2">
              Get Early Access
            </p>
            <p className="font-sans font-medium text-sm text-white mb-5">
              Register your email, be the first to try ✨
            </p>

            {!submitted ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="youremail@example.com"
                  className="ai-input flex-1 rounded-md px-4 py-3 text-xs font-sans font-medium"
                />
                <button
                  onClick={() => { if (email) setSubmitted(true); }}
                  className="ai-cta-btn rounded-md px-5 py-3 text-black flex items-center justify-center"
                >
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5 py-3 px-4 rounded-md bg-emerald-950/20 border border-emerald-900/30 text-emerald-400">
                <CheckCircle className="w-4 h-4 shrink-0" />
                <p className="text-[11px] font-sans font-medium">
                  Success! We will notify you first 🎉
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── TIMELINE ──────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-600 w-full max-w-md">
          <p className="text-center text-[9px] font-sans font-medium text-white/50 mb-6">Roadmap</p>
          <div className="space-y-4 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px bg-white/5" />
            {[
              { phase: 'Alpha', label: 'Auto-Write Bio & Description', done: false, active: true },
              { phase: 'Beta', label: 'Smart Theme & Color AI', done: false, active: false },
              { phase: 'v1.0', label: 'SEO Optimizer + Translator', done: false, active: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 relative">
                <div className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 text-[9px] font-sans font-medium z-10 ${item.active ? 'bg-[#ff9e00]/10 border border-[#ff9e00]/30 text-[#ff9e00] ai-badge-glow' : 'bg-zinc-900 border border-white/10 text-white/60'}`}
                >
                  {item.phase}
                </div>
                <p className={`text-xs font-sans font-medium ${item.active ? 'text-white' : 'text-white/50'}`}>
                  {item.label}
                </p>
                {item.active && (
                  <span className="ml-auto text-[9px] px-2 py-0.5 rounded-md font-sans font-medium bg-[#ff9e00] text-black">
                    Next
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <p className="mt-16 text-[9px] font-sans text-white/20 text-center">
          © 2025 Portfo.be · All AI features will be available gradually
        </p>
      </div>
    </div>
  );
}
