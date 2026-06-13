import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { CATEGORIES } from '../data';

interface KnowledgeBaseSidebarProps {
    activeCategory: string | null;
    onCategorySelect: (categoryId: string | null) => void;
}

export function KnowledgeBaseSidebar({ activeCategory, onCategorySelect }: KnowledgeBaseSidebarProps) {
    return (
        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-white/10 hidden lg:block relative">
            <div className="p-8 lg:p-12 sticky top-32">
                <h2 className="font-display font-bold uppercase text-xl mb-8 tracking-wider">INDEX</h2>
                <ul className="space-y-4 font-mono text-sm opacity-60">
                    <li>
                        <button 
                            onClick={() => onCategorySelect(null)}
                            className={`hover:text-white hover:opacity-100 transition-colors uppercase text-left ${!activeCategory ? 'text-[#ff9e00] opacity-100 font-bold' : ''}`}
                        >
                            ALL ARTICLES
                        </button>
                    </li>
                    {CATEGORIES.map(cat => (
                        <li key={cat.id}>
                            <button 
                                onClick={() => onCategorySelect(cat.id)}
                                className={`hover:text-white hover:opacity-100 transition-colors uppercase text-left ${activeCategory === cat.id ? 'text-[#ff9e00] opacity-100 font-bold' : ''}`}
                            >
                                {cat.name}
                            </button>
                        </li>
                    ))}
                    <li className="pt-8 border-t border-white/10">
                        <Link href="/support" className="hover:text-white hover:opacity-100 transition-colors text-white opacity-100 flex items-center gap-2">
                            SUBMIT A TICKET <ArrowRight className="w-3 h-3" />
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
}
