import { BaseErrorLayout } from './BaseErrorLayout';

interface SystemErrorUIProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export function SystemErrorUI({ error, reset }: SystemErrorUIProps) {
  return (
    <BaseErrorLayout>
      <div className="w-16 h-16 mb-8 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
        <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>

      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-white">
        System Malfunction
      </h1>
      
      <p className="text-lg text-white/50 mb-8 leading-relaxed max-w-md">
        Ups, terjadi kesalahan pada server internal kami. Tim teknis telah diberitahu dan sedang menanganinya.
      </p>

      {error?.message && (
        <div className="mb-12 p-4 bg-black/50 border border-white/10 rounded-lg text-left max-w-lg w-full overflow-hidden">
          <p className="text-xs text-red-400/80 font-mono break-words">
            {error.message}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button 
          onClick={() => window.location.reload()}
          className="px-8 py-3 bg-white hover:bg-slate-200 transition-colors text-black font-medium rounded-full"
        >
          Muat Ulang
        </button>
      </div>
    </BaseErrorLayout>
  );
}
