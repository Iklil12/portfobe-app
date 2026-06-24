// components/OnboardingModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { mutate } from "swr";
import { 
  Camera, Video, PenTool, Code, Film, HelpCircle, 
  ArrowLeft, ArrowRight, Loader2, Check, AlertCircle 
} from "lucide-react";

interface OnboardingModalProps {
  userName: string;
  onFinish?: () => void;
}

const professions = [
  { id: "photographer", label: "Photographer", icon: Camera, color: "text-[#ff9e00]", bg: "bg-[#ff9e00]/5", border: "border-white/10 hover:border-[#ff9e00]" },
  { id: "videographer", label: "Videographer", icon: Video, color: "text-[#ff9e00]", bg: "bg-[#ff9e00]/5", border: "border-white/10 hover:border-[#ff9e00]" },
  { id: "uiux", label: "UI/UX Designer", icon: PenTool, color: "text-[#ff9e00]", bg: "bg-[#ff9e00]/5", border: "border-white/10 hover:border-[#ff9e00]" },
  { id: "dev", label: "Web Developer", icon: Code, color: "text-[#ff9e00]", bg: "bg-[#ff9e00]/5", border: "border-white/10 hover:border-[#ff9e00]" },
  { id: "creator", label: "Content Creator", icon: Film, color: "text-[#ff9e00]", bg: "bg-[#ff9e00]/5", border: "border-white/10 hover:border-[#ff9e00]" },
  { id: "other", label: "Other", icon: HelpCircle, color: "text-white/40", bg: "bg-zinc-950", border: "border-white/10 hover:border-white/30" },
];

