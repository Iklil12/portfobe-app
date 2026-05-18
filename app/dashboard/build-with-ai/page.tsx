"use client";

import React, { useEffect, useRef, useState } from 'react';

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
      icon: 'fas fa-pen-nib',
      label: 'Auto-Write',
      desc: 'AI menyusun bio & deskripsi proyek yang menarik dari poin-poin sederhana milikmu',
      color: 'from-violet-500 to-indigo-500',
      glow: 'shadow-violet-500/20',
      delay: 0,
    },
    {
      icon: 'fas fa-layer-group',
      label: 'Smart Theme',
      desc: 'Rekomendasi tema & warna terbaik berdasarkan analisis karya portofoliomu secara mendalam',
      color: 'from-emerald-500 to-teal-500',
      glow: 'shadow-emerald-500/20',
      delay: 100,
    },
    {
      icon: 'fas fa-language',
      label: 'Translate+',
      desc: 'Terjemahkan seluruh portofolio ke Inggris dengan grammar presisi dalam satu klik',
      color: 'from-amber-500 to-orange-500',
      glow: 'shadow-amber-500/20',
      delay: 200,
    },
    {
      icon: 'fas fa-magnifying-glass-chart',
      label: 'SEO Boost',
      desc: 'Optimasi kata kunci agar portofoliomu mudah ditemukan di Google dan mesin pencari lainnya',
      color: 'from-rose-500 to-pink-500',
      glow: 'shadow-rose-500/20',
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
      style={{ background: '#03030a' }}
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
        @keyframes ai-particle {
          0% { transform: translateY(0) translateX(0) scale(1); opacity: 0.7; }
          100% { transform: translateY(-80px) translateX(var(--tx)) scale(0); opacity: 0; }
        }
        @keyframes ai-grid-flash {
          0%, 100% { opacity: 0.03; }
          50% { opacity: 0.07; }
        }
        @keyframes ai-badge-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(139,92,246,0.4), 0 0 40px rgba(139,92,246,0.2); }
          50% { box-shadow: 0 0 30px rgba(139,92,246,0.7), 0 0 60px rgba(139,92,246,0.3); }
        }
        @keyframes ai-word-fade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes ai-scan-line {
          0% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes ai-border-spin {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        .ai-float { animation: ai-float 6s ease-in-out infinite; }
        .ai-pulse-ring { animation: ai-pulse-ring 3s ease-in-out infinite; }
        .ai-rotate-slow { animation: ai-rotate-slow 20s linear infinite; }
        .ai-shimmer-text {
          background: linear-gradient(90deg, #c4b5fd 0%, #fff 30%, #f59e0b 60%, #a78bfa 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: ai-shimmer 4s linear infinite;
        }
        .ai-card-hover {
          transition: all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .ai-card-hover:hover {
          transform: translateY(-6px) scale(1.02);
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
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.1);
          color: #e2e8f0;
          transition: all 0.3s;
        }
        .ai-input:focus {
          outline: none;
          border-color: rgba(139,92,246,0.6);
          background: rgba(139,92,246,0.06);
          box-shadow: 0 0 0 3px rgba(139,92,246,0.15);
        }
        .ai-input::placeholder { color: rgba(148,163,184,0.5); }
        .ai-cta-btn {
          background: linear-gradient(135deg, #7c3aed, #4f46e5);
          transition: all 0.3s cubic-bezier(0.22,1,0.36,1);
          position: relative;
          overflow: hidden;
        }
        .ai-cta-btn::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .ai-cta-btn:hover { transform: translateY(-1px); box-shadow: 0 12px 30px rgba(124,58,237,0.4); }
        .ai-cta-btn:hover::before { opacity: 1; }
        .ai-scan-line {
          position: absolute;
          left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(139,92,246,0.7), transparent);
          animation: ai-scan-line 3s ease-in-out infinite;
          pointer-events: none;
        }
      `}</style>

      {/* ── RADIAL MOUSE-FOLLOW GLOW ───────────────────────────── */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-all duration-500"
        style={{
          background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(139,92,246,0.08), transparent 70%)`,
        }}
      />

      {/* ── ANIMATED GRID ─────────────────────────────────────── */}
      <div
        className="pointer-events-none absolute inset-0 z-0 ai-grid-flash"
        style={{
          backgroundImage: `linear-gradient(rgba(139,92,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.06) 1px, transparent 1px)`,
          backgroundSize: '48px 48px',
        }}
      />

      {/* ── AMBIENT ORBS ──────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] w-[300px] h-[300px] bg-amber-500/5 rounded-full blur-[80px] -translate-x-1/2" />
      </div>

      {/* ── MAIN CONTENT ──────────────────────────────────────── */}
      <div className="relative z-10 flex flex-col items-center min-h-full px-6 py-20 max-w-4xl mx-auto">

        {/* ── BADGE ─────────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-0 mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full ai-badge-glow"
            style={{ background: 'rgba(139,92,246,0.12)', border: '1px solid rgba(139,92,246,0.35)' }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-400"></span>
            </span>
            <span className="text-[11px] font-extrabold text-violet-300 uppercase tracking-widest">Coming Soon · Dalam Pengembangan</span>
          </div>
        </div>

        {/* ── HERO ICON ─────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-100 mb-10 relative">
          {/* Outer pulse */}
          <div className="absolute inset-0 rounded-3xl ai-pulse-ring"
            style={{ background: 'rgba(139,92,246,0.15)', transform: 'scale(1.5)' }} />
          {/* Rotating ring */}
          <div className="absolute inset-0 rounded-3xl ai-rotate-slow"
            style={{
              background: 'conic-gradient(from 0deg, transparent 60%, rgba(139,92,246,0.6), transparent 80%)',
              padding: '2px',
              borderRadius: '24px',
              scale: '1.18',
            }} />

          <div className="relative w-24 h-24 rounded-3xl flex items-center justify-center ai-float"
            style={{ background: 'linear-gradient(135deg, #1e1b4b, #2e1065)', border: '1px solid rgba(139,92,246,0.4)' }}>
            <i className="fas fa-wand-magic-sparkles text-4xl" style={{ color: '#c4b5fd' }}></i>
            <div className="ai-scan-line" />
          </div>
        </div>

        {/* ── HEADLINE ──────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-200 text-center mb-6">
          <h1 className="text-5xl font-black leading-tight tracking-tight" style={{ color: '#f8fafc' }}>
            Portofolio yang{' '}
            <span
              className={`inline-block ai-shimmer-text ai-word ${fade ? 'ai-word-visible' : 'ai-word-hidden'}`}
              style={{ minWidth: '230px', display: 'inline-block' }}
            >
              {words[wordIndex]}
            </span>
            <br />
            <span style={{ color: 'rgba(148,163,184,0.7)' }}>Dibangun oleh AI</span>
          </h1>
        </div>

        {/* ── SUBHEADLINE ─────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-300 text-center mb-14 max-w-lg">
          <p style={{ color: 'rgba(148,163,184,0.75)', fontSize: '16px', lineHeight: '1.7' }}>
            Cukup ceritakan siapa kamu — AI kami akan menyusun portofolio yang memukau, teroptimasi SEO, dan siap menarik klien impianmu.
          </p>
        </div>

        {/* ── FEATURE CARDS ─────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-400 w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mb-14">
          {features.map((f) => (
            <div
              key={f.label}
              className="ai-card-hover rounded-2xl p-6 cursor-default"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                backdropFilter: 'blur(12px)',
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${f.glow}`}
                  style={{ background: `linear-gradient(135deg, ${getColor(f.color, 0)}, ${getColor(f.color, 1)})` }}
                >
                  <i className={`${f.icon} text-white text-[14px]`}></i>
                </div>
                <div>
                  <p className="font-extrabold text-[13px] mb-1" style={{ color: '#e2e8f0' }}>{f.label}</p>
                  <p style={{ color: 'rgba(148,163,184,0.7)', fontSize: '12px', lineHeight: '1.6' }}>{f.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── NOTIFY ME FORM ────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-500 w-full max-w-md mb-16">
          <div className="rounded-3xl p-8 relative overflow-hidden"
            style={{
              background: 'rgba(139,92,246,0.06)',
              border: '1px solid rgba(139,92,246,0.2)',
              backdropFilter: 'blur(20px)',
            }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -mr-12 -mt-12"
              style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.2), transparent 70%)' }} />
            <p className="text-[11px] font-extrabold uppercase tracking-widest mb-2"
              style={{ color: '#a78bfa' }}>Dapatkan Akses Pertama</p>
            <p className="font-extrabold text-[17px] mb-5" style={{ color: '#f1f5f9' }}>
              Daftarkan Email-mu, Jadilah yang Pertama Mencoba ✨
            </p>

            {!submitted ? (
              <div className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="emailmu@example.com"
                  className="ai-input flex-1 rounded-xl px-4 py-3 text-[13px] font-medium"
                />
                <button
                  onClick={() => { if (email) setSubmitted(true); }}
                  className="ai-cta-btn rounded-xl px-5 py-3 text-[13px] font-extrabold text-white flex-shrink-0"
                >
                  <i className="fas fa-arrow-right"></i>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-3 px-4 rounded-xl"
                style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.2)' }}>
                <i className="fas fa-circle-check text-emerald-400 text-lg"></i>
                <p className="text-[13px] font-bold" style={{ color: '#86efac' }}>
                  Berhasil! Kami akan kabari kamu duluan 🎉
                </p>
              </div>
            )}
          </div>
        </div>

        {/* ── TIMELINE ──────────────────────────────────────────── */}
        <div className="ai-slide-up ai-delay-600 w-full max-w-md">
          <p className="text-center text-[10px] font-extrabold uppercase tracking-widest mb-6"
            style={{ color: 'rgba(148,163,184,0.4)' }}>Roadmap</p>
          <div className="space-y-4 relative">
            <div className="absolute left-[19px] top-4 bottom-4 w-px"
              style={{ background: 'rgba(139,92,246,0.15)' }} />
            {[
              { phase: 'Alpha', label: 'Auto-Write Bio & Deskripsi', done: false, active: true },
              { phase: 'Beta', label: 'Smart Theme & Color AI', done: false, active: false },
              { phase: 'v1.0', label: 'SEO Optimizer + Translator', done: false, active: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-4 relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-extrabold z-10 ${item.active ? 'ai-badge-glow' : ''}`}
                  style={{
                    background: item.active ? 'rgba(139,92,246,0.3)' : 'rgba(255,255,255,0.04)',
                    border: item.active ? '1px solid rgba(139,92,246,0.5)' : '1px solid rgba(255,255,255,0.08)',
                    color: item.active ? '#c4b5fd' : 'rgba(148,163,184,0.4)',
                  }}>
                  {item.phase}
                </div>
                <p className="text-[13px] font-semibold"
                  style={{ color: item.active ? '#e2e8f0' : 'rgba(148,163,184,0.4)' }}>
                  {item.label}
                </p>
                {item.active && (
                  <span className="ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold"
                    style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.25)' }}>
                    Next
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── FOOTER ────────────────────────────────────────────── */}
        <p className="mt-16 text-[11px] text-center" style={{ color: 'rgba(100,116,139,0.5)' }}>
          © 2025 Portfo.be · Semua fitur AI akan tersedia secara bertahap
        </p>
      </div>
    </div>
  );
}

// Untuk ekstrak warna dari class tailwind gradient
function getColor(gradient: string, idx: number): string {
  const map: Record<string, string[]> = {
    'from-violet-500 to-indigo-500': ['#8b5cf6', '#6366f1'],
    'from-emerald-500 to-teal-500': ['#10b981', '#14b8a6'],
    'from-amber-500 to-orange-500': ['#f59e0b', '#f97316'],
    'from-rose-500 to-pink-500': ['#f43f5e', '#ec4899'],
  };
  return map[gradient]?.[idx] ?? '#8b5cf6';
}
