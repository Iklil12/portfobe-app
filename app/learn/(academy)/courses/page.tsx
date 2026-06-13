import React from 'react';
import Link from 'next/link';
import { Layers, ArrowRight, Star } from 'lucide-react';

export const metadata = {
    title: 'Courses - Portfo.be Academy',
    description: 'Master your craft with our comprehensive courses.',
};

const COURSES = [
    {
        id: 'portfolio-masterclass',
        title: 'The Portfolio Masterclass',
        description: 'Learn how to build a portfolio that lands high-paying enterprise clients. Covers layout, copywriting, and project curation.',
        level: 'INTERMEDIATE',
        lessons: 12,
        duration: '2h 45m',
        featured: true,
        progress: 0,
    },
    {
        id: 'seo-fundamentals',
        title: 'SEO Fundamentals for Creatives',
        description: 'Stop being invisible. Learn how to optimize your Portfo.be site to rank on the first page of Google.',
        level: 'BEGINNER',
        lessons: 8,
        duration: '1h 20m',
        featured: false,
    },
    {
        id: 'advanced-theming',
        title: 'Advanced Theming & CSS',
        description: 'Push the limits of the Theme Editor. Learn how to use custom CSS and global variables to create a unique aesthetic.',
        level: 'ADVANCED',
        lessons: 15,
        duration: '4h 10m',
        featured: false,
    }
];

export default function CoursesPage() {
    return (
        <div className="flex flex-col h-full bg-[#050505]">
            <header className="p-8 lg:p-12 border-b border-white/10 bg-black">
                <div className="max-w-4xl">
                    <span className="font-mono text-[#ff9e00] mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                        <Layers className="w-4 h-4" /> ACADEMY // COURSES
                    </span>
                    <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-4">
                        MASTER YOUR <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">CRAFT</span>
                    </h1>
                    <p className="font-mono text-sm opacity-60 max-w-2xl leading-relaxed">
                        Structured learning paths designed to help you extract maximum value from Portfo.be and elevate your professional presence.
                    </p>
                </div>
            </header>

            <div className="p-8 lg:p-12 flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {COURSES.map((course) => (
                        <div key={course.id} className="border border-white/10 bg-black flex flex-col group hover:border-white/30 transition-colors relative">
                            {course.featured && (
                                <div className="absolute -top-3 -right-3 bg-[#ff9e00] text-black font-mono text-[10px] font-bold px-2 py-1 flex items-center gap-1 z-10">
                                    <Star className="w-3 h-3 fill-black" /> FEATURED
                                </div>
                            )}
                            
                            <div className="aspect-video bg-zinc-900 border-b border-white/10 p-6 flex flex-col justify-end relative overflow-hidden">
                                {/* Abstract BG for course card */}
                                <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity" style={{
                                    backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
                                    backgroundSize: '24px 24px'
                                }}></div>
                                <h3 className="font-display font-bold text-2xl uppercase relative z-10">{course.title}</h3>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex items-center gap-4 font-mono text-[10px] font-bold tracking-widest opacity-60 mb-4">
                                    <span className={course.level === 'ADVANCED' ? 'text-[#ff9e00]' : ''}>{course.level}</span>
                                    <span>•</span>
                                    <span>{course.lessons} LESSONS</span>
                                    <span>•</span>
                                    <span>{course.duration}</span>
                                </div>
                                <p className="font-sans text-sm opacity-80 mb-8 flex-1">
                                    {course.description}
                                </p>
                                
                                <div className="w-full py-4 mt-auto text-center font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 bg-white/5 text-white/30 cursor-not-allowed">
                                    [ COMING SOON ]
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
