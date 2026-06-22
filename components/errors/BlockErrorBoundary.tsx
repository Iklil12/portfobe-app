import React from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { AlertOctagon, RefreshCw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: any) {
  return (
    <div className="w-full p-8 border border-red-500/20 bg-black/40 backdrop-blur-md rounded-2xl my-4 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mb-6 text-red-500">
        <AlertOctagon className="w-8 h-8" />
      </div>
      <h3 className="text-white font-mono font-bold text-lg mb-2 uppercase tracking-wide">
        Gagal Memuat Blok
      </h3>
      <p className="text-white/50 text-sm max-w-md mb-8 font-mono break-words leading-relaxed">
        {error?.message || 'Terjadi kesalahan sistem saat me-render komponen ini. Sisa halaman tetap aman.'}
      </p>
      <button 
        onClick={resetErrorBoundary}
        className="px-6 py-3 bg-white hover:bg-gray-200 transition-colors text-black font-mono font-bold uppercase tracking-widest text-xs flex items-center gap-2 cursor-pointer rounded-full"
      >
        <RefreshCw className="w-4 h-4" />
        Coba Muat Ulang
      </button>
    </div>
  );
}

export function BlockErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundary>
  );
}
