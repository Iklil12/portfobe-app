"use client";

import React, { useState, useEffect } from 'react';
import { showToast } from '@/lib/customToast';
import useSWR from 'swr';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell,
  AreaChart,
  Area
} from 'recharts';

const fetcher = (url: string) => fetch(url).then(res => res.json());

// Smooth Counter Component
function AnimatedCounter({ value, duration = 1500 }: { value: number | string, duration?: number }) {
  const [count, setCount] = useState(typeof value === 'number' ? 0 : value);

  useEffect(() => {
    if (typeof value !== 'number') return;
    let startTime: number | null = null;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      setCount(Math.round(easeOut * value));

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return <>{typeof count === 'number' ? count.toLocaleString() : count}</>;
}

export default function AnalyticsPage() {
  const [isAnimationReady, setIsAnimationReady] = useState(false);
  const [range, setRange] = useState('7d');
  const { data, isLoading, error } = useSWR(`/api/analytics/stats?range=${range}`, fetcher, {
    refreshInterval: 30000 // Refresh every 30s
  });

  const { data: userData, isLoading: isUserLoading } = useSWR('/api/layout-sync', fetcher);
  const userPlan = userData?.plan || 'FREE';

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !isUserLoading && isMounted) {
      const timer = setTimeout(() => setIsAnimationReady(true), 150);
      return () => clearTimeout(timer);
    }
  }, [isLoading, isUserLoading, isMounted]);

  const handleProFeature = () => {
    showToast({
      message: userPlan === 'FREE' ? "Upgrade ke PRO untuk membuka metrik ini!" : "Fitur Heatmaps & Demografis sedang dikembangkan!",
      id: "analytics-pro-toast",
      icon: "fa-crown"
    });
  };

  if (isLoading || isUserLoading || !isMounted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-[3px] border-slate-200 border-t-slate-900 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-400 text-[10px] font-extrabold uppercase tracking-widest animate-pulse">Menghitung Data Audience...</p>
      </div>
    );
  }

  const statsData: { totalViews: number; uniqueVisitors: number; avgTime: string; bounceRate: string } = data?.stats || { totalViews: 0, uniqueVisitors: 0, avgTime: '0s', bounceRate: '0%' };
  const chartData: { day: string; views: number }[] = data?.chartData || [];
  const sources: { name: string; count: number; percentage: number }[] = data?.sources || [];

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 md:px-10 py-10 font-sans selection:bg-slate-200 selection:text-slate-900 pb-32">
      
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
        * { font-family: 'Plus Jakarta Sans', sans-serif; }
        
        .animate-enter { 
            opacity: 0; 
            animation: slideUpFade 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
        }
        @keyframes slideUpFade {
            0% { opacity: 0; transform: translateY(20px); }
            100% { opacity: 1; transform: translateY(0); }
        }
      `}} />

      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 animate-enter gap-6">
        <div className="text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Audience <span className="font-light text-slate-400">Metrics.</span>
            </h1>
            {userPlan === 'PRO' ? (
               <span className="bg-slate-900 text-white text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase flex items-center gap-1.5 shadow-sm">
                  <i className="fas fa-crown text-[8px] text-[#ff9e00]"></i> PRO
               </span>
            ) : (
               <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2.5 py-1 rounded-md tracking-widest uppercase border border-slate-200">FREE</span>
            )}
          </div>
          <p className="text-sm font-medium text-slate-500">Pantau performa, jangkauan, dan interaksi portofolio Anda.</p>
        </div>
        
        {/* RANGE SELECTOR */}
        <div className="flex bg-slate-100 p-1 rounded-2xl self-center md:self-auto border border-slate-200/50">
          {[
            { id: '7d', label: '7 Hari', pro: false },
            { id: '30d', label: '30 Hari', pro: true },
            { id: 'all', label: 'Semua', pro: true }
          ].map((item) => {
            const isLocked = item.pro && userPlan === 'FREE';
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (isLocked) {
                    showToast({ message: "Upgrade PRO untuk melihat data historis lebih dari 7 hari!", id: "range-pro", icon: "fa-lock" });
                    return;
                  }
                  setRange(item.id);
                }}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2 ${range === item.id ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                {item.label}
                {isLocked && <i className="fas fa-lock text-[8px] opacity-40"></i>}
              </button>
            );
          })}
        </div>
      </div>

      {/* STATS OVERVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-12">
        {[
            { label: 'Total Views', val: statsData.totalViews, icon: 'fa-eye', pro: false },
            { label: 'Unique Visitors', val: statsData.uniqueVisitors, icon: 'fa-user', pro: false },
            { label: 'Avg. Time', val: statsData.avgTime, icon: 'fa-clock', pro: true },
            { label: 'Bounce Rate', val: statsData.bounceRate, icon: 'fa-sign-out-alt', pro: true },
        ].map((stat, i) => {
            const isLocked = stat.pro && userPlan === 'FREE';
            return (
              <div key={i} className={`bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] hover:-translate-y-1 transition-all duration-300 animate-enter flex flex-col justify-between min-h-[140px] group relative ${isLocked ? 'cursor-pointer overflow-hidden' : ''}`} style={{animationDelay: `${i * 100}ms`}} onClick={isLocked ? handleProFeature : undefined}>
                  {isLocked && (
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-all group-hover:backdrop-blur-[1px] group-hover:bg-white/30">
                        <div className="w-9 h-9 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs shadow-lg mb-2">
                           <i className="fas fa-lock"></i>
                        </div>
                        <span className="text-[9px] font-black uppercase tracking-tighter text-slate-900">PRO ONLY</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-6">
                      <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
                      <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:bg-slate-100 group-hover:text-slate-600 transition-colors shrink-0">
                          <i className={`fas ${stat.icon} text-[10px]`}></i>
                      </div>
                  </div>
                  <div className="flex items-end justify-between mt-auto">
                      <h3 className={`text-3xl md:text-[2.5rem] font-black text-slate-900 tracking-tighter leading-none ${isLocked ? 'blur-sm grayscale opacity-30' : ''}`}>
                         <AnimatedCounter value={stat.val} duration={1200 + (i * 200)} />
                      </h3>
                  </div>
              </div>
            );
        })}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-16">
        
        {/* TRAFFIC CHART (RECHARTS) */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all animate-enter flex flex-col h-[450px]" style={{animationDelay: '400ms'}}>
          <div className="flex justify-between items-start mb-10">
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 tracking-tight mb-1">Traffic Overview</h4>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Aktivitas harian</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <i className="fas fa-chart-line text-sm"></i>
            </div>
          </div>
          
          <div className="flex-1 w-full min-h-[300px] mt-auto">
            {isMounted && (
              <ResponsiveContainer width="100%" height="100%" minHeight={300}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="day" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} 
                  dy={15}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} 
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc', radius: 10 }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', fontSize: '11px', fontWeight: 'bold' }}
                />
                <Bar 
                  dataKey="views" 
                  fill="#0f172a" 
                  radius={[10, 10, 0, 0]} 
                  barSize={32}
                  animationDuration={1500}
                >
                    {chartData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={index === chartData.length - 1 ? '#0f172a' : '#e2e8f0'} className="hover:fill-[#ff9e00] transition-colors" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* TOP SOURCES */}
        <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.01)] hover:shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-all animate-enter flex flex-col h-[450px]" style={{animationDelay: '500ms'}}>
          <div className="flex justify-between items-start mb-10">
            <div>
              <h4 className="font-extrabold text-lg text-slate-900 tracking-tight mb-1">Top Sources</h4>
              <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">Darimana klien berasal</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100 shrink-0">
              <i className="fas fa-bullseye text-sm"></i>
            </div>
          </div>
          
            <div className="space-y-6 overflow-y-auto pr-2 custom-scrollbar">
            {sources.length === 0 ? (
               <div className="flex flex-col items-center justify-center py-10 opacity-30">
                  <i className="fas fa-ghost text-4xl mb-4"></i>
                  <p className="text-[10px] font-bold uppercase tracking-widest">Belum ada data traffic</p>
               </div>
            ) : sources.map((src, i) => (
              <div key={i} className="group/src cursor-default">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold flex items-center gap-3 text-slate-700 group-hover/src:text-slate-900 transition-colors">
                    <div className="w-8 h-8 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover/src:bg-white group-hover/src:border-slate-200 group-hover/src:text-slate-900 transition-all shrink-0">
                        <i className={`fas ${src.name === 'Instagram' ? 'fab fa-instagram' : src.name === 'Google' ? 'fab fa-google' : src.name === 'WhatsApp' ? 'fab fa-whatsapp' : 'fa-link'} text-xs`}></i>
                    </div>
                    {src.name}
                  </span>
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-black text-slate-900"><AnimatedCounter value={src.percentage} duration={1500} />%</span>
                    <span className="text-[9px] font-bold text-slate-400"><AnimatedCounter value={src.count} duration={1300} /> Hits</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-slate-900 h-full rounded-full transition-all ease-[cubic-bezier(0.22,1,0.36,1)] group-hover/src:bg-[#ff9e00]" 
                    style={{ 
                      width: isAnimationReady ? `${src.percentage}%` : '0%',
                      transitionDuration: '1.5s',
                      transitionDelay: `${i * 150}ms`
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION COMING SOON - PRO CREATOR */}
      <div 
        onClick={handleProFeature}
        className="relative overflow-hidden bg-[#050505] p-10 md:p-16 rounded-[2.5rem] border border-slate-800 cursor-pointer group shadow-2xl animate-enter hover:border-slate-700 transition-all duration-500"
        style={{animationDelay: '600ms'}}
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/noise-pattern-with-subtle-cross-lines.png')] opacity-[0.03] pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg h-[200px] bg-[#ff9e00]/5 blur-[100px] rounded-full group-hover:bg-[#ff9e00]/10 transition-colors duration-700 pointer-events-none"></div>

        <div className="absolute top-0 right-10 p-8 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-transform duration-700 pointer-events-none">
            <i className="fas fa-chart-pie text-[15rem]"></i>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-8 group-hover:text-white transition-colors">
              <i className="fas fa-crown text-[#ff9e00]"></i> Pro Feature
            </div>

            <h4 className="text-3xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">Advanced <span className="font-light text-slate-500">Insights.</span></h4>
            
            <p className="text-slate-400 text-sm md:text-base font-medium leading-relaxed mb-10">
                Pahami audiens Anda lebih dalam. Dapatkan data geografis, peta panas (Heatmaps) dari pengunjung, dan pelacakan interaksi secara real-time.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3 mb-10">
                {['Real-time Tracking', 'Visitor Demographics', 'Click Heatmaps', 'Conversion Funnel'].map((tag, i) => (
                    <span key={tag} className="px-5 py-2 bg-[#111] text-slate-400 text-[10px] font-bold rounded-full uppercase tracking-widest border border-white/5 hover:bg-white/10 hover:text-white transition-colors cursor-default">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-full text-xs font-extrabold uppercase tracking-widest shadow-lg group-hover:bg-slate-200 transition-all duration-300 active:scale-95">
                <i className="fas fa-lock text-slate-500"></i> Tersedia Segera
            </div>
        </div>
      </div>

    </main>
  );
}