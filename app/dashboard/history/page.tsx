"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Search, 
  X, 
  Camera, 
  User, 
  Link2, 
  Trash2, 
  Palette, 
  UploadCloud, 
  Edit3, 
  FolderHeart,
  CheckCircle2,
  Clock,
  Globe,
  ShieldAlert,
  KeyRound,
  LogOut
} from 'lucide-react';

// Helper Browser & Device
function getBrowserInfo(ua: string | null) {
  if (!ua) return { name: 'Unknown', icon: <Globe className="w-3.5 h-3.5 text-white/30" /> };
  const lower = ua.toLowerCase();
  
  if (lower.includes('chrome') || lower.includes('crios')) {
    return { name: 'Chrome', icon: <Globe className="w-3.5 h-3.5 text-blue-400" /> };
  }
  if (lower.includes('safari') && !lower.includes('chrome') && !lower.includes('chromium')) {
    return { name: 'Safari', icon: <Globe className="w-3.5 h-3.5 text-sky-400" /> };
  }
  if (lower.includes('firefox') || lower.includes('fxios')) {
    return { name: 'Firefox', icon: <Globe className="w-3.5 h-3.5 text-orange-400" /> };
  }
  if (lower.includes('edge') || lower.includes('edg')) {
    return { name: 'Edge', icon: <Globe className="w-3.5 h-3.5 text-cyan-400" /> };
  }
  if (lower.includes('opera') || lower.includes('opr')) {
    return { name: 'Opera', icon: <Globe className="w-3.5 h-3.5 text-red-500" /> };
  }
  return { name: 'Browser', icon: <Globe className="w-3.5 h-3.5 text-white/40" /> };
}

