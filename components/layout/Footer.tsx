"use client";

import Link from 'next/link';

export function Footer() {
  return (
    <footer className="bg-[#050505] text-white pt-0 pb-0 border-t border-white/10 font-sans">
        
        <style dangerouslySetInnerHTML={{__html: `
            .wire-b-ft { border-bottom: 1px solid rgba(255,255,255,0.1); }
            .wire-r-ft { border-right: 1px solid rgba(255,255,255,0.1); }
            .hover-invert-ft:hover { background-color: white !important; }
            .hover-invert-ft:hover h2 { color: black !important; }
            .hover-invert-ft:hover p { color: rgba(0, 0, 0, 0.75) !important; }
            .hover-invert-ft:hover span { color: rgba(0, 0, 0, 0.6) !important; }
            .hover-invert-ft:hover div { color: black !important; border-color: rgba(0, 0, 0, 0.35) !important; }
        `}} />

        {/* CTA Banner — Full Width Noir Style */}
        <div className="wire-b-ft">
            <Link href="/register" className="group flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-16 md:py-20 hover-invert-ft transition-colors cursor-pointer">
                <div className="text-center md:text-left mb-6 md:mb-0">
                    <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 group-hover:text-black/60 block mb-4">[ FINAL ACTION ]</span>
                    <h2 className="text-3xl md:text-5xl font-black text-white group-hover:text-black tracking-tighter uppercase">Ready to launch?</h2>
                    <p className="text-white/60 group-hover:text-black/75 font-medium mt-2 text-sm">Join thousands of visual creators on Portfo.be today.</p>
                </div>
                <div className="font-mono text-xs uppercase tracking-widest font-bold flex items-center gap-3 px-8 py-4 border border-white/30 group-hover:border-black/30 transition-colors">
                    GET STARTED FREE <i className="fas fa-arrow-right text-xs group-hover:translate-x-1 transition-transform"></i>
                </div>
            </Link>
        </div>

        {/* Grid Links — Tabular Noir */}
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-white/10">
            
            {/* Logo & Description */}
            <div className="md:col-span-2 p-6 md:p-10">
                <div className="mb-6">
                    <img src="/portfo.be.png" alt="Portfo.be Logo" className="h-8 md:h-10 w-auto object-contain brightness-0 invert" />
                </div>
                <p className="text-sm font-medium leading-relaxed text-white/60 max-w-sm mb-8">
                    A premium portfolio building platform for visual creators. Launch your professional website to showcase work, manage your profile, and land high-paying clients—all without writing a single line of code.
                </p>
                <div className="flex gap-3">
                    <a href="https://web.facebook.com/profile.php?id=61589094247534" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                        <i className="fab fa-facebook"></i>
                    </a>
                    <a href="https://www.instagram.com/portfo.be/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                        <i className="fab fa-instagram"></i>
                    </a>
                    <a href="https://www.tiktok.com/@portfo.be" target="_blank" rel="noopener noreferrer" className="w-10 h-10 border border-white/20 flex items-center justify-center text-white/60 hover:bg-white hover:text-black hover:border-white transition-all duration-300">
                        <i className="fab fa-tiktok"></i>
                    </a>
                </div>
            </div>
            
            {/* Platform Links */}
            <div className="p-6 md:p-10">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-6">[ PLATFORM ]</span>
                <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
                    <li><a href="#features" className="text-white/75 hover:text-[#ff9e00] transition-colors">Features</a></li>
                    <li><a href="/pricing" className="text-white/75 hover:text-[#ff9e00] transition-colors">Pricing</a></li>
                    <li><a href="/support" className="text-white/75 hover:text-[#ff9e00] transition-colors">Support</a></li>
                </ul>
            </div>
            
            {/* Legal Links */}
            <div className="p-6 md:p-10">
                <span className="font-mono text-[10px] tracking-[0.3em] uppercase text-white/50 block mb-6">[ LEGAL ]</span>
                <ul className="space-y-4 text-sm font-bold uppercase tracking-wider">
                    <li><Link href="/privacy" className="text-white/75 hover:text-[#ff9e00] transition-colors">Privacy Policy</Link></li>
                    <li><Link href="/terms" className="text-white/75 hover:text-[#ff9e00] transition-colors">Terms of Service</Link></li>
                </ul>
            </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-white/10 px-6 md:px-12 py-6 flex flex-col md:flex-row justify-between items-center gap-4 font-mono text-[10px] uppercase tracking-widest text-white/55">
            <p>&copy; {new Date().getFullYear()} Portfo.be Inc.</p>
            <p>Surabaya, Indonesia</p>
        </div>

        {/* Giant Fading Wordmark */}
        <div className="overflow-hidden flex items-end justify-center text-center border-t border-white/10">
            <h2 
              style={{ fontFamily: "'Space Grotesk', sans-serif" }}
              className="font-bold text-[15vw] leading-[0.75] tracking-tighter text-white/[0.08] translate-y-4 md:translate-y-6 uppercase select-none"
            >
              PORTFO.BE
            </h2>
        </div>
    </footer>
  );
}