export default function OnboardingModal({ userName, onFinish }: OnboardingModalProps) {
  // --- STATE INTRO & PROGRESS ---
  const [showIntro, setShowIntro] = useState(true);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  // --- STATE FORM ---
  const [sub, setSub] = useState("");
  const [name, setName] = useState(userName === "Creator" ? "" : userName);
  const [err, setErr] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  // --- EFEK INTRO ANIMATION ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  // --- FUNGSI SUBMIT ---
  const finishOnboarding = async (selectedProfession: string | null) => {
    setIsSubmitting(true);
    const loadingToast = toast.loading("Setting up your digital space...");
    
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subdomain: sub.toLowerCase(),
          fullName: name.trim() || userName,
          profession: selectedProfession === "other" ? null : selectedProfession,
        }),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save data.");
      
      // Paksa refresh data SWR di background
      await mutate('/api/layout-sync');
      
      toast.success("Yay! Success.", { id: loadingToast });
      
      setTimeout(() => {
        if (onFinish) onFinish();
        else window.location.reload();
      }, 1200);
      
    } catch (e: any) {
      toast.error(e.message || "A technical error occurred.", { id: loadingToast });
      setIsSubmitting(false);
      if (e.message.toLowerCase().includes("url") || e.message.toLowerCase().includes("subdomain")) {
        setCurrentStep(1);
      }
    }
  };

  // --- FUNGSI NEXT ---
  const handleNext = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); 
    
    if (currentStep === 1) {
      if (sub.length < 3) return toast.error("Subdomain must be at least 3 characters.");
      if (!/^[a-z0-9]+$/.test(sub)) return toast.error("Only lowercase letters and numbers are allowed.");

      setIsValidating(true);
      try {
        const res = await fetch("/api/profile", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: 'check_subdomain', subdomain: sub }),
        });
        const data = await res.json();

        if (!data.available) {
          setErr(data.message || "URL is already taken.");
          toast.error(data.message || "URL is already taken.");
          setIsValidating(false);
          return;
        }
        setErr("");
        setCurrentStep(2);
      } catch (error) {
        toast.error("Server is busy.");
      }
      setIsValidating(false);

    } else if (currentStep === 2) {
      if (!name.trim()) return toast.error("Please fill in your name.");
      setCurrentStep(3);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes popInModal { 
          0% { opacity: 0; transform: scale(0.98) translateY(10px); } 
          100% { opacity: 1; transform: scale(1) translateY(0); } 
        }
        @keyframes fadeInBackdrop { 
          0% { opacity: 0; } 
          100% { opacity: 1; } 
        }
        @keyframes float-slow { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-10px) rotate(2deg); } }
        @keyframes float-fast { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-8px) rotate(-2deg); } }
        @keyframes wave { 0%, 100% { transform: rotate(0deg); } 25% { transform: rotate(-20deg); } 75% { transform: rotate(20deg); } }

        .modal-enter { animation: popInModal 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; opacity: 0; }
        .backdrop-enter { animation: fadeInBackdrop 0.4s ease-out forwards; opacity: 0; }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
        .intro-wave { animation: wave 1.5s ease-in-out infinite; transform-origin: bottom right; display: inline-block; }
        
        .step-transition { transition: all 0.4s cubic-bezier(0.22, 1, 0.36, 1); }
      `}} />

      {/* ========================================== */}
      {/* LAYAR 1: INTRO SPLASH SCREEN                 */}
      {/* ========================================== */}
      {showIntro ? (
        <div className="fixed inset-0 z-[999999] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden backdrop-enter">
          {/* Latar Belakang Ambient */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#ff9e00]/5 rounded-full blur-[120px] opacity-70 animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-zinc-900 rounded-full blur-[120px] opacity-40"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          </div>

          <div className="relative z-10 text-center modal-enter">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-zinc-900 border border-white/10 rounded-none mx-auto flex items-center justify-center shadow-none mb-8">
              <span className="text-4xl sm:text-5xl intro-wave">👋</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-mono font-bold text-white uppercase tracking-wider mb-4">Hello, Creator!</h1>
            <p className="text-white/45 font-mono text-xs uppercase tracking-widest">Let's build your digital space...</p>
          </div>
        </div>
      ) : (
        /* ========================================== */
        /* LAYAR 2: MAIN MODAL                         */
        /* ========================================== */
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 lg:p-8">
          
          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-zinc-950/80 backdrop-blur-md backdrop-enter"></div>

          {/* Kontainer Modal */}
          <div className="relative w-full max-w-5xl bg-zinc-900 rounded-none shadow-none flex flex-col-reverse lg:flex-row border border-white/10 overflow-hidden max-h-[95vh] modal-enter text-white">
            
            {/* Tombol Back */}
            {currentStep > 1 && !isSubmitting && (
              <button 
                onClick={handleBack} 
                className="absolute top-4 left-4 lg:top-8 lg:left-8 z-50 w-8 h-8 bg-zinc-950 border border-white/10 text-white/50 hover:text-white rounded-none flex items-center justify-center transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
            )}

            {/* --- LEFT: FORM AREA --- */}
            <div className="w-full lg:w-1/2 p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-zinc-900 shrink-0 relative z-10">
              
              {/* Progress Indicator Dots */}
              <div className="flex gap-2 mb-8 justify-center lg:justify-start">
                {[1, 2, 3].map((step) => (
                  <div 
                    key={step} 
                    className={`h-1 step-transition rounded-none ${
                      currentStep === step 
                        ? 'w-8 bg-[#ff9e00]' 
                        : currentStep > step 
                        ? 'w-2 bg-[#ff9e00]/40' 
                        : 'w-2 bg-white/10'
                    }`}
                  ></div>
                ))}
              </div>

              {currentStep === 1 && (
                <div className="animate-[fadeInBackdrop_0.5s_forwards]">
                  <h3 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider mb-3">Claim Your Home</h3>
                  <p className="text-[11px] font-mono text-white/40 mb-8 leading-relaxed uppercase tracking-wide">This is the permanent address that will be shared with your clients or audience.</p>

                  <form onSubmit={handleNext} className="space-y-5">
                    <div className="relative flex items-center bg-zinc-950 border border-white/10 rounded-none focus-within:border-[#ff9e00] transition-all group">
                      <div className="pl-5 pr-2 py-4 bg-zinc-900 border-r border-white/5 text-white/40 font-mono font-bold text-xs">portfo.be/</div>
                      <input 
                        type="text" 
                        autoFocus 
                        maxLength={15} 
                        value={sub} 
                        onChange={(e) => setSub(e.target.value.toLowerCase().replace(/[^a-z0-9]/g, ""))} 
                        placeholder="yourname" 
                        className="flex-1 px-4 py-4 bg-transparent outline-none font-mono font-bold text-white text-xs placeholder:text-white/20" 
                      />
                      <div className="pr-5 text-[9px] font-mono text-white/30">{sub.length}/15</div>
                    </div>
                    {err && (
                      <p className="text-[10px] font-mono text-rose-500 ml-1 flex items-center gap-1.5 uppercase tracking-wide">
                        <AlertCircle className="w-3.5 h-3.5" /> <span>{err}</span>
                      </p>
                    )}
                    <button 
                      type="submit" 
                      disabled={sub.length < 3 || isValidating} 
                      className="w-full py-4 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-none font-mono font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-all disabled:opacity-40"
                    >
                      {isValidating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Checking...</span>
                        </>
                      ) : (
                        <>
                          <span>Lock This Name</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              )}

              {currentStep === 2 && (
                <div className="animate-[fadeInBackdrop_0.5s_forwards]">
                  <h3 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider mb-3">Let's Get Acquainted</h3>
                  <p className="text-[11px] font-mono text-white/40 mb-8 leading-relaxed uppercase tracking-wide">How should the world address you? This will be your main title.</p>

                  <form onSubmit={handleNext} className="space-y-5">
                    <div className="relative flex items-center bg-zinc-950 border border-white/10 rounded-none focus-within:border-[#ff9e00] transition-all">
                      <input 
                        type="text" 
                        autoFocus 
                        maxLength={50} 
                        value={name} 
                        onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z0-9\s\.\-]/g, ""))} 
                        placeholder="Full / Stage Name" 
                        className="flex-1 px-5 py-4 bg-transparent outline-none font-mono font-bold text-white text-xs placeholder:text-white/20" 
                      />
                      <div className="pr-5 text-[9px] font-mono text-white/30">{name.length}/50</div>
                    </div>
                    <button 
                      type="submit" 
                      disabled={!name.trim()} 
                      className="w-full py-4 bg-[#ff9e00] hover:bg-[#ffaa22] text-black rounded-none font-mono font-bold text-xs uppercase tracking-wider flex justify-center items-center gap-2 transition-all disabled:opacity-40"
                    >
                      <span>Final Step</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setCurrentStep(3)} 
                      className="w-full py-2 text-white/40 font-mono font-bold text-[9px] uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Skip for Now
                    </button>
                  </form>
                </div>
              )}

              {currentStep === 3 && (
                <div className="animate-[fadeInBackdrop_0.5s_forwards]">
                  <h3 className="text-lg sm:text-xl font-mono font-bold text-white uppercase tracking-wider mb-3">One More Thing</h3>
                  <p className="text-[11px] font-mono text-white/40 mb-8 leading-relaxed uppercase tracking-wide">What is your primary skill? We will customize the look for you.</p>

                  <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
                    {professions.map((p) => {
                      const IconComponent = p.icon;
                      return (
                        <button 
                          key={p.id} 
                          onClick={() => finishOnboarding(p.id)} 
                          disabled={isSubmitting} 
                          className="flex flex-col items-center justify-center p-4 sm:p-5 rounded-none border border-white/10 bg-zinc-950 transition-all hover:border-[#ff9e00] hover:-translate-y-1 active:scale-95 disabled:opacity-50 group"
                        >
                          <div className={`w-12 h-12 rounded-none ${p.bg} ${p.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                            {isSubmitting ? (
                              <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                              <IconComponent className="w-5 h-5" />
                            )}
                          </div>
                          <span className="text-[9px] font-mono font-bold text-white/60 text-center uppercase tracking-tight">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <button 
                    onClick={() => finishOnboarding(null)} 
                    disabled={isSubmitting} 
                    className="w-full text-white/40 font-mono font-bold text-[9px] uppercase tracking-[0.2em] hover:text-white transition-colors py-2 disabled:opacity-50"
                  >
                    {isSubmitting ? "Processing..." : "Keep It Secret for Now"}
                  </button>
                </div>
              )}
            </div>

            {/* --- RIGHT: DYNAMIC PLAYFUL STAGE --- */}
            <div className="w-full lg:w-1/2 h-40 sm:h-56 lg:h-auto bg-zinc-950/50 border-t lg:border-t-0 lg:border-l border-white/5 relative overflow-hidden flex items-center justify-center shrink-0">
              {/* Latar Grid Halus */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:24px_24px]"></div>
              
              {/* Ambient Glows */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[#ff9e00]/5 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-[80px]"></div>

              {/* Dinamis Visual Berdasarkan Step */}
              <div className="relative w-40 h-40 lg:w-80 lg:h-80 flex items-center justify-center">
                
                {/* Objek 1: Aksen Block */}
                <div className={`absolute transition-all duration-1000 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  currentStep === 1 ? 'w-32 h-32 lg:w-48 lg:h-48 bg-zinc-900 border border-white/5 top-0 right-4' :
                  currentStep === 2 ? 'w-40 h-40 lg:w-64 lg:h-64 bg-zinc-900 border border-[#ff9e00]/20 top-4 left-4 scale-105' :
                  'w-24 h-24 lg:w-32 lg:h-32 bg-zinc-900 border border-white/5 bottom-0 right-0'
                } shadow-none`}></div>

                {/* Objek 2: Glass Panel Utama */}
                <div className={`absolute z-10 bg-zinc-900/90 border border-white/10 rounded-none p-4 lg:p-6 shadow-none animate-float-slow step-transition flex flex-col ${
                  currentStep === 1 ? 'w-40 lg:w-56 h-24 lg:h-32 rotate-[-3deg]' :
                  currentStep === 2 ? 'w-32 lg:w-48 h-40 lg:h-56 rotate-[3deg] translate-y-4' :
                  'w-48 lg:w-64 h-32 lg:h-40 rotate-[0deg] scale-105'
                }`}>
                   {currentStep === 1 && (
                     <div className="w-full h-full flex flex-col justify-center gap-2 lg:gap-3">
                       <div className="w-1/2 h-2.5 bg-white/10 rounded-none"></div>
                       <div className="w-full h-8 bg-zinc-950 border border-white/5 rounded-none"></div>
                     </div>
                   )}
                   {currentStep === 2 && (
                     <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                       <div className="w-16 h-16 lg:w-20 lg:h-20 bg-zinc-950 border border-white/5 rounded-none shadow-none"></div>
                       <div className="w-3/4 h-2.5 bg-white/10 rounded-none"></div>
                       <div className="w-1/2 h-2 bg-white/5 rounded-none"></div>
                     </div>
                   )}
                   {currentStep === 3 && (
                     <div className="w-full h-full grid grid-cols-2 gap-2 lg:gap-3">
                       <div className="bg-zinc-950 border border-white/5 rounded-none"></div>
                       <div className="bg-[#ff9e00]/10 border border-[#ff9e00]/30 rounded-none flex items-center justify-center">
                         <Check className="w-4 h-4 text-[#ff9e00]" />
                       </div>
                       <div className="bg-zinc-950 border border-white/5 rounded-none"></div>
                       <div className="bg-zinc-950 border border-white/5 rounded-none"></div>
                     </div>
                   )}
                </div>

                {/* Objek 3: Floating Badges */}
                <div className={`absolute z-20 bg-zinc-950 border border-white/10 px-3 py-2 lg:px-4 lg:py-2.5 rounded-none font-mono font-bold text-[9px] text-[#ff9e00] uppercase tracking-wider animate-float-fast step-transition ${
                  currentStep === 1 ? 'bottom-0 left-0 rotate-[-5deg]' :
                  currentStep === 2 ? 'top-0 right-0 rotate-[5deg]' :
                  'top-[-10px] left-[-10px] rotate-[-2deg]'
                }`}>
                  {currentStep === 1 ? '✨ Unique Domain' : currentStep === 2 ? '😎 Cool' : '🚀 Start!'}
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}