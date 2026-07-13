'use client';

import React, { useState, useEffect } from 'react';
import { ChevronRight, BookOpen, CheckCircle2 } from 'lucide-react';
import { OptimizedLazyImage } from '@/shared/ui/OptimizedLazyImage';
import { useTranslations } from 'next-intl';

export default function PlatformGuidePage() {
    const t = useTranslations('Guide');
    
    const LESSONS = [
        {
            chapter: 1,
            lesson: 1,
            title: t('lesson1Title'),
            content: (
                <div className="prose prose-invert prose-orange max-w-none font-sans text-lg text-white/80 leading-relaxed space-y-6">
                    <p>{t('lesson1P1')}</p>
                    <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">{t('lesson1H1')}</h3>
                    <p dangerouslySetInnerHTML={{ __html: t('lesson1P2') }}></p>
                    <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                        <li dangerouslySetInnerHTML={{ __html: t('lesson1L1') }}></li>
                        <li dangerouslySetInnerHTML={{ __html: t('lesson1L2') }}></li>
                        <li dangerouslySetInnerHTML={{ __html: t('lesson1L3') }}></li>
                    </ul>
                    <div className="p-6 border border-white/10 bg-white/5 mt-8">
                        <h4 className="font-mono text-[10px] tracking-widest text-[#ff9e00] font-bold mb-2 uppercase">{t('lesson1TipTitle')}</h4>
                        <p className="text-sm m-0 font-mono" dangerouslySetInnerHTML={{ __html: t('lesson1TipDesc') }}></p>
                    </div>
                </div>
            )
        },
        {
            chapter: 1,
            lesson: 2,
            title: t('lesson2Title'),
            content: (
                <div className="prose prose-invert prose-orange max-w-none font-sans text-lg text-white/80 leading-relaxed space-y-6">
                    <p dangerouslySetInnerHTML={{ __html: t('lesson2P1') }}></p>
                    <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">{t('lesson2H1')}</h3>
                    <p dangerouslySetInnerHTML={{ __html: t('lesson2P2') }}></p>
                    <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                        <li dangerouslySetInnerHTML={{ __html: t('lesson2L1') }}></li>
                        <li dangerouslySetInnerHTML={{ __html: t('lesson2L2') }}></li>
                        <li dangerouslySetInnerHTML={{ __html: t('lesson2L3') }}></li>
                    </ul>
                    <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">{t('lesson2H2')}</h3>
                    <p>{t('lesson2P3')}</p>
                    <div className="p-6 border border-white/10 bg-white/5 mt-8">
                        <h4 className="font-mono text-[10px] tracking-widest text-[#ff9e00] font-bold mb-2 uppercase">{t('lesson2TipTitle')}</h4>
                        <p className="text-sm m-0 font-mono">{t('lesson2TipDesc')}</p>
                    </div>
                </div>
            )
        },
        {
            chapter: 1,
            lesson: 3,
            title: t('lesson3Title'),
            content: (
                <div className="prose prose-invert prose-orange max-w-none font-sans text-lg text-white/80 leading-relaxed space-y-6">
                    <p>{t('lesson3P1')}</p>
                    <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">{t('lesson3H1')}</h3>
                    <p>{t('lesson3P2')}</p>
                    <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                        <li dangerouslySetInnerHTML={{ __html: t('lesson3L1') }}></li>
                        <li dangerouslySetInnerHTML={{ __html: t('lesson3L2') }}></li>
                    </ul>
                    <h3 className="font-display uppercase text-2xl text-white mt-12 mb-4 border-l-4 border-[#ff9e00] pl-4">{t('lesson3H2')}</h3>
                    <p dangerouslySetInnerHTML={{ __html: t('lesson3P3') }}></p>
                    <ul className="list-disc pl-6 space-y-2 font-mono text-sm opacity-80">
                        <li dangerouslySetInnerHTML={{ __html: t('lesson3L3') }}></li>
                        <li dangerouslySetInnerHTML={{ __html: t('lesson3L4') }}></li>
                    </ul>
                    <div className="p-6 border border-[#ff9e00] bg-[#ff9e00]/10 mt-12 flex items-center gap-4">
                        <CheckCircle2 className="w-8 h-8 text-[#ff9e00] flex-shrink-0" />
                        <div>
                            <h4 className="font-display text-xl uppercase font-bold text-white mb-1">{t('lesson3TipTitle')}</h4>
                            <p className="text-sm m-0 font-mono text-white/80">{t('lesson3TipDesc')}</p>
                        </div>
                    </div>
                </div>
            )
        }
    ];

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
                            <BookOpen className="w-4 h-4" /> {t('badge')}
                        </span>
                        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter">
                            {t('titlePrefix')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">{t('titleHighlight')}</span>
                        </h1>
                    </div>
                    <div className="font-mono text-sm opacity-60 flex gap-6 border border-white/10 p-4 bg-black">
                        <div className="flex flex-col">
                            <span className="text-[10px]">{t('lessonsLabel')}</span>
                            <span key={`tracker-${currentLesson}`} className="text-white text-lg font-bold">{currentLesson + 1} / {LESSONS.length}</span>
                        </div>
                        <div className="w-px bg-white/20"></div>
                        <div className="flex flex-col">
                            <span className="text-[10px]">{t('progressLabel')}</span>
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
                <OptimizedLazyImage 
                    src="https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=1600&q=80" 
                    alt="Guide cover" 
                    className="absolute inset-0 w-full h-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-105" 
                />
            </div>

            {/* Lesson Content Area */}
            <div className="p-8 lg:p-12 max-w-4xl" key={`lesson-wrapper-${currentLesson}`}>
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase font-bold tracking-widest text-[#ff9e00] mb-6 animate-fade-in">
                    <span>{t('chapterLabel')} {lesson.chapter}</span>
                    <ChevronRight className="w-3 h-3" />
                    <span>{t('lessonLabel')} {lesson.lesson}</span>
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
                        <ChevronRight className="w-4 h-4 rotate-180" /> <span>{t('prevBtn')}</span>
                    </button>
                    
                    <button 
                        onClick={handleNext}
                        disabled={isLastLesson}
                        className={`w-full md:w-auto justify-center px-8 py-4 font-mono font-bold uppercase text-xs tracking-widest transition-all flex items-center gap-2 ${isLastLesson ? 'bg-[#ff9e00] text-black cursor-not-allowed opacity-50' : 'bg-white text-black hover:bg-[#ff9e00]'}`}
                    >
                        <span>{isLastLesson ? t('completedBtn') : t('nextBtn')}</span> 
                        <span className={isLastLesson ? 'hidden' : 'inline-flex'}>
                            <ChevronRight className="w-4 h-4" />
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}
