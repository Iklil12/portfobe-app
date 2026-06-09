//components/features/settings/BillingContent.tsx
"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import useSWR from "swr";
import Link from "next/link";
import { 
  Crown, Lock, Layers, Receipt, Gift, Loader2, Check, X, HelpCircle, 
  Folder, Palette, User, BarChart2, Globe, ArrowRight 
} from "lucide-react";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

// ── helpers ────────────────────────────────────────────────────────────────────

function formatDate(d: string | null | undefined) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function formatGateway(gateway: string | null) {
  if (!gateway) return "—";
  const map: Record<string, string> = {
    admin_grant: "Manual (Admin)",
    midtrans: "Midtrans",
    xendit: "Xendit",
  };
  return map[gateway] ?? gateway;
}

function StatusBadge({ status }: { status: string }) {
  const cfg: Record<string, string> = {
    ACTIVE:    "bg-emerald-950/20 text-emerald-400 border-emerald-500/20",
    EXPIRED:   "bg-zinc-950 text-white/20 border-white/5",
    CANCELLED: "bg-rose-950/20 text-rose-400 border-rose-500/20",
    SUCCESS:   "bg-emerald-950/20 text-emerald-400 border-emerald-500/20",
    FAILED:    "bg-rose-950/20 text-rose-400 border-rose-500/20",
    PENDING:   "bg-amber-950/20 text-amber-400 border-amber-500/20",
  };
  return (
    <span className={`inline-flex px-2 py-0.5 rounded-none text-[9px] font-mono font-bold tracking-widest uppercase border ${cfg[status] ?? "bg-zinc-950 text-white/30 border-white/5"}`}>
      {status}
    </span>
  );
}

// ── component ──────────────────────────────────────────────────────────────────

