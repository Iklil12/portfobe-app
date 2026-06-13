import React from 'react';
import Link from 'next/link';
import { Video, Lock } from 'lucide-react';

export const metadata = {
    title: 'Videos - Portfo.be Academy',
    description: 'Bite-sized tutorials and feature walkthroughs.',
};

const VIDEOS = [
    {
        id: 'v1',
        title: 'How to map a Custom Domain',
        category: 'TUTORIAL',
        duration: '03:15',
        thumbnail: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'v2',
        title: 'Mastering the Grid System',
        category: 'DESIGN',
        duration: '08:42',
        thumbnail: 'https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'v3',
        title: 'SEO Best Practices for Portfolios',
        category: 'MARKETING',
        duration: '12:05',
        thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'v4',
        title: 'Using the Dynamic Color Picker',
        category: 'FEATURE',
        duration: '02:30',
        thumbnail: 'https://images.unsplash.com/photo-1507238692062-5a0445d47085?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'v5',
        title: 'Publishing vs Drafting',
        category: 'WORKFLOW',
        duration: '04:10',
        thumbnail: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&w=800&q=80'
    },
    {
        id: 'v6',
        title: 'Connecting Google Analytics',
        category: 'INTEGRATION',
        duration: '05:55',
        thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'
    }
];

export default function VideosPage() {
    return (
        <div className="flex flex-col h-full bg-[#050505]">
            <header className="p-8 lg:p-12 border-b border-white/10 bg-black">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="max-w-2xl">
                        <span className="font-mono text-[#ff9e00] mb-4 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                            <Video className="w-4 h-4" /> ACADEMY // VIDEOS
                        </span>
                        <h1 className="font-display font-bold text-4xl md:text-5xl uppercase tracking-tighter mb-4">
                            QUICK <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">TUTORIALS</span>
                        </h1>
                        <p className="font-mono text-sm opacity-60 leading-relaxed">
                            Bite-sized videos to help you resolve specific issues or master individual features in minutes.
                        </p>
                    </div>

                    {/* Filter (Visual only) */}
                    <div className="flex items-center border border-white/10 bg-black font-mono text-xs">
                        <button className="px-4 py-2 hover:bg-white hover:text-black transition-colors bg-white text-black font-bold">ALL</button>
                        <button className="px-4 py-2 hover:bg-white hover:text-black transition-colors border-l border-white/10 text-white/50">DESIGN</button>
                        <button className="px-4 py-2 hover:bg-white hover:text-black transition-colors border-l border-white/10 text-white/50">WORKFLOW</button>
                    </div>
                </div>
            </header>

            <div className="p-8 lg:p-12 flex-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {VIDEOS.map((video) => (
                        <div key={video.id} className="group cursor-not-allowed flex flex-col gap-4">
                            <div className="relative aspect-video bg-zinc-900 overflow-hidden border border-white/10 transition-colors">
                                <img 
                                    src={video.thumbnail} 
                                    alt={video.title} 
                                    className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale transition-all duration-700" 
                                />
                                <div className="absolute inset-0 bg-black/60 transition-colors"></div>
                                
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-white/40">
                                        <Lock className="w-5 h-5" />
                                    </div>
                                    <span className="font-mono text-[10px] font-bold tracking-widest bg-white/10 text-white/60 px-3 py-1 border border-white/10 uppercase">Coming Soon</span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-1 opacity-50">
                                <span className="font-mono text-[10px] font-bold tracking-widest text-[#ff9e00]">{video.category}</span>
                                <h3 className="font-display font-bold text-xl uppercase transition-colors">{video.title}</h3>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center border-t border-white/10 pt-12">
                     <button className="px-8 py-4 border border-white/10 font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                         Load More Videos
                     </button>
                </div>
            </div>
        </div>
    );
}
