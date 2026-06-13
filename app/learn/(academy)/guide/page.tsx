'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';

const LESSONS = [
    {
        chapter: 1,
        lesson: 1,
        title: "Mastering the Portfo.be Ecosystem",
        content: (
            <div className="prose prose-invert prose-orange max-w-none font-sans text-lg text-white/80 leading-relaxed space-y-6">
                <p>
                    Welcome to the definitive guide on Portfo.be's core architecture. Unlike tradisional website builders that rely on fragile drag-and-drop mechanics, Portfo.be is engineered using an enterprise-grade abstraction. You don't just build a site; you manage a digital identity.
                </p>

                <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">The Draft vs Publish Lifecycle</h3>
                <p>
                    The biggest mistake professionals make is breaking their live site while trying out new designs. Portfo.be solves this using an advanced <strong>Theme Editor</strong> with a built-in Draft Manager.
                </p>
                <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                    <li><strong>Safe Sandboxing:</strong> Any change you make to colors, typography, or base themes is saved locally to your session state.</li>
                    <li><strong>Drafting API:</strong> Behind the scenes, the <code>/api/appearance/drafts</code> route securely stores your experimental UI without affecting the public-facing database.</li>
                    <li><strong>Explicit Publishing:</strong> Your audience only sees what you want them to see. Changes must be explicitly committed via the Publish pipeline.</li>
                </ul>

                <div className="p-6 border border-white/10 bg-white/5 mt-8">
                    <h4 className="font-mono text-[10px] tracking-widest text-[#ff9e00] font-bold mb-2 uppercase">Pro Tip: Theme Editor Shortcut</h4>
                    <p className="text-sm m-0 font-mono">You can jump straight into the Theme Editor from anywhere in the dashboard by hitting <kbd className="font-sans bg-black border border-white/20 px-2 py-1 mx-1 text-white">CMD/CTRL + E</kbd>.</p>
                </div>
            </div>
        )
    },
    {
        chapter: 1,
        lesson: 2,
        title: "Advanced Theme Engine & Brutalism",
        content: (
            <div className="prose prose-invert prose-orange max-w-none font-sans text-lg text-white/80 leading-relaxed space-y-6">
                <p>
                    Portfo.be doesn't just offer templates; it provides a comprehensive <strong>Theme Engine</strong> designed to output high-performance, aesthetically striking layouts out-of-the-box.
                </p>

                <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">The Brutalist Aesthetic</h3>
                <p>
                    You might have noticed our platform's default aesthetic: sharp edges, stark contrast, and monospaced typography. This is known as <em>Neo-Brutalism</em>.
                </p>
                <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                    <li><strong>No Border Radius:</strong> We strip away soft curves to project authority and precision.</li>
                    <li><strong>High Contrast Colors:</strong> Using absolute black (<code>#000000</code>) against stark white or vibrant accents (like our signature orange <code>#ff9e00</code>) ensures maximum accessibility and visual impact.</li>
                    <li><strong>Noise Filters:</strong> To prevent the design from feeling flat, our engine automatically applies an SVG fractal noise filter to backgrounds, giving them an organic, tactile texture.</li>
                </ul>

                <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">Customizing CSS Variables</h3>
                <p>
                    Under the hood, every theme modification you make updates a set of global CSS Variables. This means when you change a color in the Theme Editor, it instantly cascades across your entire site without requiring a page reload.
                </p>

                <div className="p-6 border border-white/10 bg-white/5 mt-8">
                    <h4 className="font-mono text-[10px] tracking-widest text-[#ff9e00] font-bold mb-2 uppercase">Design Principle</h4>
                    <p className="text-sm m-0 font-mono">Don't be afraid of empty space. Brutalism relies heavily on whitespace to separate elements rather than drawing boxes around everything.</p>
                </div>
            </div>
        )
    },
    {
        chapter: 1,
        lesson: 3,
        title: "Project Curation & Edge Publishing",
        content: (
            <div className="prose prose-invert prose-orange max-w-none font-sans text-lg text-white/80 leading-relaxed space-y-6">
                <p>
                    Once your theme is set, the final step is managing your actual portfolio content. Portfo.be treats your projects with enterprise-level data integrity.
                </p>

                <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">Enterprise Project Curation</h3>
                <p>
                    Managing your case studies should feel like managing a high-end gallery, not a messy folder of JPEGs.
                </p>
                <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                    <li><strong>Relational Integrity:</strong> Projects are strictly typed and relational. This prevents database foreign key errors when you delete a category or re-order your grid.</li>
                    <li><strong>Skeleton Loading:</strong> The platform utilizes Suspense boundaries and skeleton UIs to ensure a seamless, non-blocking editing experience, even when loading heavy high-res assets.</li>
                </ul>

                <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">Dynamic Subdomain Routing</h3>
                <p>
                    Every account is instantly provisioned with a secure, isolated namespace (e.g., <code>username.portfo.be</code> or <code>portfo.be/username</code>).
                </p>
                <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                    <li><strong>Middleware Edge Routing:</strong> We intercept requests at the edge to dynamically map your subdomain to your specific user ID, ensuring ultra-fast TTFB (Time to First Byte).</li>
                    <li><strong>Stealth Sitemaps:</strong> Your SEO is isolated. The platform dynamically generates sitemaps specific to your subdomain, preventing cross-tenant indexing bleed.</li>
                </ul>

                <div className="p-6 border border-[#ff9e00] bg-[#ff9e00]/10 mt-12 flex items-center gap-4">
                    <CheckCircle2 className="w-8 h-8 text-[#ff9e00] flex-shrink-0" />
                    <div>
                        <h4 className="font-display text-xl uppercase font-bold text-white mb-1">Masterclass Complete</h4>
                        <p className="text-sm m-0 font-mono text-white/80">You now understand the core architecture of Portfo.be. You are ready to build.</p>
                    </div>
                </div>
            </div>
        )
    }
];

export default function PlatformGuidePage() {
    const [currentLesson, setCurrentLesson] = useState(0);
    const [progress, setProgress] = useState(0);

    const lesson = LESSONS[currentLesson];
    const isFirstLesson = currentLesson === 0;
    const isLastLesson = currentLesson === LESSONS.length - 1;

    useEffect(() => {
        // Calculate progress based on current lesson
        const calculatedProgress = Math.round(((currentLesson + 1) / LESSONS.length) * 100);
        setProgress(calculatedProgress);
    }, [currentLesson]);

    const handleNext = () => {
        if (!isLastLesson) {
            setCurrentLesson(prev => prev + 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const handlePrev = () => {
        if (!isFirstLesson) {
            setCurrentLesson(prev => prev - 1);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Header Title inside Content Area */}
            <header className="p-8 lg:p-12 border-b border-white/10 bg-[#050505]">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <span className="font-mono text-[#ff9e00] mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                            <BookOpen className="w-4 h-4" /> PLATFORM GUIDE // MASTERCLASS
                        </span>
                        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter">
                            BECOME A PORTFO.BE <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">MASTER</span>
                        </h1>
                    </div>
                    <div className="font-mono text-sm opacity-60 flex gap-6 border border-white/10 p-4 bg-black">
                        <div className="flex flex-col">
                            <span className="text-[10px]">LESSONS</span>
                            <span key={`tracker-${currentLesson}`} className="text-white text-lg font-bold">{currentLesson + 1} / {LESSONS.length}</span>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px]">PROGRESS</span>
                            <span className="text-white text-lg font-bold">{progress}%</span>
                        </div>
                    </div>
                </div>
                
                {/* Progress Bar Visual */}
                <div className="w-full h-1 bg-white/10 mt-8">
                    <div className="h-full bg-[#ff9e00] transition-all duration-500 ease-out" style={{ width: `${progress}%` }}></div>
                </div>
            </header>

            {/* Hero Cover Image */}
            <div className="w-full aspect-[21/9] bg-zinc-900 border-b border-white/10 relative overflow-hidden group">
                <div className="absolute inset-0 bg-black/40 z-10 transition-colors group-hover:bg-black/20 pointer-events-none"></div>
                <img 
                    src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=1600&q=80" 
                    alt="Guide cover" 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                />
            </div>

            {/* Lesson Content Area */}
            <div className="p-8 lg:p-12 max-w-4xl" key={`lesson-wrapper-${currentLesson}`}>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-[#ff9e00] mb-6 animate-fade-in">
                    <span>CHAPTER {lesson.chapter}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>LESSON {lesson.lesson}</span>
                </div>
                
                <h2 className="font-display text-3xl md:text-5xl font-bold uppercase tracking-tight mb-8 animate-slide-up">
                    {lesson.title}
                </h2>
                
                {/* The dynamic content from the array */}
                <div className="animate-fade-in">
                    {lesson.content}
                </div>
                
                {/* Next/Prev Nav */}
                <div className="mt-16 pt-8 border-t border-white/10 flex flex-col-reverse md:flex-row items-center justify-between gap-6 md:gap-4">
                    <button 
                        onClick={handlePrev}
                        disabled={isFirstLesson}
                        className={`w-full md:w-auto justify-center py-4 md:py-0 font-mono font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-colors ${isFirstLesson ? 'text-white/20 cursor-not-allowed' : 'text-white/50 hover:text-[#ff9e00]'}`}
                    >
                        <ChevronRight className="w-4 h-4 rotate-180" /> <span>Previous</span>
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        disabled={isLastLesson}
                        className={`w-full md:w-auto justify-center px-8 py-4 font-mono font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${isLastLesson ? 'bg-[#ff9e00] text-black cursor-not-allowed opacity-50' : 'bg-white text-black hover:bg-[#ff9e00]'}`}
                    >
                        <span>{isLastLesson ? 'Course Completed' : 'Complete & Continue'}</span> 
                        <span className={isLastLesson ? 'hidden' : 'inline-flex'}>
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
