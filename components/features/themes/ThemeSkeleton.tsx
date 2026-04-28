import React from 'react';

export function ThemeSkeleton() {
  return (
    <main className="min-h-screen bg-[#FAFAFA] font-sans relative overflow-hidden pb-24">
      <style dangerouslySetInnerHTML={{__html: `
        .bg-grid-slate { background-size: 40px 40px; background-image: linear-gradient(to right, rgba(15, 23, 42, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(15, 23, 42, 0.03) 1px, transparent 1px); }
        .shimmer { background: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%); background-size: 200% 100%; animation: shimmer 1.5s infinite; }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
      `}} />
      <div className="absolute inset-0 bg-grid-slate pointer-events-none z-0 mask-image:linear-gradient(to_bottom,white,transparent)"></div>
      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
          <div>
            <div className="w-28 h-7 shimmer rounded-full mb-6"></div>
            <div className="w-64 md:w-80 h-12 shimmer rounded-lg mb-4"></div>
            <div className="w-full max-w-md h-4 shimmer rounded-full mb-2"></div>
            <div className="w-64 h-4 shimmer rounded-full"></div>
          </div>
          <div className="w-40 h-14 shimmer rounded-full hidden md:block"></div>
        </div>

        {/* Grid Skeleton (Immersive Style) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-24">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-slate-100 rounded-[2.5rem] border border-slate-200 h-[450px] relative overflow-hidden shadow-sm">
              <div className="absolute inset-0 shimmer"></div>
              <div className="absolute inset-x-3 bottom-3 h-[180px] bg-white/40 backdrop-blur-md rounded-[2rem] p-5 flex flex-col justify-end gap-3 border border-white/40">
                 <div className="w-2/3 h-6 bg-slate-300/50 rounded-md"></div>
                 <div className="w-full h-3 bg-slate-300/50 rounded-md"></div>
                 <div className="w-4/5 h-3 bg-slate-300/50 rounded-md mb-3"></div>
                 <div className="w-full h-12 bg-slate-300/50 rounded-2xl"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