// Helper Waktu
function timeAgo(dateParam: string | Date) {
  const date = typeof dateParam === 'object' ? dateParam : new Date(dateParam);
  const today = new Date();
  const seconds = Math.round((today.getTime() - date.getTime()) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return 'Baru saja';
  if (minutes < 60) return `${minutes} menit yang lalu`;
  if (hours < 24) return `${hours} jam yang lalu`;
  if (days === 1) return 'Kemarin';
  if (days < 7) return `${days} hari yang lalu`;
  return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// Helper Ikon
function getActivityIcon(actionType: string) {
  switch (actionType) {
    case 'UPDATE_AVATAR': return <Camera className="w-4 h-4" />;
    case 'UPDATE_PROFILE': return <User className="w-4 h-4" />;
    case 'ADD_LINK': 
    case 'UPDATE_LINK': return <Link2 className="w-4 h-4" />;
    case 'DELETE_LINK': return <Trash2 className="w-4 h-4" />;
    case 'CHANGE_THEME': return <Palette className="w-4 h-4" />;
    case 'UPLOAD_PROJECT': return <UploadCloud className="w-4 h-4" />;
    case 'UPDATE_PROJECT': return <Edit3 className="w-4 h-4" />;
    case 'LOGIN_SUCCESS': return <KeyRound className="w-4 h-4 text-emerald-500" />;
    case 'LOGIN_FAILED': return <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />;
    case 'LOGOUT': return <LogOut className="w-4 h-4 text-zinc-400" />;
    default:
      if (actionType.includes('LINK')) return <Link2 className="w-4 h-4" />;
      if (actionType.includes('THEME')) return <Palette className="w-4 h-4" />;
      if (actionType.includes('PROJECT')) return <FolderHeart className="w-4 h-4" />;
      if (actionType.includes('LOGIN')) return <KeyRound className="w-4 h-4" />;
      return <CheckCircle2 className="w-4 h-4" />;
  }
}

export default function HistoryPage() {
  const [activities, setActivities] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAllActivities = async () => {
      try {
        const res = await fetch('/api/activity/all');
        if (res.ok) {
          const jsonResult = await res.json();
          
          const activitiesArray = Array.isArray(jsonResult.data) 
            ? jsonResult.data 
            : (Array.isArray(jsonResult) ? jsonResult : []);
            
          setActivities(activitiesArray);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllActivities();

    const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
            e.preventDefault();
            searchInputRef.current?.focus();
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredActivities = activities.filter(act => 
    act.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
    act.actionType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const highlightText = (text: string, query: string, prefix: string) => {
    if (!query) return text;
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={`${prefix}-h-${i}`} className="bg-[#ff9e00]/25 text-[#ff9e00] px-0.5 font-bold border-b border-[#ff9e00]/40">{part}</mark> 
        : <React.Fragment key={`${prefix}-t-${i}`}>{part}</React.Fragment>
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 md:px-10 py-10 selection:bg-[#ff9e00]/35 selection:text-white pb-32">
      
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <Link href="/dashboard" className="text-[10px] font-mono font-bold uppercase tracking-widest text-white/40 hover:text-[#ff9e00] transition-colors flex items-center gap-2 mb-4 group">
             <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" /> Kembali ke Dashboard
          </Link>
          <h1 className="text-2xl md:text-3xl font-display font-bold uppercase tracking-wider text-white mb-2">
            Activity <span className="text-white/40 font-light">Log.</span>
          </h1>
          <p className="text-xs font-mono text-white/50">Seluruh riwayat perubahan dan aktivitas pada portofolio Anda.</p>
        </div>

        <div className="relative w-full md:w-80 group">
           <Search className={`w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${searchQuery ? 'text-[#ff9e00]' : 'text-white/30'}`} />
           <input 
             ref={searchInputRef}
             type="text" 
             placeholder="Cari..." 
             value={searchQuery}
             onChange={(e) => setSearchQuery(e.target.value)}
             className="w-full pl-11 pr-10 py-3.5 rounded-none border border-white/10 bg-[#0a0a0a] text-white focus:border-[#ff9e00]/40 focus:ring-0 outline-none transition-all text-xs font-mono font-bold placeholder:text-white/20"
           />
           {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-none bg-zinc-900 border border-white/10 text-white/50 hover:bg-zinc-800 hover:text-white transition-all"
              >
                <X className="w-3 h-3" />
              </button>
           )}
        </div>
      </div>

      <div className="bg-zinc-950 border border-white/10 rounded-none overflow-hidden">
        
        {isLoading ? (
          <div className="p-8 space-y-6">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex gap-5">
                <div className="w-12 h-12 bg-white/5 border border-white/5 rounded-none shimmer"></div>
                <div className="flex-1 space-y-3 py-2">
                  <div className="h-4 bg-white/5 rounded-none w-1/2 shimmer"></div>
                  <div className="h-3 bg-white/5 rounded-none w-1/4 shimmer"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          <div className="py-24 flex flex-col items-center justify-center text-center px-6">
             <div className="w-12 h-12 bg-zinc-900 border border-white/10 rounded-none flex items-center justify-center mb-6 text-white/40">
                <Search className="w-6 h-6" />
             </div>
             <p className="text-sm font-mono font-bold text-white uppercase tracking-wider">Aktivitas tidak ditemukan</p>
             <p className="text-xs font-mono text-white/40 mt-1 mb-8">Tidak ada hasil yang cocok dengan kata kunci "{searchQuery}"</p>
             <button onClick={() => setSearchQuery("")} className="text-[9px] font-mono font-bold uppercase tracking-widest bg-[#ff9e00] text-black px-6 py-3 rounded-none hover:bg-[#ffaa22] transition-all shadow-md active:scale-95">
                Reset Pencarian
              </button>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredActivities.map((activity, index) => {
              const isFailed = activity.actionType.includes('FAIL') || activity.actionType === 'LOGIN_FAILED';
              return (
                <div 
                  key={activity.id} 
                  className="flex items-start gap-5 p-6 hover:bg-white/[0.01] transition-colors group border-b border-white/5 last:border-b-0"
                >
                  <div className={`w-12 h-12 shrink-0 rounded-none bg-zinc-900 border flex items-center justify-center transition-all ${
                    isFailed 
                      ? 'border-red-500/30 text-red-500 bg-red-950/10' 
                      : 'border-white/10 text-white/50 group-hover:text-[#ff9e00] group-hover:border-[#ff9e00]/30'
                  }`}>
                      {getActivityIcon(activity.actionType)}
                  </div>
                  <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="text-xs font-mono text-white/90 break-words leading-relaxed">
                            {activity.details.split(/"|'/).map((part: string, i: number) => (
                               <React.Fragment key={`segment-${activity.id}-${i}`}>
                                 {i % 2 === 0 
                                    ? highlightText(part, searchQuery, `text-${activity.id}-${i}`) 
                                    : <span className="text-[#ff9e00] font-bold">"{highlightText(part, searchQuery, `quote-${activity.id}-${i}`)}"</span>
                                 }
                               </React.Fragment>
                            ))}
                          </div>
                          <span className={`text-[9px] font-mono font-bold uppercase tracking-widest shrink-0 px-2 py-0.5 border ${
                            isFailed 
                              ? 'bg-red-500/10 text-red-500 border-red-500/25' 
                              : searchQuery && activity.actionType.toLowerCase().includes(searchQuery.toLowerCase()) 
                                ? 'bg-[#ff9e00]/10 text-[#ff9e00] border-[#ff9e00]/25' 
                                : 'bg-white/[0.02] text-white/30 border-white/5'
                          }`}>
                             {activity.actionType.replace(/_/g, ' ')}
                          </span>
                      </div>
                      <div className="text-[10px] font-mono text-white/40 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                        <span className="flex items-center gap-1.5 font-semibold">
                          <Clock className="w-3.5 h-3.5" /> {timeAgo(activity.createdAt)}
                        </span>
                        
                        {activity.ipAddress && (
                          <span className="flex items-center gap-1.5 border-l border-white/10 pl-4" title={`User Agent: ${activity.userAgent || '-'}`}>
                            {getBrowserInfo(activity.userAgent).icon}
                            <span className="text-white/60">{getBrowserInfo(activity.userAgent).name}</span>
                            <span className="text-white/20">({activity.ipAddress})</span>
                          </span>
                        )}

                        {activity.location && (
                          <span className="flex items-center gap-1.5 border-l border-white/10 pl-4 text-emerald-400/80">
                            <Globe className="w-3.5 h-3.5 text-emerald-500/70" />
                            <span>{activity.location}</span>
                          </span>
                        )}
                      </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {!isLoading && filteredActivities.length > 0 && (
        <p className="text-center mt-10 text-[9px] font-mono font-bold text-white/30 uppercase tracking-[0.2em]">
           End of activity log • {filteredActivities.length} events
        </p>
      )}
    </main>
  );
}