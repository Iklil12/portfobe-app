"use client";

import { useEffect, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Terminal, ShieldAlert } from "lucide-react";

function ImpersonateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("Mengautentikasi...");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (token) {
      signIn("credentials", {
        impersonateToken: token,
        redirect: false,
      }).then((result) => {
        if (result?.ok) {
          setStatus("Success! Redirecting to dashboard...");
          router.push("/dashboard");
        } else {
          setStatus("Access Denied: Invalid or expired token!");
          setIsError(true);
          setTimeout(() => router.push("/login"), 3000);
        }
      });
    } else {
      setStatus("Token impersonasi tidak ditemukan di URL!");
      setIsError(true);
      setTimeout(() => router.push("/login"), 3000);
    }
  }, [token, router]);

  const containerStyles = "min-h-screen flex items-center justify-center bg-[#050505] text-white relative overflow-hidden font-sans selection:bg-[#ff9e00] selection:text-black";
  const gridBackground = "absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none";

  return (
    <div className={containerStyles}>
      <style dangerouslySetInnerHTML={{__html: `
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap');
        * { font-family: 'Space Grotesk', sans-serif; }
        input, button, pre, code, .font-mono, label, placeholder { font-family: 'Space Mono', monospace !important; }
      `}} />
      <div className={gridBackground}></div>
      
      {/* Glow effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-violet-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="relative bg-zinc-950 border border-white/15 p-8 md:p-10 max-w-sm w-full shadow-none hover:border-white/25 hover:shadow-[8px_8px_0px_rgba(255,158,0,0.15)] transition-all duration-500 text-center z-10 rounded-none animate-enter-modal flex flex-col items-center gap-6">
        <div className="flex items-center justify-center w-16 h-16 bg-zinc-900 border border-white/15 relative rounded-none">
          {isError ? (
            <div className="absolute inset-0 bg-rose-500/10 text-rose-400 flex items-center justify-center">
              <ShieldAlert className="w-8 h-8 animate-pulse" />
            </div>
          ) : (
            <div className="w-10 h-10 border-2 border-[#ff9e00]/20 border-t-[#ff9e00] rounded-full animate-spin"></div>
          )}
        </div>
        
        <div>
          <p className="text-[9px] font-mono font-bold text-violet-400 uppercase tracking-widest mb-1.5 flex items-center justify-center gap-1">
            <Terminal className="w-3.5 h-3.5" /> Dev Mode
          </p>
          <h1 className="text-sm font-mono font-bold text-white uppercase tracking-wider">Admin Override</h1>
          <p className="text-white/40 text-xs font-mono mt-3 leading-relaxed">{status}</p>
        </div>
      </div>
    </div>
  );
}

export default function ImpersonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white/40 font-mono text-xs uppercase tracking-widest">
        Memuat...
      </div>
    }>
      <ImpersonateContent />
    </Suspense>
  );
}