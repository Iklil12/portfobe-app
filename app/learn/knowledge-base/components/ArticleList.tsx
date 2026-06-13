import React from 'react';
import Link from 'next/link';
import { ArrowRight, Search, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data';

interface Article {
    id: string;
    title: string;
    categoryId: string;
    category: string;
    date: string;
    views: string;
    description: string;
    content: React.ReactNode;
}

interface ArticleListProps {
    filteredArticles: Article[];
    searchQuery: string;
    activeCategory: string | null;
    onClearFilters: () => void;
}

export function ArticleList({ 
    filteredArticles, 
    searchQuery, 
    activeCategory, 
    onClearFilters 
}: ArticleListProps) {
    return (
        <div className="lg:col-span-9 flex flex-col min-h-[500px]">
            <div className="p-8 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <h2 className="font-display font-bold uppercase text-2xl tracking-wider text-[#ff9e00]">
                    {searchQuery ? 'SEARCH RESULTS' : (activeCategory ? CATEGORIES.find(c => c.id === activeCategory)?.name : 'ALL ARTICLES')}
                </h2>
                <span className="font-mono text-xs opacity-50 hidden sm:block">
                    SHOWING {filteredArticles.length} {filteredArticles.length === 1 ? 'RESULT' : 'RESULTS'}
                </span>
            </div>

            {filteredArticles.length > 0 ? (
                filteredArticles.map((article) => (
                    <Link 
                        key={article.id} 
                        href={`/learn/knowledge-base/articles/${article.id}`}
                        className="group grid grid-cols-1 md:grid-cols-12 border-b border-white/10 hover-accent transition-all duration-300 text-left w-full"
                    >
                        <div className="md:col-span-2 p-6 md:p-8 font-mono text-xs border-b md:border-b-0 md:border-r border-white/10 flex flex-col justify-between gap-4">
                            <span className="opacity-50 group-hover:opacity-100">{article.date}</span>
                            <span className="uppercase font-bold tracking-widest">{article.category}</span>
                        </div>
                        <div className="md:col-span-10 p-6 md:p-8 flex flex-col justify-between">
                            <h3 className="font-display text-2xl md:text-3xl font-medium tracking-tight mb-4">
                                {article.title}
                            </h3>
                            <div className="flex items-center justify-between w-full">
                                <p className="font-sans text-sm opacity-60 group-hover:opacity-100 max-w-2xl">
                                    {article.description}
                                </p>
                                <div className="w-10 h-10 rounded-full border border-current flex items-center justify-center -rotate-45 group-hover:rotate-0 transition-transform shrink-0 ml-4">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </div>
                        </div>
                    </Link>
                ))
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-12 text-center border-b border-white/10">
                    <Search className="w-12 h-12 text-white/20 mb-4" />
                    <h3 className="font-display text-2xl font-bold uppercase tracking-wider mb-2">NO RESULTS FOUND</h3>
                    <p className="font-mono text-sm text-white/50 mb-8 max-w-md">We couldn't find any articles matching your criteria. Try adjusting your search or clearing the filters.</p>
                    <button 
                        onClick={onClearFilters}
                        className="px-6 py-3 border border-white/20 font-mono text-xs font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" /> Clear All Filters
                    </button>
                </div>
            )}
            
            {/* Load More (Only show if not filtering or searching) */}
            {!searchQuery && !activeCategory && filteredArticles.length > 0 && (
                <button className="w-full py-12 text-white font-display font-bold text-xl uppercase tracking-widest hover:bg-white hover:text-black transition-colors">
                    [ LOAD MORE ARTICLES ]
                </button>
            )}
        </div>
    );
}
