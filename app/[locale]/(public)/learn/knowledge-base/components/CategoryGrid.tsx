import React from 'react';
import { CATEGORIES, ALL_ARTICLES } from '../data';
import { useTranslations } from 'next-intl';

interface CategoryGridProps {
    activeCategory: string | null;
    onCategorySelect: (categoryId: string | null) => void;
}

export function CategoryGrid({ activeCategory, onCategorySelect }: CategoryGridProps) {
    const t = useTranslations('KnowledgeBase');
    const getCategoryCount = (categoryId: string) => {
        return ALL_ARTICLES.filter(a => a.categoryId === categoryId).length;
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 border-b border-white/10 divide-y md:divide-y-0 md:divide-x divide-white/10">
            {CATEGORIES.map((cat) => (
                <button 
                    key={cat.id} 
                    onClick={() => onCategorySelect(activeCategory === cat.id ? null : cat.id)}
                    className={`p-8 flex flex-col items-center text-center gap-4 transition-colors group cursor-pointer ${activeCategory === cat.id ? 'bg-[#ff9e00] text-black' : 'hover-invert'}`}
                >
                    <div className={`w-12 h-12 rounded-full border flex items-center justify-center mb-2 ${activeCategory === cat.id ? 'border-black' : 'border-current'}`}>
                        <cat.icon className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className={`font-display font-bold uppercase tracking-wider text-sm mb-1 ${activeCategory === cat.id ? 'text-black' : ''}`}>{cat.name}</h3>
                        <span className={`font-mono text-xs ${activeCategory === cat.id ? 'text-black/70' : 'opacity-50'}`}>{getCategoryCount(cat.id)} {t('articlesCount')}</span>
                    </div>
                </button>
            ))}
        </div>
    );
}