export default function BillingContent() {
  const { data, isLoading, mutate } = useSWR("/api/subscriptions", fetcher);
  const [tab, setTab] = useState<"subscriptions" | "transactions">("subscriptions");
  const [isClaimingTrial, setIsClaimingTrial] = useState(false);
  const [isTrialModalOpen, setIsTrialModalOpen] = useState(false);
  const [isTrialSuccess, setIsTrialSuccess] = useState(false);
  const [isMinimumLoadTimeMet, setIsMinimumLoadTimeMet] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Artificial delay to show the beautiful skeleton for a professional feel
  useEffect(() => {
    setMounted(true);
    const timer = setTimeout(() => setIsMinimumLoadTimeMet(true), 1200);
    return () => clearTimeout(timer);
  }, []);

  const plan: string           = data?.plan ?? "FREE";
  const remainingDays: number | null = data?.remainingDays ?? null;
  const isPro                  = plan !== "FREE";
  const isSupreme              = plan === "SUPREME";
  const planLabel              = isSupreme ? "Supreme Creator" : "Pro Creator";
  const canClaimTrial          = data?.canClaimTrial ?? false;
  const sub                    = data?.subscription;
  const subHistory: any[]      = data?.subscriptionHistory ?? [];
  const transactions: any[]    = data?.transactions ?? [];

  const handleOpenTrialModal = () => setIsTrialModalOpen(true);
  const handleCloseTrialModal = () => {
    if (isClaimingTrial) return;
    setIsTrialModalOpen(false);
    setIsTrialSuccess(false);
  };

  const handleClaimTrial = async () => {
    setIsClaimingTrial(true);
    try {
      const res = await fetch("/api/subscriptions/trial", { method: "POST" });
      const json = await res.json();
      if (res.ok) {
        setIsTrialSuccess(true);
        mutate(); // Refresh SWR data
      } else {
        alert("Gagal: " + json.error);
        setIsTrialModalOpen(false);
      }
    } catch (error) {
      alert("Terjadi kesalahan jaringan.");
      setIsTrialModalOpen(false);
    } finally {
      setIsClaimingTrial(false);
    }
  };

  // Skeleton shimmer
  if (isLoading || !isMinimumLoadTimeMet) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8 animate-billing-fade">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
          .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        `}} />
        {/* Header Skeleton */}
        <div className="mb-8">
          <div className="h-9 w-64 shimmer-dark rounded-none mb-3" />
          <div className="h-5 w-80 shimmer-dark rounded-none" />
        </div>
        
        {/* Main Grid Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Card Skeleton */}
          <div className="lg:col-span-2 h-[320px] shimmer-dark rounded-none" />
          
          {/* Right Card Skeleton */}
          <div className="h-[320px] shimmer-dark rounded-none" />
        </div>
        
        {/* Tabs & History Skeleton */}
        <div className="pt-2">
          <div className="h-10 w-64 shimmer-dark rounded-none mb-6" />
          <div className="h-[300px] w-full shimmer-dark rounded-none" />
        </div>
      </div>
    );
  }

  // ── countdown ring helpers ─────────────────────────────────────────────────
  const maxDays = 30; // reference full arc at 30 days
  const pct     = remainingDays === -1 ? 100 : Math.min(100, ((remainingDays ?? 0) / maxDays) * 100);
  const r       = 30;
  const circ    = 2 * Math.PI * r;
  const dash    = circ * (pct / 100);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes billingFadeIn { 0% { opacity: 0; transform: translateY(8px); } 100% { opacity: 1; transform: translateY(0); } }
        .animate-billing-fade { opacity: 0; animation: billingFadeIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
      `}} />

      {/* ── PAGE HEADER ── */}
      <div className="animate-billing-fade">
        <h1 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Billing & Langganan</h1>
        <p className="text-white/40 mt-2 font-mono text-xs">
          Kelola paket akun, pantau sisa hari, dan unduh riwayat transaksi.
        </p>
      </div>

      {/* ── TRIAL BANNER ── */}
      {!isPro && canClaimTrial && (
        <div className="bg-zinc-900/40 p-6 sm:p-8 rounded-none border border-[#ff9e00]/20 flex flex-col sm:flex-row items-center justify-between gap-6 text-white animate-billing-fade">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff9e00]/10 border border-[#ff9e00]/20 rounded-none text-[9px] font-mono font-bold uppercase tracking-widest mb-3 text-[#ff9e00]">
              <Gift className="w-3 h-3" /> Hadiah Pengguna Baru
            </div>
            <h2 className="text-lg font-mono font-bold uppercase tracking-wider mb-1 text-white">Coba PRO Gratis 14 Hari!</h2>
            <p className="text-white/40 text-xs font-mono">Buka semua batas tema, analitik, dan proyek. Tidak perlu kartu kredit.</p>
          </div>
          <button
            onClick={handleOpenTrialModal}
            className="shrink-0 w-full sm:w-auto px-8 py-3 bg-[#ff9e00] text-black font-mono font-bold uppercase tracking-wider text-xs rounded-none hover:bg-[#ffaa22] transition-colors"
          >
            Klaim Trial Sekarang
          </button>
        </div>
      )}

      {/* ── MAIN GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-billing-fade">
        
        {/* LEFT CARD: Current Plan Overview */}
        <div className="lg:col-span-2 bg-zinc-900/40 rounded-none border border-white/10 shadow-none overflow-hidden flex flex-col relative">
          
          <div className="p-8 flex-1 relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest mb-2">Paket Saat Ini</p>
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-mono font-bold text-white uppercase tracking-wider">{isPro ? planLabel : "Starter"}</h2>
                  {isPro && sub && (
                    <span className="px-2 py-0.5 bg-zinc-950 border border-white/10 text-white/50 text-[9px] font-mono font-bold uppercase tracking-widest rounded-none flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-none animate-pulse"></span> Active
                    </span>
                  )}
                </div>
              </div>
              <div className="w-14 h-14 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center shadow-none shrink-0">
                {isPro ? (
                  <Crown className="w-6 h-6 text-[#ff9e00]" />
                ) : (
                  <Lock className="w-6 h-6 text-white/30" />
                )}
              </div>
            </div>

            <div className="space-y-1">
              {isPro && sub ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 mt-6">
                  <div className="py-3 border-b border-white/5">
                    <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-1">Sisa Hari</p>
                    <div className="font-mono font-bold text-white text-xs">
                      {remainingDays === -1 ? (
                        <span className="text-[#ff9e00]">Seumur Hidup ♾️</span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <span>{remainingDays} Hari</span>
                          {remainingDays !== null && remainingDays <= 7 && (
                            <span className="text-[9px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-none uppercase font-mono font-bold">Hampir Habis</span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="py-3 border-b border-white/5">
                    <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-1">Berakhir Pada</p>
                    <p className="font-mono font-bold text-white text-xs">
                      {sub.isLifetime ? "Selamanya" : formatDate(sub.expiredAt)}
                    </p>
                  </div>
                  <div className="py-3 border-b border-white/5 sm:col-span-2">
                    <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-wider mb-1">Siklus Penagihan (Mulai)</p>
                    <p className="font-mono font-bold text-white text-xs">{formatDate(sub.startedAt)}</p>
                  </div>
                </div>
              ) : (
                <div className="pt-2 max-w-lg">
                  <p className="text-xs font-mono text-white/40 leading-relaxed mb-6">
                    Kamu menggunakan paket gratis. Upgrade ke PRO untuk membuka akses ke semua tema, analitik tingkat lanjut, dan menghapus batas proyek.
                  </p>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: "Batas 5 Proyek", icon: Folder },
                      { label: "Tema Terbatas", icon: Palette },
                    ].map((f) => {
                      const IconComp = f.icon;
                      return (
                        <div key={f.label} className="flex items-center gap-2.5 text-[11px] font-mono font-bold uppercase tracking-wider text-white/30">
                          <IconComp className="w-3.5 h-3.5 text-white/20" />
                          <span>{f.label}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Card Footer Actions */}
          <div className="bg-zinc-950/50 p-6 sm:px-8 border-t border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
            {isPro ? (
              <>
                <p className="text-[10px] font-mono text-white/30">
                  Lisensi diberikan oleh: <span className="font-bold text-white/50">{sub?.grantedBy || 'System Admin'}</span>
                </p>
                <a
                  href={`https://wa.me/628xxxxxxxxx?text=Halo%2C+saya+ingin+memperpanjang+paket+${plan}+saya.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors"
                >
                  Perpanjang {plan}
                </a>
              </>
            ) : (
              <>
                <p className="text-[10px] font-mono text-white/30">Tanpa biaya bulanan.</p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#ff9e00] text-black text-xs font-mono font-bold uppercase tracking-wider rounded-none hover:bg-[#ffaa22] transition-colors"
                >
                  <span>Upgrade ke PRO</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </>
            )}
          </div>
        </div>

        {/* RIGHT CARD: Member Profile / Setup */}
        <div className="bg-zinc-900/40 rounded-none p-8 text-white relative overflow-hidden flex flex-col justify-between border border-white/10 shadow-none">
          <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/0 blur-3xl rounded-none translate-x-1/3 -translate-y-1/3 pointer-events-none"></div>
          
          <div className="relative z-10">
            <div className="w-12 h-12 bg-zinc-950 border border-white/5 rounded-none flex items-center justify-center mb-8">
              <User className="w-5 h-5 text-white/40" />
            </div>
            
            <div>
              <p className="text-white/40 text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">Member Sejak</p>
              <p className="text-lg font-mono font-bold tracking-wider">{formatDate(data?.memberSince)}</p>
            </div>
          </div>
          
          <div className="mt-12 pt-6 border-t border-white/5 relative z-10">
            <p className="text-white/40 text-[10px] font-mono font-bold uppercase tracking-widest mb-3">Platform Terhubung</p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center p-1.5">
                <img src="/portfo.be.png" alt="Logo" className="w-full h-full object-contain brightness-0 invert opacity-95" />
              </div>
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Portfobe</span>
            </div>
          </div>
        </div>

      </div>

      {/* ── TABS & HISTORY ── */}
      <div className="animate-billing-fade">
        
        {/* Custom Pill Tabs */}
        <div className="inline-flex p-1 bg-zinc-950 border border-white/10 rounded-none mb-6">
          {(["subscriptions", "transactions"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-none transition-all ${
                tab === t 
                  ? "bg-zinc-900 border border-white/10 text-white" 
                  : "text-white/40 hover:text-white"
              }`}
            >
              {t === "subscriptions" ? "Riwayat Langganan" : "Invoices & Transaksi"}
            </button>
          ))}
        </div>

        {/* History Container */}
        <div className="bg-zinc-900/40 rounded-none border border-white/10 shadow-none overflow-hidden">
          
          {/* SUBSCRIPTIONS VIEW */}
          {tab === "subscriptions" && (
            <div className="divide-y divide-white/5">
              {subHistory.length === 0 ? (
                <EmptyState icon={Layers} text="Belum ada riwayat langganan yang tercatat." />
              ) : (
                subHistory.map((s: any) => (
                  <div key={s.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-zinc-950/20 transition-colors">
                    <div className={`w-12 h-12 rounded-none flex items-center justify-center shrink-0 border ${s.status === "ACTIVE" ? "bg-zinc-950 border-white/10" : "bg-zinc-950 border-white/5"}`}>
                      <Layers className={`w-5 h-5 ${s.status === "ACTIVE" ? "text-[#ff9e00]" : "text-white/20"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          Portfobe {s.plan} {s.isLifetime && "♾"}
                        </span>
                        <StatusBadge status={s.status} />
                      </div>
                      <p className="text-[11px] font-mono text-white/40">
                        {formatDate(s.startedAt)} <span className="mx-2 text-white/20">→</span> {s.isLifetime ? "Seumur Hidup" : formatDate(s.expiredAt)}
                      </p>
                      {s.notes && <p className="text-[10px] font-mono text-white/30 mt-1.5 italic flex items-center gap-1.5"><HelpCircle className="w-3.5 h-3.5 text-white/20" /> {s.notes}</p>}
                    </div>
                    <div className="text-left sm:text-right shrink-0 mt-2 sm:mt-0">
                      <p className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">Dibuat Pada</p>
                      <p className="text-xs font-mono font-bold text-white mt-0.5">{formatDate(s.createdAt)}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TRANSACTIONS VIEW */}
          {tab === "transactions" && (
            <div className="divide-y divide-white/5">
              {transactions.length === 0 ? (
                <EmptyState icon={Receipt} text="Belum ada riwayat transaksi." />
              ) : (
                transactions.map((t: any) => (
                  <div key={t.id} className="p-6 flex flex-col sm:flex-row sm:items-center gap-5 hover:bg-zinc-950/20 transition-colors group">
                    <div className={`w-12 h-12 rounded-none flex items-center justify-center shrink-0 border ${t.status === "SUCCESS" ? "bg-zinc-950 border-white/10" : "bg-zinc-950 border-white/5"}`}>
                      <Receipt className={`w-5 h-5 ${t.status === "SUCCESS" ? "text-emerald-400" : "text-white/20"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                          {t.plan} Access — {t.durationDays >= 36500 ? "Lifetime" : `${t.durationDays} Days`}
                        </span>
                        <StatusBadge status={t.status} />
                      </div>
                      <p className="text-[11px] font-mono text-white/40">
                        via {formatGateway(t.gateway)} · {formatDate(t.createdAt)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:items-end gap-3 mt-4 sm:mt-0">
                      <div className="sm:text-right">
                        <p className="text-sm font-mono font-bold text-white">
                          {t.amount === 0 ? <span className="text-[#ff9e00]">Free / Granted</span> : `Rp ${t.amount.toLocaleString("id-ID")}`}
                        </p>
                        <p className="text-[9px] text-white/30 font-mono mt-0.5">{t.id.substring(0, 12).toUpperCase()}</p>
                      </div>
                      {t.status === "SUCCESS" && (
                        <Link 
                          href={`/receipt/${t.id}`}
                          target="_blank"
                          className="text-[10px] font-mono font-bold text-white/50 hover:text-white bg-zinc-950 border border-white/10 hover:border-white/20 px-3 py-1.5 rounded-none transition-all flex items-center gap-1.5 w-fit"
                        >
                          <span>Receipt</span>
                        </Link>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── TRIAL ACTIVATION MODAL ── */}
      {isTrialModalOpen && mounted && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes floatTrial {
              0% { transform: translateY(0px); }
              50% { transform: translateY(-10px); }
              100% { transform: translateY(0px); }
            }
            @keyframes shimmerTrial {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(100%); }
            }
            .animate-float-trial { animation: floatTrial 4s ease-in-out infinite; }
            .animate-shimmer-trial { animation: shimmerTrial 2.5s infinite; }
          `}} />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={handleCloseTrialModal}></div>
          <div className="relative w-full max-w-4xl bg-zinc-950 rounded-none shadow-[0_20px_80px_-15px_rgba(0,0,0,0.5)] border border-white/10 overflow-hidden flex flex-col md:flex-row">
            
            {/* Success State */}
            {isTrialSuccess ? (
              <div className="p-12 md:p-20 flex flex-col items-center text-center w-full bg-zinc-950 relative overflow-hidden">
                <div className="w-24 h-24 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-none flex items-center justify-center mb-8 relative z-10 shadow-none">
                  <Check className="w-12 h-12" />
                </div>
                <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-4 relative z-10">Selamat Datang di PRO! 🎉</h3>
                <p className="text-white/40 text-xs font-mono leading-relaxed mb-10 max-w-lg relative z-10">
                  Paket <strong>PRO Creator 14 Hari</strong> Anda sudah aktif. Sekarang Anda bebas mengeksplorasi seluruh fitur premium tanpa batas.
                </p>
                <button 
                  onClick={handleCloseTrialModal}
                  className="w-full max-w-sm py-3 bg-[#ff9e00] text-black font-mono font-bold uppercase tracking-wider text-xs rounded-none hover:bg-[#ffaa22] transition-transform active:scale-95 relative z-10"
                >
                  Mulai Gunakan PRO
                </button>
              </div>
            ) : (
              /* Activation State (2 Columns) */
              <>
                {/* Left Column (Graphic) */}
                <div className="hidden md:flex md:w-5/12 bg-zinc-950 p-10 flex-col relative overflow-hidden items-center justify-center text-center border-r border-white/10">
                  <div className="w-24 h-24 bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center mb-8 animate-float-trial relative z-10">
                    <Crown className="w-12 h-12 text-[#ff9e00]" />
                  </div>
                  
                  <h3 className="text-white text-sm font-mono font-bold uppercase tracking-wider mb-3 relative z-10 tracking-tight leading-tight">Portfobe<br/><span className="text-[#ff9e00]">PRO Creator</span></h3>
                  <p className="text-white/40 text-[11px] font-mono relative z-10">Tingkatkan karir profesionalmu dengan alat super lengkap.</p>
                </div>

                {/* Right Column (Content) */}
                <div className="w-full md:w-7/12 p-8 md:p-12 flex flex-col bg-zinc-950">
                  
                  {/* Mobile Header Graphic (Only shows on small screens) */}
                  <div className="md:hidden h-24 bg-zinc-900 rounded-none border border-white/10 flex items-center justify-center mb-6 relative overflow-hidden">
                    <Crown className="w-10 h-10 text-[#ff9e00] relative z-10 animate-float-trial" />
                  </div>

                  <div className="mb-8 text-center md:text-left">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#ff9e00]/10 border border-[#ff9e00]/20 text-[#ff9e00] rounded-none text-[9px] font-mono font-bold uppercase tracking-widest mb-4">
                      <Gift className="w-3 h-3" /> Penawaran Spesial
                    </div>
                    <h3 className="text-lg font-mono font-bold text-white uppercase tracking-wider mb-3">Klaim Trial 14 Hari</h3>
                    <p className="text-white/40 text-xs font-mono">Buka semua fitur tanpa batas. Tanpa perlu memasukkan kartu kredit. 100% Gratis selama masa percobaan.</p>
                  </div>
                  
                  {/* Features List */}
                  <div className="space-y-5 mb-10">
                    {[
                      { icon: BarChart2, title: "Analitik Mendalam", desc: "Pantau pengunjung & performa portofolio." },
                      { icon: Globe, title: "Custom Domain Pribadi", desc: "Ubah URL menjadi namakamu.com." },
                      { icon: Layers, title: "Tanpa Batas Proyek", desc: "Upload karya sebanyak yang kamu mau." },
                      { icon: Palette, title: "Tema Eksklusif", desc: "Akses ke seluruh template premium." }
                    ].map((feature, i) => {
                      const IconComp = feature.icon;
                      return (
                        <div key={i} className="flex items-start gap-4">
                          <div className="w-10 h-10 rounded-none bg-zinc-900 border border-white/10 text-white flex items-center justify-center shrink-0">
                            <IconComp className="w-4 h-4 text-white/50" />
                          </div>
                          <div>
                            <p className="text-xs font-mono font-bold text-white uppercase mb-0.5">{feature.title}</p>
                            <p className="text-[10px] font-mono text-white/40">{feature.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 md:gap-4 mt-auto pt-4 border-t border-white/5">
                    <button 
                      onClick={handleCloseTrialModal}
                      disabled={isClaimingTrial}
                      className="px-6 py-3 bg-zinc-900 border border-white/10 text-white/50 font-mono font-bold uppercase tracking-wider rounded-none hover:bg-zinc-800 transition-colors disabled:opacity-50 text-xs"
                    >
                      Batal
                    </button>
                    <button 
                      onClick={handleClaimTrial}
                      disabled={isClaimingTrial}
                      className="flex-1 py-3 bg-[#ff9e00] text-black font-mono font-bold uppercase tracking-wider rounded-none hover:bg-[#ffaa22] transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-xs relative overflow-hidden group"
                    >
                      {isClaimingTrial ? (
                        <><Loader2 className="w-4 h-4 animate-spin" /> Mengaktifkan...</>
                      ) : (
                        <>Aktifkan Sekarang</>
                      )}
                    </button>
                  </div>
                </div>
              </>
            )}

          </div>
        </div>,
        document.body
      )}

      {/* ── SUPPORT BANNER ── */}
      <div className="animate-billing-fade bg-zinc-900/40 p-6 sm:p-8 border border-white/10 rounded-none flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center shrink-0">
            <HelpCircle className="w-5 h-5 text-white/40" />
          </div>
          <div>
            <h3 className="text-xs font-mono font-bold text-white uppercase mb-1">Punya kendala dengan tagihan?</h3>
            <p className="text-[10px] font-mono text-white/40 leading-relaxed">
              Tim support kami siap membantu pertanyaan soal upgrade, pembayaran, atau perpanjangan.
            </p>
          </div>
        </div>
        <a
          href="/support"
          className="shrink-0 px-6 py-2.5 bg-zinc-950 border border-white/10 text-white text-[11px] font-mono font-bold uppercase tracking-wider rounded-none hover:bg-zinc-900 transition-colors"
        >
          Hubungi Support
        </a>
      </div>

    </div>
  );
}

interface EmptyStateProps {
  icon: React.ComponentType<any>;
  text: string;
}

function EmptyState({ icon: IconComponent, text }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center px-6">
      <div className="w-14 h-14 rounded-none bg-zinc-950 border border-white/5 flex items-center justify-center mb-4 text-white/20">
        <IconComponent className="w-6 h-6" />
      </div>
      <p className="text-xs font-mono text-white/30">{text}</p>
    </div>
  );
}
