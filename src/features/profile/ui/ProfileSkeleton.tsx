//components/features/profile/ProfileSkeleton.tsx
import React from 'react';

export function ProfileSkeleton() {
  return (
    <main className="min-h-screen relative overflow-hidden pb-20 bg-zinc-950">
      <style dangerouslySetInnerHTML={{__html: `
        .shimmer-dark {
          background: linear-gradient(110deg, rgba(255,255,255,0.03) 8%, rgba(255,255,255,0.08) 18%, rgba(255,255,255,0.03) 33%);
          background-size: 200% 100%;
          animation: 1.5s shine linear infinite;
        }
        @keyframes shine { to { background-position-x: -200%; } }
      `}} />
      
      <div className="max-w-4xl mx-auto p-4 sm:p-6 md:p-10 relative z-10">
        
        <div className="mb-12 mt-4">
          <div className="w-32 h-6 shimmer-dark rounded-md mb-6"></div>
          <div className="w-64 md:w-80 h-10 shimmer-dark rounded-md mb-4"></div>
          <div className="w-full max-w-md h-4 shimmer-dark rounded-md"></div>
        </div>
        
        <div className="bg-zinc-900/40 p-6 sm:p-10 md:p-12 border border-white/10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8 mb-10 pb-10 border-b border-white/10">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-md shimmer-dark shrink-0"></div>
              <div className="flex-1 space-y-4 w-full">
                <div className="h-6 w-2/3 sm:w-1/3 shimmer-dark rounded-md"></div>
                <div className="h-8 w-full sm:w-2/3 shimmer-dark rounded-md"></div>
                <div className="flex gap-3 pt-2">
                   <div className="h-8 w-28 shimmer-dark rounded-md"></div>
                   <div className="h-8 w-10 shimmer-dark rounded-md"></div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-8">
               <div className="h-12 w-full shimmer-dark rounded-md"></div>
               <div className="h-12 w-full shimmer-dark rounded-md"></div>
            </div>
            <div className="h-12 w-full shimmer-dark rounded-md mb-8"></div>
            <div className="h-28 w-full shimmer-dark rounded-md"></div>
        </div>
      </div>
    </main>
  );
}
