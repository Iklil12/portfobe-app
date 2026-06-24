import React from 'react';

export function ThemeSkeleton() {
  return (
    <main className="min-h-screen font-sans relative overflow-hidden pb-24">
      <div className="max-w-6xl mx-auto p-6 md:p-10 relative z-10">
        
        {/* Header Skeleton */}
        <div className="mb-12 flex flex-col md:flex-row md:justify-between md:items-end gap-6 mt-4">
          <div>
            <div className="w-28 h-7 bg-white/5 border border-white/5 rounded-none mb-6 shimmer"></div>
            <div className="w-64 md:w-80 h-12 bg-white/5 border border-white/5 rounded-none mb-4 shimmer"></div>
            <div className="w-full max-w-md h-4 bg-white/5 border border-white/5 rounded-none mb-2 shimmer"></div>
            <div className="w-64 h-4 bg-white/5 border border-white/5 rounded-none shimmer"></div>
          </div>
          <div className="w-40 h-14 bg-white/5 border border-white/5 rounded-none hidden md:block shimmer"></div>
        </div>

        {/* Filter Tab Skeleton */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-1 bg-zinc-900 border border-white/10 rounded-none p-1">
            {[82, 58, 52, 72].map((w, i) => (
              <div
                key={i}
                className="h-9 rounded-none bg-white/5 shimmer"
                style={{ width: w }}
              />
            ))}
          </div>
        </div>

        {/* Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="flex flex-col gap-3">
              {/* Visual Card 4:3 */}
              <div className="relative w-full aspect-[4/3] bg-[#050505] rounded-none border border-white/10 overflow-hidden">
                <div className="absolute inset-0 bg-white/5 shimmer"></div>
              </div>
              
              {/* Footer Metadata */}
              <div className="flex justify-between items-center px-1">
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 bg-white/5 border border-white/5 rounded-none shimmer"></div>
                  <div className="w-24 h-4 bg-white/5 border border-white/5 rounded-none shimmer"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-8 h-3 bg-white/5 border border-white/5 rounded-none shimmer"></div>
                  <div className="w-8 h-3 bg-white/5 border border-white/5 rounded-none shimmer"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
