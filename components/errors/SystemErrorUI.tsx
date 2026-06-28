import { BaseErrorLayout } from './BaseErrorLayout';
import { Terminal, RefreshCw } from 'lucide-react';

interface SystemErrorUIProps {
  error?: Error & { digest?: string };
  reset?: () => void;
}

export function SystemErrorUI({ error, reset }: SystemErrorUIProps) {
  return (
    <BaseErrorLayout>
      <div className="w-16 h-16 mb-8 rounded-md bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500">
        <Terminal className="w-8 h-8" />
      </div>

      <h1 className="text-xl md:text-2xl font-sans font-medium tracking-wider uppercase mb-4 text-white">
        System Malfunction
      </h1>
      
      <p className="text-xs font-sans text-white/40 mb-8 leading-relaxed max-w-md">
        Ups, terjadi kesalahan pada server internal kami. Tim teknis telah diberitahu dan sedang menanganinya.
      </p>

      {error?.message && (
        <div className="mb-12 p-4 bg-black/50 border border-white/10 rounded-md text-left max-w-lg w-full overflow-hidden">
          <p className="text-xs text-rose-400/80 font-sans break-words">
            {error.message}
          </p>
        </div>
      )}

      <div className="flex gap-4">
        <button 
          onClick={() => reset ? reset() : window.location.reload()}
          className="px-8 py-4 bg-[#ff9e00] hover:bg-[#ffaa22] transition-colors text-black font-sans font-medium uppercase tracking-widest text-[11px] rounded-md active:scale-95 flex items-center gap-2 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Muat Ulang
        </button>
      </div>
    </BaseErrorLayout>
  );
}
