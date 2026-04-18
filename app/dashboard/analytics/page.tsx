"use client";

import React from 'react';
import toast, { Toaster } from 'react-hot-toast';

export default function AnalyticsPage() {
  
  const handleComingSoon = () => {
    toast('Analitik mendalam akan segera aktif!', {
      icon: '🚀',
      style: { 
        borderRadius: '12px', 
        background: '#111827', 
        color: '#fff',
        fontWeight: 'bold'
      }
    });
  };

  return (
    <main className="max-w-6xl mx-auto p-6 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Toaster position="top-center" />

      {/* HEADER */}
      <div className="mb-10">
        <p className="text-sm text-gray-500 mt-1">Pantau performa dan jangkauan portofolio Anda.</p>
      </div>

      {/* STATS OVERVIEW (Tambahan agar lebih pro) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
            { label: 'Total Views', val: '1.2k', up: '+12%' },
            { label: 'Unique Visitors', val: '842', up: '+5%' },
            { label: 'Avg. Time', val: '2m 14s', up: '+18%' },
            { label: 'Bounce Rate', val: '42%', up: '-2%' },
        ].map((stat, i) => (
            <div key={i} className="bg-white p-5 rounded-[1.5rem] border border-gray-100 shadow-sm">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                <div className="flex items-end gap-2">
                    <span className="text-xl font-black text-gray-900">{stat.val}</span>
                    <span className={`text-[10px] font-bold ${stat.up.includes('+') ? 'text-green-500' : 'text-blue-500'}`}>{stat.up}</span>
                </div>
            </div>
        ))}
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        
        {/* Traffic Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-md transition-all">
          <h4 className="font-bold mb-1 text-gray-900">Traffic Web Portofolio</h4>
          <p className="text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest">Data 7 Hari Terakhir</p>
          
          <div className="flex items-end gap-3 h-48">
            {[
              { h: 'h-[40%]', v: '120' },
              { h: 'h-[60%]', v: '180' },
              { h: 'h-[50%]', v: '150' },
              { h: 'h-[90%]', v: '300', active: true },
              { h: 'h-[70%]', v: '210' },
              { h: 'h-[55%]', v: '165' },
              { h: 'h-[65%]', v: '195' },
            ].map((bar, i) => (
              <div key={i} className={`flex-1 ${bar.active ? 'bg-gray-900 shadow-lg shadow-gray-200' : 'bg-gray-50 hover:bg-gray-200'} ${bar.h} rounded-t-xl transition-all relative group/bar cursor-pointer`}>
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] px-2 py-1 rounded-md opacity-0 group-hover/bar:opacity-100 transition-all font-bold">
                  {bar.v}
                </span>
              </div>
            ))}
          </div>
          
          <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest px-1">
            <span>Sen</span><span>Sel</span><span>Rab</span><span>Kam</span><span>Jum</span><span>Sab</span><span>Min</span>
          </div>
        </div>

        {/* Sources Chart */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm group hover:shadow-md transition-all">
          <h4 className="font-bold mb-1 text-gray-900">Sumber Pengunjung</h4>
          <p className="text-[10px] font-bold text-gray-400 mb-8 uppercase tracking-widest">Dari mana klien menemukanmu</p>
          
          <div className="space-y-7">
            {[
              { name: 'Instagram', icon: 'fab fa-instagram', color: 'text-pink-500', bar: 'from-pink-500 to-orange-400', p: '58%' },
              { name: 'Direct Link', icon: 'fas fa-link', color: 'text-gray-400', bar: 'from-gray-800 to-gray-600', p: '24%' },
              { name: 'Google Search', icon: 'fab fa-google', color: 'text-blue-500', bar: 'from-blue-500 to-indigo-400', p: '18%' },
            ].map((src, i) => (
              <div key={i}>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-bold flex items-center gap-3">
                    <i className={`${src.icon} ${src.color} text-lg`}></i> {src.name}
                  </span>
                  <span className="text-sm font-black text-gray-900">{src.p}</span>
                </div>
                <div className="w-full bg-gray-50 h-3 rounded-full overflow-hidden border border-gray-100">
                  <div className={`bg-gradient-to-r ${src.bar} h-full rounded-full transition-all duration-1000`} style={{ width: src.p }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION COMING SOON - MODERN & CLEAN */}
      <div 
        onClick={handleComingSoon}
        className="relative overflow-hidden bg-white p-10 rounded-[2.5rem] border border-dashed border-gray-200 cursor-pointer group hover:border-blue-200 transition-all"
      >
        <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform">
            <i className="fas fa-chart-pie text-[12rem] -rotate-12"></i>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center max-w-lg mx-auto">
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-6 rotate-3 group-hover:rotate-0 transition-transform">
                <i className="fas fa-rocket text-2xl"></i>
            </div>
            <h4 className="text-2xl font-black text-gray-900 mb-2">Advanced Insights</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
                Kami sedang membangun fitur analitik yang lebih mendalam termasuk <b>Real-time Tracking</b>, <b>Demografi Pengunjung</b>, dan <b>Heatmaps</b>.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-full text-[10px] font-bold uppercase tracking-widest shadow-xl shadow-gray-200 active:scale-95 transition-all">
                <i className="fas fa-hourglass-half"></i> Coming Soon
            </div>
        </div>
      </div>

    </main>
  );
}