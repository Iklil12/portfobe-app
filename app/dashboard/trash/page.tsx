"use client";

import React from "react";
import { useTrash } from "@/hooks/useTrash";
import { 
  Video, 
  Image as ImageIcon, 
  Award, 
  Box as BoxIcon,
  FileText,
  Clock,
  Trash2,
  Undo2,
  X,
  Check,
  ChevronDown,
  Loader2
} from 'lucide-react';

const TYPE_ICON: Record<string, React.ComponentType<any>> = {
  video:       Video,
  photo:       ImageIcon,
  certificate: Award,
  "3d":        BoxIcon,
};

const TYPE_LABEL: Record<string, string> = {
  video:       "Video",
  photo:       "Foto",
  certificate: "Sertifikat",
  "3d":        "3D Model",
};

function DaysLeftBadge({ days }: { days: number }) {
  const urgent = days <= 3;
  const warning = days <= 7;
  return (
    <span className={`inline-flex items-center gap-1.5 text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-none uppercase tracking-wider border
      ${urgent 
        ? "bg-rose-950/20 border-rose-900/30 text-rose-400" 
        : warning 
        ? "bg-amber-950/20 border-amber-900/30 text-amber-400" 
        : "bg-white/5 border-white/10 text-white/50"}`}>
      <Clock className={`w-2.5 h-2.5 ${urgent ? "animate-pulse text-rose-500" : ""}`} />
      {days === 0 ? "Kedaluwarsa hari ini" : `${days} hari lagi`}
    </span>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-zinc-950 rounded-none p-4 border border-white/10 flex gap-4 animate-pulse">
      <div className="w-16 h-16 rounded-none bg-white/5 border border-white/5 shrink-0 shimmer" />
      <div className="flex-1 space-y-2 py-1">
        <div className="h-4 bg-white/5 border border-white/5 rounded-none w-2/3 shimmer" />
        <div className="h-3 bg-white/5 border border-white/5 rounded-none w-1/3 shimmer" />
        <div className="h-3 bg-white/5 border border-white/5 rounded-none w-1/4 shimmer" />
      </div>
      <div className="flex flex-col gap-2 shrink-0">
        <div className="h-8 w-24 bg-white/5 border border-white/5 rounded-none shimmer" />
        <div className="h-8 w-24 bg-white/5 border border-white/5 rounded-none shimmer" />
      </div>
    </div>
  );
}

