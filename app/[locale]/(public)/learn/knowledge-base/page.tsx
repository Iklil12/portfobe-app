'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';

// Data
import { ALL_ARTICLES } from './data';

// Knowledge Base Components
import { KnowledgeBaseHero } from './components/KnowledgeBaseHero';
import { CategoryGrid } from './components/CategoryGrid';
import { KnowledgeBaseSidebar } from './components/KnowledgeBaseSidebar';
import { ArticleList } from './components/ArticleList';

export default function KnowledgeBasePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Filter articles based on search and active category
    const filteredArticles = useMemo(() => {
        return ALL_ARTICLES.filter(article => {
            const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                  article.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = activeCategory ? article.categoryId === activeCategory : true;
            return matchesSearch && matchesCategory;
        });
    }, [searchQuery, activeCategory]);

    const handleClearFilters = () => {
        setSearchQuery('');
        setActiveCategory(null);
    };

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
        
        .hover-invert:hover {
            background-color: #ffffff;
            color: #000000;
        }
        .hover-accent:hover {
            background-color: #ff9e00;
            color: #000000;
        }
        .hover-accent:hover h3, .hover-accent:hover p, .hover-accent:hover span {
            color: #000000;
        }
      `}} />

            <div className="kb-wrapper w-full min-h-screen relative flex flex-col">
                <Navbar isDarkBg />

                <KnowledgeBaseHero 
                    searchQuery={searchQuery} 
                    onSearchChange={setSearchQuery} 
                />

                <main className="max-w-7xl mx-auto flex-1 w-full relative z-10">
                    <CategoryGrid 
                        activeCategory={activeCategory} 
                        onCategorySelect={setActiveCategory} 
                    />

                    <div className="grid grid-cols-1 lg:grid-cols-12">
                        <KnowledgeBaseSidebar 
                            activeCategory={activeCategory} 
                            onCategorySelect={(cat) => {
                                setActiveCategory(cat);
                                if (cat === null) setSearchQuery('');
                            }} 
                        />

                        <ArticleList 
                            filteredArticles={filteredArticles}
                            searchQuery={searchQuery}
                            activeCategory={activeCategory}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                </main>

                <Footer />
            </div>
        </div>
    );
}
