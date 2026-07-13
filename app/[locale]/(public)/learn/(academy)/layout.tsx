'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LearnSidebar } from '@/components/layout/LearnSidebar';

export default function AcademyLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    // Global Hotkey: CMD/CTRL + E to open Theme Editor
    useEffect(() => {
        const handleGlobalKeyDown = (e: KeyboardEvent) => {
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'e') {
                e.preventDefault();
                router.push('/dashboard/appearance');
            }
        };

        window.addEventListener('keydown', handleGlobalKeyDown);
        return () => window.removeEventListener('keydown', handleGlobalKeyDown);
    }, [router]);
    return (
        <div className="font-sans min-h-screen bg-black text-white antialiased selection:bg-[#ff9e00] selection:text-black dark">
            <style dangerouslySetInnerHTML={{
                __html: `
        .academy-wrapper {
            background-color: #000000; 
            color: #ffffff;
        }
        
        .academy-wrapper::before {
            content: "";
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 0;
            background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E");
        }
      `}} />
            <div className="academy-wrapper w-full min-h-screen relative flex flex-col">
                <Navbar isDarkBg />

                <div className="flex-1 flex flex-col pt-20 md:pt-24">
                    <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col lg:flex-row border-t border-white/10">
                        <LearnSidebar />
                        
                        {/* Dynamic Page Content */}
                        <div className="flex-1 flex flex-col relative min-h-screen">
                            {children}
                        </div>
                    </main>
                </div>

                <Footer />
            </div>
        </div>
    );
}