export default function TrashPage() {
  const { state, actions } = useTrash();
  const { items, isLoading, isLoadingMore, totalCount, hasMore, confirmPurgeAll, processingId } = state;
  const { restore, purge, purgeAll, loadMore, setConfirmPurgeAll, getDaysLeft } = actions;

  return (
    <main className="min-h-screen font-sans pb-24 selection:bg-[#ff9e00]/30 selection:text-white">
      <style dangerouslySetInnerHTML={{ __html: `
        .animate-enter { opacity:0; animation: slideUp 0.7s cubic-bezier(0.16,1,0.3,1) forwards; }
        @keyframes slideUp {
          from { opacity:0; transform:translateY(32px) scale(0.98); filter:blur(4px); }
          to   { opacity:1; transform:translateY(0)    scale(1);    filter:blur(0);   }
        }
      `}} />

      <div className="max-w-3xl mx-auto p-6 md:p-10">

        {/* ── Header ── */}
        <div className="mb-8 animate-enter">
          <div className="flex items-center gap-3.5 mb-1">
            <div className="w-9 h-9 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 text-white/50">
              <Trash2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-display font-bold uppercase tracking-wider text-white">Trash</h1>
              <p className="text-xs text-white/40 font-mono mt-1">
                Item yang dihapus akan otomatis dihapus permanen setelah <strong className="text-white/60">30 hari</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* ── Actions bar ── */}
        {!isLoading && totalCount > 0 && (
          <div className="flex items-center justify-between mb-5 animate-enter" style={{ animationDelay: "80ms" }}>
            <span className="text-[10px] font-mono font-bold text-white/40 uppercase tracking-widest">
              {items.length < totalCount
                ? `${items.length} dari ${totalCount} item di trash`
                : `${totalCount} item di trash`}
            </span>

            {!confirmPurgeAll ? (
              <button
                onClick={() => setConfirmPurgeAll(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-none text-[10px] font-mono font-bold text-rose-400 border border-rose-900/30 hover:bg-rose-950/20 hover:border-rose-900/40 transition-colors uppercase tracking-wider"
              >
                <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                Kosongkan Semua
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-white/50 uppercase tracking-wider">Yakin hapus semua?</span>
                <button
                  onClick={purgeAll}
                  disabled={processingId === "all"}
                  className="px-3 py-1.5 rounded-none text-[10px] font-mono font-bold bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-50 uppercase tracking-wider"
                >
                  {processingId === "all" ? <Loader2 className="w-3 h-3 animate-spin" /> : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setConfirmPurgeAll(false)}
                  disabled={processingId === "all"}
                  className="px-3 py-1.5 rounded-none text-[10px] font-mono font-bold border border-white/10 bg-zinc-900 text-white/70 hover:bg-zinc-800 transition-colors disabled:opacity-50 uppercase tracking-wider"
                >
                  Batal
                </button>
              </div>
            )}
          </div>
        )}

        {/* ── List ── */}
        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={i} />)
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center animate-enter">
              <div className="w-14 h-14 bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center mb-4 text-white/30 text-xl">
                <Check className="w-5 h-5" />
              </div>
              <p className="font-mono font-bold text-white uppercase tracking-wider mb-1">Trash kosong</p>
              <p className="text-white/40 text-xs font-mono">
                Tidak ada item yang dihapus. Semua data aman!
              </p>
            </div>
          ) : (
            items.map((item, idx) => {
              const daysLeft = getDaysLeft(item.expiresAt);
              const isProcessing = processingId === item.id;
              const IconComponent = TYPE_ICON[item.projectType] ?? FileText;
              const label = TYPE_LABEL[item.projectType] ?? item.projectType;

              return (
                <div
                  key={item.id}
                  className="animate-enter bg-zinc-950 rounded-none border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div className="flex items-center gap-4 p-4">
                    {/* Thumbnail / Icon */}
                    <div className="w-14 h-14 rounded-none bg-zinc-900 border border-white/10 flex items-center justify-center shrink-0 overflow-hidden text-white/40">
                      {item.mediaUrl && item.projectType !== "3d" ? (
                        <img
                          src={item.projectType === "video"
                            ? `https://img.youtube.com/vi/${extractYtId(item.mediaUrl)}/mqdefault.jpg`
                            : item.mediaUrl}
                          alt={item.title}
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : (
                        <IconComponent className="w-5 h-5" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-mono font-bold text-white text-sm truncate">{item.title}</p>
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="inline-flex items-center gap-1 text-[9px] font-mono font-bold uppercase tracking-wider text-white/50 bg-white/5 border border-white/10 px-2 py-0.5 rounded-none">
                          <IconComponent className="w-2.5 h-2.5" />{label}
                        </span>
                        <DaysLeftBadge days={daysLeft} />
                      </div>
                      <p className="text-[9px] font-mono text-white/30 mt-1.5">
                        Dihapus {formatDate(item.deletedAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2 shrink-0">
                      <button
                        onClick={() => restore(item.id, item.itemType)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest bg-[#ff9e00] hover:bg-[#ffaa22] text-black transition-colors disabled:opacity-40"
                      >
                        {isProcessing
                          ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          : <Undo2 className="w-3.5 h-3.5" />}
                        Pulihkan
                      </button>
                      <button
                        onClick={() => purge(item.id, item.itemType)}
                        disabled={isProcessing}
                        className="flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest bg-zinc-900 border border-white/10 text-white/50 hover:bg-rose-950/20 hover:text-rose-400 hover:border-rose-900/30 transition-colors disabled:opacity-40"
                      >
                        <X className="w-3.5 h-3.5" />
                        Hapus
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Load More ── */}
        {!isLoading && hasMore && (
          <div className="flex justify-center mt-6 animate-enter">
            <button
              onClick={loadMore}
              disabled={isLoadingMore}
              className="flex items-center gap-2 px-5 py-3 rounded-none text-[10px] font-mono font-bold uppercase tracking-widest border border-white/10 bg-zinc-900 text-white/70 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              {isLoadingMore ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Memuat...</>
              ) : (
                <><ChevronDown className="w-3.5 h-3.5" /> Muat {Math.min(10, totalCount - items.length)} Item Lagi</>
              )}
            </button>
          </div>
        )}

        {/* ── Semua sudah dimuat ── */}
        {!isLoading && !hasMore && totalCount > 10 && (
          <p className="text-center text-[9px] font-mono text-white/30 font-bold uppercase tracking-widest mt-6">
            Semua {totalCount} item sudah ditampilkan
          </p>
        )}
      </div>
    </main>
  );
}

// ── helpers ──────────────────────────────────────────────────────────────────
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

function extractYtId(url: string) {
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  return m ? m[1] : "";
}
