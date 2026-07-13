'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, Layers, Video, FileText, MessageCircle, ChevronRight, Menu } from 'lucide-react';
import { useTranslations } from 'next-intl';

export function LearnSidebar() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);
    const t = useTranslations('LearnSidebar');

    const isActive = (path: string) => pathname?.includes(path);

    return (
        <div className="w-full lg:w-80 lg:border-r border-white/10 flex-shrink-0 bg-black flex flex-col font-sans text-sm uppercase tracking-wider lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)]">
            {/* Mobile Toggle Header */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden w-full flex items-center justify-between p-6 border-b border-white/10 text-white hover:bg-white/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <Menu className="w-5 h-5 text-[#ff9e00]" />
                    <span className="font-medium tracking-widest">{t('menuTitle')}</span>
                </div>
                <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isOpen ? 'rotate-90' : ''}`} />
            </button>

            {/* Sidebar Content (Collapsible) */}
            <div className={`flex-col flex-1 overflow-y-auto hide-scrollbar border-b lg:border-b-0 border-white/10 ${isOpen ? 'flex animate-slide-up' : 'hidden lg:flex'}`}>
                {/* Search Bar */}
                <div className="p-6 border-b border-white/10">
                <div className="relative group flex items-center">
                    <Search className="w-4 h-4 text-white/40 absolute left-4 group-focus-within:text-[#ff9e00] transition-colors" />
                    <input 
                        type="text" 
                        placeholder={t('searchPlaceholder')}
                        className="w-full bg-white/5 border border-white/10 focus:border-[#ff9e00] focus:ring-1 focus:ring-[#ff9e00] text-white py-4 pl-12 pr-4 outline-none transition-all placeholder:text-white/20 text-xs"
                    />
                    <div className="absolute right-4 text-[10px] text-white/30 px-1.5 py-0.5 border border-white/10 bg-black font-medium">/</div>
                </div>
            </div>

            {/* Navigation Groups */}
            <div className="flex-1 flex flex-col">
                {/* Group: Learn */}
                <div className="flex flex-col border-b border-white/10">
                    <div className="px-6 py-4 bg-[#0a0a0a] text-white/40 text-[10px] font-medium tracking-[0.2em] flex items-center gap-4">
                        <span>{t('groupLearn')}</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <div className="flex flex-col">
                        <Link 
                            href="/learn/courses" 
                            className={`px-6 py-5 flex items-center justify-between hover:bg-white hover:text-black transition-colors group cursor-pointer border-l-4 ${isActive('/learn/courses') ? 'border-[#ff9e00] bg-white/5 text-white' : 'border-transparent text-white/50 hover:border-black'}`}
                        >
                            <div className="flex items-center gap-4">
                                <Layers className={`w-5 h-5 group-hover:text-black ${isActive('/learn/courses') ? 'text-[#ff9e00]' : 'opacity-50 group-hover:opacity-100'}`} />
                                <span className={isActive('/learn/courses') ? 'font-medium' : ''}>{t('courses')}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-opacity ${isActive('/learn/courses') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </Link>

                        <Link 
                            href="/learn/videos" 
                            className={`px-6 py-5 flex items-center justify-between hover:bg-white hover:text-black transition-colors group cursor-pointer border-l-4 ${isActive('/learn/videos') ? 'border-[#ff9e00] bg-white/5 text-white' : 'border-transparent text-white/50 hover:border-black'}`}
                        >
                            <div className="flex items-center gap-4">
                                <Video className={`w-5 h-5 group-hover:text-black ${isActive('/learn/videos') ? 'text-[#ff9e00]' : 'opacity-50 group-hover:opacity-100'}`} />
                                <span className={isActive('/learn/videos') ? 'font-medium' : ''}>{t('videos')}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-opacity ${isActive('/learn/videos') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </Link>
                        
                        <Link 
                            href="/learn/guide" 
                            className={`px-6 py-5 flex items-center justify-between hover:bg-white hover:text-black transition-colors group cursor-pointer border-l-4 ${isActive('/learn/guide') ? 'border-[#ff9e00] bg-white/5 text-white' : 'border-transparent text-white/50 hover:border-black'}`}
                        >
                            <div className="flex items-center gap-4">
                                <FileText className={`w-5 h-5 group-hover:text-black ${isActive('/learn/guide') ? 'text-[#ff9e00]' : 'opacity-50 group-hover:opacity-100'}`} />
                                <span className={isActive('/learn/guide') ? 'font-medium' : ''}>{t('guide')}</span>
                            </div>
                            <ChevronRight className={`w-4 h-4 transition-opacity ${isActive('/learn/guide') ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                        </Link>
                    </div>
                </div>

                {/* Group: Help */}
                <div className="flex flex-col border-b border-white/10">
                    <div className="px-6 py-4 bg-[#0a0a0a] text-white/40 text-[10px] font-medium tracking-[0.2em] flex items-center gap-4">
                        <span>{t('groupHelp')}</span>
                        <div className="h-px bg-white/10 flex-1"></div>
                    </div>
                    <div className="flex flex-col">
                        <Link 
                            href="/learn/knowledge-base" 
                            className="px-6 py-5 flex items-center justify-between hover:bg-white hover:text-black transition-colors group cursor-pointer text-white/50 border-l-4 border-transparent hover:border-black"
                        >
                            <div className="flex items-center gap-4">
                                <FileText className="w-5 h-5 group-hover:text-black opacity-50 group-hover:opacity-100" />
                                <span>{t('articles')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                        <Link 
                            href="/support" 
                            className="px-6 py-5 flex items-center justify-between hover:bg-white hover:text-black transition-colors group cursor-pointer text-white/50 border-l-4 border-transparent hover:border-black"
                        >
                            <div className="flex items-center gap-4">
                                <MessageCircle className="w-5 h-5 group-hover:text-black opacity-50 group-hover:opacity-100" />
                                <span>{t('support')}</span>
                            </div>
                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                    </div>
                </div>
            </div>
            </div>
        </div>
    );
}
