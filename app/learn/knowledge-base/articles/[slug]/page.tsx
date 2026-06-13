import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ALL_ARTICLES } from '../../data';

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = ALL_ARTICLES.find(a => a.id === slug);

    if (!article) {
        notFound();
    }

    return (
        <div className="font-sans min-h-screen bg-black text-white antialiased selection:bg-[#ff9e00] selection:text-black dark">
            <style dangerouslySetInnerHTML={{
                __html: `
        .kb-wrapper {
            background-color: #000000; 
            color: #ffffff;
        }
        
        .kb-wrapper::before {
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

            <div className="kb-wrapper w-full min-h-screen relative flex flex-col">
                <Navbar isDarkBg />

                <main className="flex-1 max-w-4xl mx-auto w-full px-6 pt-32 md:pt-48 pb-32 animate-fade-in relative z-10">
                    <Link 
                        href="/learn/knowledge-base" 
                        className="font-mono text-xs font-bold uppercase tracking-widest text-[#ff9e00] flex items-center gap-2 hover:text-white transition-colors mb-12 group inline-flex"
                    >
                        <div className="w-8 h-8 border border-current rounded-full flex items-center justify-center group-hover:-translate-x-2 transition-transform">
                            <ChevronLeft className="w-4 h-4" />
                        </div>
                        Back to Knowledge Base
                    </Link>
                    
                    <div className="mb-12">
                        <div className="flex items-center gap-4 font-mono text-xs opacity-60 mb-6">
                            <span>{article.date}</span>
                            <span>/</span>
                            <span className="uppercase text-[#ff9e00]">{article.category}</span>
                        </div>
                        <h1 className="font-display text-4xl md:text-6xl font-bold uppercase tracking-tight mb-6 leading-tight">
                            {article.title}
                        </h1>
                        <p className="text-xl text-white/50 leading-relaxed max-w-2xl">
                            {article.description}
                        </p>
                    </div>
                    
                    <div className="w-full h-px bg-gradient-to-r from-[#ff9e00]/50 to-transparent mb-16"></div>
                    
                    <article className="animate-slide-up">
                        {article.content}
                    </article>

                    <div className="mt-24 p-8 border border-white/10 bg-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div>
                            <h4 className="font-display font-bold uppercase text-xl mb-1">Was this article helpful?</h4>
                            <p className="font-mono text-xs opacity-50">Help us improve our documentation.</p>
                        </div>
                        <div className="flex gap-4">
                            <button className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black font-mono text-sm font-bold transition-colors uppercase">Yes</button>
                            <button className="px-8 py-3 border border-white/20 hover:bg-white hover:text-black font-mono text-sm font-bold transition-colors uppercase">No</button>
                        </div>
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
