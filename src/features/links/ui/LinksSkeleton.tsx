import React from 'react';

export function LinksSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i, index) => (
        <div 
            key={i} 
            className="h-auto sm:h-28 w-full bg-zinc-950 rounded-none border border-white/10 flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-6 gap-4 sm:gap-6 shadow-none animate-enter"
            style={{animationDelay: `${index * 80}ms`, opacity: 0}}
        >
            <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 rounded-none shrink-0 border border-white/5 shimmer"></div>
            <div className="flex-1 w-full space-y-3">
                <div className="h-5 w-2/3 sm:w-1/3 bg-white/5 rounded-none border border-transparent shimmer"></div>
                <div className="h-3 w-full sm:w-1/2 bg-white/5 rounded-none border border-transparent shimmer"></div>
            </div>
            <div className="w-full sm:w-24 h-10 bg-white/5 rounded-none border border-transparent shimmer mt-2 sm:mt-0"></div>
        </div>
      ))}
    </>
  );
}

export function AddingSkeleton() {
  return (
    <div className="h-auto sm:h-28 w-full bg-zinc-950 rounded-none border border-white/10 flex flex-col sm:flex-row items-start sm:items-center p-5 sm:p-6 gap-4 sm:gap-6 shadow-none animate-enter">
        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white/5 rounded-none shrink-0 border border-white/5 shimmer"></div>
        <div className="flex-1 w-full space-y-3">
            <div className="h-5 w-2/3 sm:w-1/3 bg-white/5 rounded-none border border-transparent shimmer"></div>
            <div className="h-3 w-full sm:w-1/2 bg-white/5 rounded-none border border-transparent shimmer"></div>
        </div>
    </div>
  );
}
