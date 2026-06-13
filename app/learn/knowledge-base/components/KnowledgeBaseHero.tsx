import React from 'react';
import { Search } from 'lucide-react';

interface KnowledgeBaseHeroProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

export function KnowledgeBaseHero({ searchQuery, onSearchChange }: KnowledgeBaseHeroProps) {
    return (
        <header className="relative pt-32 pb-20 md:pt-48 md:pb-28 border-b border-white/10">
            <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                <h1 className="font-display font-bold text-4xl md:text-6xl lg:text-7xl uppercase tracking-tighter mb-8">
                    HOW CAN WE <span className="text-[#ff9e00]">HELP?</span>
                </h1>
                
                {/* Big Search Bar */}
                <div className="relative max-w-2xl mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <Search className="w-6 h-6 text-white/40 group-focus-within:text-[#ff9e00] transition-colors" />
                    </div>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="w-full bg-white/5 border border-white/20 focus:border-[#ff9e00] focus:ring-1 focus:ring-[#ff9e00] rounded-none py-6 pl-16 pr-6 text-lg font-mono text-white placeholder-white/30 outline-none transition-all shadow-[0_0_30px_rgba(255,158,0,0)] focus:shadow-[0_0_30px_rgba(255,158,0,0.1)]"
                        placeholder="Search for guides, error codes, or topics..."
                    />
                    {searchQuery && (
                        <div className="absolute inset-y-0 right-0 pr-2 flex items-center">
                            <button 
                                onClick={() => onSearchChange('')}
                                className="bg-white/10 text-white px-6 py-4 font-display font-bold uppercase text-sm hover:bg-white hover:text-black transition-colors"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
